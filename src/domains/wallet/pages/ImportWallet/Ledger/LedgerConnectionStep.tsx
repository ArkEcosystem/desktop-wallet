import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import { Spinner } from "app/components/Spinner";
import { useLedgerContext } from "app/contexts/Ledger";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ConnectionContent = ({
	error,
	isConnected,
	coinName,
}: {
	isConnected: boolean;
	error: string;
	coinName: string;
}) => {
	const { t } = useTranslation();

	if (isConnected) {
		return <Alert variant="success">{t("WALLETS.MODAL_LEDGER_WALLET.CONNECT_SUCCESS")}</Alert>;
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	return (
		<div className="space-y-8">
			<Image name="WaitingLedgerDevice" domain="wallet" className="mx-auto" />

			<div className="inline-flex justify-center items-center space-x-3 w-full">
				<Spinner />
				<span className="font-semibold animate-pulse text-theme-secondary-text">
					{t("WALLETS.MODAL_LEDGER_WALLET.OPEN_APP", { coin: coinName })}
				</span>
			</div>
		</div>
	);
};

export const LedgerConnectionStep = ({
	onConnect,
	onFailed,
}: {
	onConnect?: () => void;
	onFailed?: (error: Error) => void;
}) => {
	const { t } = useTranslation();

	const { watch, register, setValue, unregister } = useFormContext();
	const { connect, abortConnectionRetry, error, isConnected } = useLedgerContext();

	const [network] = useState<Network>(() => watch("network"));
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		register("connected", { required: true });

		return () => {
			unregister("connected");
		};
	}, [register, unregister]);

	useEffect(() => {
		const run = async () => {
			try {
				await connect(network.coin(), network.id());
			} catch (error) {
				onFailed?.(error);
			}
			setIsReady(true);
		};
		run();
	}, [connect, network, onFailed]);

	useEffect(() => {
		if (isConnected && isReady) {
			setValue("connected", true, { shouldDirty: true, shouldValidate: true });
			onConnect?.();
		}
	}, [isReady, isConnected, onConnect, setValue]);

	useEffect(
		() => () => {
			abortConnectionRetry();
		},
		[abortConnectionRetry],
	);

	return (
		<section data-testid="LedgerConnectionStep" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_CONNECTION_STEP.SUBTITLE")}
			/>

			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork id="ImportWallet__network" networks={[]} selected={network} disabled />
			</FormField>

			<ConnectionContent error={error} isConnected={isConnected && isReady} coinName={network.coin()} />
		</section>
	);
};
