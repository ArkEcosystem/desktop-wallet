/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "utils/testing-library";

import { translations } from "../../i18n/common/i18n";
import { Clipboard } from "./Clipboard";

describe("ClipboardIcon", () => {
	beforeAll(() => {
		(navigator as any).clipboard = {
			writeText: jest.fn().mockResolvedValue("test"),
		};
	});

	afterAll(() => {
		(navigator as any).clipboard.writeText.mockRestore();
	});

	it("should change the tooltip content when clicked", async () => {
		const { baseElement, getByTestId } = render(
			<Clipboard variant="icon" data="">
				<span>Hello!</span>
			</Clipboard>,
		);

		act(() => {
			fireEvent.mouseEnter(getByTestId("clipboard-icon__wrapper"));
		});

		expect(baseElement).toHaveTextContent(translations.CLIPBOARD.TOOLTIP_TEXT);
		expect(baseElement).not.toHaveTextContent(translations.CLIPBOARD.SUCCESS);

		await act(async () => {
			fireEvent.click(getByTestId("clipboard-icon__wrapper"));
		});

		expect(baseElement).not.toHaveTextContent(translations.CLIPBOARD.TOOLTIP_TEXT);
		expect(baseElement).toHaveTextContent(translations.CLIPBOARD.SUCCESS);
	});
});
