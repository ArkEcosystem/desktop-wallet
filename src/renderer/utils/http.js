import got from 'got'

export const reqwest = (url, options = {}) => got(url, {
  ...{
    timeout: 1000,
    retry: 0
  },
  ...options
})
