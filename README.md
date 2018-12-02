# ts-boilerplate

🐣 Tiny TypeScript + Node.js boilerplate

## What’s Included?

- TypeScript3.1
- TSLint with `tslint-config-airbnb` config
- Pretter and pre-commit hook
- Test configuration using Jest

## Getting Started

```
git clone https://github.com/HewonJeong/ts-boilerplate.git <project_name>
cd <project_name>
yarn install
```

## NPM Scripts

| script       | Description                                                                           |
| ------------ | ------------------------------------------------------------------------------------- |
| `start`      | Runs node app                                                                         |
| `serve`      | Does the same as `npm run serve`                                                      |
| `dev`        | Runs node with `ts-node-dev` so the process restarts if any of required files changes |
| `build`      | Compiles all source .ts files to .js files in the build folder                        |
| `test`       | Runs tests                                                                            |
| `test:watch` | Runs tests in watch mode                                                              |
| `prettify`   | run prettier                                                                          |

## Alternatives

- If you want to create a SPA with React in TypeScript, consider starting with [create-react-app](https://github.com/facebook/create-react-app) with following [this guide](https://facebook.github.io/create-react-app/docs/adding-typescript#docsNav)`
