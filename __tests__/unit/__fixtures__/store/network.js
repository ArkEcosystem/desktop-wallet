const network1 = {
  id: 'main',
  name: 'main',
  symbol: 'm',
  token: 'MAI',
  subunit: 'mainito',
  fractionDigits: 8,
  server: 'http://127.0.0.1',
  apiVersion: 1,
  constants: {}
}

const network2 = {
  id: 'other',
  name: 'other',
  symbol: 'o',
  token: 'OTH',
  subunit: 'another',
  fractionDigits: 8,
  server: 'http://127.0.0.1',
  apiVersion: 1,
  constants: {}
}

export default {
  network1,
  network2
}

export {
  network1,
  network2
}
