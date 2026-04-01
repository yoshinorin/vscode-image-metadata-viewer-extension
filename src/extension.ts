import * as vscode from "vscode";
import sharp from "sharp";
import * as fs from "node:fs/promises";
import { extract } from "./metadata";
import { getWorkspaceConfiguration } from "./config";
import * as view from "./view";
import * as dialog from "./dialog";
import {
  ImageMetadataEditorProvider,
  syncEditorAssociations,
} from "./customEditor";

async function run(uri?: vscode.Uri): Promise<void> {
  const imgPath = uri?.fsPath ?? (await dialog.select());
  if (!imgPath) {
    return;
  }

  try {
    const buf = await fs.readFile(imgPath);
    const meta = await sharp(buf).metadata();
    const metadata = await extract(imgPath, buf, meta);
    const panel = vscode.window.createWebviewPanel(
      "imageMetadataWebview",
      `${metadata.file.name}`,
      vscode.ViewColumn.Beside,
      { enableFindWidget: true },
    );
    const imgUri = panel.webview.asWebviewUri(vscode.Uri.file(imgPath));
    const workspaceConfiguration = getWorkspaceConfiguration();
    panel.webview.html = view.renderHtml(
      metadata,
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
  context.subscriptions.push(
    vscode.commands.registerCommand("image-metadata-viewer.view", run),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("image-metadata-viewer.openSettings", () =>
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "image-metadata-viewer",
      ),
    ),
  );

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      ImageMetadataEditorProvider.viewType,
      new ImageMetadataEditorProvider(),
      {
        webviewOptions: { retainContextWhenHidden: false },
        supportsMultipleEditorsPerDocument: false,
      },
    ),
  );

  const enabled = vscode.workspace
    .getConfiguration("image-metadata-viewer")
    .get<boolean>("openAsDefaultEditor", false);
  syncEditorAssociations(enabled);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("image-metadata-viewer.openAsDefaultEditor")) {
        const newEnabled = vscode.workspace
          .getConfiguration("image-metadata-viewer")
          .get<boolean>("openAsDefaultEditor", false);
        syncEditorAssociations(newEnabled);
      }
    }),
  );
}

export function deactivate() {
  // Nothing todo
}
