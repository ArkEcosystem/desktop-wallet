import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import React from "react";
import { NavLink } from "react-router-dom";

export type Crumb = {
	label: string;
	route?: string;
};

type BreadcrumbsProps = {
	crumbs: Crumb[];
	className?: string;
};

export const Breadcrumbs = ({ crumbs, className }: BreadcrumbsProps) => {
	const isLast = (index: number) => index === crumbs.length - 1;

	return crumbs.length ? (
		<div data-testid="breadcrumbs__wrapper" className={`flex items-center space-x-3 text-sm ${className || ""}`}>
			<Icon name="ArrowLeft" className="text-theme-neutral-500" width={13} height={24} />

			{crumbs.map((crumb: Crumb, index: number) => (
				<>
					{isLast(index) && (
						<span key={index} className="text-theme-neutral-700">
							{crumb.label}
						</span>
					)}

					{!isLast(index) && crumb.route && (
						<span key={index} className="space-x-3">
							<NavLink to={crumb.route} className="text-theme-neutral-500 hover:underline">
								<span>{crumb.label}</span>
							</NavLink>

							<span>
								<Divider
									className="border-theme-neutral-300 dark:border-theme-neutral-800"
									type="vertical"
								/>
							</span>
						</span>
					)}
				</>
			))}
		</div>
	) : null;
};
