import { Button } from "app/components/Button";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useActiveProfile } from "app/hooks";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FirstStep } from "../Step1";
import { LedgerConnectionStep } from "./LedgerConnectionStep";
import { LedgerImportStep } from "./LedgerImportStep";
import { LedgerScanStep } from "./LedgerScanStep";

const Paginator = ({
	size,
	activeIndex,
	onBack,
	onNext,
	onSubmit,
	isNextDisabled,
	isNextLoading,
}: {
	size: number;
	activeIndex: number;
	onBack?: (newIndex: number) => void;
	onNext?: (newIndex: number) => void;
	onSubmit?: () => void;
	isNextDisabled?: boolean;
	isNextLoading?: boolean;
}) => {
	const { t } = useTranslation();
	return (
		<div className="flex justify-end mt-10 space-x-3">
			{activeIndex < size && (
				<Button
					disabled={activeIndex === 1}
					variant="plain"
					onClick={() => onBack?.(activeIndex - 1)}
					data-testid="Paginator__back-button"
				>
					{t("COMMON.BACK")}
				</Button>
			)}

			{activeIndex < size && (
				<Button
					disabled={isNextDisabled || isNextLoading}
					onClick={() => onNext?.(activeIndex + 1)}
					data-testid="Paginator__continue-button"
				>
					{isNextLoading ? (
						<span className="px-3">
							<Spinner size="sm" />
						</span>
					) : (
						t("COMMON.CONTINUE")
					)}
				</Button>
			)}

			{activeIndex === size && (
				<Button disabled={isNextDisabled} data-testid="Paginator__submit-button" onClick={onSubmit}>
					{t("COMMON.GO_TO_WALLET")}
				</Button>
			)}
		</div>
	);
};

export const LedgerTabs = () => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const { getValues, formState } = useFormContext();
	const { isValid } = formState;

	const wallets = getValues("wallets");

	const [activeTab, setActiveTab] = useState(1);

	return (
		<Tabs activeId={activeTab}>
			<StepIndicator size={4} activeIndex={activeTab} />

			<div className="mt-8">
				<TabPanel tabId={1}>
					<FirstStep />
				</TabPanel>
				<TabPanel tabId={2}>
					<LedgerConnectionStep onConnect={() => setActiveTab(3)} />
				</TabPanel>
				<TabPanel tabId={3}>
					<LedgerScanStep profile={activeProfile} />
				</TabPanel>
				<TabPanel tabId={4}>
					<LedgerImportStep wallets={wallets} />
				</TabPanel>
			</div>

			<Paginator
				size={4}
				activeIndex={activeTab}
				isNextDisabled={!isValid}
				onNext={setActiveTab}
				onBack={setActiveTab}
			/>
		</Tabs>
	);
};
