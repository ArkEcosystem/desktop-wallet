import { render } from "@testing-library/react";
import React from "react";

import { SelectAsset } from "./SelectAsset";

describe("SelectAsset", () => {
	it("should render", () => {
		const { container } = render(<SelectAsset />);
		expect(container).toMatchSnapshot();
	});
});
