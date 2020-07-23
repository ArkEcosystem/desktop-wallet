import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type BestPluginsProps = {
	isOpen: boolean;
	plugins: any;
	onClose?: any;
};

const { BestPluginsBanner } = images.plugin.common;
const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const BestPlugins = ({ isOpen, plugins, onClose }: BestPluginsProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: " ",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
			className: "justify-center",
		},
		{
			Header: t("COMMON.RATING"),
			accessor: "rating",
			className: "justify-center",
		},
		{
			Header: t("COMMON.VERSION"),
			accessor: "version",
			className: "justify-center",
		},
		{
			Header: "  ",
			disableSortBy: true,
		},
	];

	return (
		<Modal
			title={
				<div className="w-3/5 mb-5 text-5xl font-bold leading-tight text-white">
					{t("PLUGINS.MODAL_BEST_PLUGINS.TITLE")}
				</div>
			}
			description={t("PLUGINS.MODAL_BEST_PLUGINS.DESCRIPTION")}
			banner={<BestPluginsBanner className="w-full" />}
			size="4xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={plugins}>
					{(rowData: any) => (
						<tr className="border-b border-dashed border-theme-neutral-200">
							<td className="w-16">
								<ChangeNowLogo className="w-12 h-12" />
							</td>

							<td>
								<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
									{rowData.name}
								</div>
								<div className="inline-flex items-center space-x-2">
									<span className="text-theme-neutral-dark">{rowData.author}</span>
									{rowData.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
									{rowData.isGrant && <Icon name="Grant" width={16} height={16} />}
								</div>
							</td>

							<td className="py-10 text-center text-theme-neutral-dark">
								{t(`PLUGINS.CATEGORIES.${rowData.category.toUpperCase()}`)}
							</td>

							<td className="flex justify-center py-10 text-theme-neutral-dark">
								<ReviewRating rating={rowData.rating} width={3} />
							</td>

							<td className="py-10 text-center text-theme-neutral-dark">v {rowData.version}</td>

							<td className="w-16">
								<Button variant="plain">{t("COMMON.INSTALL")}</Button>
							</td>
						</tr>
					)}
				</Table>
			</div>
		</Modal>
	);
};

BestPlugins.defaultProps = {
	isOpen: false,
};
