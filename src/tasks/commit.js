import { spawnSync } from "child_process";
import colors from "colors";
import prompts from "prompts";
import { request } from "../api.js";
import { showErrorMessage, toast } from "../ui.js";

const commit = async (message) => {
  const response = await request(message);

  if (response.valid) {
    console.log(
      colors.bold.green(
        " ✨✨ congratulations! your commit message looks awesome! ✨✨\n",
      ),
    );

    return void git(message);
  }

  showErrorMessage();
  const hasSuggestion = response.issues.some((issue) => issue.suggestion);

  for (const issue of response.issues) {
    toast({
      type: issue.suggestion ? "warning" : "error",
      title: issue.name,
      message: issue.message,
    });
  }

  if (hasSuggestion) {
    const suggestion = response.issues
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

    if (answer.value) {
      process.stdout.write("\u001b[1A\u001b[2K");
      toast.success({ title: "message updated", message: suggestion });
      return void git(suggestion);
    }
  }

  toast.error({ message: "please fix the issues above and try again" });
  process.exit(1);
};

const git = async (message) => {
  const args = ["commit", "-m", message];
  spawnSync("git", args, { stdio: "inherit" });
};

export default commit;
