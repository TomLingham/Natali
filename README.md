Natali
======

> The no-fuss, configurable, and honest PR review bot.

Natali can be used in your CI environment to enforce certain rules with how
Pull Requests are submitted.

Think of Natali as an objective first set of eyes over a Pull Request.

## Usage

To use Natali, install the package in your projects package.json:

```
npm i -D natali
```

Add a `natali.yaml` configuration file at the root of your project (this can
be configured, see ###).

Copy paste in this bare-bones configuration file:

```yaml
rules:
  commitLimit:
    config:
      max: 1
```

This configuration file, will tell Natali, that you expect natali to run the
rule `commitLimit`, which will limit the number of commits that can be in any
one pull request. By default, this will compare the currently checked out
branch with the `master` branch in the same repository to see by how many
commits it differs. See `commitLimit` in the **Rules** section for more
information.

Run the natali cli tool in the root of your project (this can be done locally
or in a CI environment).

```
npx natali
```

## Rules

### `commitLimit`

#### Options

Limit the number of commits that can be in any one pull request.

##### `max : number (default = 1)`

The maximum number of commits that the pull request can differ from `branch`.

##### `branch : string (default = 'master')`

The name of the branch to compare the pull request with when figuring out how
many commits difference there are.

#### Template Values

##### `maxCommits : number`

The maximum number of commits configured.

##### `numberOfCommits : number`

The number of commits that were found to be a part of the pull request.

##### `commits : Array<string>`

An array of commit messages in the format `<hash> - <message>`.

## Comment Templates

Natali can generate comments that will be posted against the pull request on
bitbucket cloud. All rules support providing a `template` option in the
configuration that points to a handlebars template relative to the location
of the `config.yaml` file. This template will be hydrated and the result
posted to the pull request as a comment.

A sample template file configuration for `commitLimit` might look like:

```yaml
# natali.yaml

rules:
  commitLimit:
    template: ./templates/commitLimit.md
    config:
      max: 1
      branch: develop
```

```md
<!-- templates/commitLimit.md ->

### Only {{maxCommits}} commit(s) per pull request

There should be a maximum of {{maxCommits}} commit(s) in your pull request
but there were {{numberOfCommits}}.

**Commits**

{{#commits}}
{{index}}. {{commit}}
{{/commits}}
```

## CLI

``` bash
# natali <path-to-config-yaml>, default path is "./natali.yaml" if none
# provided.
natali natali/config.yaml
```
