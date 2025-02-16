const axios = require('axios');
const cheerio = require('cheerio');
const EasyYandexS3 = require('easy-yandex-s3').default;
let s3 = new EasyYandexS3({
    auth: {
      accessKeyId: 'YCAJEmmhVKiQFxqCY0IXE02lH',
      secretAccessKey: 'YCMo3gC5oNmnCCC4Aby6G624qNdGD_9EPCYYiKgb',
    },
    Bucket: 'schedulesjsons', // например, "my-storage",
    debug: true, // Дебаг в консоли, потом можете удалить в релизе
  }); 

// Function to get HTML code
async function fetchHTML(url) {
    const { data } = await axios.get(url);
    if (!data) {
        console.log('Error getting HTML code');
        return null;
    }
    return data;
}

// Function to parse table
function parseTable(table) {
    const groups = [];
    const $ = cheerio.load(table);
    $(table).find('tr').each((rowIndex, row) => {
        if (rowIndex === 0) {
            $(row).find('td:not(:first-child) h1').each((i, el) => {
                groups.push({
                    groupName: $(el).text().trim(),
                    pairs: []
                });
            });
        } else {
            $(row).find('td:not(:first-child)').each((i, td) => {
                const lessonDetails = $(td).find('p').map((j, el) => $(el).text().trim()).get();
                if (groups[i]) {
                    groups[i].pairs.push(lessonDetails.length > 0 ? lessonDetails : null);
                }
            });
        }
    });
    return groups;
}

// Main function
async function totalSchedule(day, month) {

    try {
        if (typeof day === "string" && day.match(',')) {
            let days = day.split(',');
            const schedule = coupleDates(days[0], days[1], month);
            return {
                "status": 200,
                "details": "Case completed",
                schedule: schedule
            };
        }
        const probel = '%20';
        let url;
        let html;
        url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${month}`;
        html = await fetchHTML(url);
        if (!html) {
            url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${probel}${month}`;
            console.log("Error with URL, possibly missing space, trying to add...");
            html = await fetchHTML(url);
        }
        if(!html) {
            const schedule = coupleDates(day, day+1, month);
            return {
                "status": 200,
                "details": "Case completed",
                schedule: schedule
            };
        }
        if (!html) {
            console.error("Repeated error, please check input correctness");
            return {
                status: "Repeated error, please check input correctness"
            };
        }
        console.log(url);
        const $ = cheerio.load(html);
        const schedule = [];
        $('table').each((tableIndex, table) => {
            const tableData = parseTable(table);
            schedule.push(...tableData);
        });
        console.log({ status: 200, details: `Full schedule sent for ${day} ${month}` });
s3.Upload(`data/schedule${day}${month}.json`, JSON.stringify(schedule));
        return schedule;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const probel = '%20';
            let url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${probel}${month}`;
            console.log("Received status 400, trying to add another space...", url);
            let html = await fetchHTML(url);
            if (!html) {
                console.error("Error on retry, please check input correctness");
                return {
                    status: "Error on retry, please check input correctness",
                };
            }
            const $ = cheerio.load(html);
            const schedule = [];
            $('table').each((tableIndex, table) => {
                const tableData = parseTable(table);
                schedule.push(...tableData);
            });
            console.log({ status: 200, details: `Full schedule sent for ${day} ${month}` });
s3.Upload(`data/schedule${day}${month}.json`, JSON.stringify(schedule));
            return schedule;
        }
        console.error('Error getting data');
        return {
            status: "Error getting data",
            error: error.message,
        };
    }
}

async function coupleDates(date1, date2, month) {
    const probel = '%20'
    let url;
    let html;
    url = `https://www.pilot-ipek.ru/raspo/${date1},${probel}${date2}${probel}${month}`;
    console.log(url)
    html = await fetchHTML(url);
    if (!html) {
        console.error("Повторная ошибка пожалуйста проверьте правильность ввода")
        return {
            status: "ошибка пожалуйста проверьте правильность ввода"
        }  
    }
    const $ = cheerio.load(html);
    const schedule1day = [];
    const schedule2day = [];
    let nextday = false
    $('table').each((tableIndex, table) => {
        if(!nextday) {
            const tableData = parseTable(table);
            schedule1day.push(...tableData);
        } else {
            const tableData = parseTable(table);
            schedule2day.push(...tableData);
        }
        nextday = !nextday
        console.log(tableIndex,"индекс");
    });
    s3.Upload(`data/schedule${date1}${month}.json`, JSON.stringify(schedule1day));
    s3.Upload(`data/schedule${date2}${month}.json`, JSON.stringify(schedule2day));
  return {
        status: 200,
        details: "Кейс отыгран , информация записана"
    }
}

module.exports = { fetchHTML, parseTable, totalSchedule };