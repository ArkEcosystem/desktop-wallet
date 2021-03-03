import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Skeleton } from "app/components/Skeleton";
import { Table, TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import { useLedgerContext } from "app/contexts";
import { LedgerData, useLedgerScanner } from "app/contexts/Ledger";
import { useRandomNumber } from "app/hooks";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AmountWrapper = ({
	isFailed,
	isLoading,
	children,
}: {
	isFailed?: boolean;
	isLoading: boolean;
	children?: React.ReactNode;
}) => {
	const { t } = useTranslation();
	const amountWidth = useRandomNumber(100, 130);

	if (isLoading) {
		return (
			<span data-testid="LedgerScanStep__amount-skeleton" className="flex items-center space-x-1">
				<Skeleton height={16} width={amountWidth} />
				<Skeleton height={16} width={35} />
			</span>
		);
	}

	if (isFailed) {
		return (
			<div
				data-testid="LedgerScanStep__amount-error"
				className="flex items-center space-x-3 text-theme-danger-400"
			>
				<Circle className="border-theme-danger-400" noShadow size="sm">
					<Icon name="CrossSlim" />
				</Circle>
				<span>{t("COMMON.ERROR")}</span>
			</div>
		);
	}

	return <div>{children}</div>;
};

export const LedgerTable = ({
	network,
	wallets,
	selectedWallets,
	isSelected,
	isLoading,
	isFailed,
	toggleSelect,
	toggleSelectAll,
	isScanning,
}: {
	network: Network;
} & ReturnType<typeof useLedgerScanner>) => {
	const { t } = useTranslation();
	const isAllSelected = !isScanning && wallets.length > 0 && selectedWallets.length === wallets.length;

	const columns = [
		{
			Header: t("COMMON.WALLET"),
			accessor: "address",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: (
				<Tippy content={isAllSelected ? t("COMMON.UNSELECT_ALL") : t("COMMON.SELECT_ALL")}>
					<Checkbox
						data-testid="LedgerScanStep__select-all"
						onChange={() => toggleSelectAll()}
						checked={isAllSelected}
					/>
				</Tippy>
			),
			className: "justify-center",
			minimumWidth: true,
			id: "select",
		},
	];

	const { isBusy } = useLedgerContext();

	const showSkeleton = isScanning || (isBusy && wallets.length === 0);

	const skeletonRows = new Array(5).fill({});
	const data = showSkeleton ? skeletonRows : wallets;

	return (
		<Table columns={columns} data={data}>
			{(wallet: LedgerData) => {
				if (showSkeleton) {
					return (
						<TableRow>
							<TableCell variant="start" innerClassName="space-x-4">
								<Circle className="border-transparent" size="lg">
									<Skeleton circle height={44} width={44} />
								</Circle>
								<Skeleton height={16} width={120} />
							</TableCell>

							<TableCell innerClassName="justify-end">
								<AmountWrapper isLoading={true} />
							</TableCell>

							<TableCell variant="end">
								<Skeleton height={16} width={16} />
							</TableCell>
						</TableRow>
					);
				}

				return (
					<TableRow isSelected={isSelected(wallet.path)}>
						<TableCell variant="start" innerClassName="space-x-4">
							<Avatar address={wallet.address} size="lg" noShadow />
							<Address address={wallet.address} />
						</TableCell>

						<TableCell innerClassName="justify-end font-semibold" className="w-64">
							<AmountWrapper isLoading={isLoading(wallet.path)} isFailed={isFailed(wallet.path)}>
								<Amount value={wallet.balance!} ticker={network.ticker()} />
							</AmountWrapper>
						</TableCell>

						<TableCell variant="end" innerClassName="justify-center">
							<Checkbox
								disabled={isLoading(wallet.path) || isFailed(wallet.path)}
								checked={isSelected(wallet.path)}
								onChange={() => toggleSelect(wallet.path)}
							/>
						</TableCell>
					</TableRow>
				);
			}}
		</Table>
	);
};

export const LedgerScanStep = ({
	profile,
	setRetryFn,
}: {
	profile: Profile;
	setRetryFn?: (fn?: () => void) => void;
}) => {
	const { t } = useTranslation();
	const { watch, register, unregister, setValue } = useFormContext();
	const [network] = useState<Network>(() => watch("network"));

	const { isBusy, isConnected } = useLedgerContext();

	const ledgerScanner = useLedgerScanner(network.coin(), network.id(), profile);
	const {
		scanUntilNewOrFail,
		selectedWallets,
		scanRetry,
		canRetry,
		scanMore,
		isScanning,
		abortScanner,
	} = ledgerScanner;

	// eslint-disable-next-line arrow-body-style
	useEffect(() => {
		return () => {
			abortScanner();
		};
	}, [abortScanner]);

	useEffect(() => {
		setValue("isFinished", !isScanning, { shouldDirty: true, shouldValidate: true });
	}, [isScanning, setValue]);

	useEffect(() => {
		if (canRetry) {
			setRetryFn?.(() => scanRetry());
		} else {
			setRetryFn?.(undefined);
		}
		return () => setRetryFn?.(undefined);
	}, [setRetryFn, scanRetry, canRetry]);

	useEffect(() => {
		scanUntilNewOrFail();
	}, [scanUntilNewOrFail]);

	useEffect(() => {
		register("wallets", { required: true, validate: (value) => Array.isArray(value) && value.length > 0 });
		register("isFinished", { required: true });

		return () => {
			unregister("wallets");
			unregister("isFinished");
		};
	}, [register, unregister]);

	useEffect(() => {
		setValue("wallets", selectedWallets, { shouldValidate: true, shouldDirty: true });
	}, [selectedWallets, setValue]);

	return (
		<section data-testid="LedgerScanStep" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_SCAN_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_SCAN_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork id="ImportWallet__network" networks={[]} selected={network} disabled />
			</FormField>

			<LedgerTable network={network} {...ledgerScanner} />

			<Tooltip content={t("COMMON.LEDGER_DISCONNECTED")} disabled={isConnected}>
				<div>
					<Button
						data-testid="LedgerScanStep__view-more"
						variant="secondary"
						className="w-full"
						disabled={!isConnected || canRetry || isBusy || isScanning}
						isLoading={isScanning || isBusy}
						onClick={scanMore}
					>
						{t("COMMON.VIEW_MORE")}
					</Button>
				</div>
			</Tooltip>
		</section>
	);
};
