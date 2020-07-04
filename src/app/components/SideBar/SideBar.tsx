import React from "react";
import tw, { styled } from "twin.macro";

// UI Elements
import { SideBarItem } from "./SideBarItem";

type Props = {
	activeItem: string;
	handleActiveItem: any;
	items: any;
};

export type ItemProps = {
	itemKey: string;
	label: string;
	icon: string;
	route: string;
	isActive: boolean;
	handleActiveItem?: any;
};

const SideBarContainer = styled.div`
	${tw`h-full`}

	width: 210px;
`;

export const SideBar = ({ activeItem, handleActiveItem, items }: Props) => (
	<SideBarContainer>
		<ul>
			{items &&
				items.map(({ label, route, itemKey, icon }: ItemProps, index: number) => (
					<SideBarItem
						label={label}
						route={route}
						icon={icon}
						itemKey={itemKey}
						key={index}
						handleActiveItem={handleActiveItem}
						isActive={activeItem === itemKey}
					/>
				))}
		</ul>
	</SideBarContainer>
);
