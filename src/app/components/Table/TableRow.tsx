import cn from "classnames";
import React from "react";
import { styled } from "twin.macro";

import { getStyles } from "./TableRow.styles";

export type TableRowFunction = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;

type TableRowProperties = {
	border?: boolean;
	children: React.ReactNode;
	onClick?: TableRowFunction;
	isSelected?: boolean;
} & React.HTMLProps<any>;

const TableRowStyled = styled.tr<TableRowProperties>(getStyles);

export const TableRow = ({ border, children, isSelected, onClick }: TableRowProperties) => (
	<TableRowStyled
		data-testid="TableRow"
		className={cn({ group: !!onClick })}
		border={border}
		isSelected={isSelected}
		onClick={onClick}
	>
		{children}
	</TableRowStyled>
);

TableRow.defaultProps = {
	border: true,
};
