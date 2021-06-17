import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

import { ListDividedItem } from "./ListDividedItem";

interface Properties {
	items: any;
}

const StyledList = styled.ul({
	li: tw`border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800`,
	"li:last-child": tw`border-b-0 `,
});

const renderItems = (items: any) => (
	<StyledList data-testid="list-divided__items">
		{items.map((item: any, index: number) => (
			<ListDividedItem {...item} key={index} />
		))}
	</StyledList>
);

const ListDivided = ({ items }: Properties) => {
	const emptyList = <span data-testid="list-divided__empty">empty</span>;

	return items.length > 0 ? renderItems(items) : emptyList;
};

ListDivided.defaultProps = {
	items: [],
};

export { ListDivided };
