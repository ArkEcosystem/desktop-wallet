import { translations } from "domains/setting/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { peers } from "../../data";
import { PeerTable } from "./PeerTable";

describe("PeerList", () => {
	it("should render", () => {
		const { container, asFragment } = render(<PeerTable peers={peers} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty peer list", () => {
		const { container, asFragment } = render(<PeerTable peers={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should add peer", () => {
		const { container, asFragment, getByTestId, queryByText } = render(<PeerTable peers={peers} />);

		act(() => {
			fireEvent.click(getByTestId("peer-list__add-button"));
		});

		expect(container).toBeTruthy();
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CUSTOM_PEER.TITLE);
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(queryByText(translations.MODAL_CUSTOM_PEER.TITLE)).not.toBeInTheDocument();
	});
});
