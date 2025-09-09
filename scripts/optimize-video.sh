#!/bin/bash

# Video optimization script for web delivery
# This script compresses the banner video to reduce file size and improve loading performance

echo "Starting video optimization..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it first:"
    echo "brew install ffmpeg"
    exit 1
fi

# Input and output paths
INPUT_VIDEO="public/Banner Video V3.mp4"
OUTPUT_VIDEO="public/Banner Video V3 Optimized.mp4"
BACKUP_VIDEO="public/Banner Video V3 Original.mp4"

# Check if input video exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input video not found at $INPUT_VIDEO"
    exit 1
fi

# Create backup of original video
echo "Creating backup of original video..."
cp "$INPUT_VIDEO" "$BACKUP_VIDEO"

# Optimize video with ffmpeg
echo "Compressing video for web delivery..."
ffmpeg -i "$INPUT_VIDEO" \
    -c:v libx264 \
    -preset medium \
    -crf 28 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
    "$OUTPUT_VIDEO"

if [ $? -eq 0 ]; then
    # Get file sizes
    ORIGINAL_SIZE=$(du -h "$INPUT_VIDEO" | cut -f1)
    OPTIMIZED_SIZE=$(du -h "$OUTPUT_VIDEO" | cut -f1)
    
    echo "\nOptimization complete!"
    echo "Original size: $ORIGINAL_SIZE"
    echo "Optimized size: $OPTIMIZED_SIZE"
    echo "\nTo use the optimized video, replace the original:"
    echo "mv \"$OUTPUT_VIDEO\" \"$INPUT_VIDEO\""
    echo "\nTo restore the original:"
    echo "mv \"$BACKUP_VIDEO\" \"$INPUT_VIDEO\""
else
    echo "Error: Video optimization failed"
    exit 1
fi