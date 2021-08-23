import * as path from "path";
import * as ts from "typescript";
import {
  IExtractModel,
  IExtractOptions,
} from "../commands/extractCommand";
import { readFile } from "./readFile";

export type ExtractorFn =
  | ((node: ts.Node) => string)
  | ((node: ts.Node) => string);

export type ExtractorsTable = Record<string, ExtractorFn>;

export const extractors: ExtractorsTable = {
  ImportDeclaration(node: ts.Node): string {
    // import x from 'foo'
    // import { x } from 'foo'
    const importDecl: ts.ImportDeclaration =
      node as ts.ImportDeclaration;
    const moduleSpec: ts.StringLiteral =
      importDecl.moduleSpecifier as ts.StringLiteral;
    return moduleSpec.text;
  },
  ImportEqualsDeclaration(node: ts.Node): string {
    // import x = require('foo')
    const importDecl: ts.ImportEqualsDeclaration =
      node as ts.ImportEqualsDeclaration;
    const moduleRef: ts.ExternalModuleReference =
      importDecl.moduleReference as ts.ExternalModuleReference;
    const exp: ts.StringLiteral =
      moduleRef.expression as ts.StringLiteral;
    return exp.text;
  },
};

export async function getImportsFromTypescriptSource(
  filename: string,
  options: IExtractOptions,
) {
  const localImports: string[] = [];
  const externalImports: string[] = [];
  const text: string = await readFile(filename);

  const categorize = (moduleName: string) => {
    if (moduleName.startsWith(".") || moduleName.startsWith("src")) {
      if (options.local || options.all) {
        localImports.push(moduleName);
      }
    } else {
      if (options.external || options.all) {
        externalImports.push(moduleName);
      }
    }
  };

  if (text.length) {
    const sf = ts.createSourceFile(
      filename,
      text,
      ts.ScriptTarget.Latest,
    );
    sf.forEachChild((child: ts.Node) => {
      const syntaxKind: string = ts.SyntaxKind[child.kind] ?? "";
      const extractor = extractors[syntaxKind];
      if (extractor) {
        const moduleName = extractor(child);
        if (moduleName) {
          categorize(moduleName);
        }
      }

      // if (syntaxKind === "ImportDeclaration") {
      //   // import x from 'foo'
      //   // import { x } from 'foo'
      //   const importDecl: ts.ImportDeclaration =
      //     child as ts.ImportDeclaration;
      //   const moduleSpec: ts.StringLiteral =
      //     importDecl.moduleSpecifier as ts.StringLiteral;
      //   moduleName = moduleSpec.text;
      // } else if (syntaxKind === "ImportEqualsDeclaration") {
      //   // import x = require('foo')
      //   const importEqDecl: ts.ImportEqualsDeclaration =
      //     child as ts.ImportEqualsDeclaration;
      //   const moduleRef: ts.ExternalModuleReference =
      //     importEqDecl.moduleReference as ts.ExternalModuleReference;
      //   const exp: ts.StringLiteral =
      //     moduleRef.expression as ts.StringLiteral;
      //   moduleName = exp.text;
      // }
      // if (moduleName) {
      //   categorize(moduleName);
      // }
    });
  }

  return {
    localImports,
    externalImports,
  };
}

export async function extractImports(
  model: IExtractModel,
  options: IExtractOptions,
): Promise<IExtractModel> {
  const rootPath = path.resolve(model.sourcePath);
  const outModel: IExtractModel = {
    ...model,
  };

  const { localImports, externalImports } =
    await getImportsFromTypescriptSource(rootPath, options);

  if (localImports.length) {
    outModel.localImports = localImports;
  }

  if (externalImports.length) {
    outModel.externalImports = externalImports;
  }

  return outModel;
}
