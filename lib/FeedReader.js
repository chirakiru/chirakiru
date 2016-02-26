var feed = require("feed-read")
  , request = require('request')
  , cheerio = require('cheerio')
  , replace = require('gulp-replace')
  , async = require('async')
  , dateFormat = require('dateformat')
  , count = 1;

function FeedReader(cb) { 
  feed("http://blog.comicgram.io/feed/", function(err, items) {
    cb = cb
    async.map(items.slice(0,3), FetchPostInfo, function(err, results){
      cb(results)
    });    
  })
}

function template(article, post_info) {
  item = "<article>" +
    "<div class='blog-post-img'>" +
       "<a target='_blank' href="+ article.link +"><img alt='Blog Image' src='" + post_info.og_image + "&resize=360%2C220' class='img-responsive'></a>" +
    "</div>" +
             
    "<div class='blog-post-titlebar'>" +
      "<h4>" + article.title + "</h4>" +
    "</div>" +
    
    "<div class='blog-post-info'>" +
      dateFormat(article.published, "shortDate", true) +
    "</div>" +
     
    "<div class='blog-post-desc'" +
      "<p>" + post_info.description + "</p>" +                                         
    "</div>" +
    "<a target='_blank' href='" + article.link + "' class='btn btn-theme'> Leer más... <i class='fa fa-angle-double-right'></i></a>" +     
  "</article>"

  element = '<div data-animation-delay="' + ( 500 + count * 200 ) + '" data-animation="fadeInUp" class="col-md-4 animated fadeInUp visible" id="blog_post_' + count +'">' + item + '</div>'
  count++
  return element
};

function FetchPostInfo (article, cb){
  request(article.link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var list = {};
      var $ = cheerio.load(body);
      meta_items = $("meta");
      meta_items.each(function (i, item) {
        expression = item.attribs.name;
        switch(expression) {
          case "twitter:image":
            list.og_image = item.attribs.content;
            break;
          case "twitter:description":
            list.description = item.attribs.content;
            break;
        }
        if(Object.keys(list).length == 2){
          return false;
        };
      });
      markup = template(article, list)
      cb(null, markup);
    };
  });
};

module.exports = FeedReader