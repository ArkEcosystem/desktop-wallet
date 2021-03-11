const React = require("react");

module.exports = (api) => {
	const MyButton = (props) =>
		React.createElement("button", {
			...props,
			className: "border-2 p-2 focus:outline-none focus:border-theme-danger-500",
		});

	api.theme().decorate("button", () => MyButton);
};
