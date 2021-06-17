import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Alert } from "app/components/Alert";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Checkbox } from "app/components/Checkbox";
import { Circle } from "app/components/Circle";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Skeleton } from "app/components/Skeleton";
import { Table, TableCell, TableRow } from "app/components/Table";
import { useLedgerContext } from "app/contexts";
import { LedgerData, useLedgerScanner } from "app/contexts/Ledger";
import { useRandomNumber } from "app/hooks";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AmountWrapper = ({ isLoading, children }: { isLoading: boolean; children?: React.ReactNode }) => {
	const amountWidth = useRandomNumber(100, 130);

	if (isLoading) {
		return (
			<span data-testid="LedgerScanStep__amount-skeleton" className="flex items-center space-x-1">
				<Skeleton height={16} width={amountWidth} />
				<Skeleton height={16} width={35} />
			</span>
		);
	}

	return <div>{children}</div>;
};

export const LedgerTable = ({
	network,
	wallets,
	selectedWallets,
	isSelected,
	toggleSelect,
	toggleSelectAll,
	isScanning,
}: {
	network: Networks.Network;
} & ReturnType<typeof useLedgerScanner>) => {
	const { t } = useTranslation();
	const isAllSelected = !isScanning && wallets.length > 0 && selectedWallets.length === wallets.length;

	const columns = [
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "no-border justify-end",
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

	const skeletonRows = Array.from({ length: 5 }).fill({});
	const data = showSkeleton ? skeletonRows : wallets;

	return (
		<Table columns={columns} data={data}>
			{(wallet: LedgerData) => {
				if (showSkeleton) {
					return (
						<TableRow>
							<TableCell variant="start" className="w-2/5" innerClassName="space-x-4">
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
						<TableCell variant="start" className="w-2/5" innerClassName="space-x-4">
							<Avatar address={wallet.address} size="lg" noShadow />
							<div className="flex flex-1 w-32">
								<Address address={wallet.address} />
							</div>
							<span className="hidden">{wallet.path}</span>
						</TableCell>

						<TableCell innerClassName="justify-end font-semibold">
							<AmountWrapper isLoading={false}>
								<Amount value={wallet.balance!} ticker={network.ticker()} />
							</AmountWrapper>
						</TableCell>

						<TableCell variant="end" innerClassName="justify-center">
							<Checkbox checked={isSelected(wallet.path)} onChange={() => toggleSelect(wallet.path)} />
						</TableCell>
					</TableRow>
				);
			}}
		</Table>
	);
};

export const LedgerScanStep = ({
	setRetryFn,
	profile,
}: {
	profile: Contracts.IProfile;
	setRetryFn?: (function_?: () => void) => void;
}) => {
	const { t } = useTranslation();
	const { watch, register, unregister, setValue } = useFormContext();
	const [network] = useState<Networks.Network>(() => watch("network"));

	const ledgerScanner = useLedgerScanner(network.coin(), network.id());

	const { scan, selectedWallets, canRetry, isScanning, abortScanner, error } = ledgerScanner;

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
			setRetryFn?.(() => scan(profile));
		} else {
			setRetryFn?.(undefined);
		}
		return () => setRetryFn?.(undefined);
	}, [setRetryFn, scan, canRetry, profile]);

	useEffect(() => {
		scan(profile);
	}, [scan, profile]);

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

			{error ? (
				<Alert variant="danger">
					<span data-testid="LedgerScanStep__error">{error}</span>
				</Alert>
			) : (
				<LedgerTable network={network} {...ledgerScanner} />
			)}
		</section>
	);
};
