//include packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //look for ejs template files in the views folder
app.use(express.static(__dirname + "/public")); //current directory + /public to make sure we are in the right directory


const baseURL = "https://api.themoviedb.org/3/";
const basePosterURL  = "http://image.tmdb.org/t/p/"; //add w92/, w154/, w185/ after /p/ for size of poster
const APIKEY = process.env.APIKEY;
console.log("ApiKey: " + APIKEY);



//Root route
app.get("/", function(req, res){
    res.render("landing");
});

//post movie search we searched for
app.get("/results", function(req, res){
    var searchResult = req.query.movie;
    //get proper url
    var searchByKeyWordURL = baseURL + "search/movie?api_key=" + APIKEY + "&query=" + searchResult;
    
    //fetch json data of url and render
    fetch(searchByKeyWordURL).then(res => res.json()).then(
        json => res.render("results", {data: json, basePosterURL: getPosterURL("w154/")})
    );
});

//show more info about a movie
app.get("/results/:movie_id", function(req, res){
    var movie_id = req.params.movie_id;
    //search by id
    var searchByIDUrl = baseURL + "movie/"+ movie_id + "?api_key=" + APIKEY;
    
    fetch(searchByIDUrl).then(res => res.json()).then(
        json => res.render("show", {data: json, basePosterURL: getPosterURL("w185/")})
    );
});

//helper functions
function getPosterURL(width){//return url of poster with allowed specified width
    return basePosterURL + width;
}

//listen 
var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("server started");
});