import { PluginData } from "./plugin";
import { PluginPermission, PluginSetting } from "./plugin.models";

const manifest1 = {
	name: "test1",
	description: "Test manifest file",
	permissions: ["HTTP"],
	config: {
		urls: ["https://ark.io"],
	},
};

let subject: PluginData;

beforeEach(() => {
	subject = PluginData.make(manifest1, {});
});

it("#hasPermisson", () => {
	expect(subject.hasPermission(PluginPermission.Http)).toEqual(true);
	expect(subject.hasPermission(PluginPermission.Language)).toEqual(false);
});

it("#config", () => {
	expect(subject.config(PluginSetting.URLs)).toEqual(["https://ark.io"]);
});
