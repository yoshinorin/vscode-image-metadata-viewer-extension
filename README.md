![](https://img.shields.io/badge/Release-v0.0.1-blue.svg?style=flat-square)
![](https://img.shields.io/badge/vscode-^1.102.0-blue.svg?style=flat-square)
[![CI](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/actions/workflows/ci.yaml/badge.svg)](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/actions/workflows/ci.yaml)

# Image Metadata Viewer for Visual Studio Code

A comprehensive VS Code extension that displays detailed metadata information about image files including EXIF data, GPS information, file properties, and more.

## Features

* **Metadata Display**: View file information, EXIF data, and GPS.
* **Visual Preview**: Display the image alongside its metadata
    * HTML table and JSON

## Supported Image Formats

* PNG
* JPG/JPEG
* GIF
* BMP
* WebP
* TIFF

## Images

> **NOTE**: The preview area in the sample image below uses a solid gray image for demonstration purposes. While this may look unclear at first glance, when you use the extension, your selected image will be displayed in this area.

<img src="./images/docs/ext-sample.png" style="max-height:600px;">

## Usage

### Explorer

1. Right-click on any supported image file in the VS Code Explorer
2. Select `Show Image Metadata`

![](./images/docs/explorer.png)

### Command Palette

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type `Show Image Metadata` and select the command
3. Choose an image file from the file dialog

## Requirements

* Visual Studio Code `1.102.0+`

