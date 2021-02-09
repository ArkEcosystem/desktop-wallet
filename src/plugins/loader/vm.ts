import { NodeVM } from "vm2";

export const runUnknownCode = (code: string, path: string, sandbox: any = {}) =>
	new NodeVM({
		require: {
			context: "sandbox",
			external: {
				modules: ["*"],
				transitive: true,
			},
			mock: {
				react: require("react"),
			},
		},
		sandbox,
	}).run(code, path);
