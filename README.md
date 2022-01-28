# Beeload Action

[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Toolkit for uploading data to Swarm network with GitHub Actions

**Warning: This project is in beta state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

This project is intended to be used with **Bee version <!-- SUPPORTED_BEE_START -->1.4.1-238867f1<!-- SUPPORTED_BEE_END -->**. Using it with older or newer Bee versions is not recommended and may not work. Stay up to date by joining the [official Discord](https://discord.gg/GU22h2utj6) and by keeping an eye on the [releases tab](https://github.com/ethersphere/bee-js/releases).

## Table of Contents

- [Usage](#usage)
- [Action inputs](#action-inputs)
- [Action outputs](#action-outputs)
- [Contribute](#contribute)
- [License](#license)

## Usage

### Sending latest `master` built to Mattermost

```yaml
name: Send `master` built link to Mattermost

on:
  push:
    branches:
      - 'master'

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js 16
        uses: actions/setup-node@v1
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      # Build process puts the built files into `./build` folder
      - name: Build
        run: npm run build

      # Upload the build folder to Swarm
      - name: Create preview
        id: upload
        uses: ethersphere/beeload-action@master
        with:
          bee-url: https://bee-9.gateway.ethswarm.org # We are using Gateway node that allows small sized files/sites to be uploaded
          postage-batch-id: '0000000000000000000000000000000000000000000000000000000000000000' # Postage Stamps are replaced on Gateway, so we are using dummy string to pass input validations
          token: ${{ secrets.REPO_GHA_PAT }}
          dir: ./build

      # Send notification to Mattermost channel
      - name: Create the Mattermost Message
        run: |
          echo "{\"text\":\"Preview of PR :tada:: ${{ steps.upload.outpus.preview-url }}\"}" > mattermost.json
      - uses: mattermost/action-mattermost-notify@master
        env:
          MATTERMOST_WEBHOOK_URL: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
```

### PR preview

```yaml
name: PR preview

on:
  pull_request:
    branches:
      - '**'

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js 16
        uses: actions/setup-node@v1
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      # Build process puts the built files into `./build` folder
      - name: Build
        run: npm run build

      # Upload the build folder to Swarm
      - name: Create preview
        uses: ethersphere/beeload-action@master
        with:
          bee-url: https://bee-9.gateway.ethswarm.org # We are using Gateway node that allows small sized files/sites to be uploaded
          postage-batch-id: '0000000000000000000000000000000000000000000000000000000000000000' # Postage Stamps are replaced on Gateway, so we are using dummy string to pass input validations
          preview: true
          token: ${{ secrets.REPO_GHA_PAT }}
          dir: ./build
```

## Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `bee-url` | URL of Bee API of your Bee node | |
| `bzz-link-url` | URL of Bzz.link. It has to contain `<<CID>>` string, which will be replaced with the CID of the content | `https://<<CID>>.bzz.link` |
| `postage-batch-id` | Batch ID of Postage Stamp that will be used for upload | |
| `dir` | Folder that contains the built webpage | `./build` |
| `token` | Token to be used for creating of the PR Preview comment. | `GITHUB_TOKEN` |
| `preview` | Flag that enables creating PR Preview comment. | `false` |
| `extra-params` | Extra parameters that you will be passed to [swarm-cli](https://github.com/ethersphere/swarm-cli) calls. | |

## Action outputs

| Name | Description |
| --- | --- |
| `swarm-hash` | Swarm hash of the uploaded content |
| `bzz-link` | Bzz Link URL |

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/ethersphere/beeload-action/issues) and take on one of them
- Help our tests reach 100% coverage!
- Join us in our [Discord chat](https://discord.gg/wdghaQsGq5) in the #develop-on-swarm channel if you have questions or want to give feedback

## Maintainers

- [auhau](https://github.com/auhau)

## License

[BSD-3-Clause](./LICENSE)

