# Yarn Lock Json

> Generate a JSON object representing your `yarn.lock`.

**Features:**

- Generating a JSON representation of a `yarn.lock` lock file
- Generating a `dependants` field for a full story of the dependency graph
- ([In development](doc/tasks.md)) Generating a `dependency-audit.md` file with justification and approval for:
  - Top-level packages only - the ones added through `yarn add`
  - All packages - encouraging studying dependencies or your dependencies

## Running

`node --experimental-modules index.mjs`

## Contributing

This repository itself doesn't use any dependencies, all added dependencies are for testing.
Thus `package.json` and `yarn.lock` are both in `.gitignore`, feel free to fill them with any test dependencies you like.

See [development plan](doc/tasks.md).

## Studying

See [development log](doc/notes.md).
