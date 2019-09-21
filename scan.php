<?php
/**
* Notes: this code requires mediainfo v18 or higher
* 
* Debian/Ubuntu/DEB Based:
* wget https://mediaarea.net/repo/deb/repo-mediaarea_1.0-11_all.deb && dpkg -i repo-mediaarea_1.0-11_all.deb && apt-get update
* 
* CentOS/RPM Based:
* rpm -Uvh https://mediaarea.net/repo/rpm/releases/repo-MediaArea-1.0-11.noarch.rpm
* 
*/
$basedir = __DIR__.'/images/';
$server = [
    'pageLimit' => 5,
    'counts' => [
        'total' => 0,
        'audio' => 0,
        'silent' => 0,
        'formats' => [],
        'dirs' => [],
        'tags' => [],
    ],
    'formats' => [],
    'dirs' => [],
    'tags' => [],
];
$files = file_exists('files.json') ? json_decode(file_get_contents('files.json'), true) : $files = [];
$loadedFiles = [];
foreach ($files as $idx => $file) {
    $loadedFiles[$basedir.$file['dir'].'/'.$file['file']] = $idx;
}
echo 'Loaded '.count($loadedFiles).' Pre-Scanned Files'.PHP_EOL;
$x = 0;
foreach (glob($basedir.'*') as $dir) {
    if (is_dir($dir)) {
        //echo "Working on Path {$dir}\n";
        $escapedDir = escapeshellarg($dir);
        foreach (explode("\n", trim(`exec find {$escapedDir} -type f`)) as $file) {
            $info = false;
            if (array_key_exists($file, $loadedFiles)) {
                $info = $files[$loadedFiles[$file]];
                echo '.';
            } else {
                //echo "Working on File {$file}\n";
                $escapedFile = escapeshellarg($file);
                $cmd = 'exec mediainfo --Output=JSON '.$escapedFile.';';
                //echo 'CMD:'.$cmd.PHP_EOL;
                $data = json_decode(trim(`$cmd`), true);
                if (isset($data['media']) && isset($data['media']['track']) && isset($data['media']['track'][0]['Format'])) {
                    $x++;
                    $info = [
                        'dir' => str_replace($basedir, '', $dir),
                        'file' => str_replace($dir.'/', '', $file),
                        'size' => $data['media']['track'][0]['FileSize'],
                        'ext' => $data['media']['track'][0]['FileExtension'],
                        'format' => $data['media']['track'][0]['Format'],
                        'width' => $data['media']['track'][1]['Width'],
                        'height' => $data['media']['track'][1]['Height'],
                        'audio' => isset($data['media']['track'][2]) && $data['media']['track'][2]['@type'] == 'Audio',
                        'duration' => isset($data['media']['track'][1]['Duration']) ? $data['media']['track'][1]['Duration'] : false,
                    ];
                    echo json_encode($info).PHP_EOL;
                    $files[] = $info;
                    if ($x >= 500) {
                        echo "Writing files.json and server.json\n";
                        file_put_contents('files.json', str_replace('},', '},'.PHP_EOL, json_encode($files)));
                        file_put_contents('server.json', json_encode($server, JSON_PRETTY_PRINT));
                        $x = 0;
                    }
                    echo '+';
                } else {
                    echo '-';
                }
            }
            if ($info !== false) {
                if (!in_array($info['format'], $server['formats'])) {
                    $server['formats'][] = $info['format'];
                    $server['counts']['formats'][$info['format']] = 0;
                }
                $server['counts']['formats'][$info['format']]++;
                if (!in_array($info['dir'], $server['dirs'])) {
                    $server['dirs'][] = $info['dir'];
                    $server['counts']['dirs'][$info['dir']] = 0;
                }
                $server['counts']['dirs'][$info['dir']]++;
                if ($info['audio'] == true) {
                    $server['counts']['audio']++;
                } else {
                    $server['counts']['silent']++;
                }
                $server['counts']['total']++;
            }
        }
    }    
}
echo "Writing files.json and server.json\n";
file_put_contents('files.json', str_replace('},', '},'.PHP_EOL, json_encode($files)));
file_put_contents('server.json', json_encode($server, JSON_PRETTY_PRINT));
