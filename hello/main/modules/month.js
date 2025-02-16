function getMonth(month){
 if(month === 1){
    return "января"
 }else
 if(month === 2){
    return "февраля"
 }else if(month === 3){
    return "марта"
 }else if(month === 4){
    return "апреля"
 }
    else if(month === 5){
    return "мая"
 }else if(month === 6){
    return "июня"
 }else if(month === 7){
    return "июля"
 }
 else if(month === 8){
    return "августа"
 }else if(month === 9){
    return "сентября"
 }else if(month === 10){
    return "октября"
 }else if(month === 11){
    return "ноября"
 }else if(month === 12){
    return "декабря"
 }

}
module.exports = {getMonth};