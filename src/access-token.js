import fs from "fs";
import os from "os";
import path from "path";
import { toast } from "./ui.js";

const homeDir = os.homedir();
const tokenFilePath = path.join(homeDir, ".llby", ".access_token");

const fileExists = async (path) =>
  !!(await fs.promises.stat(path).catch(() => false));

export async function getAccessToken() {
  if (await fileExists(tokenFilePath)) {
    const token = await fs.promises.readFile(tokenFilePath, "utf8");
    return token.trim();
  }

  toast({
    type: "error",
    title: "unauthenticated",
    message: "please login first using 'llby auth <YOUR_TOKEN>'",
  });

  process.exit(1);
}
