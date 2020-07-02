import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fireEvent, render } from "testing-library";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
	beforeAll(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	afterAll(() => {
		console.error.mockRestore();
	});

	it("should render", () => {
		const { container } = render(<Spinner />);

		expect(container).toMatchSnapshot();
	});

	it("should render if something went wrong", () => {
		const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
			return (
				<div role="alert">
					<p>Something went wrong: </p>
					<pre>{error.message}</pre>
					<button onClick={resetErrorBoundary}>Try again?</button>
				</div>
			);
		};

		const { rerender, getByText, queryByText, getByRole, queryByRole } = render(
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Spinner color="foo" />
			</ErrorBoundary>,
		);

		expect(console.error).toHaveBeenCalledTimes(2);

		expect(getByRole("alert").textContent).toMatchInlineSnapshot(
			`"Something went wrong: Failed to find a color for \\"foo\\"Try again?"`,
		);

		console.error.mockClear();

		rerender(
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Spinner color="primary" />
			</ErrorBoundary>,
		);

		fireEvent.click(getByText(/try again/i));

		expect(console.error).not.toHaveBeenCalled();
		expect(queryByRole("alert")).not.toBeInTheDocument();
		expect(queryByText(/try again/i)).not.toBeInTheDocument();
	});

	it("should render a primary color", () => {
		const { container } = render(<Spinner color="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a success color", () => {
		const { container } = render(<Spinner color="success" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a danger color", () => {
		const { container } = render(<Spinner color="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a warning color", () => {
		const { container } = render(<Spinner color="warning" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { container } = render(<Spinner size="small" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Spinner size="large" />);

		expect(container).toMatchSnapshot();
	});
});
