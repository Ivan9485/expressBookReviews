const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
   const username = req.query.username;
    const password = req.query.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in" + JSON.stringify(req.session.authorization.username));
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   let isbn = req.params.isbn
    const user = JSON.stringify(req.session.authorization.username)
    let keys = Object.keys(books)

    books[isbn].reviews[user] = req.query.review
    

    
  return res.send("review added by " + JSON.stringify(books[isbn]));
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    let isbn = req.params.isbn
    const user = JSON.stringify(req.session.authorization.username)
    
    if(books[isbn].reviews[user]){
        delete books[isbn].reviews[user]
    }

    return res.send("checa si se borro" + JSON.stringify(books[isbn]))

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
