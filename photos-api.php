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
$type = isset($_GET['type']) ? $_GET['type'] : $server['dirs'][0];
if (!is_array($type))
    $type = [$type];
$format = isset($_GET['format']) ? $_GET['format'] : false;
if (isset($_GET['audio'])) {
    if (in_array($_GET['audio'], ['null'])) {
        $audio = null;
    } elseif (in_array($_GET['audio'], ['1', 1, true, 'true'])) {
        $audio = true;
    } elseif (in_array($_GET['audio'], ['0', 0, false, 'false'])) {
        $audio = false;
    } else {
        $audio = null;
    }    
} else {
    $audio = null;
}
if (isset($_GET['id'])) {
    $idx = 0;
    foreach ($files as $data) {
        if (in_array($data['dir'], $type)) {
            //echo $data['dir'].'::'.$data['file'].'::'.'type::';
            if ($format === false || $format == 'ALL' || $data['format'] == $format) {
                //echo 'format::';
                if ($audio === null || $audio === $data['audio']) {
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
    $pageIdx = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $totalImages = 0;
    foreach ($type as $idx => $typeItem) {
        $totalImages += $server['counts']['dirs'][$typeItem];
    }
    $imageStart = ($pageIdx - 1) * $server['pageLimit']; 
    $imageEnd = $pageIdx * $server['pageLimit'];
    if ($imageEnd > $totalImages)
        $imageEnd = $totalImages;
    if ($pageIdx == 1)
        $_SESSION['start'] = rand(0, $totalImages - 1); 
    //for ($idx = $imageStart; $idx < $imageEnd; $idx++) {
    $idx = 0;
    foreach ($files as $data) {
        if (in_array($data['dir'], $type)) {
            if ($format === false || $data['format'] == $format) {
                if (is_null($audio) || $audio == $data['audio']) {
                    if ($idx >= $imageStart && $idx < $imageEnd) {
                        $data['name'] = str_replace(['.'.$data['ext'], '_'], ['', ' '], $data['file']);
                        $photos[] = $data;
                    }
                    $idx++;
                }
            }
        }
        
    } 
    echo json_encode($photos);
}
