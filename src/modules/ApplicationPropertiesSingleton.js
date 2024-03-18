const envalid = require('envalid')
const { str, port } = envalid

const env = envalid.cleanEnv(process.env, {
    SERVER_PORT : port(),
    DATABASE_URL: str(),
    SECRET: str()
 })
    
module.exports = {
    VAR_SERVER_PORT : env.SERVER_PORT,
    VAR_DATABASE_URL : env.DATABASE_URL,
    VAR_SECRET : env.SECRET
}