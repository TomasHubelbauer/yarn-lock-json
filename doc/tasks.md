# Tasks

> Development plan

## Consider reading `package.json` as well and distinguishing between dependencies and development dependencies

Probably would have been two tables in `dependency-audit.md`.

## Consider integrating with NPM package auditing tools

- [npm-audit](https://www.npmjs.com/package/npm-audit)
- [auditjs](https://www.npmjs.com/package/auditjs)

## Consider providing a `justify` command for Yarn

Do this once mutating the justification MarkDown table is implemented.

`yarn run justify react "UI framework"` would add justification to the table, check the checkbox,
add Git name as approver and run the justification tool again to ensure constraints are met
(justification isn't empty is the only constraint as this time).

## Fix matching strings like `"setimmediate@>= 1.0.1", setimmediate@^1.0.5:`

## Upate a `.md` file with a table of dependencies and either keep reason or add a checkbox

The table is sorted alphabetically just like the lock file is.
For top-level packages, justification is left blank, for dependencies, it says who depends on it.
The justification is either generated on first run or left untouched when updating the MarkDown file.
If justification is empty but the checkbox is checked, the process fails - need to provide justification
or accept the generated one when approving packages.
Consider also enabling a mode where the process errors only for unjustified direct packages.
(This is looser but doesn't encourage studying dependencies of your dependencies.)

| Package             | Kind     | Justification            | Approved             |
|---------------------|----------|--------------------------|----------------------|
| `react`             | Direct   | UI framework             | [x] Tomas Hubelbauer |
| `react-addons-perf` | Indirect | A dependency of `react`. |                      |

Rename the project to match this purpose.

## Bundle as an NPM package and provide it under a good name like `yarn-justify`

## Consider creating a post-install script in the NPM package that would automatically (or interactively) add a Git pre-commit hook
