import MockDate from "mockdate";
import { env } from "./src/utils/testing-library";

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
