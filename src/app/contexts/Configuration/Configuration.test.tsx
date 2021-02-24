import React from "react";
import { act, fireEvent, render, renderWithRouter, waitFor } from "utils/testing-library";

import { ConfigurationProvider } from "./";
import { useConfiguration } from "./Configuration";

describe("Configuration Context", () => {
	it("should render the wrapper properly", () => {
		const { container, asFragment, getByTestId } = render(
			<ConfigurationProvider>
				<span data-testid="ConfigurationProvider__content">Configuration Provider content</span>
			</ConfigurationProvider>,
		);

		expect(getByTestId("ConfigurationProvider__content")).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should throw without provider", () => {
		jest.spyOn(console, "error").mockImplementation(() => null);
		const Test = () => {
			useConfiguration();
			return <p>Configuration content</p>;
		};

		expect(() => renderWithRouter(<Test />, { withProviders: false })).toThrowError();
		console.error.mockRestore();
	});

	it("should render configuration consumer component", () => {
		const Test = () => {
			useConfiguration();
			return <p data-testid="Configuration__consumer">Configuration content</p>;
		};
		const { getByTestId } = renderWithRouter(<Test />);

		expect(getByTestId("Configuration__consumer")).toBeInTheDocument();
	});

	it("should update configuration", async () => {
		const Test = () => {
			const { dashboard, setConfiguration } = useConfiguration();
			return (
				<div
					data-testid="Configuration__consumer"
					onClick={() => setConfiguration({ dashboard: { viewType: "list" } })}
				>
					Configuration content
					{dashboard && dashboard.viewType === "list" && <div data-testid="Configuration__list" />}
				</div>
			);
		};

		const { getByTestId, asFragment } = renderWithRouter(<Test />);
		expect(getByTestId("Configuration__consumer")).toBeInTheDocument();
		await waitFor(() => expect(() => getByTestId("Configuration__list")).toThrowError(/Unable to find/));

		act(() => {
			fireEvent.click(getByTestId("Configuration__consumer"));
		});

		await waitFor(() => expect(getByTestId("Configuration__list")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();
	});
});
