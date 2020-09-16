import { SearchBarOptions } from "app/components/SearchBar/SearchBarOptions";
import { SearchResource } from "app/components/SearchResource";
import { Table, TableCell } from "app/components/Table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SearchHelpProps = {
	isOpen: boolean;
	data: any;
	onClose?: any;
	onSearch?: any;
};

export const SearchHelp = ({ isOpen, data, onClose, onSearch }: SearchHelpProps) => {
	const { t } = useTranslation();

	const options = [
		{ label: t("COMMON.ALL"), value: "all" },
		{ label: t("COMMON.DELEGATE"), value: "delegate" },
		{ label: t("COMMON.PLUGIN"), value: "plugin" },
		{ label: t("COMMON.TRANSACTION"), value: "transaction" },
		{ label: t("COMMON.WALLET"), value: "wallet" },
	];

	const [selectedOption, setSelectedOption] = useState(options[0]);

	const columns = [
		{
			Header: t("COMMON.TITLE"),
			accessor: "title",
		},
		{
			Header: t("COMMON.CATEGORY"),
			accessor: "category",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={t("HELP.MODAL_SEARCH_HELP.TITLE")}
			description={t("HELP.MODAL_SEARCH_HELP.DESCRIPTION")}
			searchBarExtra={
				<SearchBarOptions
					options={options}
					selectedOption={selectedOption}
					onSelect={(option: any) => setSelectedOption(option)}
				/>
			}
			onClose={onClose}
			onSearch={onSearch}
		>
			<div className="mt-8">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="transition-colors duration-100 border-b last:border-b-0 border-dashed border-theme-neutral-200 group">
							<TableCell variant="start" innerClassName="pr-8">
								<div className="font-semibold">{rowData.title}</div>

								<div className="mt-2 text-sm text-theme-neutral-dark">{rowData.description}</div>
							</TableCell>

							<TableCell innerClassName="text-sm justify-end">
								<div>{t(`COMMON.${rowData.category.toUpperCase()}`)}</div>
							</TableCell>
						</tr>
					)}
				</Table>
			</div>
		</SearchResource>
	);
};
