import { app, BrowserWindow, ipcMain, screen, shell } from "electron";
import isDev from "electron-is-dev";
import winState from "electron-window-state";
import path from "path";

import assignMenu from "./menu";
import { setupPlugins } from "./plugins";
import { setupUpdater } from "./updater";
import { handleSingleInstance } from "./utils/single-instance";

const windows = {};
let mainWindow: BrowserWindow | null;
let windowState = null;
let deeplinkingUrl: string | null;

const winURL = isDev
	? "http://localhost:3000"
	: process.env.ELECTRON_IS_E2E
	? `file://${path.resolve("build/index.html")}`
	: `file://${path.resolve(__dirname, "../")}/index.html`;

const installExtensions = async () => {
	if (isDev) {
		const installer = require("electron-devtools-installer");
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		const extensions = ["REACT_DEVELOPER_TOOLS"];

		return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(
			console.log,
		);
	}
};

function broadcastURL(url: string | null) {
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
	// @ts-ignore
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

ipcMain.on("exit-app", function (_event, args) {
	app.quit();
});

ipcMain.on("open-external", function (_event, url) {
	try {
		shell.openExternal(url);
	} catch (error) {
		console.log(error);
	}
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
		minWidth: 1024,
		minHeight: 600,
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

	windowState.manage(mainWindow);
	mainWindow.loadURL(winURL);
	mainWindow.setBackgroundColor("#f7fafb");
	mainWindow.setContentProtection(!isDev);

	mainWindow.on("close", () => (mainWindow = null));
	mainWindow.on("closed", () => (mainWindow = null));

	mainWindow.webContents.on("did-finish-load", () => {
		const version = app.getVersion();
		const windowTitle = `ARK Desktop Wallet ${version}`;
		mainWindow && mainWindow.setTitle(windowTitle);

		broadcastURL(deeplinkingUrl);
	});

	if (isDev) {
		installExtensions()
			.then(() => mainWindow && mainWindow.webContents.openDevTools())
			.catch((error) => console.error(error));
	}
}

assignMenu();

app.on("ready", () => {
	createWindow();
	setupUpdater({ ipcMain, isDev, mainWindow });
	handleSingleInstance({ mainWindow, broadcastURL });
});

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

app.on("open-url", (event, url) => {
	// Protocol handler for osx
	event.preventDefault();
	deeplinkingUrl = url;
	broadcastURL(deeplinkingUrl);
});

app.setAsDefaultProtocolClient("ark", process.execPath, ["--"]);
app.allowRendererProcessReuse = false;

setupPlugins();
