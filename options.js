var server;
jQuery.getJSON('https://vault3.is.cc/consolo/neverending-eye-candy-gallery/server.json', {}, function (json) {
    server = json;
    $("#formatsContainer").append('<input id="formatALL" name="format" type="radio" value="ALL" checked><label for="formatALL">ALL</label>');
    for (var i = 0; i < server.formats.length; ++i) {
      var format = server.formats[i];
      var catId = "format" + format;
      $("#formatsContainer").append('<input id="' + catId + '" name="format" type="radio" value="' + format + '"><label for="' + catId + '">' + format + "<span style='float: right;'>" + server.counts.formats[format] + "</span></label>");
    }
    for (var i = 0; i < server.dirs.length; ++i) {
      var cat = server.dirs[i];
      var catId = "toggle" + cat;
      var catLabel = cat.replace("reddit_sub_", "");
      $("#typesContainer").append('<input id="' + catId + '" name="type[]" type="checkbox" value="' + cat + '"><label for="' + catId + '">' + catLabel + "<span style='float: right;'>" + server.counts.dirs[cat] + "</span></label>");
    }
});
$("#typesContainer input").each(function() {
  if ($(this).prop("checked")) {
    var cat = $(this).prop("id").replace("toggle", "");
  }
});