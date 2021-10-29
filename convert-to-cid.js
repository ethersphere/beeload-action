#!/usr/bin/env node

const CID = require('cids')

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    const hexByte = hex.substr(i * 2, 2)
    bytes[i] = parseInt(hexByte, 16)
  }

  return bytes
}

const input = process.argv[2]
const hashBytes = hexToBytes(input)
const multihash = new Uint8Array([0x1b, hashBytes.length, ...hashBytes])
const cid = new CID(1, 'dag-pb', multihash)

process.stdout.write(cid.toString())
