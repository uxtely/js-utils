#!/bin/sh
set -o noglob
IFS=$'\n'

# https://blog.uidrafter.com/convert-to-avif-programmatically

abort() { # Prints the message in red to stderr
  printf "\033[31m  ABORTED: $1\n\033[0m" >&2
  exit 1
}

# brew install oxipng webp libavif ffmpeg
command -v cwebp > /dev/null || abort "Missing webp"
command -v oxipng > /dev/null || abort "Missing oxipng"
command -v avifenc > /dev/null || abort "Missing libavif"
command -v ffmpeg > /dev/null || abort "Missing ffmpeg"


# We only use PNGs, no JPGs. This way we can ensure there's no
# color shifting between screenshots and PNGs look sharper anyways.
nJPG=$(find $1 -type f -name *\.jpg | awk 'END{print NR}')
test $nJPG = 0 || abort "Found a JPG, use a PNG instead." 


# If foo.png has been modified later than foo.png.avif, foo.png outputs:
#  1. foo.png (better compressed lossless, and without EXIF metadata)
#  2. foo.png.webp
#  3. foo.png.avif
for img in $(find $1 -type f -name *\.png); do
  if [ $img -nt "$img.avif" ]; then
    chmod 644 $img
    oxipng --opt max --strip safe $img
    cwebp $img -o "$img.webp"
    avifenc --speed 0 --min 25 --max 35 $img "$img.avif"
  fi
done


# Enables "+faststart" if needed, which ensures the metadata section (moov)
# of an mp4 is before the video and audio section (mdat).
# https://trac.ffmpeg.org/wiki/HowToCheckIfFaststartIsEnabledForPlayback
# https://www.ramugedia.com/mp4-container
for video in $(find $1 -type f -name *\.mp4); do
  mp4_section_appearing_first=`ffmpeg -v trace -i $video NUL 2>&1 | grep --max-count 1 --only-matching -e "type:'mdat'" -e "type:'moov'"`
  if [ "$mp4_section_appearing_first" != "type:'moov'" ]; then
    ffmpeg -i $video -movflags +faststart $video.tmp.mp4
    rm $video
    mv $video.tmp.mp4 $video
  fi
done
