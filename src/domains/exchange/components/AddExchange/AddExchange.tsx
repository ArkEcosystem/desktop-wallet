import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { ReviewRating } from "app/components/ReviewRating";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type AddExchangeProps = {
	isOpen: boolean;
	onClose?: any;
};

const AddExchangeBanner = images.exchange.components.AddExchange.AddExchangeBanner;
const ChangeNowLogo = images.exchange.components.AddExchange.ChangeNowLogo;

export const AddExchange = (props: AddExchangeProps) => {
	const { t } = useTranslation();
	const data = [
		{
			name: "ChangeNOW Plugin",
			description: "ChangeNOW",
			category: "Other",
			rating: 4.6,
			version: "1.3.8",
		},
		{
			name: "Binance",
			description: "Binance",
			category: "Other",
			rating: 4.6,
			version: "1.3.8",
		},
		{
			name: "Atomars",
			description: "Atomars",
			category: "Other",
			rating: 4.8,
			version: "1.3.8",
		},
		{
			name: "OKEx",
			description: "ARK Ecosystem",
			category: "Other",
			rating: 2.6,
			version: "1.3.8",
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
			title={t("EXCHANGE.MODAL_ADD_EXCHANGE.TITLE")}
			description={t("EXCHANGE.MODAL_ADD_EXCHANGE.DESCRIPTION")}
			banner={<AddExchangeBanner className="w-full" />}
			size="3xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-dashed border-theme-neutral-200">
							<td className="text-center w-18">
								<ChangeNowLogo className="w-12 h-12" />
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

AddExchange.defaultProps = {
	isOpen: false,
};

AddExchange.displayName = "AddExchange";
