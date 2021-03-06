
const puppeteer = require("puppeteer");
const functions = require("./functions.js");
const fs = require('fs');

const scrape = async (browser, originInput, destinationInput, departDateInput, returnDateInput) => {

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36");
    await page.goto("https://www.westjet.com/en-ca/index", {
      waitUntil: 'networkidle2'
    });

    console.log(departDateInput);
    console.log(returnDateInput);

        const origin = originInput;
    const destination = destinationInput;
    const currentDate = new Date();
    const leaveDate = new Date(departDateInput);
    const returnDate = new Date(returnDateInput);
    const leaveMonths = functions.calcMonths(currentDate, leaveDate);
    const returnMonths = functions.calcMonths(leaveDate, returnDate);
    const leaveDateFormatted = functions.formatDate(leaveDate);
    const returnDateFormatted = functions.formatDate(returnDate);

    await page.waitFor(1200);
        await page.waitFor("#origin-search");
        await page.click("#origin-search");
        for (var i = 0; i < origin.length; i++) {
            await page.keyboard.press(origin.charAt(i));
        };
        await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await page.waitFor(1000);
    await page.waitFor("#destination-search");
    await page.click("#destination-search");
        for (var i = 0; i < destination.length; i++) {
            await page.keyboard.press(destination.charAt(i));
        };
        await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    await page.waitFor("#depart")
    await page.click("#depart");
    await page.waitFor(500);
        for(var i = 0; i < leaveMonths; i++){
            await page.click("#depart_dw_pnl_0 > div > div > div > div.dw-cal-header > div > div > div.dw-cal-next-m.dw-cal-next.dw-cal-btn.dwb.dwb-e > div");
            await page.waitFor(500);
        };
    const date1 = await page.$(leaveDateFormatted);
    await date1.click();
    await page.waitFor(1000)
    
        await page.waitFor("#return");
    await page.click("#return");
    await page.waitFor(500);
        for(var i = 0; i < returnMonths; i++){
            await page.click("#return_dw_pnl_0 > div > div > div > div.dw-cal-header > div > div > div.dw-cal-next-m.dw-cal-next.dw-cal-btn.dwb.dwb-e > div");
            await page.waitFor(500);
        };
        
    const date2 = await page.$(returnDateFormatted);
    await date2.click();
    await page.waitFor(1000);
    
        await page.waitFor('#tablet-submit > div > input[type="submit"]');
    const button = await page.$('#tablet-submit > div > input[type="submit"]');
    await button.click();

    await page.waitForSelector('#outboundFlightsList > div:nth-child(1) > div');


    const departureLocation = await page.$eval('#outboundSearchResultsContent > div > div.searchContentArea > div.od-title > h2 > span:nth-child(1)', d => d.innerText)
    const destinationLocation = await page.$eval('#outboundSearchResultsContent > div > div.searchContentArea > div.od-title > h2 > span:nth-child(3)', d => d.innerText)

    const sections = await page.$$('.flightSumTriggerArea');

    var priceGoingArray = [];
    var timeGoingArray = [];
    var departureDetailsArray = [];

    for (const section of sections){
      const lowestCost = await section.$eval('div.pbig', div => div.innerText);
      await priceGoingArray.push(lowestCost);

      const timeSections = await section.$$('.odContainer');
      
      for (const timeSection of timeSections){
        const flightTime = await timeSection.$eval('div.odTime', div => div.innerText);
        await timeGoingArray.push(flightTime);
      };
    };

    //Convert flight-to array details into a JSON object 
    for (i=0; i<sections.length; i++){
      departureDetailsArray.push(functions.getFlightDetails(departureLocation, destinationLocation, priceGoingArray, timeGoingArray, i))
    }
    await browser.close()

    addNote(departureDetailsArray);

    return departureDetailsArray

}

const main = async (origin, destination, departDate, returnDate) => {
  var runtime = true;

  while(runtime) {
    const browser = await puppeteer.launch({headless: false});
    try{
      let results = await scrape(browser, origin, destination, departDate, returnDate);
      
      console.log(results)
      runtime = false;
      return results

    } catch(e) {
      await console.log("ERROR: ", e)
      await browser.close()
    }
  }
};

const addNote = async (departureDetailsArray) => {

    testArray = JSON.stringify(departureDetailsArray);
    fs.writeFileSync('temp.json', testArray);
};

module.exports = {
    main: main
};
