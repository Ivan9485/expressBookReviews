const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve,reject)=>{
        if (books) {
            resolve(books)
        } else {
            reject("there are no books")
        }
    })
    promise.then(res.send(JSON.stringify(books,null,4)));
}); 

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  let promise = new Promise((resolve,reject)=>{
    if (books[isbn]) {
        resolve(books[isbn])
    } else {
        reject("there are no books with that isbn")
    }
})
    promise.then(res.send(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    let author = req.params.author
       
    new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let myBooks = keys.filter((key) => books[key].author === author).map((key) => books[key]);
    
        if (myBooks.length > 0) {
          resolve(myBooks);
        } else {
          reject("No books found for the given author");
        }
      })
      .then((myBooks) => {
        return res.send(myBooks);
      })
      .catch((error) => {
        return res.status(404).send(error);
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
       
    new Promise((resolve,reject)=>{
        let keys = Object.keys(books)
        let myBooks = keys.filter((key)=>{return books[key].title===title}).map((key)=>books[key])
        if (myBooks.length>0) {
            resolve(myBooks)
        } else {
            reject("No hay libro con ese titulo")
        }
    }).then((myBooks)=> res.send(myBooks)).catch((err)=>{return res.status(404).send(err);})

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
       
    let keys = Object.keys(books)
    
    let myBooks = keys.filter((key)=>{return key===isbn}).map((key)=>books[key].reviews)
  return res.send(myBooks);
});

module.exports.general = public_users;
