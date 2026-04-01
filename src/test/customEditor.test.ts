import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";
import {
  ImageDocument,
  ImageMetadataEditorProvider,
  syncEditorAssociations,
} from "../customEditor";

suite("ImageDocument", () => {
  test("stores URI", () => {
    const uri = vscode.Uri.file("/test/image.png");
    const doc = new ImageDocument(uri);
    assert.strictEqual(doc.uri.fsPath, uri.fsPath);
  });

  test("dispose does not throw", () => {
    const doc = new ImageDocument(vscode.Uri.file("/test/image.png"));
    assert.doesNotThrow(() => doc.dispose());
  });
});

suite("ImageMetadataEditorProvider", () => {
  const asset = (name: string) =>
    path.join(__dirname, `../../src/test/assets/${name}`);

  const provider = new ImageMetadataEditorProvider();
  let tokenSource: vscode.CancellationTokenSource;

  setup(() => {
    tokenSource = new vscode.CancellationTokenSource();
  });

  teardown(() => {
    tokenSource.dispose();
  });

  function createMockPanel(): vscode.WebviewPanel & { disposed: boolean } {
    let disposed = false;
    return {
      get disposed() {
        return disposed;
      },
      webview: {
        options: {} as vscode.WebviewOptions,
        html: "",
        asWebviewUri: (uri: vscode.Uri) => uri,
      } as unknown as vscode.Webview,
      dispose: () => {
        disposed = true;
      },
      onDidDispose: (_listener: () => void) => ({ dispose: () => {} }),
    } as unknown as vscode.WebviewPanel & { disposed: boolean };
  }

  test("openCustomDocument returns ImageDocument with correct URI", async () => {
    const uri = vscode.Uri.file(asset("example.png"));
    const doc = await provider.openCustomDocument(
      uri,
      {} as vscode.CustomDocumentOpenContext,
      tokenSource.token,
    );
    assert.strictEqual(doc.uri.fsPath, uri.fsPath);
  });

  test("renders HTML", async () => {
    const uri = vscode.Uri.file(asset("example.png"));
    const doc = new ImageDocument(uri);
    const panel = createMockPanel();

    await provider.resolveCustomEditor(doc, panel, tokenSource.token);

    assert.ok((panel.webview as unknown as { html: string }).html.length > 0);
    assert.ok(
      (panel.webview as unknown as { html: string }).html.includes(
        "<!DOCTYPE html>",
      ),
    );
  });
});

suite("syncEditorAssociations", () => {
  const viewType = ImageMetadataEditorProvider.viewType;

  function getAssociations(): Record<string, string> {
    return vscode.workspace
      .getConfiguration()
      .get<Record<string, string>>("workbench.editorAssociations", {});
  }

  teardown(async () => {
    const config = vscode.workspace.getConfiguration();
    const associations = { ...getAssociations() };
    for (const key of Object.keys(associations)) {
      if (
        associations[key] === viewType ||
        associations[key] === "other-extension.viewer"
      ) {
        delete associations[key];
      }
    }
    await config.update(
      "workbench.editorAssociations",
      associations,
      vscode.ConfigurationTarget.Global,
    );
  });

  test("adds associations when enabled with no prior entries", async () => {
    await syncEditorAssociations(true);

    const associations = getAssociations();
    assert.strictEqual(associations["*.png"], viewType);
    assert.strictEqual(associations["*.jpg"], viewType);
    assert.strictEqual(associations["*.tiff"], viewType);
  });

  test("removes associations when disabled", async () => {
    await syncEditorAssociations(true);
    await syncEditorAssociations(false);

    const associations = getAssociations();
    assert.strictEqual(associations["*.png"], undefined);
    assert.strictEqual(associations["*.jpg"], undefined);
  });

  test("does not overwrite existing association from another editor", async () => {
    const config = vscode.workspace.getConfiguration();
    const associations = {
      ...getAssociations(),
      "*.png": "other-extension.viewer",
    };
    await config.update(
      "workbench.editorAssociations",
      associations,
      vscode.ConfigurationTarget.Global,
    );

    await syncEditorAssociations(true);

    const updated = getAssociations();
    assert.strictEqual(updated["*.png"], "other-extension.viewer");
    assert.strictEqual(updated["*.jpg"], viewType);
  });

  test("preserves unrelated associations", async () => {
    const config = vscode.workspace.getConfiguration();
    const associations = {
      ...getAssociations(),
      "*.csv": "some-csv-editor.viewer",
    };
    await config.update(
      "workbench.editorAssociations",
      associations,
      vscode.ConfigurationTarget.Global,
    );

    await syncEditorAssociations(true);
    await syncEditorAssociations(false);

    const updated = getAssociations();
    assert.strictEqual(updated["*.csv"], "some-csv-editor.viewer");
  });

  test("no-op when already in desired state", async () => {
    await syncEditorAssociations(true);
    const before = { ...getAssociations() };

    await syncEditorAssociations(true);
    const after = getAssociations();

    assert.deepStrictEqual(after, before);
  });
});
