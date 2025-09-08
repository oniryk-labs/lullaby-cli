import fs from "fs/promises";
import path from "path";
import { toast } from "../ui.js";

const EXEC_LINE = `exec < /dev/tty && npx -y llby validate "$1"`;

const getGitFolder = async () => {
  let currentDir = process.cwd();

  while (true) {
    const gitPath = path.join(currentDir, ".git");

    try {
      const stat = await fs.stat(gitPath);

      if (stat.isDirectory()) {
        return gitPath;
      }
    } catch (err) {}

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return null;
};

const setup = async () => {
  const gitdir = await getGitFolder();

  if (!gitdir) {
    toast({
      type: "error",
      title: "no git repository found",
      message: "please run this command inside a git repository",
    });

    process.exit(1);
  }

  const hookPath = path.join(gitdir, "hooks", "commit-msg");
  const huskyPath = path.resolve(gitdir, "..", ".husky");

  if (await fs.stat(huskyPath).catch(() => false)) {
    toast({
      type: "error",
      title: "husky detected",
      icon: "🐶",
      message: `please add the following line to your husky commit-msg hook:\n${EXEC_LINE}`,
    });

    process.exit(1);
  }

  if (await fs.stat(hookPath).catch(() => false)) {
    toast({
      type: "error",
      title: "hook already exists",
      message: `please add the following line to your .git/hooks/commit-msg hook:\n${EXEC_LINE}`,
    });

    process.exit(1);
  }

  const hookContent = `#!/bin/sh
  exec < /dev/tty && llby validate "$1"`;

  await fs.writeFile(hookPath, hookContent, { mode: 0o755 });

  toast({
    type: "success",
    title: "setup complete",
    message: "commit-msg hook installed successfully",
  });
};

export default setup;
