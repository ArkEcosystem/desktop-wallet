import { Icon } from "app/components/Icon";
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
	iconName?: string;
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
	<div className="pt-5 mt-5 text-sm border-t border-dashed grid grid-cols-5 divide-x divide-theme-neutral-300 grid-flow-col border-theme-neutral-300">
		<GridCol>
			<div className="flex flex-col">
				<span className="font-bold text-theme-neutral-400">Author</span>
				<div className="flex items-center">
					<span className="font-bold text-theme-neutral-600">{author}</span>
					<div className="ml-3">
						<Icon name="OfficialArkPlugin" />
					</div>
				</div>
			</div>
		</GridCol>
		<GridCol padding="px-6">
			<GridItem label="Category" value={category} />
		</GridCol>
		<GridCol padding="px-6 -ml-5">
			<div className="flex flex-col">
				<span className="font-bold text-theme-neutral-400">URL</span>
				<span className="font-bold text-theme-primary">{url}</span>
			</div>
		</GridCol>
		<GridCol colSpan={2} justify="between" padding="px-6 -ml-8">
			<div className="flex flex-col">
				<span className="font-bold text-theme-neutral-400">Rating</span>
				<div className="flex items-center">
					<div className="pr-1 text-theme-warning-400">
						<Icon name="Star" />
					</div>
					<span className="font-bold text-theme-neutral-600">{rating}</span>
				</div>
			</div>
			<GridItem label="Version" value={`v.${version}`} textDirection="right" />
		</GridCol>
		<GridCol padding="pl-6">
			<GridItem label="Size" value={`${size} Mb`} textDirection="right" />
		</GridCol>
	</div>
);
