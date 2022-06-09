const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

let items = [];

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

//connect to mongoDB
mongoose.connect('mongodb+srv://adminRH-ToDoApp:rhshoumik@todoapp.i7neo.mongodb.net/toDoList')

//model schema
const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


//insert some default items
const item1 = new Item({
    name : "Hi, this is your todo List"
});
const item2 = new Item({
    name : "Hit the + icon to add more"
});
const item3 = new Item({
    name : "Hit the delete button to remove a item"
});

const defaultsItems = [item1, item2, item3];

app.get('/' , (req, res) =>{
    const today = new Date();
    var options = {
        weekday : 'long',
        day : 'numeric',
        month : 'long'
    };
    let day = today.toLocaleDateString("en-US" , options);

    Item.find({}, (err, founditems) => {
        //console.log(founditems);
        if(founditems.length === 0){
            Item.insertMany(defaultsItems, (err)=>{
                if(err)
                    console.log(err);
                else
                    console.log("Successfully inserted default items");
            });
            res.redirect('/');
        }
        else{
            //console.log(founditems);
            res.render('list' , {today : day , newLists : founditems});

        }
    });
});

app.post('/' ,(req, res) =>{
    let item = req.body.newItem;
    const itemdb = new Item({
        name : item
    });
    itemdb.save();
    res.redirect('/');
    
});
app.post('/delete' ,(req, res) =>{
    let item = req.body.existingItem;
    //console.log(item);
    Item.findByIdAndDelete( item, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("Deleted");
            res.redirect('/');
        }
    })
    
});

app.listen(PORT , (req, res) =>{
    console.log("Server is running on port " + PORT);
})
