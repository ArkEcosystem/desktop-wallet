import React from "react";

type Props = {
	title: string;
	subheader: string;
};

export const Header = ({ title, subheader }: Props) => (
	<div className="flex flex-col items-start">
		<h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
		{subheader && <div className="mt-2 text-theme-neutral-dark">{subheader}</div>}
	</div>
);
