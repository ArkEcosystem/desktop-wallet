const { autoUpdater } = require("electron-updater");
const logger = require("electron-log");
const { version } = require("../../package.json");

const setupDevelopment = (testVersion) => {
	if (testVersion) {
		autoUpdater.currentVersion = testVersion;
	}

	if (process.platform === "linux") {
		process.env.APPIMAGE = `dist/target/ark-desktop-wallet-linux-x86_64-${testVersion || version}.AppImage`;
	}
};

const setupConfig = ({ isDev, testVersion, isE2e }) => {
	autoUpdater.logger = logger;
	autoUpdater.logger.transports.file.level = "info";

	autoUpdater.autoDownload = false;
	autoUpdater.currentVersion = testVersion || version;

	if (isDev || isE2e) {
		autoUpdater.updateConfigPath = "app-update.yml";
	}
	if (isDev) {
		setupDevelopment(testVersion);
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
	CANCEL: `${prefix}:cancel`,
	CHECK_UPDATES: `${prefix}:check-for-updates`,
	DOWNLOAD_UPDATE: `${prefix}:download-update`,
	QUIT_INSTALL: `${prefix}:quit-and-install`,
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
	setupConfig({
		isDev,
		isE2e: process.env.ELECTRON_IS_E2E,
		testVersion: process.env.AUTO_UPDATER_VERSION,
	});

	const { QUIT_INSTALL, CANCEL, CHECK_UPDATES, DOWNLOAD_UPDATE } = ipcEvents();

	for (const event_ of updaterEvents) {
		autoUpdater.on(event_, (data) => {
			sendToWindow(`updater:${event_}`, data, mainWindow);
		});
	}

	ipcMain.handle(QUIT_INSTALL, () => {
		setImmediate(() => autoUpdater.quitAndInstall());
	});

	ipcMain.handle(CANCEL, () => {
		if (autoUpdater.cancellationToken) {
			autoUpdater.cancellationToken.cancel();
		}
	});

	ipcMain.handle(CHECK_UPDATES, async () => {
		const result = await autoUpdater.checkForUpdates();

		if (result) {
			autoUpdater.cancellationToken = result.cancellationToken;
		}
		return result;
	});

	ipcMain.handle(DOWNLOAD_UPDATE, () => autoUpdater.downloadUpdate(autoUpdater.cancellationToken));
};

module.exports = { setupUpdater };
