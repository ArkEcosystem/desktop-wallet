const Page = ({ pluginAPI: pluginAPI }) => {
	const [delegates, setDelegates] = React.useState([]);

	const fetchDelegates = React.useCallback(async () => {
		const result = await pluginAPI.http().get("https://explorer.ark.io/api/delegates");
		setDelegates(result);
	}, [pluginAPI]);

	React.useEffect(async () => {
		fetchDelegates();
	}, []);

	return React.createElement("h1", null, "Total Delegates ", delegates.length);
};

exports.render = Page;
