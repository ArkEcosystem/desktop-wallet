import { assetMixins } from "./assets";

it("should load an image from the local assets", () => {
	expect(assetMixins.methods.loadImageFromAssets("ark-logo.png")).toBeString();
});
