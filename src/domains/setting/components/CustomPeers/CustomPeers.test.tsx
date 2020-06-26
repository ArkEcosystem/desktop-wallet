import { render } from "@testing-library/react";
import React from "react";

import { CustomPeers } from "./CustomPeers";

describe("CustomPeers", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<CustomPeers isOpen={false} onAddPeer={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment } = render(<CustomPeers isOpen={true} onAddPeer={() => void 0} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
