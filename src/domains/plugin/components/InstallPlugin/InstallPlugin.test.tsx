/* eslint-disable @typescript-eslint/require-await */

import { act } from "@testing-library/react-hooks";
import { PluginManager, PluginManagerProvider } from "plugins";
import React from "react";
import { fireEvent, render, RenderResult, waitFor } from "utils/testing-library";

import { InstallPlugin } from "./InstallPlugin";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

describe("InstallPlugin", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<PluginManagerProvider manager={new PluginManager()} services={[]}>
				<InstallPlugin isOpen={false} />
			</PluginManagerProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 1st step", async () => {
		const { getByTestId, asFragment } = render(
			<FirstStep plugin={{ permissions: ["PROFILE", "EVENTS", "HTTP"] }} />,
		);

		expect(getByTestId("InstallPlugin__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2st step", async () => {
		const { getByTestId, asFragment } = render(<SecondStep />);

		expect(getByTestId("InstallPlugin__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3st step", async () => {
		const { getByTestId, asFragment } = render(<ThirdStep />);

		expect(getByTestId("InstallPlugin__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.skip("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<InstallPlugin isOpen={true} />);
			await waitFor(() => expect(rendered.getByTestId(`InstallPlugin__step--first`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const downloadButton = getByTestId(`InstallPlugin__download-button`);

			// Navigation between steps
			fireEvent.click(downloadButton);
			expect(getByTestId(`InstallPlugin__step--second`)).toBeTruthy();

			const continueButton = getByTestId(`InstallPlugin__continue-button`);

			fireEvent.click(continueButton);
			expect(getByTestId(`InstallPlugin__step--third`)).toBeTruthy();

			// Back
			fireEvent.click(getByTestId(`InstallPlugin__cancel-button`));
			expect(getByTestId(`InstallPlugin__step--second`)).toBeTruthy();
		});
	});
});
