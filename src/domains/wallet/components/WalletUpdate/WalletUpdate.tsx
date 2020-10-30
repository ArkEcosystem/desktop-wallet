import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useUpdater } from "app/hooks/use-updater";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

type WalletUpdateProps = {
	profile?: Profile;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

const { WalletUpdateBanner, WalletUpdateReadyBanner } = images.wallet.components.walletUpdate;

export const WalletUpdate = ({ isOpen, onClose, onCancel }: WalletUpdateProps) => {
	const [activeStep, setActiveStep] = useState(1);

	const { t } = useTranslation();
	const { downloadUpdate, checkForUpdates } = useUpdater();

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleUpdateNow = () => {
		downloadUpdate();
		setActiveStep(2);
	};

	const handleClose = () => {
		onClose?.();
		setActiveStep(1);
	};

	return (
		<Modal
			title={t("WALLETS.MODAL_WALLET_UPDATE.TITLE", { version: "3.0.7" })}
			image={
				activeStep < 3 ? <WalletUpdateBanner className="my-8" /> : <WalletUpdateReadyBanner className="my-8" />
			}
			isOpen={isOpen}
			onClose={handleClose}
		>
			<Tabs activeId={activeStep}>
				<TabPanel tabId={1}>
					<FirstStep />
				</TabPanel>
				<TabPanel tabId={2}>
					<SecondStep />
				</TabPanel>
				<TabPanel tabId={3}>
					<ThirdStep />
				</TabPanel>

				<div className="flex flex-col justify-center space-x-0 sm:flex-row sm:space-x-3">
					{activeStep === 1 && (
						<>
							<Button
								variant="plain"
								className="mt-2 sm:mt-0"
								onClick={onCancel}
								data-testid="WalletUpdate__cancel-button"
							>
								{t("COMMON.UPDATE_LATER")}
							</Button>
							<Button onClick={handleUpdateNow} data-testid="WalletUpdate__update-button">
								{t("COMMON.UPDATE_NOW")}
							</Button>
						</>
					)}

					{/* TODO: Remove these buttons from the second step in the functional code */}
					{activeStep === 2 && (
						<>
							<Button variant="plain" onClick={handleBack} data-testid="WalletUpdate__back-button">
								{t("COMMON.BACK")}
							</Button>
							<Button onClick={handleNext} data-testid="WalletUpdate__continue-button">
								{t("COMMON.CONTINUE")}
							</Button>
						</>
					)}

					{activeStep === 3 && (
						<Button data-testid="WalletUpdate__install-button">{t("COMMON.INSTALL")}</Button>
					)}
				</div>
			</Tabs>
		</Modal>
	);
};

WalletUpdate.defaultProps = {
	isOpen: false,
};
