import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";
import { migrateProfileFixtures, restoreProfileTestPassword } from "migrations";
import TestingPasswords from "tests/fixtures/env/testing-passwords.json";

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
	migrateProfileFixtures(env);

	await env.verify();
	await env.boot();

	for (const profile of env.profiles().values()) {
		try {
			await profile.restore(TestingPasswords?.profiles[profile.id()]?.password);
			restoreProfileTestPassword(profile);
		} catch (error) {
			throw new Error(`Restoring of profile [${profile.id}] failed. Reason: ${error}`);
		}

		// Mark profiles as restored, to prevent multiple restoration in profile synchronizer
		process.env.TEST_PROFILES_RESTORE_STATUS = "restored";
	}
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
