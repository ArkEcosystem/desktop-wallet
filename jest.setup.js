import MockDate from "mockdate";
import { env } from "utils/testing-library";
import { bootEnvWithProfileFixtures } from "utils/test-helpers";

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

jest.mock("fs", () => {
	const fs = jest.requireActual(`fs`);

	return {
		...fs,
		readFileSync: (filepath, encoding) => {
			// Exceptions
			if (filepath === "path/to/sample-export.json") return "";

			// Use actual
			return fs.readFileSync(filepath, encoding);
		},
		writeFileSync: jest.fn(),
	};
});

beforeAll(async () => {
	await bootEnvWithProfileFixtures({ env, shouldRestoreDefaultProfile: true });
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
