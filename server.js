// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//include my Headline.js and Comment.js
var Headline = require("./models/headline");
var Comment = require("./models/comment");
//var Saved = require("./models/saved");

//Leverage built in JS ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();


// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
  }));

// Database configuration
// Save the URL of our database as well as the name of our collection
// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// // Use mongojs to hook the database to the db variable
// var db = mongojs(databaseUrl, collections);

//Database configuration with mongoose
mongoose.connect("mongodb://localhost/week34day5mongoose");
var db = mongoose.connection;

// // This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

//Show any mongoose errors
db.on("error", function(error){
  console.log("Mongoose Error: ", error);
});

//Log success message once logged into mongoose
db.once("open", function(){
  console.log("Mongoose connection successful.");
});



// Routes

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  

   request("http://www.azcardinals.com/news/index.html", function(error, response, html){
     var $=cheerio.load(html);
     $("h3").each(function(i, element){
      
        var result = {}; //save an empty results object

       //save the title, href, summary and author from the az cardinals news page
       result.title = $(element).children("a").text();
       result.link = $(element).children("a").attr("href");
       result.summary = $(element).siblings("p").text();
       result.author = $(element).siblings("div", "span").children(".author").text();

       //create a new headline entry
       var entry = new Headline(result);

       //save the entry to the database
       entry.save(function(err, doc){
         //log any errors
         if(err){
           console.log("there was a entry error", err);
         }
         else{
           console.log(doc);
         }
       });

       //**************using mongojs********
      //  //if title, link and author all have text then insert into the db
      //    if(title && link && summary && author) {
      //      // console.log(title);
      //      // console.log(link);
      //      // console.log(summary);
      //      // console.log(author);
      //      db.scrapedData.insert({
      //        title: title,
      //        link: link,
      //        summary: summary,
      //        author: author

      //      }, function(err, inserted){
      //        if(err) {
      //          console.log(err);
      //        }
      //        else{
      //          //view what has been inserted to the db
      //          console.log(inserted);
      //        }
      //      }
      //    )};
     });
   
   });
 
 //  Send a "Scrape Complete" message to the browser
   res.send("Scrape Complete");
 });

 //******************mongojs***************************************************** */
// // 2. At the "/all" path, display every entry in the scrapedData collection
// app.get("/all", function(req, res) {
//   // Query: In our database, go to the scrapedData collection, then "find" everything
//   db.scrapedData.find({}, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       //console.log("I am in the app.get/all in server.js");
//       //console.log(found);
//       res.json(found);
//     }
//   });
// });

//get the headlines saved from mongoDB
app.get("/headlines", function(req, res){
  //get all doc from the Headline array
  Headline.find().sort({_id:-1}).
  exec(function(error, doc){
    if(error){
      console.log("error in find all headlines", error);
    }
    else{
      res.json(doc); //successful
    }
  });
});


//get the saved headlines
app.get("/savedHeadlines", function(req, res){
    console.log("I am in savedHeadlines route in server.js")
    
  Headline.find({saveHeadline:true}, function(error, doc){
    if(error) {
      console.log("error in find saved headlines", error);
    }
    else{
      console.log(doc);
      res.json(doc);

    }
  });
});

// route to get the headline with the objectId for associated comment button
app.get("/headlines/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Headline.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

//route to create a new comment
app.post("/headlines/:id", function(req, res){
  var newComment = new Comment(req.body);
  
  //add the new comment and save to the database
  newComment.save(function(error,doc){
    if(error){
      console.log("I have an error saving to db ", error)
    }
    else {
      //update the specific id with the comment
      Headline.findOneAndUpdate({"_id": req.params.id }, {"comment": doc._id}).exec(function(err, doc){
        if(err){
          console.log("I have an error finding the specific object id ", err);
        }
        else{
          //if no errors then update the browser
          res.send(doc);
        }
      });
      console.log(doc);  //show what is being saved
    }
  });
});

//route to create a new saved article
app.post("/saved/:id", function(req, res){
  console.log("I'm in the app.post route for saved");
  //var newSaved = new Saved(req.body);
  console.log("post saved headline", req.body);
  console.log("id to update: ", req.params.id);
  
  //add the new comment and save to the database
  // newSaved.save(function(error,doc){
  //   if(error){
  //     console.log("I have an error saving to db ", error)
  //   }
  //   else {
      
      Headline.update({_id:req.params.id}, {$set:{saveHeadline:true}} ).exec(function(err, doc){
        if(err){
          console.log("I have an error finding the specific object id ", err);
        }
        else{
          //if no errors then update the browser
          console.log("I updated my saveHeadline to 'true'", doc);
          res.send(doc);
          
        }
      });
     // console.log("I just saved: ", doc);  //show what is being saved
    //}
 // });
});

//route to delete saved article
app.post("/delete/:id", function(req, res){
  console.log("I'm in the app.post route for delete");
  //var newSaved = new Saved(req.body);
  console.log("post to delete", req.body);
  console.log("id to update: ", req.params.id);
 
  Headline.update({_id:req.params.id}, {$set:{saveHeadline:false}} ).exec(function(err, doc){
        if(err){
          console.log("I have an error finding the specific object id ", err);
        }
        else{
          //if no errors then update the browser
          console.log("I updated my saveHeadline to 'false'", doc);
          res.send(doc);
          
        }
      });
});


// Set the app to listen on port 4000
app.listen(4000, function() {
  console.log("App running on port 4000!");
});
