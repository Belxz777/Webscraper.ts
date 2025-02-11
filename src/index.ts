import { totalSchedule } from "./modules/getter"
import { getGroupSchedule } from "./modules/groupgetter"

const express = require('express')
const app = express()

// Define middleware for all routes

// Define route for GET request on path '/'
app.get('/getScedule', async (request, response) =>{
    const respons= await totalSchedule(request.query.day,request.query.month)
    response.json({ respons })  
})
app.get('/getScedule/group', async (request, response) =>{
    const respons= await getGroupSchedule(request.query.group,request.query.day,request.query.month)
    response.json({ respons })  
})



// Start the server on port 3000
app.listen(
 5000, 
   () => console.log(`Server listening on port 5000.`));