import React from "react";
import { render, screen } from "utils/testing-library";

import { ExchangeImage } from "./ExchangeImage";

describe("ExchangeImage", () => {
	it("should render image placeholder", () => {
		const { container } = render(<ExchangeImage />);
		expect(screen.getByTestId("ExchangeImage__placeholder")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render exchange logo", () => {
		const { container } = render(<ExchangeImage logoURL="https://ark.io/logo.png" />);
		expect(screen.getByTestId("ExchangeImage__logo")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
