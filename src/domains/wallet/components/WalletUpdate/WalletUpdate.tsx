import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type WalletUpdateProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

const { WalletUpdateBanner, WalletUpdateReadyBanner } = images.wallet.components.walletUpdate;

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__first-step">
			<div className="mb-8 text-center">
				<p className="text-sm text-theme-neutral-dark md:text-base">
					{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_1")}
				</p>
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__second-step">
			{/* TODO: Remove the class name `mb-8` in the functional code */}
			<div className="flex w-2/5 mx-auto mb-8">
				<div className="flex-1">
					<p className="text-sm font-semibold text-theme-neutral-light">{t("COMMON.DOWNLOADED")}</p>
					<p className="text-sm font-bold text-theme-neutral-dark">154 KB / 154 KB</p>
				</div>
				<div className="flex-1">
					<div className="flex justify-center">
						<CircularProgressBar value={78} size={50} strokeWidth={5} fontSize={0.8} />
					</div>
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__third-step">
			<div className="mb-6 text-center">
				<p className="text-sm text-theme-neutral-dark md:text-base">
					{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_2")}
				</p>
			</div>
		</section>
	);
};

export const WalletUpdate = ({ isOpen, onClose, onCancel }: WalletUpdateProps) => {
	const { t } = useTranslation();
	const [activeStep, setActiveStep] = useState(1);

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	return (
		<Modal
			title={t("WALLETS.MODAL_WALLET_UPDATE.TITLE", { version: "3.0.7" })}
			image={
				activeStep < 3 ? <WalletUpdateBanner className="my-8" /> : <WalletUpdateReadyBanner className="my-8" />
			}
			isOpen={isOpen}
			onClose={onClose}
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
							<Button onClick={handleNext} data-testid="WalletUpdate__update-button">
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
