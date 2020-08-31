import React from "react";
import { fireEvent } from "testing-library";
import { renderWithRouter } from "utils/testing-library";

import { LinkList } from "./LinkList";

const links = [
	{
		value: "http://github.com/robank",
		type: "github",
	},
	{
		value: "http://gitlab.com/robank",
		type: "gitlab",
	},
	{
		value: "http://bitbucket.com/robank",
		type: "bitbucket",
	},
	{
		value: "http://npmjs.com/robank",
		type: "npm",
	},
];

describe("LinkList", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<LinkList title="Repository" description="Show your projects through the repository" links={links} />,
		);

		expect(getByTestId("LinkList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle open/close of link collection", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<LinkList title="Repository" description="Show your projects through the repository" links={links} />,
		);

		expect(getByTestId("LinkList")).not.toHaveTextContent("http://github.com/robank");

		fireEvent.click(getByTestId("LinkList__header"));

		expect(getByTestId("LinkList")).toHaveTextContent("http://github.com/robank");

		fireEvent.click(getByTestId("LinkList__header"));

		expect(getByTestId("LinkList")).not.toHaveTextContent("http://github.com/robank");

		expect(asFragment()).toMatchSnapshot();
	});
});
