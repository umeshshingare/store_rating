const mysql=require('mysql2');
const dotenv=require('dotenv');
const path=require('path');
dotenv.config({path:'./.env'});
const db=mysql.createPool({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME
}).promise();

module.exports=db;