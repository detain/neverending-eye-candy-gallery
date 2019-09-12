# neverending-eye-candy-gallery
Packery Infinite-Scroll Images-Loaded JSON Scrolling Image Gallery

Impeccable Imagry

[https://github.com/detain/neverending-eye-candy-gallery/wiki/Image-Gallery-Related-Samples-of-Notable-Quality-with-Features-worthy-of-future-inclusion](Image Gallery Related Samples of Notable Quality with Features worthy of future inclusion)


## Setup

Run this to generate the list of images and thier resolutions

```
cd /path/to/images
file * > images.txt
```

If you are having rpoblems with the list being too long or spanning muultiple directoreis you can do this instead

```
cd /path/to/images
IFS="
"
for i in $(find * -type f); do
  file "$i"
done > images.txt
```

