# JavaScript-Kite <!-- omit from toc -->

- [Installation](#installation)
- [Create credentials](#create-credentials)
- [Usage](#usage)
    - [Showing versions](#showing-versions)
    - [Report version information to dashboard](#report-version-information-to-dashboard)

## Installation

Install the package as a dev dependency

```
npm install --save-dev @concept7/kite
```

or

```
npm install -D @concept7/kite
```

> _Make sure you have a `.env` with atleast a form of `ENV` or `ENVIRONMENT` in it (with or without the needed prefix)._

And a `.nvmrc` file and/or the node version in the `package.json`, eg;

```
    ...
    "engines": {
        "node": ">=18"
    }
    ...
```

## Create credentials

In order to make use of this package you need kite credentials.

Create a new project in the [Kite Dashboard](https://kite-monitor.concept7.dev/) and copy the credentials `KITE_URI`, `KITE_PROJECT_ID`, `KITE_PROJECT_KEY` to your own `.env`.

_See full explaination in the [ClickUp docs](https://app.clickup.com/24333704/v/dc/q6kc8-9535/q6kc8-2335)_

**NOTE:** Do **not** prefix these variables with, depending on your project, eg. `EXPO_PUBLIC_`, `VITE_`, etc. These variables will not be used in your project so they don't have to be made available for your framework.

## Usage

### Showing versions

To show the available versions in the project run

```
npx kite --versions
```

Below packages/frameworks can be filtered out;

- Node
- React
- React Native
- Expo
- Ionic
- Capacitor
- Angular

### Report version information to dashboard

To report the version information run

```
npx kite --report
```
