<?php
$basedir = __DIR__.'/images/';
$files = file_exists('files.json') ? json_decode(file_get_contents('files.json'), true) : $files = [];
$newFiles = [];
foreach ($files as $idx => $file) {
	if (file_exists($basedir.$file['dir'].'/'.$file['file'])) {
		$newFiles[] = $file;
	} else {
		echo "Removing {$basedir}{$file['dir']}/{$file['file']}\n";
	}
}
file_put_contents('files.json', str_replace('},', '},'.PHP_EOL, json_encode($newFiles)));
