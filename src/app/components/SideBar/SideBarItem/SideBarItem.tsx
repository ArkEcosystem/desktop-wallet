import React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
// UI Elements
import { SvgIcon } from "app/components/SvgIcon";
// Types
import { ItemProps } from "../SideBar";

const ActiveIndicator = styled.div({
	minWidth: "8px",
	minHeight: "100%",
});

export const SideBarItem = withRouter(
	({ label, icon, itemKey, route, isActive, history, handleActiveItem }: ItemProps & RouteComponentProps) => {
		const getActiveClass = () =>
			isActive
				? `
        text-theme-primary
        bg-theme-primary-contrast
    `
				: "text-theme-medium";

		const handleClick = () => {
			handleActiveItem(itemKey);

			return history.push(route);
		};

		return (
			<div
				className="relative cursor-pointer"
				onClick={() => handleClick()}
				data-testid={`side-menu__item--${itemKey}`}
			>
				{isActive && <ActiveIndicator className="absolute top-0 left-0 rounded-lg bg-theme-primary" />}
				<li className={`p-5 flex ${getActiveClass()}`}>
					{icon && (
						<div className={`text-theme-${isActive ? "primary" : "primary-contrast"}`}>
							<SvgIcon name={icon} />
						</div>
					)}
					<span className="font-semibold ml-2">{label}</span>
				</li>
			</div>
		);
	},
);
