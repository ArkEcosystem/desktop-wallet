import React from "react";
import { fireEvent, render, screen, waitFor } from "utils/testing-library";

import { PluginInfo } from "./PluginInfo";

describe("PluginInfo", () => {
	it("should render properly", () => {
		const about = "Testing About text content";
		const permissions = ["PROFILE", "EVENTS"];

		const { asFragment, getByTestId, getAllByTestId } = render(
			<PluginInfo description={about} permissions={permissions} images={["https://ark.io/screenshot.png"]} />,
		);

		expect(getByTestId("plugin-info__about")).toHaveTextContent(about);
		expect(getByTestId("plugin-info__screenshots--pagination")).toBeTruthy();
		expect(getAllByTestId("plugin-info__screenshot")).toHaveLength(1);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without permissions", () => {
		const about = "Testing About text content";

		const { asFragment, queryByTestId } = render(<PluginInfo description={about} permissions={[]} />);

		expect(queryByTestId("plugin-info__permissions")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not show the view permissions button with text less than 50 chars", () => {
		const permissions = ["EVENTS"];

		const { asFragment, queryByTestId } = render(<PluginInfo permissions={permissions} />);

		expect(queryByTestId("plugin-info__view-permissions")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open and close the plugin permissions modal", async () => {
		const permissions = ["EVENTS", "PROFILE", "CUSTOM_PERMISSION"];

		const { asFragment, getByTestId, queryByTestId } = render(<PluginInfo permissions={permissions} />);

		fireEvent.click(getByTestId("plugin-info__view-permissions"));

		await waitFor(() => expect(queryByTestId("PluginPermissionsModal")).toBeInTheDocument());

		fireEvent.click(getByTestId("modal__close-btn"));

		await waitFor(() => expect(queryByTestId("PluginPermissionsModal")).not.toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with minimum version", () => {
		const { container } = render(<PluginInfo minimumVersion={"3.0.1"} />);

		expect(screen.getByTestId("plugin-info__mininum-version")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
