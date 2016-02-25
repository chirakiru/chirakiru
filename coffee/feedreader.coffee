FeedReader = (->
  _initialize = () ->
    console.log 'iniciando feed reader'
    $.ajax(
      type: "GET",
      url: "http://blog.comicgram.io/feed/"
      contentType: 'application/xhtml+xml'
      dataType: "xml"
    ).done (data) ->
      xml = data
      $(xml).find('item').each ->
        $item = $(this)
        console.log("title      : " + el.find("title").text());
        console.log("author     : " + el.find("author").text());
        console.log("description: " + el.find("description").text());
    });

  init: _initialize
)()

$(document).on 'page:load ready', ->
  do FeedReader.init

  coso.obj((file, encoding, cb) ->

   file.contents = new Buffer(file.contents.toString().replace(regexp, (_, string) ->
    manifest[string]
   ))

   @push file
   cb()
   return
  )