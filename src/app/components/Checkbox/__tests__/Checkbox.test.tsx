import React from "react";
import { render } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { Checkbox } from "../Checkbox";

describe("Checkbox", () => {
	beforeAll(() => {
		jest.spyOn(console, "error").mockImplementation(() => null);
	});

	it("should render", () => {
		const { container } = render(<Checkbox />);

		expect(container).toMatchSnapshot();
	});

	it("should render if something went wrong", () => {
		const ErrorFallback = ({ error }: any) => {
			return (
				<div role="alert">
					<p>Something went wrong: </p>
					<pre>{error.message}</pre>
				</div>
			);
		};

		const { getByRole } = render(
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Checkbox color="foo" />
			</ErrorBoundary>,
		);

		expect(getByRole("alert").textContent).toMatchInlineSnapshot(
			`"Something went wrong: Failed to find a color for \\"foo\\""`,
		);
	});

	it("should render a primary color", () => {
		const { container } = render(<Checkbox color="primary" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a success color", () => {
		const { container } = render(<Checkbox color="success" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a danger color", () => {
		const { container } = render(<Checkbox color="danger" />);

		expect(container).toMatchSnapshot();
	});

	it("should render a warning color", () => {
		const { container } = render(<Checkbox color="warning" />);

		expect(container).toMatchSnapshot();
	});
});
