import React, { useMemo } from "react";
import { useSortBy, useTable } from "react-table";
import { styled } from "twin.macro";

import { Icon } from "../Icon";
import { defaultTableStyle } from "./Table.styles";

type TableProps = {
	children?: any;
	className?: string;
	data: any[];
	columns: any[];
};

const TableWrapper = styled.div`
	${defaultTableStyle}
`;

export const Table = ({ children, data, columns }: TableProps) => {
	const tableData = useMemo(() => data, [data]);
	const tableColumns = useMemo(() => columns, [columns]);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			data: tableData,
			columns: tableColumns,
		},
		useSortBy,
	);

	const renderChildNode = (data: any, index: number) => {
		if (typeof children === "function") return children(data, index);
		return <tr />;
	};

	const getSortIconName = (isSorted: boolean, isSortedDesc: boolean) => {
		if (isSorted && isSortedDesc) {
			return "ArrowDown";
		}

		if (isSorted && !isSortedDesc) {
			return "ArrowUp";
		}

		return "Sort";
	};

	return (
		<TableWrapper {...getTableProps()}>
			<table className="table-auto">
				<thead>
					{headerGroups.map((headerGroup: any, index: number) => (
						<tr key={index} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any, thIndex: number) => (
								<th
									key={thIndex}
									className="text-sm text-left select-none text-theme-neutral-500"
									data-testid={`table__th--${thIndex}`}
									{...column.getHeaderProps(column.getSortByToggleProps())}
								>
									<div className={`flex flex-inline align-top ${column.className}`}>
										<div className="mr-2">{column.render("Header")}</div>
										<div
											className="flex items-center text-theme-color-neutral-500"
											data-testid={`table__${getSortIconName(
												column.isSorted,
												column.isSortedDesc,
											)}`}
										>
											{column.canSort && (
												<Icon
													name={getSortIconName(column.isSorted, column.isSortedDesc)}
													width={column.isSorted ? 10 : 15}
													height={column.isSorted ? 10 : 12}
												/>
											)}
										</div>
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody {...getTableBodyProps()}>
					{rows.map((row: any) => {
						prepareRow(row);
						return { ...renderChildNode(row.original, row.index), ...row.getRowProps() };
					})}
				</tbody>
			</table>
		</TableWrapper>
	);
};

Table.defaultProps = {
	data: [],
	columns: [],
};
