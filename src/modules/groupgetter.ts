import fs from 'fs';

export function getGroupSchedule(groupName, day, month) {
    try {
        const filePath =`data/schedule${day}${month}.json`;
      console.log(filePath);
        if (!fs.existsSync(filePath)) {
            console.log("Файл не найден:", filePath);
            return { status: "Ошибка: файл расписания не найден." };
        }

        const data = fs.readFileSync(filePath, 'utf8');
        if (!data) {
            console.log("Ошибка при чтении файла");
            return { status: "Ошибка при чтении файла, возможно расписание еще нет" };
        }

        const schedule = JSON.parse(data);
        console.log(schedule);
        const groupSchedule = schedule.find(group => group.groupName === groupName);
        
        if (!groupSchedule) {
            return { status: "Группа не найдена" };
        }

        return groupSchedule;
    } catch (error) {
        console.error('Ошибка при чтении файла:', error.message);
        return { status: "Ошибка сервера" };
    }
}
