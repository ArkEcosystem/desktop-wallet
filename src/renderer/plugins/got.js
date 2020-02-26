/* eslint-disable @typescript-eslint/no-var-requires */
const got = require('got/source/index')
const { request } = require('stream-http')

const client = got.extend({ request })

module.exports = client
