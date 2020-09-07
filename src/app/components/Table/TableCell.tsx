import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProps = {
	variant?: "start" | "middle" | "end";
	isSelected?: boolean;
	cellWidth?: string;
	className?: string;
	children: React.ReactNode;
};

const TableCellInnerWrapper = styled.div<TableCellProps>(getStyles);

export const TableCell = ({ variant, isSelected, cellWidth, className, children }: TableCellProps) => (
	<td className={cellWidth}>
		<TableCellInnerWrapper variant={variant} isSelected={isSelected} className={className}>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
