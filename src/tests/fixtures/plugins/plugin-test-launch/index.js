const React = require("react");

module.exports = (api) => {
	api.launch().render(
		React.createElement(
			ark.Components.Box,
			{
				className:
					"flex-1 border-t-3 border-theme-success-500 bg-theme-neutral-200 p-10 flex items-center justify-center",
			},
			React.createElement("h1", { className: "font-semibold text-2xl" }, "My Plugin Page"),
		),
	);
};
