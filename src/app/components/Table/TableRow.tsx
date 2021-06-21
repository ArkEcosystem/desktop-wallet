import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableRow.styles";

export type TableRowFunction = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;

type TableRowProperties = {
	border?: boolean;
	dotted?: boolean;
	children: React.ReactNode;
	onClick?: TableRowFunction;
	isSelected?: boolean;
} & React.HTMLProps<any>;

const TableRowStyled = styled.tr<TableRowProperties>(getStyles);

export const TableRow = ({ border, dotted, children, isSelected, onClick }: TableRowProperties) => (
	<TableRowStyled
		data-testid="TableRow"
		className="group"
		border={border}
		dotted={dotted}
		isSelected={isSelected}
		onClick={onClick}
	>
		{children}
	</TableRowStyled>
);

TableRow.defaultProps = {
	border: true,
};
