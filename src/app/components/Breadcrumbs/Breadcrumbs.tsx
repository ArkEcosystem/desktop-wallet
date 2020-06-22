import React from "react";
import { NavLink } from "react-router-dom";

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
		<div
			data-testid="breadcrumbs__wrapper"
			className={`flex items-center space-x-3 ${className} ${
				crumbs.length === 1 ? "text-theme-neutral-700" : "text-theme-neutral-500"
			}`}
		>
			{crumbs.length && <span> &lt;- </span>}

			{crumbs.map((crumb: Crumb, index: number) => {
				return (
					<div key={index} className="space-x-3">
						<NavLink to={crumb.route} className={`${isLast(index) ? "text-theme-neutral-700" : ""}`}>
							<span>{crumb.label}</span>
						</NavLink>

						{!isLast(index) && <span> | </span>}
					</div>
				);
			})}
		</div>
	) : null;
};

Breadcrumbs.defaultProps = {
	className: "font-semibold",
};
