# Tasks

> Development plan

## Generate `dependants` field for each package as a reverse for `dependencies`

## Upate a `.md` file with a table of dependencies and either keep reason or add a checkbox

The table is sorted alphabetically just like the lock file is.
For top-level packages, justification is left blank, for dependencies, it says who depends on it.
The justification is either generated on first run or left untouched when updating the MarkDown file.
If justification is empty but the checkbox is checked, the process fails - need to provide justification
or accept the generated one when approving packages.

| Package             | Justification            | Approved             |
|---------------------|--------------------------|----------------------|
| `react`             | UI framework             | [x] Tomas Hubelbauer |
| `react-addons-perf` | A dependency of `react`. |                      |

Rename the project to match this purpose.
