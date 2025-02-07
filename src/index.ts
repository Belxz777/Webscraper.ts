import axios from 'axios';
import cheerio from 'cheerio';
interface city  {
    name:string,
    created:string,
    humans:string
    }
export class CapitalCityScraper {
    async scrapeCity(url: string) {
        const response = await axios.get(url);
        const html = response.data;

        const cheerio = require('cheerio');
        const $ = cheerio.load(html);
        const cityName = $('.mergedtoprow th:contains(Country) + td').text().trim();
        const createdAt = $('.mergedtoprow th:contains(Founded) + td').text().trim()
        const humansamout = $('.mergedrow th:contains(Total) + td').text().trim()
        const humanAmount = Number(humansamout)
        const flagPageLink = $('.mergedtoprow a.image + div:contains(Flag)').prev().attr('href')!;
        const flagPageUrl = new URL(flagPageLink, url).toString();
        console.log(flagPageUrl);
        console.log(cityName)
        const City :city= {
            name:cityName,
            created:createdAt,
            humans:humansamout
               }
               return City;
               
    }
}
async function main() {
    const scraper = new CapitalCityScraper();
    const City = await scraper.scrapeCity("https://en.wikipedia.org/wiki/Izhevsk");
    console.log(City);
}


main();