const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let items = [];

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get('/' , (req, res) =>{
    const today = new Date();
    var options = {
        weekday : 'long',
        day : 'numeric',
        month : 'long'
    };
    let day = today.toLocaleDateString("en-US" , options);

    res.render('list' , {today : day , newLists : items});
});

app.post('/' ,(req, res) =>{
    let item = req.body.newItem;
    items.push(item);
    res.redirect('/');
    
});

app.listen(PORT , (req, res) =>{
    console.log("Server is running on port " + PORT);
})
