const { NodeVM } = require("vm2");

class PluginVM {
	run(code, path) {
		const vm = new NodeVM({
			require: {
				builtin: ["*"],
				external: true,
			},
		});
		return vm.run(code, path);
	}
}

module.exports.PluginVM = PluginVM;
