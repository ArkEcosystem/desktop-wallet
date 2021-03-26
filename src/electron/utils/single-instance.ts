import { app, BrowserWindow } from "electron";

const gotTheLock = app.requestSingleInstanceLock();

export function handleSingleInstance({
	mainWindow,
	broadcastURL,
}: {
	mainWindow: BrowserWindow | null;
	broadcastURL: (url: string | null) => void;
}) {
	if (!gotTheLock) {
		app.quit();
	} else {
		app.on("second-instance", (_, argv) => {
			// Someone tried to run a second instance, we should focus our window.
			// argv: An array of the second instance’s (command line / deep linked) arguments
			for (const arg of argv) {
				if (arg.startsWith("ark:")) {
					broadcastURL(arg);
					break;
				}
			}

			if (mainWindow) {
				if (mainWindow.isMinimized()) {
					mainWindow.restore();
				}
				mainWindow.focus();
			}
		});
	}
}
