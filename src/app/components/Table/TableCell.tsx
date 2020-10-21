import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProps = {
	variant?: "start" | "middle" | "end";
	className?: string;
	innerClassName?: string;
	isCompact?: boolean;
	isSelected?: boolean;
	children: React.ReactNode;
};

const TableCellInnerWrapper = styled.div<TableCellProps>(getStyles);

export const TableCell = ({ variant, className, innerClassName, isCompact, isSelected, children }: TableCellProps) => (
	<td className={className}>
		<TableCellInnerWrapper
			variant={variant}
			className={innerClassName}
			isSelected={isSelected}
			isCompact={isCompact}
		>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
