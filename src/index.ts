import axios from 'axios';

async function fetchSchedule() {
    try {
        const url = 'https://www.pilot-ipek.ru/raspo/10%20февраля'; 
        const { data } = await axios.get(url);
        
        const cheerio = require('cheerio')
        const $ = cheerio.load(data);
        
        // Объект для хранения расписания
        const schedule: { date: string; groups: { groupName: string; lessons: { pair: string; subject: string; teacher: string; room: string; }[]; }[] } = {
            date: '10 февраля',
            groups: []
        };

        // Получаем названия групп
        const groups = $('table tbody tr:first-child td h1').map((i, el) => $(el).text().trim()).get();
console.log("группы",groups)
        // Проходим по всем парам
        $('table tbody tr').each((rowIndex, rowElement,colIndex) => {
            if (rowIndex === 0) return; 

            
            const elbyindex = $(rowElement).find(`td:nth-child(${rowIndex}) p`).first().text().trim(); // Время пары
if(!elbyindex){
console.log("no first pair")
}
            console.log("pairtime",elbyindex,groups[rowIndex])
            $(rowElement).find('td').each((colIndex, colElement) => {
                if (colIndex === 0) return; // Пропускаем первый столбец с временем пары
                const groupName = groups[colIndex]; // Название группы
                const lessonDetails = $(colElement).find('p').map((i, el) => $(el).text().trim()).get();

                if (lessonDetails.length > 0) {
                    const subject = lessonDetails[0]; // Название предмета
                    const teacher = lessonDetails[1] || ''; // Имя учителя (если есть)
                    const room = lessonDetails[lessonDetails.length - 1] || ''; // Кабинет (последний элемент)

                    // Находим или создаем группу в расписании
                    let group = schedule.groups.find(g => g.groupName === groupName);
                    if (!group) {
                        group = { groupName, lessons: [] };
                        schedule.groups.push(group);
                    }

                    // Добавляем урок в группу
                    // group.lessons.push({  subject, teacher, room });
                }
            });
        });

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
    "no errors"
    ); // Выводим расписание в формате JSON
}

main();
