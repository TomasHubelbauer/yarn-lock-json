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

It might also be helpful to run `yarn audit` while justifying a package to catch any vulnerabilities.

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

This script itself doesn't use any dependencies for its function, so running the tool
on itself will produce an empty result.

Feel free to temporarily add packages during development, but do not commit `package.json`
with packages unless they are actualliy utilized for the contribution's function.

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

## To-Do

### See if there is a way good to contribute a `yarn run justify` script in `postinstall`

This way we could make `yarn justify` do `yarn-justify`.
Doable by invoking a shell script for sure, but would be nice if there was a supported
way for this.

### Support NPM lock file

- Read NPM shrinkwrap file
- Rename project to `package-justify` and note that both Yarn and NPM is supported

### Use `git blame` when reporting which packages miss justification

Find who added the `[x]` without adding justification.

### Fix warning with empty lock file

### Support versions granually and think through new version defaults

Each version should have its own records and new versions should maybe be considered
approved automatically unless they are breaking versions.

### Fix `echo "yarn-justify" >> .git/hooks/pre-commit` not working after installation

Is the current working directory correct?

Also:

### Think about local versus global installation and how it affects hook installation

When installing locally, it is okay to install the Git pre-commit hook, but when
installing globally, it makes no sense as we're not in context of a Git repository.

Can we tell the two instances apart? Should we just check for .git and if present,
then install the hook?

### Introduce tests

The tests should test just the script itself as well as installation from NPMJS.org
and working in a temporary directory Git repository.

### Utilize GitHub releases
