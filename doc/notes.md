# Notes

> Development log

## 2018/01/07

Decided against integrating with auditing tools directly in order to not bring in something served independently.
`npm-audit` didn't look very good and `auditjs` wasn't usable without a CLI anyway and instead of invoking an
executable for the user, it has been recommended in the README to install `auditjs` also in order to make better
decisions about what packages to justify.

## 2018/01/05

Project started.
