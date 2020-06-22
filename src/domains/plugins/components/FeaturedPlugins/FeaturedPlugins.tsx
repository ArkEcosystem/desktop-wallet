import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type FeaturedPluginsProps = {
	isOpen: boolean;
	onClose?: any;
};

const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const FeaturedPlugins = (props: FeaturedPluginsProps) => {
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
		},
		{
			Header: t("COMMON.RATING"),
			accessor: "rating",
		},
		{
			Header: t("COMMON.VERSION"),
			accessor: "version",
		},
		{
			Header: "  ",
			disableSortBy: true,
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_FEATURED_PLUGINS.TITLE")}
			description={t("PLUGINS.MODAL_FEATURED_PLUGINS.DESCRIPTION")}
			size="3xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-dashed border-theme-neutral-200">
							<td className="text-center w-18">
								<ChangeNowLogo />
							</td>

							<td>
								<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
									{rowData.name}
								</div>
								<div>{rowData.description}</div>
							</td>

							<td className="py-10">{rowData.category}</td>

							<td className="py-10">
								<ReviewRating rating={rowData.rating} />
							</td>

							<td className="py-10">v {rowData.version}</td>

							<td className="w-16">
								<Button variant="plain">Install</Button>
							</td>
						</tr>
					)}
				</Table>
			</div>
		</Modal>
	);
};

FeaturedPlugins.defaultProps = {
	isOpen: false,
};
