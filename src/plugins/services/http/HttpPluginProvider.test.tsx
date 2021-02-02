import { PluginManager } from "plugins/core";
import React from "react";
import { render } from "utils/testing-library";

import { HttpPluginProvider } from "./HttpPluginProvider";

describe("HttpPluginProvider", () => {
	it("should render properly", () => {
		const pluginManager = new PluginManager();
		const { container } = render(
			<HttpPluginProvider manager={pluginManager}>
				<div>Test</div>
			</HttpPluginProvider>,
		);

		expect(container).toMatchSnapshot();
	});
});
