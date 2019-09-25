var formatType = 'ALL';
var audioType = 'null';
var gridType = 'packery'; // masonry packery or isotope
var pageType = 'reddit_sub_ProgrammerHumor'; // gifs images or wallpapers
var enableScrolling = false;
var server;
var itemIdx = 0;
var showNsfw = false;

function pageScroll() {
    if (enableScrolling == true) {
        window.scrollBy(0,4); // horizontal and vertical scroll increments
    }
    scrolldelay = setTimeout('pageScroll()',100); // scrolls every 100 milliseconds
}

function startScroll() {
    $grid.infiniteScroll({
        path: function() {
            return ("photos-api.php?" + $("#optionsForm").serialize() + "&page=" + this.pageIndex);
        },
        responseType: "text", // load response as flat text
        outlayer: gridInsance,
        status: ".page-load-status",
        history: false
    });
    $grid.infiniteScroll("loadNextPage"); // load initial page
    enableScrolling = true;    
}

function getItemHTML(photo) {
    photo.idx = itemIdx;
    ++itemIdx;
    if (photo.format == "MPEG-4") {
        return microTemplate(videoTemplateSrc, photo);        
    } else {
        return microTemplate(itemTemplateSrc, photo);
    }
    
}

function microTemplate(src, data) { // micro templating, sort-of
    return src.replace(/\{\{([\w\-_\.]+)\}\}/gi, function(match, key) { // replace {{tags}} in source
        var value = data; // walk through objects to get value
        key.split(".").forEach(function(part) {
            value = value[part];
        });
        return value;
    });
}

$("#nsfwHas").change(function() {
    console.log($(this));
    if ($(this).prop('checked') == true) {
        showNsfw = true;
        $("#typesContainer .nsfw").show();
    } else {
        showNsfw = false;
        $("#typesContainer .nsfw").hide();
    }
})
jQuery.getJSON('server.json', {}, function (json) {
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
      var extra = '';
      if (typeof server.tags.nsfw != "undefined" && server.tags.nsfw.indexOf(cat) != -1) {
          extra = 'class="nsfw"';
          if (showNsfw == false) {
              extra = extra + ' style="display: none;"';
          }
      }
      $("#typesContainer").append('<input id="' + catId + '" name="type[]" ' + extra + ' type="checkbox" value="' + cat + '"><label for="' + catId + '" ' + extra + ' >' + catLabel + "<span style='float: right;'>" + server.counts.dirs[cat] + "</span></label>");
    }
    if ($(".nsfw").length == 0) {
        $("#nsfwOptions").hide();
    } else {
        $("#nsfwOptions").show();
    }
});
$("#optionsButton").click(function() {
    pageType = '';
    $("#typesContainer input").each(function() {
      if ($(this).prop("checked")) {
        pageType = pageType + '&type[]=' + $(this).prop("id").replace("toggle", "");
      }
    });        
    $("#formatsContainer input").each(function() {
      if ($(this).prop("checked")) {
        formatType = $(this).prop("id").replace("format", "");
      }
    });        
    $("#layoutContainer input").each(function() {
      if ($(this).prop("checked")) {
        gridType = $(this).prop("id").replace("layout", "");
      }
    });        
    startScroll();
    $("#optionsContainer").hide();
});

$('#photo-grid').addClass(gridType);
if (gridType == 'masonry') {
    var $grid = $(".grid").masonry({
        itemSelector: ".photo-item",
        columnWidth: ".grid__col-sizer",
        gutter: ".grid__gutter-sizer",
        percentPosition: false,
        stagger: 30,
        visibleStyle: { transform: "translateY(0)", opacity: 1 }, // nicer reveal transition
        hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
    });
    var gridInsance = $grid.data("masonry"); // get Masonry instance
} else if (gridType == 'packery') {
    var $grid = $(".grid").packery({
        itemSelector: ".photo-item",
        gutter: ".grid__gutter-sizer",
        percentPosition: false,
        stagger: 30,
        visibleStyle: { transform: "translateY(0)", opacity: 1 }, // nicer reveal transition
        hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
    });
    var gridInsance = $grid.data("packery"); // get Packery instance
} else if (gridType == 'isotope') {
    var $grid = $(".grid").isotope({
        layoutMode: 'fitRows', // masonry fitRows cellsByRow vertical packery masonryHorizontal fitColumns cellsByColumn horiz
        itemSelector: ".photo-item",
        gutter: ".grid__gutter-sizer",
        percentPosition: false,
        stagger: 30,
        visibleStyle: { transform: "translateY(0)", opacity: 1 }, // nicer reveal transition
        hiddenStyle: { transform: "translateY(100px)", opacity: 0 }
    });
    var gridInsance = $grid.data("isotope"); // get Packery instance
}
$grid.infiniteScroll.imagesLoaded = imagesLoaded;
//startScroll();
$grid.on("load.infiniteScroll", function(event, response) {
    var data = JSON.parse(response); // parse response into JSON data
    var itemsHTML = data.map(getItemHTML).join(""); // compile data into HTML
    var $items = $(itemsHTML); // convert HTML string into elements
    $items.imagesLoaded(function() { // append item elements
        if (gridType == 'masonry') {
            $grid.infiniteScroll("appendItems", $items).masonry("appended", $items);
        } else if (gridType == 'packery') {
            $grid.infiniteScroll("appendItems", $items).packery("appended", $items);
        } else if (gridType == 'isotope') {
            $grid.infiniteScroll("appendItems", $items).isotope("appended", $items);
        }
        $('video').each(function() { 
            if ($(this).prop('paused') == true) { 
                $(this).load(); 
            } 
        });        
        if (data.length >= server.pageLimit) {
            $grid.infiniteScroll("loadNextPage"); // load initial pag
        } else {
            $grid.infiniteScroll( 'option', {
              // disable loading on scroll
              loadOnScroll: false,
            });
        }
    });
});
var itemTemplateSrc = $("#photo-item-template").html();
var videoTemplateSrc = $("#video-item-template").html();
pageScroll();    

