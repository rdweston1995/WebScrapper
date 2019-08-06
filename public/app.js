// $.getJSON("/articles", function(data){
//     for(var i = 0; i < data.length; i++){
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br></p><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "<hr>");
//     }
// })

$(".subBtn").on("click", function(){
    let subreddit = $(this).text().split(" ").join("").toLowerCase();
    console.log(subreddit);
    $("#articles").empty();
    $.get("/scrape/" + subreddit, function(data){
        // console.log("APP ++++++++++++++" + data);
        console.log(data);
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br></p><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "<hr>");

        // $.getJSON("/articles/" + subreddit, function(data){
        //     for(var i = 0; i < data.length; i++){
        //         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br></p><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "<hr>");
        //     }
        // })
    }).then(getArticles(subreddit));
});

function getArticles(subReddit){
    $("#articles").empty();
    $.getJSON("/articles/subreddit/" + subReddit, function(data){
        for(var i = 0; i < data.length; i++){
            $("#articles").append("<p class='articleTitle' data-id='" + data[i]._id + "'>" + data[i].title + "<br></p><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "<hr>");
        }
    });
}

$(document).on("click", "p", function(){
    $("#comments").empty();
    var thisId = $(this).attr("data-id");
    var thisArticle = $(this).text();
    console.log(thisArticle);

    $.ajax({
        method: "GET",
        url: "/articles/" + thisArticle
    }).then(function(data){
        console.log(data);
        $("#comments").append("<h2 id='articleTitle'>" + data[0].title + "</h2>");
        // $("#comments").append("<input id='titleinput' name='title' >");
        $("#comments").append("<textarea id='bodyinput' name'body'></textarea>");
        $("#comments").append("<button data-id='" + data[0]._id + "' id='savecomment'>Save Comment</button>");
        $("#commentsDb").append("<h3 id='commentsCollectionTitle'>Comments</h3>");
        $("#commentsDb").append("<p id='commentsCollection'></p>");
        if(data.comment){
            $("#titleinput").val(data.comment.title);
            $("#bodyinput").val(data.comment.body);
        }
    });
});

$(document).on("click", "#savecomment", function(){
    var thisId = $(this).attr("data-id");
    console.log($("#bodyInput").val());
    $.ajax({
        method: "POST",
        url: "/articles/" + $("#articleTitle").val(),
        data: {
            // title: $("#titleinput").val(),
            title: $("#articleTitle").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data){
        console.log(data);
        $("#comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");

    $.ajax({
    method: "GET",
    url: "/articles/" + $("#articleTitle").text()        
    }).then(function(data){
        console.log(data[0]);
    }).catch(function(err){
        console.log(err);
    }); 
})