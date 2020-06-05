const electron = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const winState = require("electron-window-state");

const { BrowserWindow, app, screen, ipcMain } = electron;

let mainWindow;
let windowState = null;
let deeplinkingUrl = null;

const winURL = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`;

const installExtensions = async () => {
	const installer = require("electron-devtools-installer");
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ["REACT_DEVELOPER_TOOLS"];

	return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.log);
};

function broadcastURL(url) {
	if (!url || typeof url !== "string") {
		return;
	}

	if (mainWindow && mainWindow.webContents) {
		mainWindow.webContents.send("process-url", url);
		deeplinkingUrl = null;
	}
}

ipcMain.on("disable-iframe-protection", function (_event, urls) {
	const filter = { urls };
	windows.main.webContents.session.webRequest.onHeadersReceived(filter, (details, done) => {
		const headers = details.responseHeaders;

		const xFrameOrigin = Object.keys(headers).find((header) => header.toString().match(/^x-frame-options$/i));
		if (xFrameOrigin) {
			delete headers[xFrameOrigin];
		}

		done({
			cancel: false,
			responseHeaders: headers,
			statusLine: details.statusLine,
		});
	});
});

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	windowState = winState({
		defaultWidth: width,
		defaultHeight: height,
		fullScreen: false,
	});

	mainWindow = new BrowserWindow({
		width: windowState.width,
		height: windowState.height,
		x: windowState.x,
		y: windowState.y,
		backgroundColor: "#f7fafb",
		center: true,
		show: true,
		webPreferences: {
			nodeIntegration: true,
			webviewTag: true,
		},
	});

	mainWindow.isMain = true;

	windowState.manage(mainWindow);
	mainWindow.loadURL(winURL);
	mainWindow.setBackgroundColor("#f7fafb");

	mainWindow.on("close", () => (mainWindow = null));
	mainWindow.on("closed", () => (mainWindow = null));

	mainWindow.webContents.on("did-finish-load", () => {
		const version = app.getVersion();
		const windowTitle = `ARK Desktop Wallet ${version}`;
		mainWindow.setTitle(windowTitle);

		broadcastURL(deeplinkingUrl);
	});

	if (isDev) {
		installExtensions()
			.then(() => mainWindow.webContents.openDevTools())
			.catch((error) => console.error(error));
	}
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("open-url", (event, url) => {
	// Protocol handler for osx
	event.preventDefault();
	deeplinkingUrl = url;
	broadcastURL(deeplinkingUrl);
});

app.setAsDefaultProtocolClient("ark", process.execPath, ["--"]);
