# JavaScript Kite

JavaScript/TypeScript CLI tool that reports project metadata to the [Kite](https://gitlab.concept7.nl/workflow/kite-backend) monitoring API.

## Prerequisites

### npmrc file

A `.npmrc` file with the following content must exist in the root of the project:

```
@concept7:registry=https://gitlab.concept7.nl/api/v4/projects/284/packages/npm/
//gitlab.concept7.nl/api/v4/projects/284/packages/npm/:_authToken=${CI_JOB_TOKEN}
```

### GitLab Personal Access Token

1. Go to [GitLab](https://gitlab.concept7.nl/-/user_settings/personal_access_tokens) and create a new personal access token (scope: `api`, max expiry: 1 year)
2. Add to your `.zshrc`:

```bash
export CI_JOB_TOKEN=your-personal-accesstoken
```

### Project access

Add the consuming project to the [Job token permissions](https://gitlab.concept7.nl/workflow/javascript-kite/-/settings/ci_cd#js-token-access) section with `Default permissions`.

## Installation

```bash
npm install --save-dev @concept7/kite
```

### Requirements

- A `.env` file with an `ENV` or `ENVIRONMENT` variable (with or without a framework prefix)
- A `.nvmrc` file and/or a `node` version in `package.json`:

```json
{
    "engines": {
        "node": ">=18"
    }
}
```

## Configuration

Add the `KITE_TOKEN` to your `.env` file (generated from the [Kite Dashboard](https://kite-monitor.concept7.dev/)):

```env
KITE_TOKEN=your-kite-token
```

**NOTE:** Do **not** prefix this variable with `EXPO_PUBLIC_`, `VITE_`, `NG_APP_`, etc. This variable is only used by the CLI tool, not by your framework.

## Usage

### Help

```bash
npx kite --help
```

### Show versions

```bash
npx kite --versions
```

Detected frameworks:

- Node
- React
- React Native
- Expo
- Ionic
- Capacitor
- Angular
- Vue

### Report to dashboard

```bash
npx kite --report
```

### What gets reported

**Meta** — Framework and runtime versions detected in the project.

**Packages** — All npm dependencies from `package.json`, resolved to their installed versions from `package-lock.json`. Each package is tagged with `ecosystem: "npm"`.

## License

MIT
