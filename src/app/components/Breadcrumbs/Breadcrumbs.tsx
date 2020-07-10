import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
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
			className={`flex items-center space-x-2 ${className} ${
				crumbs.length === 1 ? "text-theme-neutral-dark" : "text-theme-neutral"
			}`}
		>
			{crumbs.length && <Icon name="ArrowBack" width={19} height={10} />}

			{crumbs.map((crumb: Crumb, index: number) => {
				return (
					<div key={index} className="space-x-2">
						<NavLink to={crumb.route} className={`${isLast(index) ? "text-theme-neutral-dark" : ""}`}>
							<span>{crumb.label}</span>
						</NavLink>

						{!isLast(index) && (
							<span>
								<Divider className="border-1 border-theme-neutral" type="vertical" />
							</span>
						)}
					</div>
				);
			})}
		</div>
	) : null;
};

Breadcrumbs.defaultProps = {
	className: "px-20 py-5 font-semibold bg-theme-neutral-contrast",
};
