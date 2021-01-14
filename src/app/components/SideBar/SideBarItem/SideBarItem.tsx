// UI Elements
import { Icon } from "app/components/Icon";
import React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";

// Types
import { ItemProps } from "../SideBar";

export const SideBarItem = withRouter(
	({ label, icon, itemKey, route, isActive, history, handleActiveItem }: ItemProps & RouteComponentProps) => {
		const handleClick = () => {
			handleActiveItem(itemKey);
		};

		return (
			<div
				className="relative cursor-pointer"
				onClick={() => handleClick()}
				data-testid={`side-menu__item--${itemKey}`}
			>
				<li
					className={`rounded-lg py-5 pl-10 pr-8 h-15 flex items-center ${
						isActive ? "text-theme-primary-600 bg-theme-primary-100 dark:bg-theme-secondary-800" : ""
					}`}
				>
					{isActive && <div className="absolute top-0 bottom-0 left-0 w-2 rounded bg-theme-primary-600" />}

					{icon && (
						<div
							className={`mr-3 ${
								isActive
									? "text-theme-primary-600"
									: "text-theme-primary-300 dark:text-theme-secondary-600"
							}`}
						>
							<Icon name={icon} width={20} height={20} />
						</div>
					)}

					<span className="text-lg font-semibold">{label}</span>
				</li>
			</div>
		);
	},
);
