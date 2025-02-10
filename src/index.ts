import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as readline from 'readline';

// Функция для создания интерфейса чтения из терминала
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функция для получения HTML-кода
async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return data;
}

// Функция для парсинга таблицы
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

// Основная функция
async function fetchSchedule(date, month) {
    try {
        const url = `https://www.pilot-ipek.ru/raspo/11%20%20февраля`
        const html = await fetchHTML(url);
        const $ = cheerio.load(html);
        const schedule = [];

        $('table').each((tableIndex, table) => {
            const tableData = parseTable(table);
            schedule.push(...tableData);
        });

        fs.writeFileSync('schedule.json', JSON.stringify(schedule, null, 2));
        console.log('Данные успешно сохранены в schedule.json');
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
    }
}

// Запрос даты и месяца у пользователя
rl.question('Введите дату (например, 10): ', (date) => {
    rl.question('Введите месяц (например, февраль): ', (month) => {
        fetchSchedule(date, month);
        rl.close();
    });
});
