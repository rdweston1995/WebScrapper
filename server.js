var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/redditNewsScraper";
// mongoose.connect("mongodb://localhost/newsscraper", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI)

app.get("/scrape", function (req, res) {
    // axios.get("http://www.echojs.com/").then(function (response) {
    //     var $ = cheerio.load(response.data);

    //     $("article h2").each(function (i, element) {
    //         var result = {};

    //         result.title = $(this).children("a").text();
    //         result.link = $(this).children("a").attr("href");

    //         db.Article.create(result).then(function (dbArticle) {
    //             console.log(dbArticle);
    //         }).catch(function (err) {
    //             console.log(err);
    //         });
    //     });
    // });
    axios.get("https://old.reddit.com/r/worldnews").then(function(response){
        var $ = cheerio.load(response.data);

        $("p.title").each(function(i, element){
            var result = {};

            result.title = $(element).text();
            result.link = $(element).children().attr("href");

            db.Article.create(result).then(function(dbArticle){
                // console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            })
        })
    })
    res.send("Scrape Complete");
});

app.get("/scrape/:subreddit", function(req, res){
    axios.get("https://old.reddit.com/r/" + req.params.subreddit).then(function(response){
        var $ = cheerio.load(response.data);

        $("p.title").each(function(i, element){
            var result = {};

            result.title = $(element).text();
            result.link = $(element).children().attr("href");
            result.subreddit = req.params.subreddit;

            db.Article.create(result).then(function(dbArticle){
                // console.log(dbArticle);
            }).catch(function(err){
                // console.log(err);
            });
        });
    });
})

app.get("/articles/subreddit/:subreddit", function (req, res) {
    db.Article.find({subreddit: req.params.subreddit}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// app.get("/articles/:id", function(req, res){
//     db.Article.find({_id: req.params.id}).populate("comment").then(function(dbArticle){
//         res.json(dbArticle);
//     }).catch(function(err){
//         res.json(err);
//     });
// });
app.get("/articles/:articleTitle", function(req, res){
    db.Article.find({title: req.params.articleTitle}).populate("comment").then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    // db.Comment.create(req.body).then(function(dbComment){
    //     return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new:true});
    // }).then(function(dbArticle){
    //     res.json(dbArticle);
    // }).catch(function(err){
    //     res.json(err);
    // })
    console.log(req.body);
    db.Comment.create(req.body, function(error, saved){
        if(error){
            console.log(error);
        } else {
            res.send(saved);
        }
    })
});

app.listen(PORT, function () {
    console.log("App is running on port " + PORT + "!");
});