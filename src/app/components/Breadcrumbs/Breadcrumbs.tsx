import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import React from "react";
import { NavLink } from "react-router-dom";

export type Crumb = {
	route: string;
	label: string;
};

type BreadcrumbsProps = {
	crumbs: Crumb[];
	className?: string;
};

export const Breadcrumbs = ({ crumbs, className }: BreadcrumbsProps) => {
	const isLast = (index: number) => index === crumbs.length - 1;

	return crumbs.length ? (
		<div
			data-testid="breadcrumbs__wrapper"
			className={`flex items-center space-x-3 text-sm ${className} ${
				crumbs.length === 1 ? "text-theme-secondary-text" : "text-theme-neutral"
			}`}
		>
			{crumbs.length && <Icon name="ArrowLeft" width={13} height={24} />}

			{crumbs.map((crumb: Crumb, index: number) => (
				<div key={index} className="space-x-3">
					<NavLink to={crumb.route} className={`${isLast(index) ? "text-theme-secondary-text" : ""}`}>
						<span>{crumb.label}</span>
					</NavLink>

					{!isLast(index) && (
						<span>
							<Divider
								className="border-theme-neutral-300 dark:border-theme-neutral-800"
								type="vertical"
							/>
						</span>
					)}
				</div>
			))}
		</div>
	) : null;
};
