#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p renders
npx remotion render src/index.ts Pitch renders/pitch_render.mp4 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=192k --pixel-format=yuv420p --concurrency=4
ffmpeg -hide_banner -loglevel error -y -i renders/pitch_render.mp4 -c copy -movflags +faststart renders/pitch_final.mp4
rm renders/pitch_render.mp4
npx remotion still src/index.ts Miniatura renders/miniatura.png
ffprobe -v error -show_entries format=duration,size:stream=codec_name,profile,width,height,pix_fmt,sample_rate,bit_rate -of default=nw=1 renders/pitch_final.mp4
