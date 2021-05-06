
var home = document.getElementById("home"),
    login = document.getElementById("login"),
    register = document.getElementById("register"),
    logout = document.getElementById("logout"),
    search = document.getElementById("aaa"),
    save =  document.getElementById("save-button"),
    flightData = {};

//Direct user to home page
home.addEventListener("click", function(){
    window.location.pathname = "/";
});
  
//Direct user to login page  
login.addEventListener("click", function(){
	window.location.pathname = "/login";
});

register.addEventListener("click", function(){
	window.location.pathname = "/login";
});

//Logout
logout.addEventListener("click", function(){
    alert("Logout successful");
});

save.addEventListener("click", function(){
    console.log("click");
});

//Retrieve form data and continue to results page
search.addEventListener("click", function(){
    var origin = document.getElementById("origin"),
        destination = document.getElementById("destination"),
        departDate = document.getElementById("depart"),
        returnDate = document.getElementById("return")
        // adult = document.getElementById("adult"),
        // child = document.getElementById("child"),
        // infant = document.getElementById("infant");
        
    // flightData = {
    //     "origin": origin.value,
    //     "destination": destination.value,
    //     "depart": departDate.value,
    //     "return": returnDate.value,
    //     "adults": adult.value,
    //     "children": child.value,
    //     "infants": infant.value
    // };
        
    window.location.pathname = "/test";
});