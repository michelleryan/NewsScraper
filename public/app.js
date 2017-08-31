//load all data to the table
/********************************using mongojs********************* */
// function displayResults() {
//     $("#dbdata").empty();
//     $.getJSON("/all", function(data){
//         for(var i=0; i<11; i++){
//             $("#dbdata").prepend("<tr><td>" + data[i].title + 
//     "</td><td>" + data[i].link + "</td><td>" + data[i].summary + "</td><td>"+ data[i].author + "</td></tr>");
//         }
//         $("#dbdata").prepend("<tr><th>Title</th><th>Link</th><th>Summary</th><th>Author</><tr>");
//     });
// }

// displayResults();

/**************************Using mongoose***************** */

//when user clicks "Scrape Articles Button, get headlines"
$(document).on("click", "#scrapeHeadlines", function(){
    $.getJSON("/headlines", function(data){
       for(var i=0; i<11; i++){
            $("#headlines").prepend("<tr><td>" + data[i].title + 
                "</td><td>" + data[i].link + "</td><td>" + data[i].summary + "</td><td>"+ data[i].author + 
                "</td><td><button class='btn modal-trigger red darken-2' data-target='#comments' type='button' id='saveComment' value =" + data[i]._id + ">Comment</button>" 
                +"</td><td><button class='btn waves-effect waves-light red darken-2' type='button' id='save' value =" + data[i]._id + ">Save Article</button>"
                + "</td></tr>");
                    }
                    $("#headlines").prepend("<tr><th>Title</th><th>Link</th><th>Summary</th><th>Author</th></><tr>");
    });
});


//whenever someone clicks on the comment button
$(document).on("click", "#saveComment", function(){
    console.log("I clicked on ", $(this).attr("value"));
    var thisId = $(this).attr("value");  //save the objectId of the item to save a comment to
  
    //make an ajax call to get the specific headline
    $.ajax({
        method: "GET",
        url:"/headlines/" + thisId
    }).done(function(data){
        console.log("This is the headline from the ajax GET method", data);
        // //build the html for the comment
        // $("#comments").append("<h2>" + data.title + "<h2>");
        // $("#comments").append("<input id='titleinput name='title'>");
        // $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        // $("#comments").append("<button value='" + data._id + "' id='savenote'>Save Comment</button>");
        //$("#comments").append("<div class='card red lighten-3' id='card'><div class='card-content white-text'>")
        $("#comments").append("<span>" + data.title + "</span>");
        $("#comments").append("<p><textarea id='bodyinput' class='materialize-textarea' name='body'></textarea></p>");
        $(".card-action").append("<button value='" + data._id + "' id='savenote'>Save Comment</button>")

        // if there is already a comment for the headline, add them to the title and textarea
      if (data.comment) {
        //$("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
        console.log( $("#bodyinput").val());
      }

    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("value");
    console.log(thisId);
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/headlines/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        //$("#card").empty();
         $("#comments").empty();
         $(".card-action").empty();

      });
  
    // Also, remove the values entered in the input and textarea for note entry
    //$("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  $(document).on("click", "#save", function(){
    var thisId = $(this).attr("value");
    console.log("Clicked on this Save button: " , thisId);
    $.ajax({
      method:"POST",
      url: "/saved/" + thisId
      // data: {
      //   saveHeadline:true
      // }
    });
  });