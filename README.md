# React Tour

_Simple, interactive tour component for React._

![license](https://img.shields.io/github/license/thinknum/react-tour.svg)
![last-commit](https://img.shields.io/github/last-commit/thinknum/react-tour/master.svg)
![typescript](https://shields-staging.herokuapp.com/npm/types/@thinknum/react-tour.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## About

React Tour helps you add an interactive tour to your product. **It waits for user to complete certain action** before showing the next tooltip. Optionally, you can opt into interaction simulation - so user doesn't have to do anything, only watch.

<img src="preview.gif" width="400" />

# Installation

Use npm:

`npm install @thinknum/react-tour`

Or Yarn:

`yarn add @thinknum/react-tour`.

**Note: React Tour currently requires `react-redux` at version 6, as it relies on custom stores using store key. (See [this issue](https://github.com/reduxjs/react-redux/issues/1132) in react-redux.) We're working on resolving this, pull-requests are welcome.**


# Adding tour to your project

1. Wrap your app in `ReactTourProvider.` It's just a custom Redux provider where tour is storing its state. This will let you integrate user interactions with the tour, for example waiting for user to take an action before showing the next tooltip.

```ts
const MyApp = () => {
  return (
    <ReactTourProvider>
      <ReduxProvider store={store}>
        <AppLayout />
      </ReduxProvider>
    </ReactTourProvider>
  );
};
```

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