const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const scraper = require("./public/javascripts/scraper.js");
const fm = require("./public/javascripts/functions.js");

const port = process.env.PORT || 8080;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

hbs.registerHelper('message', (text) => {
	return text;
})

app.get('/results', (req, res) => {

  // console.log(scraper.main(req.query['origin'], req.query['destination'], req.query['departDate'] ,req.query['returnDate']));
  
  const runScraper = async () => {
    const results = await scraper.main(req.query['origin'], req.query['destination'], req.query['departDate'] ,req.query['returnDate']);
    console.log(`AAA   + ${results[0].from}`);
    var test = "";

    for(i = 0; i < results.length; i++){
    	test += results[i].from + " " + results[i].to + " " + results[i].price + " " + results[i].time + " " + results[i].duration;	
    }

    await res.render('results.hbs', {
      title: 'Board and save with CanaFly!',
      from: test
    });
  }

  runScraper();

});

app.get('/', (request, response) => {
	response.render('index.hbs', {
        title: 'Scrape the deals with CanaFly!'
	});
});

app.get('/login', (request, response) => {
	response.render('login.hbs', {
        title: 'Board and save with CanaFly!'
	});
});

app.get('/results', (request, response) => {
	response.render('results.hbs', {
        title: 'Board and save with CanaFly!'
	});
});

app.get('/saved', (req, res) => {
  
  const saveFunction = async () => {
  	await fm.addNote();
    const savedArray = await fm.getArray();

    var newArray = [];

    for(i = 0; i < savedArray.length; i++){
		//dataString += savedArray[i][y].from + " " + savedArray[i][y].to + " " + savedArray[i][y].price + " " + savedArray[i][y].time + " " + savedArray[i][y].duration;
		newArray = newArray.concat(savedArray[i]);
    }

    console.log(newArray);

    await res.render('results.hbs', {
      title: 'Board and save with CanaFly!',
      from: newArray
    });
  }
  saveFunction();
});

app.listen(port, () => {
	console.log(`Server is up on the port ${port}`);
});