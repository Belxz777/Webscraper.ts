const EasyYandexS3 = require('easy-yandex-s3').default;
let s3 = new EasyYandexS3({
    auth: {
      accessKeyId: 'YCAJEmmhVKiQFxqCY0IXE02lH',
      secretAccessKey: 'YCMo3gC5oNmnCCC4Aby6G624qNdGD_9EPCYYiKgb',
    },
    Bucket: 'schedulesjsons', // например, "my-storage",
    debug: true, // Дебаг в консоли, потом можете удалить в релизе
  }); 
function getGroupSchedule(groupName, day, month) {
    try {
        const filePath =`data/schedule${day}${month}.json`;
      console.log(filePath);
        if (!s3.GetList(filePath)) {
            console.log("Файл не найден:", filePath);
            return { status: "Ошибка: файл расписания не найден." };
        }

        const data = s3.Download(filePath)
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
module.exports = { getGroupSchedule };