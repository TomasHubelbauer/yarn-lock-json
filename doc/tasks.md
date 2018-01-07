# Tasks

> Development plan

## Package the tool for NPMJS.org

- Use the `bin` field in `package.json` in order to make the package executable
- Accept `--only-top-level` CLI switch
- Use `postinstall` script in order to use `npm-hooks` package to install a `pre-commit` hook running self

Usage:

- `yarn-justify` to check for justifications and update the justification table
- `yarn-justify --top-level-only` to check only top-level packages and update the justification table
- `yarn-justify react "UI framework"` to approve with justification through the CLI

## See if there is a way to contribute a `package.json` script for `scripts` after installation

This way we could make `yarn justify` do `yarn-justify`.

## Extend to support NPM

- Read NPM shrinkwrap file
- Rename project to `package-justify` and note that both Yarn and NPM is supported

## Use `git blame` when reporting which packages miss justification

Find who added the `[x]` without adding justification.
