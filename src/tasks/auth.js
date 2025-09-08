import fs from "fs";
import os from "os";
import path from "path";
import { toast } from "../ui.js";

const homeDir = os.homedir();
const tokenFilePath = path.join(homeDir, ".llby", ".access_token");

const auth = async () => {
  const token = process.argv[3];

  if (!token) {
    console.log("please provide a token");
    process.exit(1);
  }

  await fs.promises.mkdir(path.dirname(tokenFilePath), { recursive: true });

  await fs.promises.writeFile(tokenFilePath, token, "utf8");
  toast({ type: "success", message: "access token saved" });

  process.exit(0);
};

export default auth;
