import electron from "electron";
import { Application } from "spectron";

jest.setTimeout(10000);

export const startApp = () => {
	const app = new Application({
		path: electron,
		args: ["dist/electron/main.js"],
		startTimeout: 10000,
		waitTimeout: 10000,
	});

	return app.start();
};

export const stopApp = (app) => {
	if (app && app.isRunning()) {
		return app.stop();
	}
};
