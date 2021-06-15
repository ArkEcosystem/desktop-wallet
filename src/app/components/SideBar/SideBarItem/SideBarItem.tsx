import { Icon } from "app/components/Icon";
import cn from "classnames";
import React from "react";
import { RouteComponentProps,withRouter  } from "react-router";

import { ItemProps } from "../SideBar";

export const SideBarItem = withRouter(
	({ label, icon, itemKey, isActive, handleActiveItem }: ItemProps & RouteComponentProps) => {
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
					className={cn("rounded py-5 pl-10 pr-8 h-15 flex items-center", {
						"text-theme-primary-600 dark:text-theme-secondary-200 bg-theme-primary-100 dark:bg-theme-secondary-800": isActive,
					})}
				>
					{isActive && <div className="absolute top-0 bottom-0 left-0 w-2 rounded bg-theme-primary-600" />}

					{icon && (
						<div
							className={cn("mr-3", {
								"text-theme-primary-300 dark:text-theme-secondary-600": !isActive,
							})}
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
