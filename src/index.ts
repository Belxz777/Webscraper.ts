import { getGroupNames } from "./modules/allgroup"
import { totalSchedule } from "./modules/total"
import { getGroupSchedule } from "./modules/groupgetter"
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express')
const app = express()
const  cors = require('cors')
const serverless = require('serverless-http');
app.use(express.urlencoded({ extended: true }));
//! добавить авто фетчинг расписания 

//! учесть кейс с расписание на две даты

//& задеплоить в yandex-cloud serverless functions

// * продумать более крутой функционал
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Файл базы данных
  });

  // export const Sche = sequelize.define({
  //   day:DataTypes.NUMBER,
  //   month:DataTypes.STRING,
  //   groupName:DataTypes.STRING,
  // })
  // const Pair = sequelize.define({
  //   pair:DataTypes.STRING,
  //   teacher:DataTypes.STRING,
  //   room:DataTypes.STRING,
  //   type:DataTypes.STRING,
  // })
  // Pair.belongsTo(Sche,{foreignKey:'groupName'})
  // // Синхронизация базы данных
  // sequelize.sync({ force: true }).then(() => {
  //   console.log('База данных синхронизирована');
  // });
app.use(cors())
// Define middleware for all routes

// Define route for GET request on path '/'
app.get('/getScedule', async (request, response) =>{
    const res= await totalSchedule(request.query.day,request.query.month)
    response.json({ res })  
})
app.get('/getGroupScedule', async (request, response) =>{
    const res= await getGroupSchedule(request.query.group,request.query.day,request.query.month)
    if (res.status) {
        return  response.status(400).json({ error: res.status });
        // Возвращаем ошибку с кодом 400
    }
    response.json(res)  
})
app.get('/getAllGroups', async (request, response) =>{
    const groups= await getGroupNames()
    response.json({ groups })  
})

//! add db


app.listen(
 5000, 
   () => console.log(`Server listening on port 5000.`));
//    module.exports.handler = serverless(app);