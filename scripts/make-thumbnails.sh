#!/bin/bash
# Create thumbnail images for the reference galleries.
# Requires ImageMagick's `convert` command.

WIDTH=400

set -e

for dir in Website/images/*-referenzen; do
  [ -d "$dir" ] || continue
  mkdir -p "$dir/thumbs"
  for img in "$dir"/*.jpg; do
    [ -f "$img" ] || continue
    out="$dir/thumbs/$(basename "$img")"
    if [ ! -f "$out" ]; then
      convert "$img" -auto-orient -resize ${WIDTH}x "$out"
    fi
  done
done
