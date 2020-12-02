import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { SearchBar } from "app/components/SearchBar";
import { TableCell, TableRow } from "app/components/Table";
import { Table } from "app/components/Table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type AddBlacklistPluginProps = {
	isOpen: boolean;
	plugins: any;
	blacklisted?: any;
	onClose?: any;
	handleBlacklist?: any;
};

export const AddBlacklistPlugin = ({
	isOpen,
	plugins,
	blacklisted,
	onClose,
	handleBlacklist,
}: AddBlacklistPluginProps) => {
	const [dataset, setDataset] = useState([]);
	const { t } = useTranslation();

	useEffect(() => {
		const list = plugins.filter((plugin: any) => !blacklisted.find((id: any) => plugin.id === id));

		setDataset(list);
	}, [plugins, blacklisted]);

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
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.TITLE")}
			description={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION")}
			size="4xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="-mx-10">
				<SearchBar className="mt-8" placeholder={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.SEARCH_PLACEHOLDER")} />
			</div>

			<div className="mt-8 -mb-6">
				<Table columns={columns} data={dataset}>
					{(rowData: any) => (
						<TableRow>
							<TableCell className="w-16">
								<Image name="ChangeNowLogo" domain="exchange" className="w-12 h-12" />
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

							<TableCell innerClassName="text-theme-secondary-text justify-center">
								<span>{t(`PLUGINS.CATEGORIES.${rowData.category.toUpperCase()}`)}</span>
							</TableCell>

							<TableCell innerClassName="text-theme-secondary-text">
								<span>
									<ReviewRating rating={rowData.rating} width={3} />
								</span>
							</TableCell>

							<TableCell className="w-16">
								<Button variant="secondary" onClick={() => handleBlacklist(rowData.id)}>
									{t("COMMON.ADD")}
								</Button>
							</TableCell>
						</TableRow>
					)}
				</Table>
			</div>
		</Modal>
	);
};

AddBlacklistPlugin.defaultProps = {
	isOpen: false,
	plugins: [],
};
