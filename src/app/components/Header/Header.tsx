import React from "react";

type Props = {
	title: string;
	subtitle?: string;
	extra?: React.ReactNode;
};

export const Header = ({ title, subtitle, extra }: Props) => (
	<div className="flex items-center justify-between bg-theme-background">
		<div className="flex flex-col items-start w-2/5">
			<h1 className="text-3xl font-bold md:text-4xl" data-testid="header__title">
				{title}
			</h1>
			{subtitle && (
				<div className="mt-2 text-theme-neutral-dark" data-testid="header__subtitle">
					{subtitle}
				</div>
			)}
		</div>

		{extra &&
			<div className="w-3/5">
				{extra}
			</div>
		}
	</div>
);
