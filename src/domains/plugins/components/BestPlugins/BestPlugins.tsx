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
	onClose?: any;
};

const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const BestPlugins = (props: BestPluginsProps) => {
	const { t } = useTranslation();
	const data = [
		{
			name: "ARK Explorer",
			description: "ARK Ecosystem",
			category: "Utility",
			rating: 4.6,
			version: "1.3.8",
			isOfficial: true,
		},
		{
			name: "Animal Avatars",
			description: "Breno Polanski",
			category: "Utility",
			rating: 4.6,
			version: "1.3.8",
		},
		{
			name: "ChangeNOW Plugin",
			description: "ChangeNOW",
			category: "Other",
			rating: 4.8,
			version: "1.3.8",
		},
		{
			name: "Bold Ninja",
			description: "Delegate Fun",
			category: "Game",
			rating: 4.9,
			version: "2.0.0",
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
			title={t("PLUGINS.MODAL_BEST_PLUGINS.TITLE")}
			description={t("PLUGINS.MODAL_BEST_PLUGINS.DESCRIPTION")}
			size="4xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-dashed border-theme-neutral-200">
							<td className="w-18">
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

							<td className="flex justify-center py-10 text-theme-neutral-700">
								<ReviewRating rating={rowData.rating} width={3} />
							</td>

							<td className="py-10 text-center text-theme-neutral-700">v {rowData.version}</td>

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
