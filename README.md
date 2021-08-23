# List-Imports

`list-imports` is a simple command-line tool for extracting the package and local dependencies from a given TypeScript source file.

## Installation

Install the package in your project.

```
yarn add list-imports
```

## Usage

Extract all imports from the source file

```
yarn list-imports extract --all path/to/source-file.ts
```

Extract only local imports from the source file

```
yarn list-imports extract --local path/to/source-file.ts
```

Extract only external imports from the source file

```
yarn list-imports extract --external path/to/source-file.ts
```

Specify the output to be in JSON format

```
yarn list-imports extract --all --json path/to/source-file.ts
```

Recursively extract (pass a directory as the source path)

```
yarn list-imports extract --multi path/to/sources/
```

Get help with the tool commands

```
yarn list-imports help
```

### License

MIT License (C) 2021, Richard Marks [See LICENSE.md](./LICENSE.md)
