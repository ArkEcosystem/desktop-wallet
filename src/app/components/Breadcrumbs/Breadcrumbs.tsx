import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import React from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

type Crumb = {
	route: string;
	label: string;
};

type BreadcrumbsProps = {
	crumbs: Crumb[];
	className?: string;
};

export const Breadcrumbs = ({ crumbs, className }: BreadcrumbsProps) => {
	const isLast = (index: number) => {
		return index === crumbs.length - 1;
	};

	return crumbs.length ? (
		<Router>
			<div
				data-testid="breadcrumbs__wrapper"
				className={`flex items-center space-x-2 ${className} ${
					crumbs.length === 1 ? "text-theme-neutral-700" : "text-theme-neutral-500"
				}`}
			>
				{crumbs.length && <Icon name="ArrowBack" width={19} height={10} />}

				{crumbs.map((crumb: Crumb, index: number) => {
					return (
						<div key={index} className="space-x-2">
							<NavLink to={crumb.route} className={`${isLast(index) ? "text-theme-neutral-700" : ""}`}>
								<span>{crumb.label}</span>
							</NavLink>

							{!isLast(index) && (
								<span>
									<Divider className="border-1 border-theme-neutral-500" type="vertical" />
								</span>
							)}
						</div>
					);
				})}
			</div>
		</Router>
	) : null;
};

Breadcrumbs.defaultProps = {
	className: "px-20 py-5 font-semibold bg-theme-neutral-100",
};
