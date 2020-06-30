import React from "react";
import { fireEvent, render } from "test-utils";

import { LinkList } from "./LinkList";

const links = [
	{
		link: "http://github.com/robank",
		type: "github",
	},
	{
		link: "http://gitlab.com/robank",
		type: "gitlab",
	},
	{
		link: "http://bitbucket.com/robank",
		type: "bitbucket",
	},
	{
		link: "http://npmjs.com/robank",
		type: "npm",
	},
];

describe("LinkList", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<LinkList title="Repository" description="Show your projects through the repository" links={links} />,
		);

		expect(getByTestId("LinkList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle open/close of link collection", () => {
		const { asFragment, getByTestId } = render(
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
