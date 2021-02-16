import React from "react";
import { render, screen } from "utils/testing-library";

import { PluginInfo } from "./PluginInfo";

describe("PluginInfo", () => {
	it("should render properly", () => {
		const about = "Testing About text content";
		const permissions = ["Embedded Webpages", "API Requests", "Access to Profiles"];

		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginInfo description={about} permissions={permissions} images={["https://ark.io/screenshot.png"]} />,
		);

		expect(getByTestId("plugin-info__about")).toHaveTextContent(about);
		expect(getByTestId("plugin-info__permissions")).toHaveTextContent(permissions.join(", "));
		expect(getByTestId("plugin-info__screenshots--pagination")).toBeTruthy();
		expect(getAllByTestId("plugin-info__screenshot")).toHaveLength(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without permissions", () => {
		const about = "Testing About text content";

		const { asFragment, getByTestId, queryByTestId } = render(<PluginInfo description={about} permissions={[]} />);

		expect(queryByTestId("plugin-info__permissions")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with minimum version", () => {
		const { container } = render(<PluginInfo minimumVersion={"3.0.1"} />);

		expect(screen.getByTestId("plugin-info__mininum-version")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
