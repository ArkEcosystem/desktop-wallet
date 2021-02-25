import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { Table, TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type BestPluginsProps = {
	isOpen: boolean;
	plugins: any;
	onClose?: any;
};

const { BestPluginsBanner } = images.plugin.common;

export const BestPlugins = ({ isOpen, plugins, onClose }: BestPluginsProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: "Logo",
			disableSortBy: true,
			className: "hidden",
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
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_BEST_PLUGINS.TITLE")}
			description={t("PLUGINS.MODAL_BEST_PLUGINS.DESCRIPTION")}
			banner={<BestPluginsBanner className="h-full" />}
			size="4xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={plugins}>
					{(rowData: any) => (
						<TableRow>
							<TableCell className="w-16">
								<Image name="ChangeNowLogo" className="w-12 h-12" />
							</TableCell>

							<TableCell>
								<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
									{rowData.name}
								</div>
								<div className="inline-flex items-center space-x-2">
									<span className="text-theme-secondary-text">{rowData.author}</span>
									{rowData.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
									{rowData.isGrant && <Icon name="Grant" width={16} height={16} />}
								</div>
							</TableCell>

							<TableCell className="text-theme-secondary-text">
								{t(`PLUGINS.CATEGORIES.${rowData.category.toUpperCase()}`)}
							</TableCell>

							<TableCell className="text-theme-secondary-text">
								<ReviewRating rating={rowData.rating} width={3} />
							</TableCell>

							<TableCell className="text-theme-secondary-text">
								<span>v {rowData.version}</span>
							</TableCell>

							<TableCell innerClassName="justify-end">
								<Button variant="secondary">{t("COMMON.INSTALL")}</Button>
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</Modal>
	);
};

BestPlugins.defaultProps = {
	isOpen: false,
};
