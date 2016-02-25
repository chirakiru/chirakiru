var FeedReader;

FeedReader = (function() {
  var _initialize;
  _initialize = function() {
    console.log('iniciando feed reader');
    return $.ajax({
      type: "GET",
      url: "http://blog.comicgram.io/feed/",
      contentType: 'application/xhtml+xml',
      dataType: "xml"
    }).done(function(data) {
      console.log(data);
      return $(data).find('channel').each(function() {
        var $channel, item;
        $channel = $(this);
        item = $channel.attr("item");
        return console.log(item);
      });
    });
  };
  return {
    init: _initialize
  };
})();

$(document).on('page:load ready', function() {
  return FeedReader.init();
});
