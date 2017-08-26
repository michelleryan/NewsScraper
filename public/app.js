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
$.getJSON("/headlines", function(data){
    // for(var i =0; i<data.length; i++){
    //     $("#headlines").append("<tr><td>" + data[i].title + 
    //     "</td><td>" + data[i].link + "</td><td>" + data[i].summary + "</td><td>"+ data[i].author + "</td></tr>");
    // }
    for(var i=0; i<data.length; i++){
                    $("#headlines").prepend("<tr><td>" + data[i].title + 
            "</td><td>" + data[i].link + "</td><td>" + data[i].summary + "</td><td>"+ data[i].author + 
            "</td><td><button type='button' id='saveComment' value =" + data[i]._id + ">Comment</button>" +"</td></tr>");
                }
                $("#headlines").prepend("<tr><th>Title</th><th>Link</th><th>Summary</th><th>Author</th><th>Comment</><tr>");
});

//whenever someone clicks on the comment button
$(document).on("click", "#saveComment", function(){
    console.log("I clicked on ", $(this).attr("value"));
});
