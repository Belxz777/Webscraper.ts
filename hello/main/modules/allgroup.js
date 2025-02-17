const EasyYandexS3 = require('easy-yandex-s3').default;
let s3 = new EasyYandexS3({
    auth: {
      accessKeyId: 'YCAJEmmhVKiQFxqCY0IXE02lH',
      secretAccessKey: 'YCMo3gC5oNmnCCC4Aby6G624qNdGD_9EPCYYiKgb',
    },
    Bucket: 'schedulesjsons', // например, "my-storage",
    debug: true, // Дебаг в консоли, потом можете удалить в релизе
  }); 
function extractGroupNames(data) {
    return data.map(group => group.groupName);
}

 function getGroupNames() {
const groupsData = s3.Download('data/groups.json');
    if (!groupsData) {
        console.log("Ошибка при чтении файла");
        return [];
    }
    console.log(groupsData);
    const groupNames = extractGroupNames(JSON.parse(groupsData));
    return groupNames;
}

module.exports = { getGroupNames };