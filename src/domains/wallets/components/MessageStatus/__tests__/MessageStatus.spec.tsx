import React from "react";
import { render } from "@testing-library/react";

import { MessageStatus } from "../";

describe("MessageStatus", () => {
	it("should render empty since is close", () => {
		const { container, asFragment } = render(
			<MessageStatus template="VerifyMessage" type="success" isOpen={false} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a success verify status", () => {
		const { container, asFragment } = render(
			<MessageStatus template="VerifyMessage" type="success" isOpen={true} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
