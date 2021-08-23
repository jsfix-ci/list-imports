import chalk = require("chalk");
import { IExtractModel } from "../commands/extractCommand";

export function mdLink(text: string, href: string): string {
  return `[${text}](${href})`;
}

export function mdSourceLink(model: IExtractModel): string {
  return `**Source:** ${mdLink(
    model.sourcePath,
    model.sourcePath,
  )}\n`;
}

export function mdDependenciesList(model: IExtractModel): string {
  const output: string[] = ["**Dependencies:**\n\n"];

  if (model.externalImports?.length) {
    const packages: string[] = model.externalImports.map(
      (x: string) => `  - ${mdLink("'" + x + "'", x)}`,
    );
    output.push(
      `- Packages (*node_modules*)\n${packages.join("\n")}`,
    );
  }

  if (model.localImports?.length) {
    const refs: string[] = model.localImports.map(
      (x: string) => `  - ${mdLink(x, x)}`,
    );
    output.push(`- Local\n${refs.join("\n")}`);
  }

  return output.join("\n");
}

export async function markdownFormatter(
  model: IExtractModel,
): Promise<string> {
  try {
    const output: string[] = [
      mdSourceLink(model),
      mdDependenciesList(model),
    ];
    return output.join("\n\n");
  } catch (err) {
    console.log(chalk.redBright(`X ${err.message}`));
    return "";
  }
}
