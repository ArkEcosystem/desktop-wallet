import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";
import fixtureData from "tests/fixtures/env/storage.json";
import { Base64 } from "@arkecosystem/platform-sdk-crypto";

jest.mock("@ledgerhq/hw-transport-node-hid-singleton", () => {
	const { createTransportReplayer } = require("@ledgerhq/hw-transport-mocker");
	return createTransportReplayer();
});

jest.mock("electron", () => {
	const setContentProtection = jest.fn();

	return {
		ipcMain: {
			handle: jest.fn(),
			invoke: jest.fn(),
			on: jest.fn(),
			removeListener: jest.fn(),
			send: jest.fn(),
		},
		ipcRenderer: {
			handle: jest.fn(),
			invoke: jest.fn(),
			on: jest.fn(),
			removeListener: jest.fn(),
			send: jest.fn(),
		},
		remote: {
			app: {
				isPackaged: true,
			},
			dialog: {
				showOpenDialog: jest.fn(),
				showSaveDialog: jest.fn(),
			},
			getCurrentWindow: () => ({ setContentProtection }),
			nativeTheme: {
				shouldUseDarkColors: true,
				themeSource: "system",
			},
			powerMonitor: {
				getSystemIdleTime: jest.fn(),
			},
		},
		shell: {
			openExternal: jest.fn(),
		},
	};
});

beforeAll(async () => {
	const ids = Object.keys(fixtureData.profiles);
	const profiles = {};

	ids.forEach((id) => {
		profiles[id] = {
			id,
			password: undefined,
			name: fixtureData.profiles[id].settings.NAME,
			data: Base64.encode(JSON.stringify({ id, ...fixtureData.profiles[id] })),
		};
	});

	await env.verify({ profiles });
	await env.boot();

	for (const profile of env.profiles().values()) {
		await profile.restore();

		if (TestingPasswords?.profiles[profile.id()]?.password) {
			profile.auth().setPassword(TestingPasswords?.profiles[profile.id()]?.password);
		}

		profile.save();
		await profile.sync();
	}

	// Mark profiles as restored, to prevent multiple restoration in profile synchronizer
	process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
});

beforeEach(() => {
	MockDate.set(new Date("2020-07-01T00:00:00.000Z"));
});

afterEach(() => {
	MockDate.reset();
});

afterAll(() => {
	if (global.gc) {
		global.gc();
	}
});

window.scrollTo = jest.fn();
