const mongoose = require("mongoose")
let instance = null
class DB {
    constructor(){
        if(!instance){
            instance = this
            this.mongoDBConnection = null
        }
        return instance
    }
    async connect(){
        if (this.mongoDBConnection) {
            console.log("Using existing DB connection")
            return this.mongoDBConnection
        }
        try {
            let db = await mongoose.connect(process.env.DB_URL)
            this.mongoDBConnection = db
            console.log("DB is connected")
        } catch (error) {
            console.log("DB did not connected")
            console.error(error)
            process.exit(1)
        }
    }
} 

module.exports = new DB()