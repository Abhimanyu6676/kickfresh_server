var express = require("express");
var app = express();

//app.use(express.static('public'));
//app.use(express.static('images'));
app.use("/", express.static("./kickfresh_app/web-build"));

app.listen(4000);
