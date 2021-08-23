import { extractImports } from "../utils/extractImports";
import { jsonFormatter } from "../utils/jsonFormatter";
import { markdownFormatter } from "../utils/markdownFormatter";

export interface IExtractOptions {
  json?: boolean;
  all?: boolean;
  local?: boolean;
  external?: boolean;
}

export interface IExtractModel {
  sourcePath: string;
  localImports: string[];
  externalImports: string[];
}

export async function extractCommand(
  sourcePath: string,
  options: IExtractOptions,
) {
  if (!options.local && !options.external && !options.all) {
    options.all = true;
  }
  const model: IExtractModel = await extractImports(
    { sourcePath, localImports: [], externalImports: [] },
    options,
  );

  const jsonFormat: boolean = Boolean(options.json);

  const output: string = jsonFormat
    ? await jsonFormatter(model)
    : await markdownFormatter(model);
  console.log(output);
}
