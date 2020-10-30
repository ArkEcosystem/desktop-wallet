const { autoUpdater } = require("electron-updater");
const { version } = require("../../package.json");
const logger = require("electron-log");

const setupConfig = () => {
	autoUpdater.logger = logger;
	autoUpdater.logger.transports.file.level = "info";
	autoUpdater.autoDownload = false;
	autoUpdater.currentVersion = version;
};

const setupDev = () => {
	autoUpdater.updateConfigPath = "app-update.yml";
	const testVersion = process.env.AUTO_UPDATER_VERSION;
	if (testVersion) {
		autoUpdater.currentVersion = testVersion;
	}
};

const sendToWindow = (key, value, mainWindow) => {
	if (mainWindow && mainWindow.webContents) {
		mainWindow.webContents.send(key, value);
		return true;
	}

	return false;
};

const ipcEvents = (prefix = "updater") => ({
	QUIT_INSTALL: `${prefix}:quit-and-install`,
	CANCEL: `${prefix}:cancel`,
	CHECK_UPDATES: `${prefix}:check-for-updates`,
	DOWNLOAD_UPDATE: `${prefix}:download-update`,
});

const updaterEvents = [
	"checking-for-update",
	"update-available",
	"update-not-available",
	"error",
	"download-progress",
	"update-downloaded",
];

const setupUpdater = ({ ipcMain, mainWindow, isDev }) => {
	setupConfig();

	if (isDev) setupDev();

	const { QUIT_INSTALL, CANCEL, CHECK_UPDATES, DOWNLOAD_UPDATE } = ipcEvents();

	updaterEvents.forEach((evt) =>
		autoUpdater.on(evt, (data) => {
			sendToWindow(`updater:${evt}`, data, mainWindow);
		}),
	);

	ipcMain.handle(QUIT_INSTALL, () => {
		setImmediate(() => autoUpdater.quitAndInstall());
	});

	ipcMain.handle(CANCEL, () => {
		if (!autoUpdater.cancellationToken) {
			autoUpdater.cancellationToken.cancel();
		}
	});

	ipcMain.handle(CHECK_UPDATES, async () => {
		const result = await autoUpdater.checkForUpdates();

		if (result) autoUpdater.cancellationToken = result.cancellationToken;
		return result;
	});

	ipcMain.handle(DOWNLOAD_UPDATE, () => autoUpdater.downloadUpdate(autoUpdater.cancellationToken));
};

module.exports = { setupUpdater };
