import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Table } from "../Table";
import { act } from "react-dom/test-utils";

describe("Table", () => {
	const data = [
		{
			col1: "column 1",
			col2: "column 2",
		},
	];

	const columns = [
		{
			Header: "Header 1",
			accessor: "col1",
		},
		{
			Header: "Header 2",
			accessor: "col2",
		},
	];

	it("should render", () => {
		const { container } = render(
			<Table columns={columns} data={data}>
				{() => (
					<tr>
						<td>1</td>
						<td>2</td>
					</tr>
				)}
			</Table>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render empty rows if template not provided", () => {
		const { container } = render(<Table columns={columns} data={data} />);
		expect(container).toMatchSnapshot();
	});

	it("should change sort order on th click", () => {
		const { getByTestId } = render(<Table columns={columns} data={data} />);
		const th = getByTestId("table__th--0");
		act(() => {
			fireEvent.click(th);
		});

		expect(getByTestId("table__ArrowUp")).toBeTruthy();

		act(() => {
			fireEvent.click(th);
		});

		expect(getByTestId("table__ArrowDown")).toBeTruthy();
	});
});
