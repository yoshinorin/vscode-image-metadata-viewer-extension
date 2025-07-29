import * as vscode from "vscode";
import sharp from "sharp";
import * as fs from "node:fs/promises";
import { extract, type Metadata } from "./metadata";
import { getWorkspaceConfiguration } from "./config";
import * as view from "./view";
import * as dialog from "./dialog";

async function run(uri?: vscode.Uri): Promise<void> {
  const imgPath = uri?.fsPath ?? (await dialog.select());
  if (!imgPath) {
    return;
  }

  try {
    const buf = await fs.readFile(imgPath);
    const meta = await sharp(buf).metadata();
    const imageInfo = await extract(imgPath, buf, meta);
    const panel = vscode.window.createWebviewPanel(
      "imageInfoWebview",
      `${imageInfo.file.name}`,
      vscode.ViewColumn.Beside,
      { enableFindWidget: true },
    );
    const imgUri = panel.webview.asWebviewUri(vscode.Uri.file(imgPath));
    const workspaceConfiguration = getWorkspaceConfiguration();
    panel.webview.html = view.renderHtml(
      imageInfo,
      imgUri,
      workspaceConfiguration,
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      "Failed to read image metadata: " +
        (err instanceof Error ? err.message : String(err)),
      { modal: false },
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "image-metadata-viewer.view",
    run,
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Nothing todo
}
