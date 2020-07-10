import { Numeral } from "@arkecosystem/platform-sdk-intl";
import { SvgCollection } from "app/assets/svg";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Circle } from "app/components/Circle";
import { Modal } from "app/components/Modal";
import { RadioButton } from "app/components/RadioButton";
import { SearchBar } from "app/components/SearchBar";
import { Table } from "app/components/Table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SelectDelegateProps = {
	isOpen: boolean;
	onClose?: any;
	onVote?: any;
	allowMultiple?: boolean;
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
					<Avatar address="test" size="sm" className="mr-8" />

					<div className="mr-2">{delegate.username}</div>
					<div className="text-theme-neutral">{delegate.address}</div>
				</div>
				#{delegate.rank}
			</div>,
		);
	}

	return <div className={props.className}>{output}</div>;
};

export const SelectDelegate = (props: SelectDelegateProps) => {
	const { t } = useTranslation();
	const [showSelectedList, setShowSelectedList] = useState(false);
	const [selected, setSelected] = useState([] as any);
	const toggleSelected = (delegate: any) => {
		if (selected.find((selectedDelegate: any) => selectedDelegate.username === delegate.username)) {
			setSelected(selected.filter((selectedDelegate: any) => selectedDelegate.username !== delegate.username));

			return;
		}

		if (props.allowMultiple) {
			setSelected([...selected, delegate]);

			return;
		}

		setSelected([delegate]);
	};

	const totalSupply = 129354814;
	const data = [
		{
			selected: false,
			username: "Delegate1",
			address: "AADDDDDDDRREEEEESSSSSSS",
			rank: 1,
			previousRank: 3,
			marketsquare: "https://ms.com",
			forged_ark: "225946",
			votes: "3143322",
			voting: false,
		},
		{
			selected: false,
			username: "Delegate2",
			address: "AADDDDDDDRREEEEESSSSSSS",
			rank: 2,
			previousRank: 5,
			marketsquare: null,
			forged_ark: "465437",
			votes: "2364566",
			voting: false,
		},
		{
			selected: false,
			username: "Delegate3",
			address: "AADDDDDDDRREEEEESSSSSSS",
			rank: 3,
			previousRank: 1,
			marketsquare: "https://ms.com",
			forged_ark: "693236",
			votes: "1976303",
			voting: true,
		},
		{
			selected: false,
			username: "Delegate4",
			address: "AADDDDDDDRREEEEESSSSSSS",
			rank: 4,
			previousRank: 4,
			forged_ark: "693236",
			votes: "1976303",
			voting: false,
		},
	];

	const columns = [
		{
			Header: t("COMMON.CHOOSE"),
			accessor: "selected",
			disableSortBy: true,
		},
		{
			accessor: "avatar",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.DELEGATE_NAME"),
			accessor: "username",
		},
		{
			Header: t("COMMON.RANK"),
			accessor: "rank",
		},
		{
			Header: t("COMMON.MARKETSQUARE"),
			accessor: "marketsquare",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.FORGED_ARK"),
			accessor: "forged_ark",
		},
		{
			Header: t("COMMON.VOTES"),
			accessor: "votes",
			className: "justify-end mr-8",
		},
		{
			Header: t("COMMON.VOTING"),
			accessor: "voting",
			disableSortBy: true,
		},
	];

	return (
		<Modal
			title={t("TRANSACTION.MODAL_SELECT_DELEGATE.TITLE")}
			description={t("TRANSACTION.MODAL_SELECT_DELEGATE.DESCRIPTION")}
			size="5xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="-mx-12">
				<SearchBar className="mt-8" placeholder="Search for a Delegate" />
			</div>

			<div className="mt-8 mb-14">
				<Table columns={columns} data={data}>
					{(rowData: any) => {
						const isSelected =
							selected.find((selectedDelegate: any) => selectedDelegate.username === rowData.username) ||
							false;

						return (
							<tr
								className={`border-b border-dashed border-theme-neutral-200 ${
									isSelected && "bg-theme-success-contrast"
								}`}
							>
								<td className="w-16 text-center">
									{props.allowMultiple ? (
										<Checkbox
											checked={isSelected}
											onChange={() => toggleSelected(rowData)}
											data-testid={`SelectedDelegateModal__select-delegate-${rowData.username}`}
										/>
									) : (
										<RadioButton
											checked={isSelected}
											onChange={() => toggleSelected(rowData)}
											data-testid={`SelectedDelegateModal__select-delegate-${rowData.username}`}
										/>
									)}
								</td>

								<td className="w-16 px-4">
									<Avatar address="test" noShadow />
								</td>

								<td className="py-6 font-semibold">
									<div>{rowData.username}</div>
								</td>

								<td className="py-6 font-semibold text-theme-neutral-dark">#{rowData.rank}</td>

								<td className="py-6 text-center text-theme-primary-500">
									{rowData.marketsquare && (
										<a href={rowData.marketsquare}>
											<SvgCollection.Link className="inline-block h-5 cursor-pointer" />
										</a>
									)}
								</td>

								<td className="py-6 font-semibold whitespace-no-wrap text-theme-neutral-dark">
									<div>{Numeral.make("en").format(rowData.forged_ark)} A</div>
								</td>

								<td className="py-6 pr-8 font-semibold text-right whitespace-no-wrap text-theme-neutral-dark">
									<span className="mr-1 text-sm text-theme-neutral">
										{Numeral.make("en").format((rowData.votes / totalSupply) * 100)}%
									</span>

									<span>{Numeral.make("en").format(rowData.votes)} A</span>
								</td>

								<td className="w-16">
									{rowData.voting ? (
										<Avatar address="test" noShadow />
									) : (
										<Circle className=" border-theme-primary-contrast" noShadow={true} />
									)}
								</td>
							</tr>
						);
					}}
				</Table>
			</div>

			{Object.keys(selected).length ? (
				<div
					className="absolute bottom-0 left-0 right-0 pt-8 pb-10 pl-4 pr-12 bg-white shadow-2xl"
					data-testid="SelectedDelegateModal__footer"
				>
					{!props.allowMultiple && Object.keys(selected).length ? (
						<div className="flex">
							<div className="px-8 mr-8 border-r border-theme-neutral-300">
								<div className="text-sm text-theme-neutral">{t("COMMON.RANK")}</div>

								<div className="font-semibold text-theme-neutral-dark">#3</div>
							</div>

							<div className="flex flex-1">
								<Avatar address="test" className="mr-2" />

								<div>
									<div className="text-sm text-theme-neutral">{t("COMMON.DELEGATE_ADDRESS")}</div>

									<div className="font-semibold text-theme-neutral-dark">
										{selected[0].username} - {selected[0].address}
									</div>
								</div>
							</div>

							<Button onClick={props.onVote}>Vote</Button>
						</div>
					) : (
						""
					)}

					{props.allowMultiple && selected.length ? (
						<div className="flex">
							<div className="px-8 mr-8 font-semibold border-r border-theme-neutral-300">
								<div className="text-sm text-theme-neutral">{t("COMMON.QUANTITY")}</div>

								<div className="text-theme-neutral-dark">{selected.length}/50</div>
							</div>

							<div className="flex-1">
								<div className="flex justify-between">
									<div className="font-semibold">
										<div className="text-sm text-theme-neutral">{t("COMMON.DELEGATES")}</div>

										<div
											data-testid="SelectedDelegateModal__toggle-show-selected"
											className="cursor-pointer text-theme-primary-dark hover:text-theme-primary-500"
											onClick={() => setShowSelectedList(!showSelectedList)}
										>
											{showSelectedList ? "Hide" : "Show"} List
										</div>
									</div>

									<Button onClick={props.onVote}>Vote</Button>
								</div>

								{showSelectedList && <SelectedDelegateList delegates={selected} className="mt-2" />}
							</div>
						</div>
					) : (
						""
					)}
				</div>
			) : (
				""
			)}
		</Modal>
	);
};

SelectDelegate.defaultProps = {
	allowMultiple: false,
};
