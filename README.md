# React Tour

_Simple, interactive tour component for React._

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<img src="preview.gif" width="400" />

# Installation

Use npm:

`npm install @thinknum/react-tour`

Or Yarn:

`yarn add @thinknum/react-tour`.

## Development

1. Run `yarn` to install all dependencies
1. For development, run `yarn watch`. This will watch TypeScript source files, and automatically update generated files in `lib/`.
1. To use in another project, use `yarn link`.
    1. First, run `yarn link` in this repository, to register it as linkable module.
    1. Then, in your target repository, run `yarn link @thinknum/react-tour`, to use not version from NPM, but instead a live development version.
1. To unlink use `yarn unlink @thinknum/react-tour` in your project and reinstall your node_modules.

## Publishing

1. To publish a new version, first make sure that your repository is clean.
1. Make sure you're on the `master` branch and your changes are pushed to the origin (`git push origin master`)
1. Bump version by running `npm version patch`. This will bump the last number in version (for example from `0.0.1` to `0.0.2`). This will also create a new commit with version bump.
1. To publish your new version to NPM, run `npm publish`.
1. To use latest version in your project use `yarn upgrade --latest @thinknum/react-tour`