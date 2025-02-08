import axios from 'axios';
import { is } from 'cheerio/dist/commonjs/api/traversing';
import * as readline from 'readline';

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/getRaspo/bygroup', async (req, res) => {
    const day = req.query.day;
    const group = req.query.group;
    const schedule = await fetchSchedule(day, false);
    
    // Directly filter the array returned by fetchSchedule
    const groupsSchedule = schedule.filter(groupSchedule => groupSchedule.groupName === group);
    
    res.json(groupsSchedule);
});

app.get('/getRaspo/group/twoDay', async (req, res) => {
    const firstDay = req.query.firstDay;
    const secondDay = req.query.secondDay;
    const schedule = await fetchSchedule([firstDay, secondDay], true);
    res.json(schedule);
});

app.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fetchSchedule(day: string | number | string[], isTwoDay: boolean) {
    try {
        let url = '';
        console.log(`Дата расписания: ${day}`);
        url = `https://www.pilot-ipek.ru/raspo/${day}%20февраля`;
        const { data } = await axios.get(url);
        const cheerio = require('cheerio');
        const $ = cheerio.load(data);

        // Объект для хранения расписания
        const schedule = [];

        // Получаем названия групп
        const groupsArray = $('table tbody tr td h1').map((i, el) => $(el).text().trim()).get();

        const firstpairs = $('table tbody tr:nth-child(2) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const secondpairs = $('table tbody tr:nth-child(3) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const thirdpairs = $('table tbody tr:nth-child(4) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const fourthpairs = $('table tbody tr:nth-child(5) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const fifthpair = $('table tbody tr:nth-child(6) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
            return { details };
        }).get();

        const sixpair = $('table tbody tr:nth-child(7) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const sevenpair = $('table tbody tr:nth-child(8) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : null;
            return { details };
        }).get();

        const groups = groupsArray.map((groupName, index) => ({
            groupName,
            isTalks: false,
            pairs: {
                first: firstpairs[index] ? firstpairs[index].details : [],
                second: secondpairs[index] ? secondpairs[index].details : [],
                third: thirdpairs[index] ? thirdpairs[index].details : [],
                fourth: fourthpairs[index] ? fourthpairs[index].details : [],
                fifthpair: fifthpair[index] ? fifthpair[index].details : null,
                sixpair: sixpair[index] ? sixpair[index].details : [],
                sevenpair: sevenpair[index] ? sevenpair[index].details : []
            },
        }));

        console.log("группы", groups);
        const fs = require('fs');
        fs.writeFileSync(`./totalinfo${day}.json`, JSON.stringify(groups, null, 2));
        return groups; // Return the array of groups
    } catch (error) {
        console.error(`Error fetching schedule: ${error.message}`);
        return []; // Return an empty array in case of error
    }
}