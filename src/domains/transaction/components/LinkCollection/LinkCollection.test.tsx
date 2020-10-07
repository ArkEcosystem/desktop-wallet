/* eslint-disable @typescript-eslint/require-await */
import { waitFor } from "@testing-library/react";
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { LinkCollection } from "./LinkCollection";

const types = [
	{
		label: "Facebook",
		value: "facebook",
		validate: jest.fn(() => true),
	},
	{
		label: "Twitter",
		value: "twitter",
		validate: jest.fn(() => true),
	},
	{
		label: "Instagram",
		value: "instagram",
		validate: jest.fn(() => true),
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

	it("should toggle open/close link collection", () => {
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

	it("should add links", async () => {
		const onChange = jest.fn();

		const { asFragment, getAllByTestId, getByTestId } = render(
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

		await act(async () => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("LinkCollection__add-link")).toBeDisabled();
		expect(getByTestId("LinkCollection__input-link")).toBeDisabled();

		const firstOption = getByTestId("select-list__toggle-option-1");
		expect(firstOption).toBeTruthy();

		await act(async () => {
			fireEvent.click(firstOption);
		});

		expect(getByTestId("select-list__input")).toHaveValue("twitter");

		await waitFor(() => expect(getByTestId("LinkCollection__input-link")).toBeEnabled());

		const value = "https://twitter.com/arkecosystem";

		await act(async () => {
			fireEvent.input(getByTestId("LinkCollection__input-link"), {
				target: {
					value,
				},
			});
		});

		await waitFor(() => expect(getByTestId("LinkCollection__add-link")).toBeEnabled());

		await act(async () => {
			fireEvent.click(getByTestId("LinkCollection__add-link"));
		});

		await waitFor(() => expect(onChange).toHaveBeenCalledWith([{ value, type: "twitter" }]));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove links", async () => {
		const onChange = jest.fn();

		const data = [{ type: "twitter", value: "https//twitter.com/arkecosystem" }];

		const { asFragment, getAllByTestId, getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={types}
				data={data}
				typeName="media"
				onChange={onChange}
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));

		expect(() => getAllByTestId("LinkCollection__item").toHaveLength(1));

		expect(getByTestId("LinkCollection__item")).toHaveTextContent("Twitter");
		expect(getByTestId("LinkCollection__item")).toHaveTextContent(data[0].value);

		fireEvent.click(getByTestId("LinkCollection__remove-link"));
		expect(onChange).toHaveBeenCalledWith([]);

		expect(() => getByTestId("LinkCollection__item")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger validation before adding a link", async () => {
		const onChange = jest.fn();
		const validate = jest.fn(() => false);

		const { getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={[
					{
						label: "TestEntity",
						value: "test-entity",
						validate,
					},
				]}
				typeName="media"
				onChange={onChange}
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));

		const toggle = getByTestId("select-list__toggle-button");

		await act(async () => {
			fireEvent.click(toggle);
		});

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-option-0"));
		});

		act(() => {
			fireEvent.input(getByTestId("LinkCollection__input-link"), {
				target: {
					value: "invalid link",
				},
			});
		});

		await waitFor(() => expect(validate).toHaveBeenCalledWith("invalid link"));
	});

	it("should trigger validation when changing the type", async () => {
		const onChange = jest.fn();

		const { getByTestId } = render(
			<LinkCollection
				title="Social Media"
				description="Tell people more about yourself through social media"
				types={[
					{
						label: "TestEntity 1",
						value: "test-entity-1",
						validate: jest.fn(() => true),
					},
					{
						label: "TestEntity 2",
						value: "test-entity-2",
						validate: jest.fn(() => false),
					},
				]}
				typeName="media"
				onChange={onChange}
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));

		const toggle = getByTestId("select-list__toggle-button");

		await act(async () => {
			fireEvent.click(toggle);
		});

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-option-0"));
		});

		const input = getByTestId("LinkCollection__input-link");
		const button = getByTestId("LinkCollection__add-link");

		act(() => {
			fireEvent.input(input, {
				target: {
					value: "invalid link",
				},
			});
		});

		await waitFor(() => expect(input).toBeValid());
		expect(button).toBeEnabled();

		await act(async () => {
			fireEvent.click(toggle);
		});

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-option-1"));
		});

		await waitFor(() => expect(input).toBeInvalid());
		expect(button).toBeDisabled();
	});

	it("should select a specific link type", () => {
		const onChoose = jest.fn();
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
				onChoose={onChoose}
			/>,
		);

		fireEvent.click(getByTestId("LinkCollection__header"));
		fireEvent.click(getAllByTestId("LinkCollection__selected")[0]);

		expect(getByTestId("LinkCollection")).toBeTruthy();
		expect(onChoose).toHaveBeenCalledWith({ type: "twitter", value: "testing link" });
		expect(asFragment()).toMatchSnapshot();
	});
});
