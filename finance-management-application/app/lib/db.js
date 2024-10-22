import mongoose from "mongoose";

global.mongoose = {
    conn: null,
    promise: null
}

export async function dbConnect(params) {
    if(global.mongoose && global.mongoose.conn){
        console.log('Connected from previous');
        return global.mongoose.conn
    }else{
        const conString = process.env.MONGO_URI;
        const promise = mongoose.connect(conString, {
            autoIndex: true
        })

        global.mongoose = {
            conn: await promise,
            promise,
        };
        console.log('Newly Connected');

        return await promise;
    }
}