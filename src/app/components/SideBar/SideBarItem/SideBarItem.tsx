// UI Elements
import { Icon } from "app/components/Icon";
import React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";

// Types
import { ItemProps } from "../SideBar";

const ActiveIndicator = styled.div({
	minWidth: "8px",
	minHeight: "100%",
});

export const SideBarItem = withRouter(
	({ label, icon, itemKey, route, isActive, history, handleActiveItem }: ItemProps & RouteComponentProps) => {
		const getActiveClass = () => (isActive ? "text-theme-primary bg-theme-primary-contrast" : "text-theme-medium");

		const handleClick = () => {
			handleActiveItem(itemKey);
		};

		return (
			<div
				className="relative cursor-pointer"
				onClick={() => handleClick()}
				data-testid={`side-menu__item--${itemKey}`}
			>
				{isActive && <ActiveIndicator className="absolute top-0 left-0 rounded-lg bg-theme-primary" />}
				<li className={`rounded-lg py-5 pl-10 pr-8 h-15 ${getActiveClass()} flex items-center`}>
					{icon && (
						<div className={`text-theme-${isActive ? "primary" : "primary-light"}`}>
							<Icon name={icon} width={20} height={20} />
						</div>
					)}
					<span className={`ml-3 text-lg ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
				</li>
			</div>
		);
	},
);
