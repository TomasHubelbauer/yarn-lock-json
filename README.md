# Yarn Lock Json

> Generate a JSON object representing your `yarn.lock`.

A script (recommended to run as a pre-commit hook) which updates a `package-justifications.md` file with a list
of justifications for including the package to always include all packages used at any one time.

Justifications are synchronized with the package list and need to be explicitly approved otherwise the script
fails with an error in case there is an unjustified (top-level or any) dependency.

**Features:**

- Generating a JSON representation of a `yarn.lock` lock file
- Generating a `dependants` field for a full story of the dependency graph
- Generating a `package-justifications.md` file with justification and approval for dependencies
- ([In development](doc/tasks.md)) Switching between requiring justifications for all or only top-level packages
- ([In development](doc/tasks.md)) Integration with auditing tools for reporting insecure packages
- ([In development](doc/tasks.md)) Automatic installation of the pre-commit Git hook after installation

## Running

`node --experimental-modules index.mjs`

## Contributing

This repository itself doesn't use any dependencies, all added dependencies are for testing.
Thus `package.json` and `yarn.lock` are both in `.gitignore`, feel free to fill them with any test dependencies you like.

See [development plan](doc/tasks.md).

## Studying

See [development log](doc/notes.md).
