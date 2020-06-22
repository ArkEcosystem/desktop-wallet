import { render } from "@testing-library/react";
import { Button } from "app/components/Button";
import React from "react";

import { Header } from "./Header";

describe("Header", () => {
	it("should render an header", () => {
		const { container, asFragment, getByTestId } = render(<Header title="Header test" />);

		expect(container).toBeTruthy();
		expect(getByTestId("header__title")).toHaveTextContent("Header test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an header with a subtitle", () => {
		const { container, asFragment, getByTestId } = render(<Header title="Header test" subtitle="Subtitle test" />);

		expect(container).toBeTruthy();
		expect(getByTestId("header__title")).toHaveTextContent("Header test");
		expect(getByTestId("header__subtitle")).toHaveTextContent("Subtitle test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render an header with extra", () => {
		const { container, asFragment, getAllByTestId, getByTestId } = render(
			<Header
				title="Header test"
				subtitle="Subtitle test"
				extra={
					<div className="flex justify-end space-x-3">
						<Button data-testid="header__extra">Extra 1</Button>
						<Button data-testid="header__extra">Extra 2</Button>
					</div>
				}
			/>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("header__title")).toHaveTextContent("Header test");
		expect(getByTestId("header__subtitle")).toHaveTextContent("Subtitle test");
		expect(getAllByTestId("header__extra")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});
});
