import React from "react";
import { render, screen } from "utils/testing-library";

import { PluginUpdatesConfirmation } from "./PluginUpdatesConfirmation";

describe("Plugin Updates Confirmation", () => {
	const plugins = [
		{
			title: "ARK Explorer",
			isOfficial: true,
			logo: "https://ark.io/logo.png",
			minimumVersion: "3.0.5",
		},
		{
			title: "Animal Avatars",
			isGrant: true,
			minimumVersion: "3.1.0",
		},
	];

	it("should render", () => {
		const { container } = render(<PluginUpdatesConfirmation isOpen plugins={plugins} />);

		expect(screen.getAllByRole("row")).toHaveLength(3);
		expect(screen.getByText("ARK Explorer")).toBeInTheDocument();
		expect(screen.getByText("3.1.0")).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});
});
