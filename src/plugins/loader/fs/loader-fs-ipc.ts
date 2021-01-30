import { ipcRenderer } from "electron";

import { PluginRawInstance } from "../../types";

export const search = (): Promise<PluginRawInstance[]> => ipcRenderer.invoke("plugin:loader-fs.search");
export const remove = (dir: string): Promise<PluginRawInstance[]> => ipcRenderer.invoke("plugin:loader-fs.remove", dir);
export const find = (dir: string): Promise<PluginRawInstance> => ipcRenderer.invoke("plugin:loader-fs.find", dir);
