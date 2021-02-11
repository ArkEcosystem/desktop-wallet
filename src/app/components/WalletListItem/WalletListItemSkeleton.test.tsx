import React from "react";
import { render } from "utils/testing-library";

import { WalletListItemSkeleton } from "./WalletListItemSkeleton";

describe("WalletListItemSkeleton", () => {
	it("should render wallet list skeleton", () => {
		const { container, getByTestId } = render(
			<table>
				<tbody data-testid="WalletListSkeleton">
					<WalletListItemSkeleton />
				</tbody>
			</table>,
		);

		expect(getByTestId("WalletListSkeleton")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
