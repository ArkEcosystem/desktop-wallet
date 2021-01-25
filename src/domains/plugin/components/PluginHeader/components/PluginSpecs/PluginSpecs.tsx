import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

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
		<span className="font-bold text-theme-secondary-400">{label}</span>
		<span className="font-bold text-theme-secondary-600">{value}</span>
	</div>
);

const GridCol = ({ children, colSpan, justify, padding }: GridColProps) => {
	const mountClassName = () => {
		let styles = "flex";

		if (colSpan) {
			styles = `${styles} col-span-${colSpan}`;
		}
		if (justify) {
			styles = `${styles} justify-${justify}`;
		}
		if (padding) {
			styles = `${styles} ${padding}`;
		}

		return styles;
	};

	return <div className={mountClassName()}>{children}</div>;
};

export const PluginSpecs = ({ author, category, url, rating, version, size }: Props) => {
	const { t } = useTranslation();

	return (
		<div className="grid grid-cols-5 grid-flow-col pt-8 mt-8 text-sm border-t border-dashed divide-x divide-theme-secondary-300 border-theme-secondary-300 dark:border-theme-secondary-800">
			<GridCol>
				<div className="flex flex-col">
					<span className="font-bold text-theme-secondary-400">{t("COMMON.AUTHOR")}</span>
					<div className="flex items-center">
						<span className="font-bold text-theme-secondary-600">{author}</span>
						<div className="ml-3">
							<Icon name="OfficialArkPlugin" />
						</div>
					</div>
				</div>
			</GridCol>
			<GridCol padding="px-6">
				<GridItem label={t("COMMON.CATEGORY")} value={t(`PLUGINS.CATEGORIES.${category.toUpperCase()}`)} />
			</GridCol>
			<GridCol padding="px-6 -ml-5">
				<div className="flex flex-col">
					<span className="font-bold text-theme-secondary-400">{t("COMMON.URL")}</span>
					<span className="font-bold text-theme-primary-600">{url}</span>
				</div>
			</GridCol>
			<GridCol colSpan={2} justify="between" padding="px-6 -ml-8">
				<div className="flex flex-col">
					<span className="font-bold text-theme-secondary-400">{t("COMMON.RATING")}</span>
					<div className="flex items-center">
						<div className="pr-1 text-theme-warning-400">
							<Icon name="Star" />
						</div>
						<span className="font-bold text-theme-secondary-600">{rating}</span>
					</div>
				</div>
				<GridItem label={t("COMMON.VERSION")} value={`v.${version}`} textDirection="right" />
			</GridCol>
			<GridCol padding="pl-6">
				<GridItem label={t("COMMON.SIZE")} value={`${size} Mb`} textDirection="right" />
			</GridCol>
		</div>
	);
};
