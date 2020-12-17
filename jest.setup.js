import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

jest.mock("@ledgerhq/hw-transport-node-hid-singleton", () => {
	const { createTransportReplayer } = require("@ledgerhq/hw-transport-mocker");
	return createTransportReplayer();
});

beforeAll(async () => {
	await migrateProfiles(env, fixtureData.profiles);
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
