import { render } from "@testing-library/react";
import React from "react";

import { peers } from "../../data";
import { PeerList } from "./PeerList";

describe("PeerList", () => {
	it("should render", () => {
		const { container } = render(<PeerList peers={peers} />);

		expect(container).toMatchSnapshot();
	});

	it("should render with empty peer list", () => {
		const { container } = render(<PeerList peers={[]} />);

		expect(container).toMatchSnapshot();
	});
});
