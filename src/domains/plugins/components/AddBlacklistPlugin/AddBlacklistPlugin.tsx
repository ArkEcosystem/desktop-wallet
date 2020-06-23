import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { Table } from "app/components/Table";
import { SearchBar } from "domains/search/components/SearchBar";
import React from "react";
import { useTranslation } from "react-i18next";

type AddBlacklistPluginProps = {
	isOpen: boolean;
	onClose?: any;
};

const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const AddBlacklistPlugin = (props: AddBlacklistPluginProps) => {
	const { t } = useTranslation();
	const data = [
		{
			name: "Animal Avatars",
			description: "Breno Polanski",
			category: "Utility",
			rating: 4.6,
		},
		{
			name: "ARK Explorer",
			description: "ARK Ecosystem",
			category: "Utility",
			rating: 4.6,
			isOfficial: true,
		},
		{
			name: "Bold Ninja",
			description: "Delegate Fun",
			category: "Game",
			rating: 4.9,
			isGrant: true,
		},
	];

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
		},
		{
			Header: "  ",
			disableSortBy: true,
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.TITLE")}
			description={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION")}
			size="3xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="-mx-12">
				<SearchBar className="mt-8" placeholder={t("PLUGINS.MODAL_ADD_BLACKLIST_PLUGIN.SEARCH_PLACEHOLDER")} />
			</div>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
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
									<span className="text-theme-neutral-700">{rowData.description}</span>
									{rowData.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
									{rowData.isGrant && <Icon name="Grant" width={16} height={16} />}
								</div>
							</td>

							<td className="py-10 text-center text-theme-neutral-700">{rowData.category}</td>

							<td className="py-10 text-theme-neutral-700">
								<ReviewRating rating={rowData.rating} width={3} />
							</td>

							<td className="w-16">
								<Button variant="plain">{t("COMMON.ADD")}</Button>
							</td>
						</tr>
					)}
				</Table>
			</div>
		</Modal>
	);
};

AddBlacklistPlugin.defaultProps = {
	isOpen: false,
};
