import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProps = {
	variant?: "start" | "middle" | "end";
	isSelected?: boolean;
	className?: string;
	innerClassName?: string;
	children: React.ReactNode;
};

const TableCellInnerWrapper = styled.div<TableCellProps>(getStyles);

export const TableCell = ({ variant, isSelected, className, innerClassName, children }: TableCellProps) => (
	<td className={className}>
		<TableCellInnerWrapper variant={variant} isSelected={isSelected} className={innerClassName}>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
