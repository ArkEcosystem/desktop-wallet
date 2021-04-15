import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";
import fixtureData from "tests/fixtures/env/storage.json";

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
	await env.verify();
	await env.boot();

	env.profiles().fill(fixtureData.profiles);
	env.profiles()
		.values()
		.forEach((profile) => {
			const profileData = fixtureData.profiles[profile.id()];

			profile.peers().fill(profileData.peers);
			profile.plugins().fill(profileData.plugins);
			profile.data().fill(profileData.data);
			profile.settings().fill(profileData.settings);
			profile.notifications().fill(profileData.notifications);
			profile.contacts().fill(profileData.contacts);
			profile.wallets().fill(profileData.wallets);

			profile.save();
		});

	for (const profile of env.profiles().values()) {
		await profile.restore();
		if (TestingPasswords?.profiles[profile.id()]?.password) {
			profile.auth().setPassword(TestingPasswords?.profiles[profile.id()]?.password);
		}
	}

	await env.persist();
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
