import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { coupleDates } from './coupleDates';


// Функция для создания интерфейса чтения из терминала


// Функция для получения HTML-кода
export async function fetchHTML(url): Promise<string | null> {
    const { data} = await axios.get(url);
if (!data) {
    console.log('Ошибка при получении HTML-кода');
    return null;
}
    return data;
}

// Функция для парсинга таблицы
export function parseTable(table) {
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
export async function totalSchedule(day:number | string,month:string):Promise<any>  {
    try {
        // %20  - пробел , проблема в том что иногда в ссылке 
        // находиться два пробела между 11 и февраля , а иногда один
    // также бывают случаи когда в url находитться две даты 
    // запятая никак не кодируется кодируется только пробел
   if (typeof day == "string" && day.match(',')) {
    let days
     days = day.split(',')
 const schedule = coupleDates(days[0],days[1],month)
 return {
    "status":200,
    "details":"Кейс отыгран"
 }
}
    const probel = '%20'
   let url:string;
   let html;
   url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${month}`;
   html = await fetchHTML(url);
   if (!html) {
       url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${probel}${month}`;
       console.log("Ошибка с url возможно нет пробела , пробую добавить ...")
       html = await fetchHTML(url); // Retry fetching with the updated URL
   }
   if (!html) {
       console.error("Повторная ошибка пожалуйста проверьте правильность ввода")
       return {
           status :"Повторная ошибка пожалуйста проверьте правильность ввода"
       }  
   }
   console.log(url)
   const $ = cheerio.load(html);
   const schedule = [];
   $('table').each((tableIndex, table) => {
       const tableData = parseTable(table);
       schedule.push(...tableData);
   });
   console.log({status:200,details:`Отправлено полное расписание  за ${day} ${month}`}) 
// saveScheduleToDB(schedule)
   return schedule;
} catch (error) {
   if (error.response && error.response.status === 400) {
   const probel = '%20'
       let url = `https://www.pilot-ipek.ru/raspo/${day}${probel}${probel}${month}`;
       console.log("Получен статус 400, пробую добавить еще один пробел ...",url)
      let  html = await fetchHTML(url); // Retry fetching with the updated URL
       if (!html) {
           return {
               status :"Ошибка при повторном запросе, пожалуйста проверьте правильность ввода",
           }
       }
       const $ = cheerio.load(html);
       const schedule = [];
       $('table').each((tableIndex, table) => {
           const tableData = parseTable(table);
           schedule.push(...tableData);
       });
       console.log({status:200,details:`Отправлено полное расписание  за ${day} ${month}`}) 
       fs.writeFileSync(`data/schedule${day}${month}.json`, JSON.stringify(schedule, null, 2));      
        return schedule;
   }
   return {
       status :"Ошибка при получении данных",
       error: error.message,
   }
}}
