'use strict'

const axios = require('axios')

module.exports = message => {
  return new Promise(async (resolve, reject) => {
    if (message.url) {
      try {
        const { data, status } = await axios(message)
        // Sending through processes involves serializing and parsing the data,
        // so it is better to use only the useful parts of the response
        resolve({ data, status })
      } catch (error) {
        reject(error)
      }
    } else {
      reject(new Error(`HTTP worker does not understand message \`${message}\``))
    }
  })
}
