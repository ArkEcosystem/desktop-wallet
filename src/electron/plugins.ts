const { PluginLoaderFileSystem } = require("../plugins/loader");

export const setupPlugins = () => {
	PluginLoaderFileSystem.ipc().injectHandler();
};
