require('dotenv').config()
const PORT = process.env.PORT||3001
const MONGODB_URL = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URL
  : process.env.MONGODB_URL
const SECRET_KEY= process.env.SECRET
module.exports = { MONGODB_URL, PORT, SECRET_KEY} 