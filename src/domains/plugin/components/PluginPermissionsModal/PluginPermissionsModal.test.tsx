import React from "react";
import { render, screen } from "utils/testing-library";

import { PluginPermissionsModal } from "./PluginPermissionsModal";

describe("Plugin Permissions", () => {
	it("should render", () => {
		const { container } = render(<PluginPermissionsModal permissions={["PROFILE", "EVENTS"]} isOpen />);
		expect(screen.queryAllByRole("listitem")).toHaveLength(2);
		expect(screen.queryByText("EVENTS")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
