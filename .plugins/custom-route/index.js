const React = require("react");

const Page = () => {
	return React.createElement(
		"h1",
		{
			className: "text-2xl font-semibold",
		},
		"My Custom Route",
	);
};

module.exports = {
	registerRoutes() {
		return [
			{
				path: "/custom-route",
				component: Page,
			},
		];
	},
};
