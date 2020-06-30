import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Table } from "app/components/Table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { DelegateListItem } from "../DelegateListItem";

type DelegateListProps = {
	data?: any;
};

const SelectedDelegateList = ({ delegates, className }: { delegates: any[]; className: string }) => {
	const output = [];

	for (const delegate of delegates) {
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

	return <div className={className}>{output}</div>;
};

const DelegateAvatarList = ({ delegates, limit }: { delegates: any[]; limit: number }) => {
	const items = delegates.slice(0, limit);
	const rest = Math.max(0, delegates.length - limit);

	return (
		<div data-testid="DelegateAvatarList__avatar-list" className="flex items-center -space-x-2">
			{items.map((item, index) => (
				<Avatar data-testid="DelegateAvatarList__avatar-list__avatar" key={index} address={item.address} />
			))}
			{rest > 0 && (
				<Circle
					data-testid="DelegateAvatarList__avatar-list__rest"
					size="large"
					className="text-lg font-bold bg-theme-background border-theme-neutral-200 text-theme-primary-700"
				>
					+{rest}
				</Circle>
			)}
		</div>
	);
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
					data-testid="DelegateList__footer"
				>
					<div className="flex">
						<div className="px-8 mr-8 font-semibold border-r border-theme-neutral-300">
							<div className="text-sm text-theme-neutral-500">{t("COMMON.QUANTITY")}</div>
							<div className="text-theme-neutral-700">{selected.length}/50</div>
						</div>

						<div className="flex-1">
							<div className="flex justify-between">
								<div className="font-semibold">
									{selected.length === 1 ? (
										<>
											<div className="inline-flex">
												<Avatar address={selected[0].address} className="mr-4" />
												<div className="flex flex-col">
													<div className="text-sm text-theme-neutral-700">
														Address Delegate
													</div>
													<div className="text-theme-neutral-500">
														{selected[0].username} - {selected[0].address}
													</div>
												</div>
											</div>
										</>
									) : (
										<div className="inline-flex items-center">
											<DelegateAvatarList delegates={selected} limit={2} />
											<div
												data-testid="DelegateList__toggle-show-selected"
												className="ml-4 cursor-pointer text-theme-primary-700 hover:text-theme-primary-500"
												onClick={() => setShowSelectedList(!showSelectedList)}
											>
												{showSelectedList ? "Hide" : "Show"} List
											</div>
										</div>
									)}
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
