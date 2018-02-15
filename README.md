# Yarn Justify

[![Greenkeeper badge](https://badges.greenkeeper.io/TomasHubelbauer/yarn-justify.svg)](https://greenkeeper.io/)

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
    "justify": "yarn-justify",
    // …
  },
  // …
```

You can run this script using `yarn justify` or update the pre-commit hook to run it.

See [Using](#using) for more information about CLI usage.

**As a contributor:**

`yarn start`

See [Contributing](#contributing) for more information.

## Using

[NPM lock file support is coming](doc/tasks.md)

**`yarn-justify`**

Synchronizes dependencies from the `yarn.lock`, reports all approved-but-unjustified dependencies,
updates `package-justification.md` if none.

**`yarn-justify --top-level-only`**

Synchronizes dependencies from the `yarn.lock`, reports all approved-but-unjustified dependencies
(only those mentioned in `dependencies` and `devDependencies` in `package.json`, not indirect ones),
updates `package-justification.md` if none.

**`yarn-justify $package "$reason"`**

Updates the *Justification* cell in `package-justification.md` and [x] approves the package.
The same can be done manually if so desired.

## Contributing

See [development plan](doc/tasks.md).

This script itself doesn't use any dependencies for its function, so running the tool
on itself will produce an empty result.

Feel free to temporarily add packages during development, but do not commit `package.json`
with packages with packages unless they are actualliy utilized for the contribution's function.

The same goes for `package-justification.md` where only actually utilized packages should be commited, too.

If you are having trouble with `npm publish` and NodeJS 9.3.0, use `nvm` to switch to `8.7.0` temporarily.
(A note to self as I'm the only one publishing the repository…)

## Testing

There is no machine testing at the moment.

To test the package manually, create a new Git repository and set up an NPM project with some packages:

```sh
git init
yarn init -y
yarn add react redux
npm install yarn-justify
# Optionally add a `yarn run justify` script
yarn-justify
```

## Studying

See [development log](doc/notes.md).
