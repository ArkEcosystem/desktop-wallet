import { Modal } from "app/components/Modal";
import { Table } from "app/components/Table";
import { SearchBar } from "domains/search/components/SearchBar";
import { SearchBarOptions } from "domains/search/components/SearchBarOptions";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchModalProps = {
	isOpen: boolean;
	onClose?: any;
};

export const SearchModal = (props: SearchModalProps) => {
	const { t } = useTranslation();
	const options = [
		{ label: "All", value: "all" },
		{ label: "Delegate", value: "delegate" },
		{ label: "Plugin", value: "plugin" },
		{ label: "Transaction", value: "transaction" },
		{ label: "Wallet", value: "wallet" },
	];
	const [selectedOption, setSelectedOption] = React.useState(options[0]);

	const data = [
		{
			title: "How do I install the plugin?",
			category: "Plugin",
			description:
				"ARK Core is written in TypeScript, and it has been using Lerna to manage the development and publication of its packages and uses Node.js as the bla bla bla",
		},
		{
			title: "Installing the side plugin",
			category: "Plugin",
			description:
				"ARK Core is written in TypeScript, and it has been using Lerna to manage the development and publication of its packages and uses Node.js as the bla bla bla",
		},
		{
			title: "If the plugin is not installed, what do we do?",
			category: "Plugin",
			description:
				"ARK Core is written in TypeScript, and it has been using Lerna to manage the development and publication of its packages and uses Node.js as the bla bla bla",
		},
	];

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
		<Modal
			title={t("SEARCH.MODAL_SEARCH.TITLE")}
			description={t("SEARCH.MODAL_SEARCH.DESCRIPTION")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="-mx-16">
				<SearchBar className="mt-8">
					<SearchBarOptions
						options={options}
						selectedOption={selectedOption}
						onSelect={(option: any) => setSelectedOption(option)}
					/>
				</SearchBar>
			</div>

			<div className="mt-8">
				<Table columns={columns} data={data}>
					{(rowData: any) => (
						<tr className="border-b border-theme-neutral-200">
							<td className="py-4 pr-8">
								<div className="font-semibold">{rowData.title}</div>

								<div className="mt-2 text-sm text-theme-neutral-700">{rowData.description}</div>
							</td>

							<td className="py-4 text-right align-top text-sm">
								<div>{rowData.category}</div>
							</td>
						</tr>
					)}
				</Table>
			</div>
		</Modal>
	);
};
