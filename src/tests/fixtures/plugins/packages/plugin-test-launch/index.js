const React = require("react");
const { Box, Modal } = globalThis.ark.Components;

module.exports = (api) => {
	const App = () => {
		const [isOpen, setIsOpen] = React.useState(false);

		return React.createElement(
			"div",
			null,
			React.createElement("button", { onClick: () => setIsOpen(true) }, isOpen ? "Close" : "Open Modal"),
			React.createElement(
				Modal,
				{ isOpen, onClose: () => setIsOpen(false) },
				React.createElement("h2", {}, "Hello"),
			),
		);
	};

	api.launch().render(
		React.createElement(
			Box,
			{
				className:
					"flex-1 border-t-3 border-theme-success-500 bg-theme-neutral-200 p-10 flex flex-col space-y-3 items-center justify-center",
			},
			React.createElement("h1", { className: "font-semibold text-2xl" }, "My Plugin Page"),
			React.createElement(App),
		),
	);
};
