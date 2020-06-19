import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { peers } from "../../data";
import { PeerList } from "./PeerList";

describe("PeerList", () => {
	it("should render", () => {
		const { container, asFragment } = render(<PeerList peers={peers} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty peer list", () => {
		const { container, asFragment } = render(<PeerList peers={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should add peer", () => {
		const { container, asFragment, getByTestId, queryByText } = render(<PeerList peers={peers} />);

		act(() => {
			fireEvent.click(getByTestId("peer-list__add-button"));
		});

		expect(container).toBeTruthy();
		expect(getByTestId("modal__inner")).toHaveTextContent("Custom Peers");
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(queryByText(/Custom Peers/i)).not.toBeInTheDocument();
	});
});
