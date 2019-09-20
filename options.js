var formats = ["ALL", "JPG", "PNG", "GIF", "MPEG-4"];
var cats = ["anime", "reddit_sub_ProgrammerHumor", "wallpapers"];
for (var i = 0; i < formats.length; ++i) {
  var format = formats[i];
  var catId = "format" + format;
  $("#formatsContainer").append('<input id="' + catId + '" name="format" type="radio"><label for="' + catId + '">' + format + "</label>");
}
for (var i = 0; i < cats.length; ++i) {
  var cat = cats[i];
  var catId = "toggle" + cat;
  var catLabel = cat.replace("reddit_sub_", "r/");
  $("#typesContainer").append('<input id="' + catId + '" name="type[]" type="checkbox"><label for="' + catId + '">' + catLabel + "</label>");
}
$("#typesContainer input").each(function() {
  if ($(this).prop("checked")) {
    var cat = $(this).prop("id").replace("toggle", "");
  }
});
