//Require Express
const express = require('express');
const app = express();

//Require fs, util, path
const fs = require('fs');
const util = require('util');
const path = require('path');

//Variables to read & write fiels
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Set the port
//Remember to include process.env for Heroku
const PORT = process.env.PORT || 5000;

//Set up Express to handle data parsing
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));


//API Route: (get, post, and delete)
//GET first
app.get("/api/notes", (req, res)=>{

    readFileAsync("./db/db.json", "utf8")
    .then((result, err)=>{
        if(err) console.log(err);
        return res.json(JSON.parse(result));
    });
});


//HTML Routes
app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/notes.html"));
    
});
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"));
});


//API Route: Save Notes
//POST next
app.post("/api/notes", (req, res)=>{
    let newNote = req.body;
    readFileAsync("./db/db.json", "utf8")
    .then((result, err)=>{
        if(err) console.log(err);
        return Promise.resolve(JSON.parse(result));
    })
    .then(data =>{
        newNote.id = getLastNote(data) + 1;

        (data.length > 0)? data.push(newNote):data = [newNote];
        return Promise.resolve(data);
    })
    .then(data =>{
        //write the new note file
        writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(newNote);
    })
    .catch(err =>{
        if(err) throw err;
    });
});
//function to retrieve notes

//API Route: Delete note
//DELETE last

//Start the server
app.listen(PORT, function(){
    console.log(`Listening on PORT ${PORT}`);
});