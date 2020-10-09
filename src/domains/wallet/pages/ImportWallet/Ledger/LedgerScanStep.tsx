import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Checkbox } from "app/components/Checkbox";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Spinner } from "app/components/Spinner";
import { Table, TableCell, TableRow } from "app/components/Table";
import { useLedgerContext } from "app/contexts";
import { LedgerData } from "app/contexts/Ledger/use-ledger";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const LedgerTable = ({
	network,
	data,
	onChange,
	checkedAddresses,
}: {
	network: Network;
	data: LedgerData[];
	onChange: (cb: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
	checkedAddresses: Record<string, boolean>;
}) => {
	const columns = [
		{
			Header: "Wallet",
			accessor: "address",
		},
		{
			Header: "Balance",
			accessor: "balance",
		},
		{
			Header: "Select",
		},
	];

	const handleCheckbox = (address: string) => {
		onChange((prev) => {
			const value = prev[address];
			return { ...prev, [address]: !value };
		});
	};

	return (
		<Table columns={columns} data={data}>
			{(wallet: LedgerData) => (
				<TableRow>
					<TableCell isSelected={checkedAddresses[wallet.address]} variant="start" innerClassName="space-x-3">
						<Avatar address={wallet.address} noShadow />
						<Address address={wallet.address} />
					</TableCell>
					<TableCell isSelected={checkedAddresses[wallet.address]} innerClassName="font-semibold">
						<Amount value={wallet.balance} ticker={network.ticker()} />
					</TableCell>
					<TableCell isSelected={checkedAddresses[wallet.address]} innerClassName="justify-center">
						<Checkbox
							checked={checkedAddresses[wallet.address] ?? false}
							onChange={() => handleCheckbox(wallet.address)}
						/>
					</TableCell>
				</TableRow>
			)}
		</Table>
	);
};

export const LedgerScanStep = ({ profile }: { profile: Profile }) => {
	const { t } = useTranslation();
	const { watch, register, setValue } = useFormContext();
	const { scanWallets, isBusy } = useLedgerContext();

	const [network] = useState<Network>(() => watch("network"));

	const [ledgerWallets, setLedgerWallets] = useState<LedgerData[]>([]);
	const [checkedAddresses, setCheckedAddresses] = useState<Record<string, boolean>>({});

	const scan = useCallback(() => {
		scanWallets(network.coin(), network.id(), profile, (wallet) => {
			setLedgerWallets((prev) => [...prev, wallet]);
			setCheckedAddresses((prev) => ({ ...prev, [wallet.address]: true }));
		});
	}, [scanWallets, network, profile]);

	useEffect(() => {
		register("wallets", { required: true, validate: (value) => Array.isArray(value) && value.length > 0 });
	}, [register]);

	useEffect(() => {
		const wallets = ledgerWallets.filter((item) => checkedAddresses[item.address]);
		setValue("wallets", wallets, { shouldValidate: true, shouldDirty: true });
	}, [checkedAddresses, setValue, ledgerWallets]);

	useEffect(() => {
		scan();
	}, [scan]);

	const handleCheckbox = (address: string) => {
		setCheckedAddresses((prev) => {
			const value = prev[address];
			return { ...prev, [address]: !value };
		});
	};

	return (
		<section className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork id="ImportWallet__network" networks={[]} selected={network} disabled />
			</FormField>

			<LedgerTable
				network={network}
				checkedAddresses={checkedAddresses}
				onChange={setCheckedAddresses}
				data={ledgerWallets}
			/>

			{isBusy && (
				<div className="inline-flex items-center justify-center w-full mt-8 space-x-3">
					<Spinner color="primary" />
					<span className="text-theme-text">Loading</span>
				</div>
			)}
		</section>
	);
};
