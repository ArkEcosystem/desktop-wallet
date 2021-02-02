import { Icon } from "app/components/Icon";
// @ts-ignore
import extractDomain from "extract-domain";
import React from "react";
import { useTranslation } from "react-i18next";
import { openExternal } from "utils/electron-utils";

type Props = {
	author?: string;
	category?: string;
	url?: string;
	version?: string;
	size?: string;
	logo?: string;
	isOfficial?: boolean;
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
} & React.HTMLProps<any>;

const GridItem = ({ label, value, textDirection, ...props }: GridItemProps) => (
	<div className={`flex flex-col ${textDirection && `text-${textDirection}`}`} {...props}>
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

export const PluginSpecs = ({ author, category, url, version, isOfficial, size }: Props) => {
	const domain = url && extractDomain(url);
	const { t } = useTranslation();

	return (
		<div className="flex justify-between space-4">
			<div className="flex space-x-4 text-sm divide-x divide-theme-secondary-300 border-theme-secondary-300 dark:border-theme-secondary-800">
				<GridCol>
					<div className="flex flex-col pr-6">
						<span className="font-bold text-theme-secondary-400">{t("COMMON.AUTHOR")}</span>
						<div className="flex items-center">
							<span className="font-bold text-theme-secondary-600">{author}</span>
							{isOfficial && (
								<div data-testid="PluginSpecss__official" className="ml-2">
									<Icon name="OfficialArkPlugin" />
								</div>
							)}
						</div>
					</div>
				</GridCol>
				<GridCol padding="px-6">
					<GridItem label={t("COMMON.CATEGORY")} value={t(`PLUGINS.CATEGORIES.${category?.toUpperCase()}`)} />
				</GridCol>
				<GridCol padding="px-6">
					{domain ? (
						<div className="flex flex-col">
							<div className="font-bold text-theme-secondary-400">{t("COMMON.URL")}</div>
							<a href="/" onClick={() => openExternal(url!)} className="font-bold text-theme-primary-600">
								{domain}
							</a>
						</div>
					) : (
						<GridItem data-testid="PluginSpecs__url" label={t("COMMON.URL")} value="N/A" />
					)}
				</GridCol>
			</div>

			<div className="flex space-x-4 text-sm divide-x divide-theme-secondary-300 border-theme-secondary-300 dark:border-theme-secondary-800">
				<GridCol padding="pl-6">
					<GridItem
						data-testid="PluginSpecs__version"
						label={t("COMMON.VERSION")}
						value={version!}
						textDirection="right"
					/>
				</GridCol>

				<GridCol padding="pl-6">
					<GridItem
						data-testid="PluginSpecs__size"
						label={t("COMMON.SIZE")}
						value={size || "N/A"}
						textDirection="right"
					/>
				</GridCol>
			</div>
		</div>
	);
};
