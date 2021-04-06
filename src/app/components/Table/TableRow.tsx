import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableRow.styles";

export type TableRowFunction = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;

type TableRowProps = {
	border?: boolean;
	children: React.ReactNode;
	onClick?: TableRowFunction;
	isSelected?: boolean;
} & React.HTMLProps<any>;

const TableRowStyled = styled.tr<TableRowProps>(getStyles);

export const TableRow = ({ border, children, isSelected, onClick }: TableRowProps) => (
	<TableRowStyled data-testid="TableRow" className="group" border={border} isSelected={isSelected} onClick={onClick}>
		{children}
	</TableRowStyled>
);

TableRow.defaultProps = {
	border: true,
};
