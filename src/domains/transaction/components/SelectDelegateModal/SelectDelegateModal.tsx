import { Numeral } from "@arkecosystem/platform-sdk-intl";
import { SvgCollection } from "app/assets/svg";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Circle } from "app/components/Circle";
import { Modal } from "app/components/Modal";
import { RadioButton } from "app/components/RadioButton";
import { Table } from "app/components/Table";
import { SearchBar } from "domains/search/components/SearchBar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SelectDelegateModalProps = {
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
				className="flex items-center font-semibold border-b border-dashed border-theme-neutral-200 last:border-0 py-4"
			>
				<div className="flex flex-1">
					<Circle avatarId="test" className="mr-8" />

					<div className="mr-2">{delegate.username}</div>
					<div className="text-theme-neutral-500">{delegate.address}</div>
				</div>
				#{delegate.rank}
			</div>,
		);
	}

	return <div className={props.className}>{output}</div>;
};

export const SelectDelegateModal = (props: SelectDelegateModalProps) => {
	const { t } = useTranslation();
	const [showSelectedList, setShowSelectedList] = useState(false);
	const [selected, setSelected] = useState({} as any);
	const toggleSelected = (delegate: any) => {
		if (selected[delegate.username]) {
			setSelected(
				Object.values(selected).reduce((mapping: any, selectedDelegate: any) => {
					if (selectedDelegate.username === delegate.username) {
						return mapping;
					}

					mapping[selectedDelegate.username] = selectedDelegate;

					return mapping;
				}, {}) as any,
			);

			return;
		}

		if (props.allowMultiple) {
			setSelected({
				...selected,
				[delegate.username]: delegate,
			});

			return;
		}

		setSelected({
			[delegate.username]: delegate,
		});
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
					{(rowData: any) => (
						<tr
							className={`border-b border-dashed border-theme-neutral-200 ${
								selected[rowData.username] && "bg-theme-success-100"
							}`}
						>
							<td className="w-16 text-center">
								{props.allowMultiple ? (
									<Checkbox
										checked={selected[rowData.username]}
										onChange={() => toggleSelected(rowData)}
										data-testid={`SelectedDelegateModal__select-delegate-${rowData.username}`}
									/>
								) : (
									<RadioButton
										checked={selected[rowData.username]}
										onChange={() => toggleSelected(rowData)}
										data-testid={`SelectedDelegateModal__select-delegate-${rowData.username}`}
									/>
								)}
							</td>

							<td className="w-16 px-4">
								<Circle avatarId="test" noShadow={true} />
							</td>

							<td className="py-6 font-semibold">
								<div>{rowData.username}</div>
							</td>

							<td className="py-6 font-semibold text-theme-neutral-700">#{rowData.rank}</td>

							<td className="py-6 text-center text-theme-primary-500">
								{rowData.marketsquare && (
									<a href={rowData.marketsquare}>
										<SvgCollection.Link className="inline-block h-5 cursor-pointer" />
									</a>
								)}
							</td>

							<td className="py-6 font-semibold whitespace-no-wrap text-theme-neutral-700">
								<div>{Numeral.make("en").format(rowData.forged_ark)} A</div>
							</td>

							<td className="py-6 font-semibold text-right whitespace-no-wrap text-theme-neutral-700 pr-8">
								<span className="mr-1 text-sm text-theme-neutral-500">
									{Numeral.make("en").format((rowData.votes / totalSupply) * 100)}%
								</span>

								<span>{Numeral.make("en").format(rowData.votes)} A</span>
							</td>

							<td className="w-16">
								{rowData.voting ? (
									<Circle avatarId="test" noShadow={true} />
								) : (
									<Circle className=" border-theme-primary-100" noShadow={true} />
								)}
							</td>
						</tr>
					)}
				</Table>
			</div>

			{Object.keys(selected).length ? (
				<div
					className="absolute bottom-0 left-0 right-0 pl-4 pr-12 pt-8 pb-10 bg-white shadow-2xl"
					data-testid="SelectedDelegateModal__footer"
				>
					{!props.allowMultiple && Object.keys(selected).length ? (
						<div className="flex">
							<div className="px-8 mr-8 border-r border-theme-neutral-300">
								<div className="text-sm text-theme-neutral-500">{t("COMMON.RANK")}</div>

								<div className="font-semibold text-theme-neutral-700">#3</div>
							</div>

							<div className="flex flex-1">
								<Circle avatarId="test" className="mr-2" />

								<div>
									<div className="text-sm text-theme-neutral-500">{t("COMMON.DELEGATE_ADDRESS")}</div>

									<div className="font-semibold text-theme-neutral-700">
										{Object.values(selected)[0].username} - {Object.values(selected)[0].address}
									</div>
								</div>
							</div>

							<Button onClick={props.onVote}>Vote</Button>
						</div>
					) : (
						""
					)}

					{props.allowMultiple && Object.keys(selected).length ? (
						<div className="flex">
							<div className="px-8 mr-8 font-semibold border-r border-theme-neutral-300">
								<div className="text-sm text-theme-neutral-500">{t("COMMON.QUANTITY")}</div>

								<div className="text-theme-neutral-700">{Object.keys(selected).length}/50</div>
							</div>

							<div className="flex-1">
								<div className="flex justify-between">
									<div className="font-semibold">
										<div className="text-sm text-theme-neutral-500">{t("COMMON.DELEGATES")}</div>

										<div
											data-testid="SelectedDelegateModal__toggle-show-selected"
											className="text-theme-primary-700 hover:text-theme-primary-500 cursor-pointer"
											onClick={() => setShowSelectedList(!showSelectedList)}
										>
											{showSelectedList ? "Hide" : "Show"} List
										</div>
									</div>

									<Button onClick={props.onVote}>Vote</Button>
								</div>

								{showSelectedList && (
									<SelectedDelegateList delegates={Object.values(selected)} className="mt-2" />
								)}
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

SelectDelegateModal.defaultProps = {
	allowMultiple: false,
};
