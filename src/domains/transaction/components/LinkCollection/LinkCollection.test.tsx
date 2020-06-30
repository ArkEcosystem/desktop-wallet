import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { LinkCollection } from "./LinkCollection";

const types = [
	{
		label: "Facebook",
		value: "facebook",
	},
	{
		label: "Twitter",
		value: "twitter",
	},
	{
		label: "Instagram",
		value: "instagram",
	},
];

describe("LinkCollection", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				typeName="media"
			/>,
		);

		expect(getByTestId("LinkCollection")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle open/close of link collection", () => {
		const { asFragment, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				typeName="social media"
			/>,
		);

		expect(getByTestId("LinkCollection")).not.toHaveTextContent("Add social media");

		fireEvent.click(getByTestId("LinkCollection__header"));

		expect(getByTestId("LinkCollection")).toHaveTextContent("Add social media");

		fireEvent.click(getByTestId("LinkCollection__header"));

		expect(getByTestId("LinkCollection")).not.toHaveTextContent("Add social media");

		expect(asFragment()).toMatchSnapshot();
	});

	it("should add and remove links", () => {
		const { asFragment, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				typeName="media"
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));
		fireEvent.click(getByTestId("select-dropdown__toggle"));
		fireEvent.click(getByTestId("select-dropdown__option-1"));
		fireEvent.change(getByTestId("LinkCollection__input-link"), {
			target: {
				value: "testing link",
			},
		});
		fireEvent.click(getByTestId("LinkCollection__add-link"));

		expect(getByTestId("LinkCollection")).toHaveTextContent("twitter");
		expect(getByTestId("LinkCollection")).toHaveTextContent("testing link");

		fireEvent.click(getByTestId("LinkCollection__remove-link"));

		expect(getByTestId("LinkCollection")).not.toHaveTextContent("twitter");
		expect(getByTestId("LinkCollection")).not.toHaveTextContent("testing link");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a specific link type", () => {
		const { asFragment, getAllByTestId, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				data={[{ link: "testing link", type: "twitter" }]}
				typeName="media"
				selectionTypes={["twitter"]}
				selectionTypeTitle="Primary"
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));
		fireEvent.click(getAllByTestId("LinkCollection__selected")[0]);

		expect(getByTestId("LinkCollection")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
