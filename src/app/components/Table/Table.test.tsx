import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, within } from "testing-library";

import { Table } from "./Table";

const data = [
	{
		col1: "column 1",
		col2: "column 2",
		col3: "column 3",
	},
];

const columns = [
	{
		Header: "Header 1",
		accessor: "col1",
		minimumWidth: true,
		className: "flex-row-reverse",
	},
	{
		Header: "Header 2",
		accessor: "col2",
		className: "no-border",
	},
	{
		Header: "Header 3",
		accessor: "col3",
		className: "justify-end",
	},
];

describe("Table", () => {
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
		const { getAllByRole, getByRole } = render(<Table columns={columns} data={data} />);

		const th = getAllByRole("columnheader")[0];

		act(() => {
			fireEvent.click(th);
		});

		expect(th).toHaveTextContent("chevron-down.svg");

		expect(within(th).getByRole("img")).toHaveClass("rotate-180");

		act(() => {
			fireEvent.click(th);
		});

		expect(within(th).getByRole("img")).not.toHaveClass("rotate-180");
	});

	it("should hide header", () => {
		const { queryAllByRole } = render(<Table hideHeader columns={columns} data={data} />);
		expect(queryAllByRole("columnheader")).toHaveLength(0);
	});

	it("should render with width class applied to column header", () => {
		const { getByTestId } = render(
			<Table
				columns={[
					{
						Header: "Header 1",
						cellWidth: "width",
					},
				]}
				data={data}
			/>,
		);

		expect(getByTestId("table__th--0")).toHaveClass("width");
	});
});
