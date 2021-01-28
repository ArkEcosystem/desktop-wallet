import React from "react";
import { render } from "testing-library";

import { PluginCardSkeleton } from "./PluginCardSkeleton";

describe("PluginCardSkeleton", () => {
	it("should render", async () => {
		const { asFragment, findByTestId } = render(<PluginCardSkeleton />);

		expect(await findByTestId("PluginCardSkeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
