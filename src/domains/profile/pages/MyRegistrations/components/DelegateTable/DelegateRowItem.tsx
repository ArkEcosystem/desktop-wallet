import { ReadWriteWallet, WalletData } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowItemSkeleton } from "./DelegateRowItemSkeleton";

type DelegateRowItem = {
	wallet: ReadWriteWallet;
	onAction?: any;
};

const getStatusIcon = (confirmed: boolean) => {
	if (!confirmed) {
		return <Icon name="StatusClock" className="ml-2 text-theme-neutral" />;
	}

	return <Icon name="Checkmark" className="ml-1 text-theme-success" width={30} height={30} />;
};

export const DelegateRowItem = ({ wallet, onAction }: DelegateRowItem) => {
	const [delegateInfo, setDelegateInfo] = useState<WalletData | any>();

	const { t } = useTranslation();

	const options = [
		{ label: t("COMMON.UPDATE"), value: "update" },
		{ label: t("COMMON.RESIGN"), value: "resign" },
	];

	useEffect(() => {
		const fetchDelegateInfo = async () => {
			const delegate = await wallet.client().delegate(wallet.address());
			setDelegateInfo(delegate);
		};
		fetchDelegateInfo();
	}, [wallet]);

	if (!delegateInfo) return <DelegateRowItemSkeleton />;

	return (
		<tr data-testid="DelegateRowItem" className="border-b border-dashed border-theme-neutral-light">
			<td className="w-24 py-6">
				<div className="flex items-center">
					<Circle className="border-theme-neutral-800" size="lg">
						<Icon name="Business" width={22} height={22} />
					</Circle>
					<Avatar address={wallet.address()} size="lg" className="mr-4" />
				</div>
			</td>
			<td className="font-semibold">
				<span>{delegateInfo.username()}</span>
			</td>
			<td className="font-semibold text-theme-neutral-dark">
				<span>#{delegateInfo.rank()}</span>
			</td>
			<td className="font-semibold text-center text-theme-primary">
				<span className="flex justify-center">
					<Icon name="Msq" width={22} height={22} />
				</span>
			</td>
			<td className="text-theme-neutral-light">
				<span className="flex justify-center">{getStatusIcon(delegateInfo.hasPassed())}</span>
			</td>
			<td className="text-theme-neutral-light">
				<span className="flex justify-center">
					<span className="whitespace-no-wrap">2,450.643 Ѧ</span>
				</span>
			</td>
			<td className="font-semibold text-theme-neutral-dark">
				<div className="flex items-center justify-end">
					<small className="text-theme-neutral">2,43%</small>
					<span className="ml-1 whitespace-no-wrap">2,450.643 Ѧ</span>
				</div>
			</td>
			<td className="align-middle">
				<span className="flex justify-end">
					<Button variant="plain" size="sm" className="ml-16">
						<Dropdown
							data-testid="DelegateRowItem__actions"
							toggleIcon="Settings"
							options={options}
							onSelect={({ value }: any) => onAction?.({ walletId: wallet.id(), action: value })}
						/>
					</Button>
				</span>
			</td>
		</tr>
	);
};
