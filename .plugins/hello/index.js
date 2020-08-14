class HelloPlugin {
	activate(pluginAPI) {
		pluginAPI.profile().onDidProfileChange((profile) => {
			console.log(profile.name);
		});
	}
}

module.exports = new HelloPlugin();
