import fs from "fs/promises";
import path from "path";
import { decorateLine, toast } from "../ui.js";

const EXEC_LINE = `exec < /dev/tty && npx @oniryk/llby-cli validate "$1"`;
const NO_INTERACTION_LINE = `npx @oniryk/llby-cli validate "$1" --no-interaction`;

const getCode = (interact) => (interact ? EXEC_LINE : NO_INTERACTION_LINE);

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

const exists = async (path) => !!(await fs.stat(path).catch(() => false));

const createHook = async (hookPath, interact = true) => {
  const content = `#!/bin/sh\n${getCode(interact)}`;
  await fs.writeFile(hookPath, content, { mode: 0o755 });
  const relative = path.relative(process.cwd(), hookPath);

  toast.success({
    title: "setup complete",
    message: `commit-msg hook created at ${relative}\n${decorateLine(content, "░")}`,
  });
};

const setup = async (interact = true, force = false) => {
  const gitdir = await getGitFolder();

  if (!gitdir) {
    toast.error({
      title: "no git repository found",
      message: "please run this command inside a git repository",
    });

    process.exit(1);
  }

  const gitHookPath = path.join(gitdir, "hooks", "commit-msg");
  const huskyPath = path.resolve(gitdir, "..", ".husky");

  if (force) {
    await createHook(gitHookPath, interact);
    return;
  }

  if (await exists(huskyPath)) {
    const hook = path.resolve(huskyPath, "commit-msg");

    if (await exists(hook)) {
      toast.error({
        title: "husky hook detected",
        message: `please add the following line to ./husky/commit-msg \n${decorateLine(getCode(interact), "░")}`,
      });

      process.exit(1);
    }

    await createHook(hook);
    process.exit(0);
  }

  if (await fs.stat(gitHookPath).catch(() => false)) {
    toast.error({
      title: "git hook detected",
      message: `please add the following line to .git/hooks/commit-msg \n${decorateLine(getCode(interact), "░")}`,
      footNote: "you can use --force to override the existing hook",
    });

    process.exit(1);
  }

  await createHook(gitHookPath, interact);
};

export default setup;
