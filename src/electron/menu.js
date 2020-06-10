/* eslint-disable @typescript-eslint/no-var-requires */
const { Menu, shell } = require("electron");
const aboutWindow = require("about-window").default;
const path = require("path");
const packageJson = require("../../package.json");

const isProduction = process.env.NODE_ENV === "production";

const latestReleaseUrl = () => {
	const [, project] = packageJson.repository.url.match(/github.com\/(.*)\.git$/);
	return `https://github.com/${project}/releases/latest`;
};

module.exports = function () {
	const about = {
		label: "About",
		click: () =>
			aboutWindow({
				adjust_window_size: true,
				icon_path: isProduction
					? path.resolve(__dirname, "./static/128x128.png")
					: path.resolve(__dirname, "../app/assets/icons/128x128.png"),
				copyright: [
					`<p style="text-align: center">Distributed under ${packageJson.license} license</p>`,
					'<p>Flag icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">flaticon.com</a> are licensed by <a href="https://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></p>',
				],
				package_json_dir: path.resolve(__dirname, "../../"),
				css_path: isProduction ? path.resolve(__dirname, "styles.css") : null,
				use_inner_html: true,
			}),
	};

	const template = [
		{
			label: "File",
			submenu: [{ role: "quit" }],
		},
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ role: "pasteandmatchstyle" },
				{ role: "delete" },
				{ role: "selectall" },
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggledevtools" },
				{ type: "separator" },
				{ role: "resetzoom" },
				{ role: "zoomin" },
				{ role: "zoomout" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			role: "window",
			submenu: [{ role: "minimize" }, { role: "close" }],
		},
		{
			role: "help",
			submenu: [
				{
					label: "Learn More",
					click() {
						shell.openExternal("https://ark.io");
					},
				},
				{
					label: `Version ${packageJson.version}`,
					click() {
						shell.openExternal(latestReleaseUrl());
					},
				},
			],
		},
	];

	if (process.platform === "darwin") {
		// File menu
		template[0] = {
			role: "appMenu",
			label: packageJson.build.productName,
			submenu: [
				about,
				{ type: "separator" },
				{ type: "separator" },
				{ role: "services", submenu: [] },
				{ type: "separator" },
				{
					label: "Hide",
					role: "hide",
				},
				{ role: "hideothers" },
				{ role: "unhide" },
				{ type: "separator" },
				{
					label: "Quit",
					role: "quit",
				},
			],
		};

		// Edit menu
		template[1].submenu.push(
			{ type: "separator" },
			{
				label: "Speech",
				submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
			},
		);

		// Window menu
		template[3].submenu = [
			{ role: "close" },
			{ role: "minimize" },
			{ role: "zoom" },
			{ type: "separator" },
			{ role: "front" },
		];
	} else {
		template[4].submenu.unshift(about, { type: "separator" });
	}

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
