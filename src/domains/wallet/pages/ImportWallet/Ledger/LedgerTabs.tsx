import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext, useLedgerContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import React, { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { FirstStep } from "../Step1";
import { LedgerConnectionStep } from "./LedgerConnectionStep";
import { LedgerImportStep } from "./LedgerImportStep";
import { LedgerScanStep } from "./LedgerScanStep";

const Paginator = ({
	size,
	activeIndex,
	showRetry,
	onBack,
	onNext,
	onRetry,
	onSubmit,
	isNextDisabled,
	isNextLoading,
}: {
	size: number;
	activeIndex: number;
	showRetry?: boolean;
	onRetry?: () => void;
	onBack: () => void;
	onNext: () => void;
	onSubmit: () => void;
	isNextDisabled?: boolean;
	isNextLoading?: boolean;
}) => {
	const { t } = useTranslation();

	return (
		<div className="flex justify-between mt-10">
			<div>
				{showRetry && (
					<Button variant="secondary" onClick={onRetry} data-testid="Paginator__retry-button">
						<Icon name="Reset" />
						<span>{t("COMMON.RETRY")}</span>
					</Button>
				)}
			</div>

			<div className="flex space-x-3">
				{activeIndex < size && (
					<Button variant="secondary" onClick={onBack} data-testid="Paginator__back-button">
						{t("COMMON.BACK")}
					</Button>
				)}

				{activeIndex < size && (
					<Button
						disabled={isNextDisabled || isNextLoading}
						isLoading={isNextLoading}
						onClick={onNext}
						data-testid="Paginator__continue-button"
					>
						{t("COMMON.CONTINUE")}
					</Button>
				)}

				{activeIndex === size && (
					<Button disabled={isNextDisabled} data-testid="Paginator__submit-button" onClick={onSubmit}>
						{t("COMMON.SAVE_FINISH")}
					</Button>
				)}
			</div>
		</div>
	);
};

export const LedgerTabs = ({ activeIndex }: { activeIndex?: number }) => {
	const activeProfile = useActiveProfile();

	const history = useHistory();
	const { env, persist } = useEnvironmentContext();
	const { importLedgerWallets, isBusy } = useLedgerContext();

	const { formState, handleSubmit } = useFormContext();
	const { isValid, isSubmitting } = formState;

	const [importedWallets, setImportedWallets] = useState([]);
	const [activeTab, setActiveTab] = useState<number>(activeIndex!);

	const [showRetry, setShowRetry] = useState(false);
	const retryFnRef = useRef<() => void>();

	const importWallets = useCallback(
		async ({ network, wallets }: any) => {
			setImportedWallets(wallets);
			const coin = await env.coin(network.coin(), network.id());
			await importLedgerWallets(wallets, coin, activeProfile);
		},
		[importLedgerWallets, activeProfile, env],
	);

	const saveNames = async ({ names }: { names: Record<string, string> }) => {
		const nameMaxLength = 42;

		for (const [address, name] of Object.entries(names)) {
			if (name) {
				const formattedName = name.trim().substring(0, nameMaxLength);
				const wallet = activeProfile.wallets().findByAddress(address);
				wallet?.setAlias(formattedName);
			}
		}
		await persist();
		history.push(`/profiles/${activeProfile.id()}/dashboard`);
	};

	const handleNext = useCallback(async () => {
		if (activeTab === 3) {
			await handleSubmit((data: any) => importWallets(data))();
		}

		setActiveTab(activeTab + 1);
	}, [activeTab, handleSubmit, importWallets]);

	const handleBack = () => {
		if (activeTab === 1) {
			return history.push(`/profiles/${activeProfile.id()}/dashboard`);
		}

		setActiveTab(activeTab - (activeTab === 3 ? 2 : 1));
	};

	const handleRetry = useCallback((fn?: () => void) => {
		retryFnRef.current = fn;
		setShowRetry(!!fn);
	}, []);

	return (
		<Tabs activeId={activeTab}>
			<StepIndicator size={4} activeIndex={activeTab} />

			<div data-testid="LedgerTabs" className="mt-8">
				<TabPanel tabId={1}>
					<FirstStep profile={activeProfile} />
				</TabPanel>
				<TabPanel tabId={2}>
					<LedgerConnectionStep onConnect={() => setActiveTab(3)} />
				</TabPanel>
				<TabPanel tabId={3}>
					<LedgerScanStep profile={activeProfile} setRetryFn={handleRetry} />
				</TabPanel>
				<TabPanel tabId={4}>
					<LedgerImportStep wallets={importedWallets} profile={activeProfile} />
				</TabPanel>
			</div>

			<Paginator
				size={4}
				activeIndex={activeTab}
				isNextDisabled={isBusy || !isValid}
				isNextLoading={isSubmitting}
				showRetry={showRetry}
				onRetry={retryFnRef.current}
				onNext={handleNext}
				onBack={handleBack}
				onSubmit={handleSubmit((data: any) => saveNames(data))}
			/>
		</Tabs>
	);
};

LedgerTabs.defaultProps = {
	activeIndex: 1,
};
