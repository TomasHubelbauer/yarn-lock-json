# Yarn Justify

> A CLI tool for checking and reporting justification of inclusion of NodeJS packages based on Yarn lock file

A script (recommended to run as a pre-commit hook) which updates a `package-justifications.md` file with a list
of justifications for including the package to always include all packages used at any one time.

Justifications are synchronized with the package list and need to be explicitly approved otherwise the script
fails with an error in case there is an unjustified dependency (top-level or any depending on `--top-level-only`).

**Features:**

- Generating a `package-justifications.md` file with justification and approval for dependencies
- Switching between requiring justifications for all or only top-level packages (`--top-level-only`)
- ([In development](doc/tasks.md)) Automatic installation of the pre-commit Git hook after installation
- ([In development](doc/tasks.md)) Displaying commiters who approved packages without justifying using `git blame`

## Installing

([In development](doc/tasks.md))

`yarn add yarn-justify`

We recommend you accompany Yarn Justify with [`auditjs`](https://www.npmjs.com/package/auditjs)
in order to be able to make a more informed decision when justifying inclusion of NPM packages.

**Support:**

At this time only Yarn is supported and lock file version 1 (latest) is required.
NPM support is ([in development and coming soon](doc/tasks.md)).

## Running

**As a user:**

The script installs itself as a Git pre-commit hook and abort commit with unjustified, approved dependencies.

Optionally you can add a `justify` script `package.json`:

```json
{
  // …
  "scripts": {
    // …
    "justify": "yarn-justify [--top-level-only]",
    // …
  },
  // …
```

You can run this script using `yarn justify` or update the pre-commit hook to run it.

**As a contributor:**

`yarn start`

See [Contributing](#contributing) for more information.

## Contributing

This script itself doesn't use any dependencies for its function, so running the tool
on itself will produce an empty result.

Feel free to temporarily add packages during development, but do not commit `package.json`
with packages with packages unless they are actualliy utilized for the contribution's function.

See [development plan](doc/tasks.md).

## Studying

See [development log](doc/notes.md).
