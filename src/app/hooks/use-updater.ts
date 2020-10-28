import { ipcRenderer } from "electron";

const ipcEvents = (prefix = "updater") => ({
	QUIT_INSTALL: `${prefix}:quit-and-install`,
	CANCEL: `${prefix}:cancel`,
	CHECK_UPDATES: `${prefix}:check-for-updates`,
	DOWNLOAD_UPDATE: `${prefix}:download-update`,
});

export const useUpdater = () => {
	const { CANCEL, QUIT_INSTALL, CHECK_UPDATES, DOWNLOAD_UPDATE } = ipcEvents();

	const cancel = (callback?: () => void) => {
		ipcRenderer.send(CANCEL, callback);
	};

	const checkForUpdates = (callback?: () => void) => {
		ipcRenderer.send(CHECK_UPDATES, callback);
	};

	const quitInstall = (callback?: () => void) => {
		ipcRenderer.send(QUIT_INSTALL, callback);
	};

	const downloadUpdate = (callback?: () => void) => {
		ipcRenderer.send(DOWNLOAD_UPDATE, callback);
	};

	return {
		cancel,
		checkForUpdates,
		downloadUpdate,
		quitInstall,
	};
};
