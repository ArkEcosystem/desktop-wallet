import React from "react";
import { act, fireEvent, render } from "utils/testing-library";

import { LedgerWaitingApp } from "./LedgerWaitingApp";

describe("LedgerWaitingApp", () => {
	it("should call the onClose callback if given", () => {
		const onClose = jest.fn();

		const { getByTestId } = render(<LedgerWaitingApp isOpen={true} coinName="ARK" onClose={onClose} />);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(onClose).toHaveBeenCalled();
	});
});
