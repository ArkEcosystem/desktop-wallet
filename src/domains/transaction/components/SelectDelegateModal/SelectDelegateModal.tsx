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
	allowMultiple?: boolean;
};

export const SelectDelegateModal = (props: SelectDelegateModalProps) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState({} as any);
	const toggleSelected = (delegate: any) => {
		if (selected[delegate.id]) {
			setSelected(
				Object.values(selected).reduce((mapping: any, selectedDelegate: any) => {
					if (selectedDelegate.id === delegate.id) {
						return mapping;
					}

					mapping[selectedDelegate.id] = selectedDelegate;

					return mapping;
				}, {}) as any,
			);
			console.log("old", selected);

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
			...selected,
			[delegate.id]: delegate,
		});
		console.log("new", selected);
	};

	const totalSupply = 129354814;
	const data = [
		{
			id: 1,
			selected: false,
			delegate_name: "Delegate 1",
			rank: "1",
			marketsquare: "https://ms.com",
			forged_ark: "225946",
			votes: "3143322",
			voting: false,
		},
		{
			id: 2,
			selected: false,
			delegate_name: "Delegate 2",
			rank: "2",
			marketsquare: "https://ms.com",
			forged_ark: "465437",
			votes: "2364566",
			voting: false,
		},
		{
			id: 3,
			selected: false,
			delegate_name: "Delegate 3",
			rank: "3",
			marketsquare: "https://ms.com",
			forged_ark: "693236",
			votes: "1976303",
			voting: true,
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
			accessor: "delegate_name",
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
			className: "justify-end",
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
			size="4xl"
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
							className={`border-b border-theme-neutral-200 ${
								selected[rowData.id] && "bg-theme-success-100"
							}`}
						>
							<td className="w-16 text-center">
								{props.allowMultiple ? (
									<Checkbox checked={selected[rowData.id]} onChange={() => toggleSelected(rowData)} />
								) : (
									<RadioButton
										checked={selected[rowData.id]}
										onChange={() => toggleSelected(rowData)}
									/>
								)}
							</td>

							<td className="w-16 px-4">
								<Circle avatarId="test" noShadow={true} />
							</td>

							<td className="py-6 font-semibold">
								<div>{rowData.delegate_name}</div>
							</td>

							<td className="py-6">
								<div className="font-semibold text-theme-neutral-700">#{rowData.rank}</div>
							</td>

							<td className="py-6 text-center text-theme-primary-500">
								<SvgCollection.Link className="inline-block h-5 cursor-pointer" />
							</td>

							<td className="py-6 font-semibold whitespace-no-wrap text-theme-neutral-700">
								<div>{Numeral.make("en").format(rowData.forged_ark)} A</div>
							</td>

							<td className="py-6 font-semibold text-right whitespace-no-wrap text-theme-neutral-700">
								<span className="mr-1 text-sm text-theme-neutral-500">
									{Numeral.make("en").format((rowData.votes / totalSupply) * 100)}%
								</span>

								<span>{Numeral.make("en").format(rowData.votes)} A</span>
							</td>

							<td className="w-24 text-right">
								<div>
									{rowData.voting ? (
										<Circle avatarId="test" noShadow={true} />
									) : (
										<Circle className=" border-theme-primary-100" noShadow={true} />
									)}
								</div>
							</td>
						</tr>
					)}
				</Table>
			</div>

			<div className="absolute bottom-0 left-0 right-0 flex px-8 py-6 bg-white shadow-2xl">
				<div className="px-8 mr-8 border-r border-theme-neutral-200">
					<div className="text-sm text-theme-neutral-500">Rank</div>

					<div className="font-semibold text-theme-neutral-700">#3</div>
				</div>

				<div className="flex flex-1">
					<Circle avatarId="test" className="mr-2" />

					<div>
						<div className="text-sm text-theme-neutral-500">Address Delegate</div>

						<div className="font-semibold text-theme-neutral-700">Delegate 3 - AADDDDDDDRREEEEESSSSSSS</div>
					</div>
				</div>

				<Button>Vote</Button>
			</div>
		</Modal>
	);
};

SelectDelegateModal.defaultProps = {
	allowMultiple: false,
};
