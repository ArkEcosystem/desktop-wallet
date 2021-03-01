import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { Table, TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type AddExchangeProps = {
	isOpen: boolean;
	onClose?: any;
};

export const AddExchange = ({ isOpen, onClose }: AddExchangeProps) => {
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
			Header: "Logo",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("COMMON.VERSION"),
			accessor: "version",
		},
		{
			Header: "Actions",
			disableSortBy: true,
			className: "hidden",
		},
	];

	return (
		<Modal
			title={t("EXCHANGE.MODAL_ADD_EXCHANGE.TITLE")}
			description={t("EXCHANGE.MODAL_ADD_EXCHANGE.DESCRIPTION")}
			banner={<Image name="AddExchangeBanner" domain="exchange" />}
			size="4xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<TableRow>
							<TableCell variant="start" className="w-16">
								<div className="w-12 h-12">
									<Image name="ChangeNowLogo" domain="exchange" />
								</div>
							</TableCell>

							<TableCell>
								<div className="flex flex-col">
									<div className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
										{rowData.name}
									</div>
									<div>{rowData.description}</div>
								</div>
							</TableCell>

							<TableCell>
								<span>v {rowData.version}</span>
							</TableCell>

							<TableCell variant="end" className="w-16" innerClassName="justify-end">
								<Button variant="secondary">{t("COMMON.INSTALL")}</Button>
							</TableCell>
						</TableRow>
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
