import React from "react";

type Props = {
	title: string;
	subtitle?: string;
};

export const Header = ({ title, subtitle }: Props) => (
	<div className="flex flex-col items-start">
		<h1 className="text-3xl font-bold md:text-4xl" data-testid="header__title">
			{title}
		</h1>
		{subtitle && (
			<div className="mt-2 text-theme-neutral-dark" data-testid="header__subtitle">
				{subtitle}
			</div>
		)}
	</div>
);
