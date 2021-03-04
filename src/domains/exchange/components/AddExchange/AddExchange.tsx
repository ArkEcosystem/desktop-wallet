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
			title: "ChangeNOW Plugin",
			author: "ChangeNOW",
			category: "Other",
			version: "1.3.8",
		},
		{
			title: "Binance",
			author: "Binance",
			category: "Other",
			version: "1.3.8",
		},
		{
			title: "Atomars",
			author: "Atomars",
			category: "Other",
			version: "1.3.8",
		},
		{
			title: "OKEx",
			author: "ARK Ecosystem",
			category: "Other",
			version: "1.3.8",
		},
	];

	const initialState = {
		sortBy: [
			{
				id: "title",
				// desc: false,
			},
		],
	};

	const columns = [
		{
			Header: t("COMMON.NAME"),
			accessor: "title",
		},
		{
			Header: t("COMMON.AUTHOR"),
			accessor: "author",
		},
		{
			Header: t("COMMON.VERSION"),
			accessor: "version",
			className: "no-border",
			disableSortBy: true,
		},
		{
			Header: "Actions",
			className: "hidden",
			disableSortBy: true,
		},
	];

	return (
		<Modal title={t("EXCHANGE.MODAL_ADD_EXCHANGE.TITLE")} size="4xl" isOpen={isOpen} onClose={onClose}>
			<div className="mt-8 -mb-6">
				<Table columns={columns} data={data} initialState={initialState}>
					{(rowData: any) => (
						<TableRow>
							<TableCell variant="start" innerClassName="space-x-5">
								<div className="w-11 h-11">
									<Image name="ChangeNowLogo" />
								</div>

								<span className="cursor-pointer font-semibold link">{rowData.title}</span>
							</TableCell>

							<TableCell>
								<span>{rowData.author}</span>
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
