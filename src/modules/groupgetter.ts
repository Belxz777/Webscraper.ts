// groupSchedule.js
import { group } from 'console';
import fs from 'fs';

// Функция для получения расписания группы
export function getGroupSchedule(groupName,day,month) {
    try {
        const data = fs.readFileSync(`data/schedule${day}${month}.json`, 'utf8');
      if(!data) {
        console.log("Ошибка при чтении файла")
        return {
            status :"Ошибка при чтении файла , возможно расписани еще нет"
        }
      }
        const schedule = JSON.parse(data);
return schedule.find(group => group.groupName == groupName);
    } catch (error) {
        console.error('Ошибка при чтении файла:', error.message);
    }
}
// Экспорт функции
