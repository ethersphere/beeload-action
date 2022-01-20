#!/usr/bin/env node

const swarmCID = require('@ethersphere/swarm-cid')

const input = process.argv[2]
const cid = swarmCID.encodeManifestReference(input)

process.stdout.write(cid.toString())
