import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { PaginationSearch } from "./PaginationSearch";

describe("PaginationSearch", () => {
	it("should render", async () => {
		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={jest.fn()} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show search icon on hover", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.mouseEnter(getByTestId("PaginationSearchButton"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearch__toggle-open")).toBeInTheDocument());

		act(() => {
			fireEvent.mouseLeave(getByTestId("PaginationSearchButton"));
		});

		await waitFor(() => expect(() => getByTestId("PaginationSearch__toggle-open")).toThrow());
	});

	it("should show pagination search input", async () => {
		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={jest.fn()} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());
	});

	it("should show search input and close", async () => {
		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={jest.fn()} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__cancel"));
		});

		await waitFor(() => expect(() => getByTestId("PaginationSearchForm")).toThrow());
	});

	it("should type page and emit onSelectPage event", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.input(getByTestId("PaginationSearch__input"), {
				target: {
					value: "1",
				},
			});

			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearch__input")).toHaveValue(1));

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(onSelect).toHaveBeenCalledWith(1));
	});

	it("should not allow typing number greater than total pages", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.input(getByTestId("PaginationSearch__input"), {
				target: {
					value: "6",
				},
			});

			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearch__input")).toHaveValue(5));

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(onSelect).toHaveBeenCalledWith(5));
	});

	it("should not emit onSelect if nothing is typed", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(onSelect).not.toHaveBeenCalled());
	});

	it("should not emit onSelect if zero is typed", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect} totalPages={5}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.input(getByTestId("PaginationSearch__input"), {
				target: {
					value: "0",
				},
			});

			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearch__input")).toHaveValue(0));

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(onSelect).not.toHaveBeenCalled());
	});

	it("should not limit total page if not provided", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<PaginationSearch onSelectPage={onSelect}>
				<span data-testid="PaginationSearchToggle">...</span>
			</PaginationSearch>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.input(getByTestId("PaginationSearch__input"), {
				target: {
					value: "100000000",
				},
			});

			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearch__input")).toHaveValue(100000000));

		act(() => {
			fireEvent.click(getByTestId("PaginationSearch__submit"));
		});

		await waitFor(() => expect(onSelect).toHaveBeenCalledWith(100000000));
	});

	it("shoucd close search input if clicked outside", async () => {
		const onSelect = jest.fn();

		const { asFragment, getByTestId } = render(
			<div>
				<div data-testid="somewhere-outside" className="p-4">
					sample text
				</div>
				<PaginationSearch onSelectPage={onSelect}>
					<span data-testid="PaginationSearchToggle">...</span>
				</PaginationSearch>
				,
			</div>,
		);

		await waitFor(() => expect(getByTestId("PaginationSearchToggle")).toBeInTheDocument());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("PaginationSearchToggle"));
		});

		await waitFor(() => expect(getByTestId("PaginationSearchForm")).toBeInTheDocument());

		act(() => {
			fireEvent.mouseDown(getByTestId("somewhere-outside"));
		});

		await waitFor(() => expect(() => getByTestId("PaginationSearchForm")).toThrow());
	});
});
