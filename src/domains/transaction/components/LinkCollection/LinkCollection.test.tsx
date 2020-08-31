import React from "react";
import { act, fireEvent, render } from "testing-library";

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
		const onChange = jest.fn();
		const { asFragment, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				typeName="media"
				onChange={onChange}
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));

		const toggle = getByTestId("select-list__toggle-button");

		act(() => {
			fireEvent.click(toggle);
		});
		const firstOption = getByTestId("select-list__toggle-option-1");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(getByTestId("select-list__input")).toHaveValue("twitter");

		const linkField = getByTestId("LinkCollection__input-link");
		act(() => {
			fireEvent.change(linkField, {
				target: {
					value: "testing link",
				},
			});
		});

		expect(linkField).toHaveValue("testing link");

		act(() => {
			fireEvent.click(getByTestId("LinkCollection__add-link"));
		});

		expect(onChange).toHaveBeenCalledWith([{ value: "testing link", type: "twitter" }]);
		expect(getByTestId("LinkCollection")).toHaveTextContent("Twitter");
		expect(getByTestId("LinkCollection")).toHaveTextContent("testing link");

		fireEvent.click(getByTestId("LinkCollection__remove-link"));

		expect(onChange).toHaveBeenCalledWith([]);
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
				data={[
					{ value: "testing link", type: "twitter" },
					{ value: "testing link 2", type: "facebook" },
				]}
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
