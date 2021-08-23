import { Dirent } from "fs";
import * as fs from "fs/promises";
import path = require("path");

export async function findSourcesRecursively(
  rootPath: string,
): Promise<string[]> {
  const entries: Dirent[] = await fs.readdir(rootPath, {
    withFileTypes: true,
  });

  const sources: string[] = [];

  for (const entry of entries) {
    if (entry.isFile()) {
      if (/\.tsx?$/.test(entry.name)) {
        sources.push(path.join(rootPath, entry.name));
      }
    } else if (entry.isDirectory()) {
      const subSources: string[] = await findSourcesRecursively(
        path.join(rootPath, entry.name),
      );
      sources.push(...subSources);
    }
  }

  return sources;
}
