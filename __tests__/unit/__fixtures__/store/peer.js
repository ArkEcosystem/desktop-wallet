const goodPeer1 = {
  ip: '1.1.1.1',
  host: 'http://1.1.1.1',
  port: 4001,
  p2pPort: null,
  version: '1.3.1',
  height: 6030358,
  status: 'OK',
  os: 'linux',
  delay: 123,
  isCustom: false,
  lastUpdated: null,
  isHttps: false
}
const goodPeer2 = {
  ip: '2.2.2.2',
  host: 'http://2.2.2.2',
  port: 4001,
  p2pPort: null,
  version: '1.3.1',
  height: 6030358,
  status: 'OK',
  os: 'linux',
  delay: 234,
  isCustom: false,
  lastUpdated: null,
  isHttps: false
}
const goodPeer3 = {
  ip: '3.3.3.3',
  host: 'http://3.3.3.3',
  port: 4001,
  p2pPort: null,
  version: '1.3.1',
  height: 6030358,
  status: 'OK',
  os: 'linux',
  delay: 345,
  isCustom: false,
  lastUpdated: null,
  isHttps: false
}
const badPeer1 = {
  ip: '4.4.4.4',
  host: 'http://4.4.4.4',
  port: 4001,
  p2pPort: null,
  version: '1.3.1',
  height: 5000,
  status: 'OK',
  os: 'linux',
  delay: 456,
  isCustom: false,
  lastUpdated: null,
  isHttps: false
}

export default [
  goodPeer1,
  goodPeer2,
  goodPeer3,
  badPeer1
]

export {
  goodPeer1,
  goodPeer2,
  goodPeer3,
  badPeer1
}
