#!/usr/bin/env node

import { argv } from "./src/argv.js";
import banner from "./src/banner.js";
import auth from "./src/tasks/auth.js";
import help from "./src/tasks/help.js";
import setup from "./src/tasks/setup.js";
import validate from "./src/tasks/validate.js";
import { toast } from "./src/ui.js";

(async () => {
  const { task, params, flags } = argv();
  banner();

  if (task === "validate") {
    await validate(params[0], !flags.has("--no-interaction"));
    process.exit(0);
  }

  if (task === "auth") {
    await auth();
    process.exit(0);
  }

  if (task === "setup") {
    await setup(!flags.has("--no-interaction"), flags.has("--force"));
    process.exit(0);
  }

  if (!task || task === "help") {
    help();
    process.exit(0);
  }

  toast.error({
    title: "unknown task",
    message: `the task "${task}" is not recognized`,
  });

  process.exit(1);
})();
