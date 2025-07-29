import * as vscode from "vscode";

export interface WorkspaceConfiguration {
  fontFamily: string;
  fontSize: number;
}

export function getWorkspaceConfiguration(): WorkspaceConfiguration {
  const config = vscode.workspace.getConfiguration("editor");

  return {
    fontFamily: config.get<string>("fontFamily") || "monospace",
    fontSize: config.get<number>("fontSize") || 14,
  } as WorkspaceConfiguration;
}
