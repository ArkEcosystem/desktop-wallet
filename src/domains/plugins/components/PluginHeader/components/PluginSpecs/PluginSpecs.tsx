import React from "react";

type Props = {
	author: string;
	category: string;
	url: string;
	rating: string;
	version: string;
	size: string;
};

type GridColProps = {
	children: React.ReactNode;
	colSpan?: number;
	justify?: string;
	padding?: string;
};

type GridItemProps = {
	label: string;
	value: string;
	textDirection?: string;
};

const GridItem = ({ label, value, textDirection }: GridItemProps) => (
	<div className={`flex flex-col ${textDirection && `text-${textDirection}`}`}>
		<span className="font-bold text-theme-neutral-400">{label}</span>
		<span className="font-bold text-theme-neutral-600">{value}</span>
	</div>
);

const GridCol = ({ children, colSpan, justify, padding }: GridColProps) => {
	const mountClassName = () => {
		let styles = "flex";

		if (colSpan) styles = `${styles} col-span-${colSpan}`;
		if (justify) styles = `${styles} justify-${justify}`;
		if (padding) styles = `${styles} ${padding}`;

		return styles;
	};

	return <div className={mountClassName()}>{children}</div>;
};

export const PluginSpecs = ({ author, category, url, rating, version, size }: Props) => (
	<div className="grid grid-cols-5 divide-x divide-gray-400 text-sm mt-5 grid-flow-col border-t border-dashed border-theme-neutral pt-5">
		<GridCol>
			<GridItem label="Author" value={author} />
		</GridCol>
		<GridCol padding="px-8">
			<GridItem label="Category" value={category} />
		</GridCol>
		<GridCol padding="px-8">
			<GridItem label="URL" value={url} />
		</GridCol>
		<GridCol colSpan={2} justify="between" padding="px-8">
			<GridItem label="Rating" value={rating} />
			<GridItem label="Version" value={`v.${version}`} textDirection="right" />
		</GridCol>
		<GridCol padding="pl-8">
			<GridItem label="Size" value={`${size} Mb`} textDirection="right" />
		</GridCol>
	</div>
);
