const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Listing = require("../models/listing.js");
const initData = require("./data.js");



const MONGO_URL ="mongodb://127.0.0.1:27017/wonderlust";

main()
.then(()=>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);

}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68c7e4a1e2af46d70f62b5f5" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();