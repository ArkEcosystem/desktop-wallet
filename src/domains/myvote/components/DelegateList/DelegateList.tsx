import { Button } from "app/components/Button";
import { Table } from "app/components/Table";
import { Avatar } from "domains/wallet/components/Avatar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { DelegateListItem } from "../DelegateListItem";

type DelegateListProps = {
	data?: any;
};

type SelectedDelegateListProps = {
	delegates: any[];
	className?: string;
};

const SelectedDelegateList = (props: SelectedDelegateListProps) => {
	const output = [];

	for (const delegate of props.delegates) {
		output.push(
			<div
				key={delegate.username}
				className="flex items-center py-4 font-semibold border-b border-dashed border-theme-neutral-200 last:border-0"
			>
				<div className="flex flex-1">
					<Avatar address={delegate.address} className="mr-8" />
					<div className="mr-2">{delegate.username}</div>
					<div className="text-theme-neutral-500">{delegate.address}</div>
				</div>
				#{delegate.rank}
			</div>,
		);
	}

	return <div className={props.className}>{output}</div>;
};

export const DelegateList = (props: DelegateListProps) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState([] as any);
	const [showSelectedList, setShowSelectedList] = useState(false);
	const columns = [
		{
			Header: "",
			accessor: "delegateAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: "Delegate Name",
			accessor: "delegateName",
		},
		{
			Header: "Rank",
			accessor: "rank",
		},
		{
			Header: "Votes",
			accessor: "votes",
		},
		{
			Header: "Profile",
			accessor: "profile",
			disableSortBy: true,
			className: "flex justify-center",
		},
		{
			Header: "Comm.",
			accessor: "commissionPercentage",
		},
		{
			Header: "Payout",
			accessor: "payout",
		},
		{
			Header: "Min",
			accessor: "min",
		},
		{
			Header: "Commission (Daily)",
			accessor: "commissionDaily",
		},
		{
			Header: "",
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	const toggleSelected = (delegate: any) => {
		if (selected.find((selectedDelegate: any) => selectedDelegate.username === delegate.username)) {
			setSelected(selected.filter((selectedDelegate: any) => selectedDelegate.username !== delegate.username));

			return;
		}

		setSelected([...selected, delegate]);
	};

	return (
		<div>
			<Table columns={columns} data={props.data}>
				{(rowData: any) => <DelegateListItem {...rowData} selected={selected} onSelect={toggleSelected} />}
			</Table>

			{selected.length ? (
				<div
					className="absolute bottom-0 left-0 right-0 pt-8 pb-10 pl-4 pr-12 bg-white shadow-2xl"
					data-testid="SelectedDelegateModal__footer"
				>
					<div className="flex">
						<div className="px-8 mr-8 font-semibold border-r border-theme-neutral-300">
							<div className="text-sm text-theme-neutral-500">{t("COMMON.QUANTITY")}</div>
							<div className="text-theme-neutral-700">{selected.length}/50</div>
						</div>

						<div className="flex-1">
							<div className="flex justify-between">
								<div className="font-semibold">
									<div className="text-sm text-theme-neutral-500">{t("COMMON.DELEGATES")}</div>

									<div
										data-testid="SelectedDelegateModal__toggle-show-selected"
										className="cursor-pointer text-theme-primary-700 hover:text-theme-primary-500"
										onClick={() => setShowSelectedList(!showSelectedList)}
									>
										{showSelectedList ? "Hide" : "Show"} List
									</div>
								</div>

								<Button>Continue</Button>
							</div>

							{showSelectedList && <SelectedDelegateList delegates={selected} className="mt-2" />}
						</div>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

DelegateList.defaultProps = {
	data: [],
};
