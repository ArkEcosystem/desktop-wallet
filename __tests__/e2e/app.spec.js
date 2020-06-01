import packageJson from "@package.json";
import { startApp, stopApp } from "@setup";

let app;

describe("App", () => {
	beforeAll(async () => (app = await startApp()));
	afterAll(() => stopApp(app));

	describe("Window", () => {
		it("shows the proper application title", async () => {
			const title = await app.client.getTitle();
			expect(title.toLowerCase()).toContain(packageJson.build.productName.toLowerCase());
		});
	});

	describe("ProfileWelcome", () => {
		it("click on create profile button", async () => {
			const buttonText = await app.client.getText(".button-secondary");
			expect(buttonText).toEqual("Create Profile");

			await app.client.click(".button-secondary").pause(200);

			const headline = await app.client.getText("div");
			expect(headline).toContain("Create a new Profile or login with your MarketSquare account to get started.");
		});
	});
});
