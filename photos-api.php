<?php
function getImageIdx($idx, $totalImages) {
    $idx = $_SESSION['start'] + $idx;
    if ($idx >= $totalImages)
        $idx -= $totalImages;
    return $idx;
}
ob_end_clean(); 
$files = json_decode(file_get_contents('files.json'), true);
$server = json_decode(file_get_contents('server.json'), true);
$photos = [];
$type = isset($_GET['type']) && in_array($_GET['type'], $server['dirs']) ? $_GET['type'] : $server['dirs'][0];
$format = isset($_GET['format']) && in_array($_GET['format'], $server['formats']) ? $_GET['format'] : false;
$audio = isset($_GET['audio']) && in_array($_GET['audio'], ['1', 1, true, 'true']) ? true : isset($_GET['audio']) && in_array($_GET['audio'], ['0', 0, false, 'false']) ? false : null;
if (isset($_GET['id'])) {
    $idx = 0;
    foreach ($files as $data) {
        if ($data['dir'] == $type) {
            //echo $data['dir'].'::'.$data['file'].'::'.'type::';
            if ($format === false || $data['type'] == $format) {
                //echo 'format::';
                if (is_null($audio) || $audio == $data['audio']) {
                    //echo 'audio::';
                    if ($idx == $_GET['id']) {
                        ///echo 'id::good';
                        Header('Content-type: image/'.$data['ext'].'; charset=UTF-8');
                        readfile(__DIR__.'/images/'.$data['dir'].'/'.$data['file']);
                        //header('Content-type: text/html; charset=UTF-8');
                        //echo '<img src="images/'.$data['dir'].'/'.$data['file'].' alt="" border="0" />';
                        exit;
                    }
                    $idx++;
                }
            }
            //echo PHP_EOL;
        }
    } 
} else {
    session_start();
    header('Content-type: application/json; charset=UTF-8');
    $pageLimit = 20;
    $pageIdx = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $totalImages = $server['counts']['dirs'][$type];
    $imageStart = ($pageIdx - 1) * $pageLimit; 
    $imageEnd = $pageIdx * $pageLimit;
    if ($imageEnd > $totalImages)
        $imageEnd = $totalImages;
    if ($pageIdx == 1)
        $_SESSION['start'] = rand(0, $totalImages - 1); 
    //for ($idx = $imageStart; $idx < $imageEnd; $idx++) {
    $idx = 0;
    foreach ($files as $data) {
        if ($data['dir'] == $type) {
            if ($format === false || $data['type'] == $format) {
                if (is_null($audio) || $audio == $data['audio']) {
                    if ($idx >= $imageStart && $idx <= $imageEnd) {
                        $name = $data['file'];
                        $photos[] = $data;
                    }
                    $idx++;
                }
            }
        }
        
    } 
    echo json_encode($photos);
}
