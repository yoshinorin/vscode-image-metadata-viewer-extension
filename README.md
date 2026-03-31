![](https://img.shields.io/badge/Release-v1.0.1-blue.svg?style=flat-square)
![](https://img.shields.io/badge/vscode-^1.102.0-blue.svg?style=flat-square)
[![CI](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/actions/workflows/ci.yml)

# Image Metadata Viewer for Visual Studio Code

A comprehensive VS Code extension that displays detailed metadata information about image files including EXIF data, GPS information, file properties, and more.

## Features

* **Metadata Display**: View file information, EXIF data, and GPS.
* **Visual Preview**: Display the image alongside its metadata
    * HTML table and JSON

## Supported Platforms

> **NOTE**: The publisher has only tested the extension on `win32-x64` and `linux-x64`. While it is expected to work on other platforms listed belows, they have not been fully verified.

* Windows
    * win32-x64
    * win32-arm64
* Linux
    * linux-x64
    * linux-armhf
    * linux-arm64
* MacOS
    * darwin-x64
    * darwin-arm64

## Supported Image Formats

* PNG
* JPG/JPEG
* GIF
* BMP
* WebP
* TIFF

## Images

> **NOTE**: The preview area in the sample image below uses a solid gray image for demonstration purposes. While this may look unclear at first glance, when you use the extension, your selected image will be displayed in this area.

<img src="https://raw.githubusercontent.com/yoshinorin/vscode-image-metadata-viewer-extension/refs/heads/master/images/docs/ext-sample.png" style="max-height:600px;">

## Usage

You can also open the Image Metadata Viewer by simply clicking an image file in the Explorer. Enable the `image-metadata-viewer.openAsDefaultEditor` setting in the [Configuration](#configuration) section below.

### Explorer

1. Right-click on any supported image file in the VS Code Explorer
2. Select `Show Image Metadata`

![](https://raw.githubusercontent.com/yoshinorin/vscode-image-metadata-viewer-extension/refs/heads/master/images/docs/explorer.png)

### Command Palette

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type `Show Image Metadata` and select the command
3. Choose an image file from the file dialog

## Configuration

| Setting | Type | Default | Description |
|---|---|---|---|
| `image-metadata-viewer.openAsDefaultEditor` | `boolean` | `false` | When enabled, clicking an image file in the Explorer opens the Image Metadata Viewer instead of the built-in image viewer. |

To open the Image Metadata Viewer by default when clicking image files, add the following to your `settings.json`:

```json
"image-metadata-viewer.openAsDefaultEditor": true
```

> **NOTE**: Even when this setting is disabled, you can always open the viewer via right-click or the Command Palette.

If you already have a custom editor association for a specific image type in `workbench.editorAssociations`, this extension will not overwrite it. For example, if your `settings.json` contains:

```json
"workbench.editorAssociations": {
  "*.png": "other-extension.pngViewer"
}
```

Enabling `openAsDefaultEditor` will apply to other image types (e.g., `*.jpg`, `*.gif`) but `*.png` will continue to use `other-extension.pngViewer`. A warning notification will inform you which patterns were skipped.

## Requirements

* Visual Studio Code `1.102.0+`

## Release Note

* Please see [releases](https://github.com/yoshinorin/vscode-image-metadata-viewer-extension/releases)
