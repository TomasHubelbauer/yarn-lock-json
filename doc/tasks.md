# Tasks

> Development plan

## Release `yarn-justify` to NPMJS.org

- `yarn-justify` to check for justifications and update the justification table
- `yarn-justify --top-level-only` to check only top-level packages and update the justification table
- `yarn-justify react "UI framework"` to approve with justification through the CLI

## See if there is a way to contribute a `package.json` script for `scripts` after installation

This way we could make `yarn justify` do `yarn-justify`.

## Support NPM lock file

- Read NPM shrinkwrap file
- Rename project to `package-justify` and note that both Yarn and NPM is supported

## Use `git blame` when reporting which packages miss justification

Find who added the `[x]` without adding justification.

## Fix warning with empty lock file

## Support versions granually and think through new version defaults

Each version should have its own records and new versions should maybe be considered
approved automatically unless they are breaking versions.
