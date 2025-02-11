function getDate(day: number,month:string){
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setMonth(date.getMonth() + month.indexOf(month));
    return date.toLocaleDateString('ru-RU');
}