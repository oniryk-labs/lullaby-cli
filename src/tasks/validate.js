import { confirm } from "@inquirer/prompts";
import { ArkErrors, type } from "arktype";
import colors from "colors";
import { promises as fs } from "fs";
import path from "path";
import { fetch } from "undici";
import { getAccessToken } from "../access-token.js";
import { toast } from "../ui.js";

const issue = type({
  message: "string",
  name: "string",
  suggestion: "string?",
});

const schema = type({
  valid: "boolean",
  issues: issue.array(),
});

const validate = async () => {
  const token = await getAccessToken();
  const commit = path.resolve(process.cwd(), process.argv[3]);
  const message = await fs.readFile(commit, "utf8");

  const req = await fetch("https://lullaby.oniryk.services/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  const data = schema(await req.json());

  if (data instanceof ArkErrors) {
    console.error("Response schema is not valid:", data);
    process.exit(1);
  }

  if (!data.valid) {
    console.log(
      colors.bold(
        " 🚫 your commit message has some issues\n".toLocaleUpperCase(),
      ),
    );

    const hasSuggestion = data.issues.some((issue) => issue.suggestion);

    for (const issue of data.issues) {
      toast({
        type: issue.suggestion ? "warn" : "error",
        title: issue.name,
        message: issue.message,
      });
    }

    if (hasSuggestion) {
      const suggestion = data.issues
        .filter((issue) => issue.suggestion)
        .map((issue) => issue.suggestion)[0];

      toast({
        type: "info",
        icon: "✦",
        title: "suggestion",
        message: suggestion,
      });

      const answer = await confirm({
        message: "do you want to use the suggested message?",
        default: true,
      });

      // move cursor up and clear line
      process.stdout.write("\u001b[1A\u001b[2K");

      if (answer) {
        await fs.writeFile(commit, suggestion, "utf8");

        toast({
          type: "success",
          title: "message updated",
          message: suggestion,
        });

        process.exit(0);
      }
    }

    toast({
      type: "error",
      message: "please fix the issues above and try again",
    });

    process.exit(1);
  }
};

export default validate;
