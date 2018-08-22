// https://github.com/facebook/jest/issues/3601
const errorCapturer = fn => fn.then(res => () => res).catch(err => () => { throw err })
export default errorCapturer
