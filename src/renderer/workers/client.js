'use strict'

const { Connection } = require('@arkecosystem/client')

process.on('message', async ({ baseUrl, options, type, endpoint, data, query, method, url }) => {
  const client = new Connection(baseUrl)

  if (method) {
    try {
      process.send((await client[method](url, options)))
    } catch (error) {
      process.send({
        error: `Failed to perform ${method} request ${url}: ${error.message}`
      })
    }

    return
  }

  try {
    if (options) {
      client.withOptions(options)
    }

    process.send((await client.api(type)[endpoint](data, query)))
  } catch (error) {
    process.send({
      error: `Failed to perform request ${baseUrl}/${type}/${endpoint}: ${error.message}`
    })
  }
})
