import got from 'got/source/index'
import { request } from 'stream-http'

const client = got.extend({ request, stream: false })

export default client
