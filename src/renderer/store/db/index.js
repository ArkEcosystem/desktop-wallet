import packageJson from '@package.json'
import DbInterface from '@/store/db/interface'

export default DbInterface.create(packageJson.name)
