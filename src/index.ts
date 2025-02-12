import { getGroupNames } from "./modules/allgroup"
import { totalSchedule } from "./modules/getter"
import { getGroupSchedule } from "./modules/groupgetter"

const express = require('express')
const app = express()
const  cors = require('cors')

//! добавить авто фетчинг расписания 

//! учесть кейс с расписание на две даты

//& задеплоить в yandex-cloud serverless functions

// * продумать более крутой функционал
app.use(cors())
// Define middleware for all routes

// Define route for GET request on path '/'
app.get('/getScedule', async (request, response) =>{
    const res= await totalSchedule(request.query.day,request.query.month)
    response.json({ res })  
})
app.get('/getScedule/group', async (request, response) =>{
    const res= await getGroupSchedule(request.query.group,request.query.day,request.query.month)
    if (res.status) {
        return  response.status(400).json({ error: res.status });
        // Возвращаем ошибку с кодом 400
    }
    response.json(res)  
})
app.get('/groups', async (request, response) =>{
    const groups= await getGroupNames()
    response.json({ groups })  
})




app.listen(
 5000, 
   () => console.log(`Server listening on port 5000.`));