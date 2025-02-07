import axios from 'axios';
type schedule =  {
date:Date,
groups:{
groupName:{
pairs :{
    num:number,
    name:string,
    class:string
},
isTalks:boolean
     }
    }
}
async function fetchSchedule() {
    try {
        const url = 'https://www.pilot-ipek.ru/raspo/10%20февраля'; 
        const { data } = await axios.get(url);
        const cheerio = require('cheerio')
        const $ = cheerio.load(data);
        
        // Объект для хранения расписания
        const schedule: { date: string; groups: { groupName: string;id:number; pairs: {  subject: string;name:string; teacher: string; room: string; }[];talks:boolean; }[] } = {
            date: '10 февраля',
            groups: []
        };

        // Получаем названия групп
        const groups = $('table tbody tr:first-child td h1').map((i, el) => $(el).text().trim()).get();
schedule.groups = groups.map((groupName, index) => ({
    groupName,
    id : index + 1,
    pairs: []
}));
$('table tbody tr:first-child td').each((rowIndex, rowElement) => {
    if (rowIndex === 0) return; 
    const el = $(rowElement).find(`td:nth-child(1) p`).first().text().trim(); // Название группы
groups.forEach((groupName, index) => {
   console.log(el)
    schedule.groups[index].pairs.push({
        name: el,
        subject: '',
        teacher: '',
        room: ''
    });
    console.log(schedule.groups[index].pairs)
})

    // schedule.groups[index].pairs.push({
    //     name: el,
    //     subject: '',
    //     teacher: '',
    //     room: ''
    // });
})

//         $('table tbody tr').each((rowIndex, rowElement,colIndex,index) => {
//             // if (rowIndex === 0) return; 
//         console.log(rowIndex,$(rowElement).find(`td:nth-child(${rowIndex}) p`).first().text().trim())
//     //    const el = $(rowElement).find(`td:nth-child(1) p`).first().text().trim(); // Название группы
//     //         console.log(groups[index],"data:",el)
// //             const elbyindex = $(rowElement).find(`td:nth-child(${rowIndex}) p`).first().text().trim(); // Время пары
// // console.log(elbyindex)
//             $(rowElement).find('td').each((colIndex, colElement) => {
//                 if (colIndex === 0) return; 
//                 console.log()// Пропускаем первый столбец с временем пары
//                 const groupName = groups[colIndex];
//                 // Название группы
//                 const lessonDetails = $(colElement).find('p').map((i, el) => $(el).text().trim()).get();
//           //      console.log(groupName,"details:",colIndex) 
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

//                     // Добавляем урок в группу
//                     // group.lessons.push({  subject, teacher, room });
//                 }
//             });
//         });

        return schedule;
    } catch (error) {
        console.error('Ошибка при получении расписания:', error);
        return {};
    }
}

async function main() {
    let isLoading = true;
    const loadingAnimation = ['|', '/', '-', '\\'];
    let i = 0;

    const loadingInterval = setInterval(() => {
        process.stdout.write(`\rLoading ${loadingAnimation[i++]}`);
        i %= loadingAnimation.length;
    }, 100);

    const schedule = await fetchSchedule();
    isLoading = false;
    clearInterval(loadingInterval);
    process.stdout.write('\rLoading complete!\n');
    console.log(
    schedule
    ); // Выводим расписание в формате JSON
}

main();
