<?php
function getImageIdx($idx, $totalImages) {
    $idx = $_SESSION['start'] + $idx;
    if ($idx >= $totalImages)
        $idx -= $totalImages;
    return $idx;
} 
header('Content-type: application/json; charset=UTF-8');
session_start();
error_log($_SESSION['start']);
$photos = [];
$type = isset($_GET['type']) && in_array($_GET['type'], ['anime', 'family', 'gifs', 'images', 'wallpapers']) ? $_GET['type'] : 'ProgrammerHumor';
$result = file_get_contents(__DIR__.'/'.$type.'.txt'); // generated with file * > gifs.txt
preg_match_all('/^([^:]*):\s+.* (\d+)\s?x\s?(\d+)[^0-9].*$/msuU', $result, $matches);
$pageLimit = 5;
$pageIdx = isset($_GET['page']) ? intval($_GET['page']) : 1;
$totalImages = count($matches[0]);
$imageStart = ($pageIdx - 1) * $pageLimit; 
$imageEnd = $pageIdx * $pageLimit;
if ($imageEnd > $totalImages)
    $imageEnd = $totalImages;
if ($pageIdx == 1)
    $_SESSION['start'] = rand(0, $totalImages - 1); 
for ($idx = $imageStart; $idx < $imageEnd; $idx++) {
    $realIdx = getImageIdx($idx, $totalImages);
    $photos[] = [
        'type' => $type,
        'file' => [
            'src' => $matches[1][$realIdx],
            'name' => substr($matches[1][$realIdx], 0, -4),
        ],
        'size' => [
            'width' => $matches[2][$realIdx],
            'height' => $matches[3][$realIdx]
        ] 
    ]; 
} 
echo json_encode($photos);
