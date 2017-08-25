//load all data to the table

function displayResults() {
    $("#dbdata").empty();
    $.getJSON("/all", function(data){
        for(var i=0; i<data.length; i++){
            $("#dbdata").prepend("<tr><td>" +
        data[i]._id + "</td><td>" + data[i].title + 
    "</td><td>" + data[i].link + "</td></tr>");
        }
        $("#dbdata").prepend("<tr><th>ID</th><th>Title</th><th>Link</th><tr>");
    });
}

displayResults();