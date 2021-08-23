import * as fs from "fs/promises";
import chalk = require("chalk");

export async function readFile(filename: string): Promise<string> {
  try {
    const text: string = await fs.readFile(filename, {
      encoding: "utf-8",
    });
    return text;
  } catch (err) {
    console.log(chalk.redBright(`X ${err.message}`));
    return "";
  }
}
