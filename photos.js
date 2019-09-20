var formatType = 'ALL';
var audioType = 'null';
var gridType = 'packery'; // masonry packery or isotope
var pageType = 'reddit_sub_ProgrammerHumor'; // gifs images or wallpapers
if (pageType == 'family') gridType = 'masonry';
$('#photo-grid').addClass(gridType);
function pageScroll() {
        window.scrollBy(0,4); // horizontal and vertical scroll increments
        scrolldelay = setTimeout('pageScroll()',100); // scrolls every 100 milliseconds
}
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
$grid.infiniteScroll({
    path: function() {
        return ("photos-api.php?format=" + formatType + "&audio=" + audioType + "&type=" + pageType + "&page=" + this.pageIndex);
    },
    responseType: "text", // load response as flat text
    outlayer: gridInsance,
    status: ".page-load-status",
    history: false
});
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
        if ($('.photo-item').length < 50)
            $grid.infiniteScroll("loadNextPage"); // load initial pag
    });
});
$grid.infiniteScroll("loadNextPage"); // load initial page
var itemTemplateSrc = $("#photo-item-template").html();
var videoTemplateSrc = $("#video-item-template").html();
function getItemHTML(photo) {
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
pageScroll();
