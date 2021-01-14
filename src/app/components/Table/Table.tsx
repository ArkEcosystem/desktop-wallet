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
	hideHeader?: boolean;
};

const TableWrapper = styled.div`
	${defaultTableStyle}
`;

export const Table = ({ children, data, columns, hideHeader, className }: TableProps) => {
	const tableData = useMemo(() => data, [data]);
	const tableColumns = useMemo(() => columns, [columns]);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			data: tableData,
			columns: tableColumns,
			autoResetSortBy: false,
		},
		useSortBy,
	);

	const renderChildNode = (data: any, index: number) => {
		if (typeof children === "function") return children(data, index);
		return <tr />;
	};

	const getSortIconName = (isSorted: boolean, isSortedDesc: boolean) => {
		if (isSorted) {
			return isSortedDesc ? "ChevronDown" : "ChevronUp";
		}

		return "Sort";
	};

	return (
		<TableWrapper {...getTableProps({ className })} className={!hideHeader ? "-mt-3" : ""}>
			<table cellPadding={0} className="table-auto">
				{!hideHeader && (
					<thead>
						{headerGroups.map((headerGroup: any, index: number) => (
							<tr
								className="border-b border-theme-neutral-300 dark:border-theme-neutral-800"
								key={index}
								{...headerGroup.getHeaderGroupProps()}
							>
								{headerGroup.headers.map((column: any, thIndex: number) => (
									<th
										key={thIndex}
										className={`relative text-sm text-left select-none text-theme-neutral-500 border-theme-neutral-300 dark:text-theme-neutral-700 dark:border-theme-neutral-800 m-0 p-3 first:pl-0 last:pr-0 font-semibold ${
											column.className?.includes("no-border") ? "" : "hasBorder"
										} ${
											column.minimumWidth
												? "w-1"
												: (column.cellWidth && `${column.cellWidth} min-${column.cellWidth}`) ||
												  ""
										}`}
										data-testid={`table__th--${thIndex}`}
										{...column.getHeaderProps(column.getSortByToggleProps())}
									>
										<div className={`flex flex-inline align-top ${column.className || ""}`}>
											<div>{column.render("Header")}</div>
											{column.canSort && (
												<div
													className="flex items-center ml-2 text-theme-neutral-500 dark:text-theme-neutral-700"
													data-testid={`table__${getSortIconName(
														column.isSorted,
														column.isSortedDesc,
													)}`}
												>
													<Icon
														name={getSortIconName(column.isSorted, column.isSortedDesc)}
														width={column.isSorted ? "0.75rem" : 10}
														height={column.isSorted ? "0.75rem" : 5}
													/>
												</div>
											)}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
				)}

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
	hideColumns: false,
};
