import React from "react";
import { render, screen } from "utils/testing-library";

import { PluginUpdatesConfirmation } from "./PluginUpdatesConfirmation";

describe("Plugin Updates Confirmation", () => {
	it("should render", () => {
		render(<PluginUpdatesConfirmation isOpen plugins={[]} />);
		screen.debug();
	});
});
