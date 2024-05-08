/*
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors);

app.listen(port, () => {console.log("running")});

//route get
app.get("/index", async function name(req, res) {
    console.log("UA")
    res.render("dist/index");
})
*/
const express = require("express");
const app = express();
const port = process.env.port | 3000;

app.set("view engine", "ejs");
app.use(express.static("dist"));
var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.listen(port, () => {console.log("running")});

//route get
app.get("/", async function name(req, res) {
    res.render("index.html", {
        
    });
})