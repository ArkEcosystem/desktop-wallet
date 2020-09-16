import React from "react";
import { render } from "utils/testing-library";

import { NetworkIcon } from "./NetworkIcon";

describe("NetworkIcon", () => {
	it("should render network", () => {
		const { getByTestId } = render(<NetworkIcon coin="ARK" network="ark.devnet" />, {});
		expect(getByTestId("NetworkIcon-ARK-devnet")).toHaveAttribute("aria-label", "Ark Devnet");
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
	});

	it("should render placeholder", () => {
		const { queryByTestId } = render(<NetworkIcon coin="TEST" />, {});
		expect(queryByTestId("NetworkIcon__placeholder")).toBeTruthy();
	});
});
