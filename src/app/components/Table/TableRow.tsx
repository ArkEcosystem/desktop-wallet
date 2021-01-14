import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableRow.styles";

export type TableRowFunction = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;

type TableRowProps = {
	border?: boolean;
	children: React.ReactNode;
	onClick?: TableRowFunction;
	isSelected?: boolean;
	onMouseEnter?: TableRowFunction;
	onMouseLeave?: TableRowFunction;
} & React.HTMLProps<any>;

const TableRowStyled = styled.tr<TableRowProps>(getStyles);

export const TableRow = ({ border, children, isSelected, onClick, onMouseEnter, onMouseLeave }: TableRowProps) => (
	<TableRowStyled
		data-testid="TableRow"
		border={border}
		isSelected={isSelected}
		onClick={onClick}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}
	>
		{children}
	</TableRowStyled>
);

TableRow.defaultProps = {
	border: true,
};
