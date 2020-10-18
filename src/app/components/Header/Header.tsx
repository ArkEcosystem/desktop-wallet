import React from "react";

type Props = {
	title: string;
	subtitle?: string | React.ReactNode;
	extra?: React.ReactNode;
};

export const Header = ({ title, subtitle, extra }: Props) => (
	<div className="flex items-end justify-between bg-theme-background">
		<div>
			<h1 className="mb-0 md:text-4xl" data-testid="header__title">
				{title}
			</h1>
			{subtitle && (
				<div className="text-theme-secondary-text" data-testid="header__subtitle">
					{subtitle}
				</div>
			)}
		</div>

		{extra && <div>{extra}</div>}
	</div>
);
