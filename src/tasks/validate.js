import colors from "colors";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import path from "path";
import prompts from "prompts";
import { z } from "zod";
import { getAccessToken } from "../access-token.js";
import { toast } from "../ui.js";

const issue = z.object({
  message: z.string(),
  name: z.string(),
  suggestion: z.string().optional(),
});

const schema = z.object({
  valid: z.boolean(),
  issues: z.array(issue),
});

const safe = async (fn) => {
  try {
    return { ok: true, result: await fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
};

const validate = async () => {
  const token = await getAccessToken();
  const commit = path.resolve(process.cwd(), process.argv[3]);
  const message = await fs.readFile(commit, "utf8");

  const req = await safe(() =>
    fetch("https://lullaby.oniryk.services/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    }),
  );

  if (!req.ok) {
    const message = "failed to make request to the API: " + req.error.message;
    toast.error({ title: "api error", message });
    process.exit(1);
  }

  const response = await safe(() => req.result.json());

  if (!response.ok) {
    const message = "failed to parse API response: " + response.error.message;
    toast.error({ title: "api error", message });
    process.exit(1);
  }

  const parseResult = schema.safeParse(response.result);

  if (!parseResult.success) {
    const message = "response schema is not valid";
    toast.error({ title: "schema validation error", message });
    process.exit(1);
  }

  const data = parseResult.data;

  if (!data.valid) {
    console.log(colors.bold(" 🚫 THERE IS SOME ISSUE IN YOUR COMMIT\n"));
    const hasSuggestion = data.issues.some((issue) => issue.suggestion);

    for (const issue of data.issues) {
      toast({
        type: issue.suggestion ? "warning" : "error",
        title: issue.name,
        message: issue.message,
      });
    }

    if (hasSuggestion) {
      const suggestion = data.issues
        .filter((issue) => issue.suggestion)
        .map((issue) => issue.suggestion)[0];

      toast.info({
        icon: "✍",
        title: "suggestion",
        message: suggestion,
      });

      const answer = await prompts({
        type: "confirm",
        name: "value",
        message: "do you want to use the suggested message?",
        initial: true,
      });

      // remove line added by the prompt
      process.stdout.write("\u001b[1A\u001b[2K");

      if (answer) {
        await fs.writeFile(commit, suggestion, "utf8");
        toast.success({ title: "message updated", message: suggestion });
        process.exit(0);
      }
    }

    toast.error({ message: "please fix the issues above and try again" });
    process.exit(1);
  }

  console.log(
    colors.bold.green(
      " ✨✨ congratulations! your commit message looks awesome! ✨✨\n",
    ),
  );
};

export default validate;
