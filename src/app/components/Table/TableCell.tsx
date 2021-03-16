import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProps = {
	variant?: "start" | "middle" | "end";
	className?: string;
	innerClassName?: string;
	isCompact?: boolean;
	children: React.ReactNode;
} & React.HTMLProps<any>;

const TableCellInnerWrapper = styled.div<TableCellProps>(getStyles);

export const TableCell = ({ variant, className, innerClassName, isCompact, children, ...props }: TableCellProps) => (
	<td className={className} {...props}>
		<TableCellInnerWrapper variant={variant} className={innerClassName} isCompact={isCompact}>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
