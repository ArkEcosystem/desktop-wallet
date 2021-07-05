import React from "react";
import { render } from "utils/testing-library";

import { NetworkIcon } from "./NetworkIcon";

describe("NetworkIcon", () => {
	it.each([
		["ark.mainnet", "ARK"],
		["ark.devnet", "ARK Devnet"],
	])("should render network (%s)", (network, label) => {
		const { getByTestId } = render(<NetworkIcon coin="ARK" network={network} />, {});

		expect(getByTestId(`NetworkIcon-ARK-${network}`)).toHaveAttribute("aria-label", label);
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
	});

	it("should render placeholder", () => {
		const { queryByTestId } = render(<NetworkIcon coin="TEST" />, {});

		expect(queryByTestId("NetworkIcon__placeholder")).toBeTruthy();
	});

	it("should render network with custom classname", () => {
		const { getByTestId } = render(<NetworkIcon coin="ARK" network="ark.devnet" className="test" />, {});

		expect(getByTestId("NetworkIcon-ARK-ark.devnet")).toHaveAttribute("aria-label", "ARK Devnet");
		expect(getByTestId("NetworkIcon__icon")).toBeTruthy();
	});
});
