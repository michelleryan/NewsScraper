// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");

// Initialize Express
var app = express();


// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
  }));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
// app.get("/", function(req, res) {
//   res.send("Hello World");
// });

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      //console.log("I am in the app.get/all in server.js");
      //console.log(found);
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
   

    request("http://www.azcardinals.com/news/index.html", function(error, response, html){
      var $=cheerio.load(html);
      $("h3").each(function(i, element){
        //save the title, href, summary and author from the az cardinals news page
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
        var summary = $(element).siblings("p").text();
        var author = $(element).siblings("div", "span").children(".author").text();

        //if title, link and author all have text then insert into the db
          if(title && link && author) {
            // console.log(title);
            // console.log(link);
            // console.log(summary);
            // console.log(author);
            db.scrapedData.insert({
              title: title,
              link: link,
              summary: summary,
              author: author

            }, function(err, inserted){
              if(err) {
                console.log(err);
              }
              else{
                //view what has been inserted to the db
                console.log(inserted);
              }
            }
          )};
      });
    
    });
  
  //  Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
  

// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
