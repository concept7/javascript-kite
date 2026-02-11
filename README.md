# JavaScript-Kite <!-- omit from toc -->

- [Prerequisites](#prerequisites)
    - [npmrc file](#npmrc-file)
    - [GitLab Personal Access Token](#gitlab-personal-access-token)
- [Installation](#installation)
- [Create credentials](#create-credentials)
- [Usage](#usage)
    - [Help](#help)
    - [Showing versions](#showing-versions)
    - [Report version information to dashboard](#report-version-information-to-dashboard)

## Prerequisites

#### npmrc file

A `.npmrc` file with the following content must exist in the root of the project in order to install the package;

```
# @concept7/kite
@concept7:registry=https://gitlab.concept7.nl/api/v4/projects/284/packages/npm/
//gitlab.concept7.nl/api/v4/projects/284/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

#### GitLab Personal Access Token

- Go to [GitLab](https://gitlab.concept7.nl/-/user_settings/personal_access_tokens) and create a new personal access token
    - Set the date as far as possible (this can be a maximum of 1 year)
    - Scope must be set to `api`

- Add the following code block to your `.zshrc` file and replace `{your-personal-accesstoken}` with your token (without any quotes)

```
# GitLab Presonal Access Token
# For installing packages from the GitLab package registry
export CI_JOB_TOKEN={your-personal-accesstoken}
```

## Installation

Install the package as a dev dependency

```
npm install --save-dev @concept7/kite
```

or

```
npm install -D @concept7/kite
```

> If your unable to install the latest version of the package, please empty your cache (`npm cache clean --force`) and try again

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

### Help

To see all available commands, use the `--help` or `-h` flag

```
npx kite --help
```

```
npx kite -h
```

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
