#!/usr/bin/env node
import { createCommand } from "commander";
import {
  extractCommand,
  IExtractOptions,
} from "./commands/extractCommand";

async function main() {
  const program = createCommand();
  program.version(
    "1.0.0",
    "-v, --version",
    "output the current version",
  );
  program
    .command("extract <source_path>")
    .description("extracts imports from source path")
    .option("--all", "extract both local and external imports")
    .option("--local", "extract local imports")
    .option("--external", "extract external imports")
    .option("--json", "output in JSON format")
    .action(async (sourcePath: string, options: IExtractOptions) => {
      await extractCommand(sourcePath, options);
    });
  // program
  //   .command("toggle <plist_path>")
  //   .description("toggle ATS on or off")
  //   .action(async (plistPath: string) => {
  //     await toggle(plistPath);
  //   });
  await program.parseAsync(process.argv);
}

main().catch((err) => console.error(err));
