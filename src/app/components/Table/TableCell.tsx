import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableCell.styles";

type TableCellProperties = {
	variant?: "start" | "middle" | "end";
	className?: string;
	innerClassName?: string;
	isCompact?: boolean;
	children: React.ReactNode;
} & React.HTMLProps<any>;

const TableCellInnerWrapper = styled.div<TableCellProperties>(getStyles);

export const TableCell = ({ variant, className, innerClassName, isCompact, children, ...properties }: TableCellProperties) => (
	<td className={className} {...properties}>
		<TableCellInnerWrapper variant={variant} className={innerClassName} isCompact={isCompact}>
			{children}
		</TableCellInnerWrapper>
	</td>
);

TableCell.defaultProps = {
	variant: "middle",
};
