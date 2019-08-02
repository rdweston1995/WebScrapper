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
    $.getJSON("/articles/" + subReddit, function(data){
        for(var i = 0; i < data.length; i++){
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br></p><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "<hr>");
        }
    });
}

$(document).on("click", "p", function(){
    $("#comments").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log(data);
        $("#comments").append("<h2>" + data.title + "</h2>");
        $("#comments").append("<input id='titleinput' name='title' >");
        $("#comments").append("<textarea id='bodyinput' name'body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

        if(data.comment){
            $("#titleinput").val(data.comment.title);
            $("#bodyinput").val(data.comment.body);
        }
    })
});

$(document).on("click", "#savecomment", function(){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            bpdy: $("#bodyinput").val()
        }
    }).then(function(data){
        console.log(data);
        $("#comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
})