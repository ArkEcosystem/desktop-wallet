import React from "react";
import tw, { styled } from "twin.macro";

// UI Elements
import { SideBarItem } from "./SideBarItem";

interface Properties {
	activeItem: string;
	handleActiveItem: any;
	items: any;
}

export interface ItemProperties {
	itemKey: string;
	label: string;
	icon: string;
	route: string;
	isActive: boolean;
	handleActiveItem?: any;
}

const SideBarContainer = styled.div`
	${tw`h-full`}

	width: 210px;
`;

export const SideBar = ({ activeItem, handleActiveItem, items }: Properties) => (
	<SideBarContainer>
		<ul>
			{items &&
				items.map(({ label, route, itemKey, icon }: ItemProperties, index: number) => (
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
