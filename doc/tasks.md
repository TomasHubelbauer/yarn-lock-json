# Tasks

> Development plan

## See if there is a way good to contribute a `yarn run justify` script in `postinstall`

This way we could make `yarn justify` do `yarn-justify`.
Doable by invoking a shell script for sure, but would be nice if there was a supported
way for this.

## Support NPM lock file

- Read NPM shrinkwrap file
- Rename project to `package-justify` and note that both Yarn and NPM is supported

## Use `git blame` when reporting which packages miss justification

Find who added the `[x]` without adding justification.

## Fix warning with empty lock file

## Support versions granually and think through new version defaults

Each version should have its own records and new versions should maybe be considered
approved automatically unless they are breaking versions.

## Fix `echo "yarn-justify" >> .git/hooks/pre-commit` not working after installation

Is the current working directory correct?

Also:

## Think about local versus global installation and how it affects hook installation

When installing locally, it is okay to install the Git pre-commit hook, but when
installing globally, it makes no sense as we're not in context of a Git repository.

Can we tell the two instances apart? Should we just check for .git and if present,
then install the hook?

## Introduce tests

The tests should test just the script itself as well as installation from NPMJS.org
and working in a temporary directory Git repository.

## Utilize GitHub releases
