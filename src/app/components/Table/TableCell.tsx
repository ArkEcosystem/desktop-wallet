import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProps = {
	variant?: "start" | "middle" | "end";
	className?: string;
	innerClassName?: string;
	children: React.ReactNode;
} & React.HTMLProps<any>;

const TableCellInnerWrapper = styled.div<TableCellProps>(getStyles);

export const TableCell = ({ variant, className, innerClassName, children, ...props }: TableCellProps) => (
	<td className={className} {...props}>
		<TableCellInnerWrapper variant={variant} className={innerClassName}>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
