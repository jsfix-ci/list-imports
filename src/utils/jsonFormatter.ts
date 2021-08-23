import chalk = require("chalk");
import { IExtractModel } from "../commands/extractCommand";

export async function jsonFormatter(
  model: IExtractModel,
): Promise<string> {
  try {
    const serialized: string = JSON.stringify(model, null, 2);
    return serialized;
  } catch (err) {
    console.log(chalk.redBright(`X ${err.message}`));
    return "";
  }
}
