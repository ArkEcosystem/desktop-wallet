import React from "react";
import { render } from "testing-library";

import { assets } from "../../data";
import { AddAssets } from "./AddAssets";

const allAssets = [...Array(27)].map(() => "ARK");

describe("AddAssets", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<AddAssets isOpen={false} onUpdate={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment } = render(
			<AddAssets selectedAssets={assets} allAssets={allAssets} isOpen={true} onUpdate={() => void 0} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
