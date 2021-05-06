const puppeteer = require("puppeteer");
const functions = require("./functions.js");

const scrape = async (browser) => {


		//const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();
		//await page.setViewport({width: 600, height: 600});
		await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1');
		//await page.goto("https://www.westjet.com/en-ca/index");
		//await page.waitForSelector("#destination-search");
		await page.goto("https://www.westjet.com/en-ca/index", {
			waitUntil: 'networkidle2'
		});

		const origin = "Kelowna";
		const destination = "Vancouver";
		const currentDate = new Date();
		const leaveDate = new Date(2019,1,1);
		const returnDate = new Date(2019,1,5);
		const leaveMonths = functions.calcMonths(currentDate, leaveDate);
		const returnMonths = functions.calcMonths(leaveDate, returnDate);
		const leaveDateFormatted = functions.formatDate(leaveDate);
		const returnDateFormatted = functions.formatDate(returnDate);


		await page.waitFor(2000);
		await page.click("#origin-search");
		for (var i = 0; i < origin.length; i++) {
			await page.keyboard.press(origin.charAt(i));
		};
		//await page.$eval("#origin-search", el => el.value = "Kelowna");
		//await page.click("#origin-search");
		//await page.waitFor(3000);
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		
		await page.waitFor(1200);
		await page.click("#destination-search");
		for (var i = 0; i < destination.length; i++) {
			await page.keyboard.press(destination.charAt(i));
		};
		//await page.click("#destination-search");
		await page.waitFor(500);
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		//await page.$eval("#destination-search", el => el.value = "Vancouver");
		//await page.click("#destination-search");
		//await page.keyboard.press('ArrowDown');
		//await page.keyboard.press('Enter');
		await page.waitFor(500);
		await page.click("#depart");
		for(var i = 0; i < leaveMonths; i++){
			await page.click("#depart_dw_pnl_0 > div > div > div > div.dw-cal-header > div > div > div.dw-cal-next-m.dw-cal-next.dw-cal-btn.dwb.dwb-e > div");
			await page.waitFor(500);
		};
		await page.waitFor(500);
		//await console.log(leaveDateFormatted);
		//await console.log('[data-full="2018-11-5"]');
		const date1 = await page.$(leaveDateFormatted);
		await page.waitFor(750);
		await date1.click();
		await page.waitFor(500);
		await page.click("#return");
		for(var i = 0; i < returnMonths; i++){
			await page.click("#return_dw_pnl_0 > div > div > div > div.dw-cal-header > div > div > div.dw-cal-next-m.dw-cal-next.dw-cal-btn.dwb.dwb-e > div");
			await page.waitFor(500);
		};
		const date2 = await page.$(returnDateFormatted);
		await page.waitFor(1500);
		await date2.click();
		await page.waitFor(1000);
		const button = await page.$('#tablet-submit > div > input[type="submit"]');
    	await button.click();

    	//await page.waitFor(10000);
    	await page.waitForSelector('#outboundFlightsList');
    	const sections = await page.$$('.flightSumTriggerArea');

    	var priceGoingArray = [];
    	var timeGoingArray = [];
	    for (const section of sections) {
	      	const lowestCost = await section.$eval('div.pbig', div => div.innerText);
	      	//await console.log(lowestCost);
	      	await priceGoingArray.push(lowestCost);

	      	const timeSections = await section.$$('.odContainer');

	      	for (const timeSection of timeSections){
	        	const flightTimes = await timeSection.$eval('div.odTime', div => div.innerText);
	        	//await console.log(flightTimes);
	        	await timeGoingArray.push(flightTimes);
	      	};

	    };

	    // await page.waitFor(500);
	    // for (const section of sections) { 
	    // 	await section.click(".fareCard.economy");
	    // 	await page.waitFor(1000);
	    // 	await page.click("#outboundFlightsList > div:nth-child(1) > div > div.col-xs-12.col-md-6.flightsSummaryRight > flight-details > div > div > fare-box:nth-child(2) > div > div > div > div.buttonContainer.col-xs-12 > button");
	    // 	await page.click("#outboundFlightsList > div:nth-child(1) > div > div.col-xs-12.col-md-6.flightsSummaryRight > div.flightsSummaryRightContainer > div > div.cardgroup > div.pbig");
	    // 	break;
	    // };

	    for(i = 0; i < sections.length; i++) {
	    	await console.log("Price: " + priceGoingArray[i])
	    	await console.log("Time: " + timeGoingArray[i*2] + " -> " + timeGoingArray[i*2+1]);
	    };

};

const main = async () => {
	var runtime = true;

	while(runtime) {
		const browser = await puppeteer.launch({headless: false});
		try{
			await scrape(browser);
			runtime = false;
		} catch(e) {
				await console.log("ERROR: ", e);
				await browser.close();
		}
	};


}

main();






































