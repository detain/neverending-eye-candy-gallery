var formats = ["ALL", "JPG", "PNG", "GIF", "MPEG-4"];
var cats =  ["anime", "gifs", "images", "reddit_sub_420_Girls", "reddit_sub_Amateur",  "reddit_sub_CommandoTwerkin",  "reddit_sub_DressTwerk",  "reddit_sub_GangbangChicks",  "reddit_sub_ProgrammerHumor",  "reddit_sub_RealAmateurNSFW",  "reddit_sub_RealAmateur_NSFW",  "reddit_sub_TwerkQueens",  "reddit_sub_TwerkStop", "reddit_sub_TwerkingPorn", "reddit_sub_cosplaytwerk", "reddit_sub_group_sex", "reddit_sub_groupsex", "reddit_sub_ircuckold", "reddit_sub_twerk", "reddit_sub_twerking", "reddit_sub_twerknsfw", "wallpapers"];
for (var i = 0; i < formats.length; ++i) {
  var format = formats[i];
  var catId = 'format'+format;
  $("#formatsContainer").append('<input id="'+catId+'" name="format" type="radio"><label for="'+catId+'">'+format+'</label>');
}
for (var i = 0; i < cats.length; ++i) {
  var cat = cats[i];
  var catId = 'toggle'+cat;
  var catLabel = cat.replace('reddit_sub_', 'r/');
  $("#typesContainer").append('<input id="'+catId+'" name="type[]" type="checkbox"><label for="'+catId+'">'+catLabel+'</label>');
}

$("#typesContainer input").each(function() {
  if ($(this).prop('checked')) {
    var cat = $(this).prop('id').replace('toggle', '');
    
  }
});
