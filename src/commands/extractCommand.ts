import { extractImports } from "../utils/extractImports";
import { findSourcesRecursively } from "../utils/findSourcesRecursively";
import {
  jsonFormatter,
  jsonFormatterMulti,
} from "../utils/jsonFormatter";
import { markdownFormatter } from "../utils/markdownFormatter";

export interface IExtractOptions {
  json?: boolean;
  all?: boolean;
  local?: boolean;
  external?: boolean;
  multi?: boolean;
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
  const jsonFormat: boolean = Boolean(options.json);

  if (!options.local && !options.external && !options.all) {
    options.all = true;
  }

  if (options.multi) {
    const sourcePaths: string[] = await findSourcesRecursively(
      sourcePath,
    );

    sourcePaths.sort((a, b) => a.localeCompare(b));
    if (jsonFormat) {
      const models: IExtractModel[] = [];
      for (const path of sourcePaths) {
        const model: IExtractModel = await extractImports(
          { sourcePath: path, localImports: [], externalImports: [] },
          options,
        );
        models.push(model);
      }
      const output: string = await jsonFormatterMulti(models);
      console.log(output);
    } else {
      for (const path of sourcePaths) {
        const model: IExtractModel = await extractImports(
          { sourcePath: path, localImports: [], externalImports: [] },
          options,
        );
        const output: string = await markdownFormatter(model);
        console.log(output);
        console.log();
      }
    }
    return;
  }

  const model: IExtractModel = await extractImports(
    { sourcePath, localImports: [], externalImports: [] },
    options,
  );

  const output: string = jsonFormat
    ? await jsonFormatter(model)
    : await markdownFormatter(model);
  console.log(output);
}
