import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { PeerListItem } from "./PeerListItem";

describe("PeerListItem", () => {
	it("should render", () => {
		const { container } = render(
			<table>
				<tbody>
					<PeerListItem coin="Bitcoin" />
				</tbody>
			</table>,
		);

		expect(container).toMatchSnapshot();
	});

	it("should trigger onAction callback if provided", () => {
		const onAction = jest.fn();
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { container, getByTestId } = render(
			<table>
				<tbody>
					<PeerListItem coin="Bitcoin" actions={options} onAction={onAction} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
		expect(onAction).toHaveBeenCalled();
	});

	it("should ignore onAction callback if not provided", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { container, getByTestId } = render(
			<table>
				<tbody>
					<PeerListItem coin="Bitcoin" actions={options} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});
});
