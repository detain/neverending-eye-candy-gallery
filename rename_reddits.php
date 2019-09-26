<?php
$dir = '/storage/ConSolo/public/neverending-eye-candy-gallery/images';
foreach (glob($dir.'/reddit_sub_*') as $sub) {
	$subEsc = escapeshellarg($sub);
	$files = trim(`find {$subEsc} -type f`);
	preg_match_all("/\/reddit_sub_(?P<sub>[^\/]*)(?P<mid>\/.*\/)?[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-(?P<txt>[^\/]*)-[^-]*(?P<ext>\.[^\.\s]*)/m", $files, $matches);
	foreach ($matches[0] as $idx => $orig) {
		$new = $dir.'/'.$matches['sub'][$idx].$matches['mid'][$idx].$matches['txt'][$idx].$matches['ext'][$idx];
		if (!file_exists(dirname($new)))
			mkdir(dirname($new), true);
		if ($dir.$orig != $new && !file_exists($new)) {
			echo "Renamed {$orig} to {$new}\n";
			rename($dir.$orig, $new);
		}
	}
}
