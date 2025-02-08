import axios from 'axios';
import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function fetchSchedule(answer:string | number) {
    try {
        let url = '';
        const dateday = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });     
url =` https://www.pilot-ipek.ru/raspo/${answer}%20февраля`
        console.log(url)
        const { data } = await axios.get(url);
        const cheerio = require('cheerio')
        const $ = cheerio.load(data);
              // Объект для хранения расписания
        const schedule: { date: string; groups: { groupName: string; lessons: { pair: string; subject: string; teacher: string; room: string; }[]; }[] } = {
            date: '10 февраля',
            groups: []
        };     
                  $('table').each((i, table) => {
                      $(table).find('tr').filter((j, tr) => {
                          return $(tr).find('td').text().trim() === '';
                      }).remove();
                  });
        // Получаем названия групп
        const groupsArray = $('table tbody tr:first td h1').map((i, el) => $(el).text().trim()).get();
           const firstpairs = $('table tbody tr:nth-child(2) td:not(:first-child)').map((i, tdElement) => {
               const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
               const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
             console.log(details)
               return { details };
           }).get();

           const secondpairs = $('table tbody tr:nth-child(3) td:not(:first-child)').map((i, tdElement) => {
               const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
               const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
               console.log(details)
               return { details };
           }).get();

           const thirdpairs = $('table tbody tr:nth-child(4) td:not(:first-child)').map((i, tdElement) => {
               const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
               const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
               return { details };
           }).get();

           const fourthpairs = $('table tbody tr:nth-child(5) td:not(:first-child)').map((i, tdElement) => {
               const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
               const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
               return { details };
           }).get();
           const fifthpair = $('table tbody tr:nth-child(6) td:not(:first-child)').map((i, tdElement) => {
            const lessonDetails = $(tdElement).find('p').map((j, el) => $(el).text().trim()).get();
            const details = lessonDetails.length > 0 ? lessonDetails : ["нет пары"];
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
              fifthpair: fifthpair[index] ? fifthpair[index].details : [],
                }
           }));

        console.log("группы", groups,groups[3].pairs.fifthpair);
        // Проходим по всем парам
        // $('table tbody tr').each((rowIndex, rowElement,colIndex) => {
        //     if (rowIndex === 0) return; 

            
//             const elbyindex = $(rowElement).find(`td:nth-child(${rowIndex}) p`).first().text().trim(); // Время пары
// if(!elbyindex){
// console.log("no first pair")
// }
//             console.log("pairtime",elbyindex,groups[rowIndex])
//             $(rowElement).find('td').each((colIndex, colElement) => {
//                 if (colIndex === 0) return; // Пропускаем первый столбец с временем пары
//                 const groupName = groups[colIndex]; // Название группы
//                 const lessonDetails = $(colElement).find('p').map((i, el) => $(el).text().trim()).get();

//                 if (lessonDetails.length > 0) {
//                     const subject = lessonDetails[0]; // Название предмета
//                     const teacher = lessonDetails[1] || ''; // Имя учителя (если есть)
//                     const room = lessonDetails[lessonDetails.length - 1] || ''; // Кабинет (последний элемент)

//                     // Находим или создаем группу в расписании
//                     let group = schedule.groups.find(g => g.groupName === groupName);
//                     if (!group) {
//                         group = { groupName, lessons: [] };
//                         schedule.groups.push(group);
//                     }
//                     // Находим или создаем группу в расписании
//                     let group = schedule.groups.find(g => g.groupName === groupName);
//                     if (!group) {
//                         group = { groupName, lessons: [] };
//                         schedule.groups.push(group);
//                     }

                    // Добавляем урок в группу
                    // group.lessons.push({  subject, teacher, room });
        //         }
        //     });
        // });

        return schedule;
    } catch (error) {
        console.error('Ошибка при получении расписания:', error);
        return {};
    }
}
async function main() {
    rl.question("На какую дату ", async function(answer) {
        let isLoading = true;
        const loadingAnimation = ['|', '/', '-', '\\'];
        let i = 0;
    
        const loadingInterval = setInterval(() => {
            process.stdout.write(`\rLoading ${loadingAnimation[i++]}`);
            i %= loadingAnimation.length;
        }, 100);
    
        const schedule = await fetchSchedule(answer);
        isLoading = false;
        clearInterval(loadingInterval);
        process.stdout.write('\rLoading complete!\n');
        console.log(
        "no errors"
        ); 
      rl.close();
      });// Выводим расписание в формате JSON
}

main();
