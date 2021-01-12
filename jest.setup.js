import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";

jest.mock("@ledgerhq/hw-transport-node-hid-singleton", () => {
	const { createTransportReplayer } = require("@ledgerhq/hw-transport-mocker");
	return createTransportReplayer();
});

jest.mock("electron", () => {
	return {
		remote: {
			nativeTheme: {
				shouldUseDarkColors: true,
				themeSource: "system",
			},
			getCurrentWindow: () => ({
				setContentProtection: jest.fn(),
			}),
			app: {
				isPackaged: true,
			},
		},
	};
});

beforeAll(async () => {
	await env.verify();
	await env.boot();
});

beforeEach(() => {
	MockDate.set(new Date("2020-07-01T00:00:00.000Z"));
});

afterEach(() => {
	MockDate.reset();
});

afterAll(() => {
	global.gc();
});

window.scrollTo = jest.fn();
