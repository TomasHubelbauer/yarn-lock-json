# Tasks

> Development plan

## Consider integrating with NPM package auditing tools

- [npm-audit](https://www.npmjs.com/package/npm-audit)
- [auditjs](https://www.npmjs.com/package/auditjs)

## Consider providing a `justify` command for Yarn

Do this once mutating the justification MarkDown table is implemented.

`yarn run justify react "UI framework"` would add justification to the table, check the checkbox,
add Git name as approver and run the justification tool again to ensure constraints are met
(justification isn't empty is the only constraint as this time).

## Fail table generation when justification is emptied but approval is checked

Consider a mode where this only happens for top-level packages as opposed to all packages.
The latter is the default as it encourages proper dependency review.

## Rename project to signal this is about package justification first and forefront

## Bundle as a binary NPM package and provide it under a good name like `yarn-justify`

## Consider creating a post-install script in the NPM package that would automatically (or interactively) add a Git pre-commit hook

## Figure out why `type` is empty
