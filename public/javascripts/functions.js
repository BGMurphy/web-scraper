const fs = require('fs');

function calcMonths(date1, date2) {
	var year1=date1.getFullYear();
	var year2=date2.getFullYear();
	var month1=date1.getMonth();
	var month2=date2.getMonth();

	if(month1===0){
	  month1++;
	  month2++;
	}
	var numberOfMonths = (year2 - year1) * 12 + (month2 - month1);

	return numberOfMonths;

};

function formatDate(date){
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var dateString = `[data-full="${year}-${month}-${day}"]`

	return dateString;

};

//Accepts price and time arrays to return an object with the departure details
const getFlightDetails = (departingLocation, arrivingLocation, priceArray, timeArray, counter) => {
  let departureObj = {
    from: `${departingLocation}`,
    to: `${arrivingLocation}`,
    price: `Price: ${priceArray[counter]}`,
    time: `Time: ${timeArray[counter*2]}  -> ${timeArray[counter*2+1]}`,
    duration: `Duration: ${convertedTimeString(timeArray)[counter]}`
  };

  return departureObj;
};

//Static method that converts an array of departure and arrival times to an array of strings for the total duration of the flight 
const convertedTimeString = (times) => {
  let durationString = "";
  let convertedTimesArray = [];
  let durationArray = [];

  for (i=0; i < times.length; i++) {
    let splitTimes = times[i].split(":");
    let convertedTime = parseInt(splitTimes[0]*60) + parseInt(splitTimes[1]);
    convertedTimesArray.push(convertedTime);
  };

  for (i = 0; i < convertedTimesArray.length; i=i+2) {
    let durationMinutesTotal = convertedTimesArray[i+1] - convertedTimesArray[i];
    let durationHour = Math.floor(durationMinutesTotal/60);
    let durationDecimalIntoMinutes = Math.round((durationMinutesTotal/60 - durationHour)*60);
    durationString = `${durationHour} hr. ${durationDecimalIntoMinutes} min.`

    durationArray.push(durationString);
  };

  return durationArray;
};

const getArray = async () => {
    var testArray = [];
    var readFlights = fs.readFileSync('saved.json');
    if(readFlights != ""){
        testArray = JSON.parse(readFlights);
    };

    return testArray;
};

const addNote = async () => {
    
    let testArray = await getArray();
    tempArray = fs.readFileSync("temp.json");
    tempArray = JSON.parse(tempArray);

    testArray.push(tempArray);
    testArray = JSON.stringify(testArray);
    fs.writeFileSync('saved.json', testArray);
};

module.exports = {
	calcMonths: calcMonths,
	formatDate: formatDate,
	getFlightDetails: getFlightDetails,
  getArray: getArray,
  addNote: addNote
};