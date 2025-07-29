import * as vscode from "vscode";

// select file from dialog
export async function select(): Promise<string | undefined> {
  const selectedFile = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: "Select Image",
    filters: {
      Images: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "tiff"],
    },
  });
  if (!selectedFile || selectedFile.length === 0) {
    return;
  }
  return selectedFile[0].fsPath;
}
