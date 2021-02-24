import { createMemoryHistory } from "history";
import React from "react";
import { act, fireEvent, renderWithRouter } from "utils/testing-library";

import { BackButton } from "./BackButton";
const history = createMemoryHistory();

describe("BackButton", () => {
	it("should render", () => {
		const historySpy = jest.spyOn(history, "go").mockImplementation();

		const { container, getByRole } = renderWithRouter(<BackButton />, { history });

		act(() => {
			fireEvent.click(getByRole("button"));
		});

		expect(historySpy).toHaveBeenCalledWith(-1);

		expect(container).toHaveTextContent("arrow-left.svg");
		expect(container).toMatchSnapshot();

		historySpy.mockRestore();
	});

	it("should render when disabled", () => {
		const historySpy = jest.spyOn(history, "go").mockImplementation();

		const { container, getByRole } = renderWithRouter(<BackButton disabled />, { history });

		act(() => {
			fireEvent.click(getByRole("button"));
		});

		expect(historySpy).not.toHaveBeenCalled();

		expect(container).toHaveTextContent("arrow-left.svg");
		expect(container).toMatchSnapshot();

		historySpy.mockRestore();
	});
});
