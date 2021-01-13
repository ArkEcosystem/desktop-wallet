const { injectHandler } = require("../plugins/loader/loader-fs-handler");

export const setupPlugins = () => {
	injectHandler();
};
