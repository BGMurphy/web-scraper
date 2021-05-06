const fileManager = require("./file_manager.js")

//Adds a new username, password (after confirming), first name, and last name
const addUser = (username, pw, cpw, fn, ln, ) => {

  if (pw === cpw) {
    let userObj = {
      username: username,
      pw: pw,
      fn: fn,
      ln: ln
    }

    fileManager.checkUserlist();
    let userArray = fileManager.getJSON()
    if (userArray.users.length != 0) {
      for (i=0; i < userArray.users.length; i++) {
        if (userArray.users[i].username === username){
          throw "Username already exists"
        } 
      } 
      userArray.users.push(userObj);
      fileManager.updateJSON(userArray)
    } else {
      userArray.users.push(userObj);
      fileManager.updateJSON(userArray)
    }

  } else {
    throw "Password must match";
  }
}

//Returns a user object specified by the user username
const getUser = (username) => {
  var userArray = fileManager.getJSON();
  if (userArray.users.length != 0) {
    for (i=0; i < userArray.users.length; i++) {
      if (userArray.users[i].username === username){
        returnedUser = userArray.users.splice(i, 1)
        return returnedUser
      } 
    }
    throw `There are currently no existing users matching user ID: '${username}'`
  } else {
    throw "There are currently no existing users to retrieve";
  }
}

module.exports = {
  addUser: addUser,
  getUser: getUser
}

