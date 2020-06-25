/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { networks } from "../../data";
import { NetworkCard } from "./NetworkCard";

describe("NetworkCard", () => {
	const network = networks[0];

	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<NetworkCard {...network} />);

		expect(container).toBeTruthy();
		expect(getByTestId("network-card--network")).toHaveTextContent(network.network);
		expect(getByTestId("network-card--name")).toHaveTextContent(network.name);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a network card", async () => {
		const onChange = jest.fn();
		const { asFragment, getAllByTestId } = render(<NetworkCard {...network} onChange={onChange} />);

		expect(asFragment()).toMatchSnapshot();

		const networksEl = getAllByTestId(`card-control__network`);
		expect(networksEl.length).toEqual(1);

		await act(async () => {
			fireEvent.click(networksEl[0]);
		});

		expect(onChange).toBeCalledWith(network.name);
	});
});
