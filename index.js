#!/usr/bin/env node

import banner from "./src/banner.js";
import auth from "./src/tasks/auth.js";
import help from "./src/tasks/help.js";
import setup from "./src/tasks/setup.js";
import validate from "./src/tasks/validate.js";
import { toast } from "./src/ui.js";

(async () => {
  const [, , task] = process.argv;
  banner();

  if (task === "validate") {
    await validate();
    process.exit(0);
  }

  if (task === "auth") {
    await auth();
    process.exit(0);
  }

  if (task === "setup") {
    await setup();
    process.exit(0);
  }

  if (!task || task === "help") {
    help();
    process.exit(0);
  }

  toast({
    type: "error",
    title: "unknown task",
    message: `the task "${task}" is not recognized`,
  });

  process.exit(1);
})();
