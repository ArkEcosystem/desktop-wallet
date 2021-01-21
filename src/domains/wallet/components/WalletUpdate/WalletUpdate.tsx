import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useUpdater } from "app/hooks/use-updater";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

type WalletUpdateProps = {
	version?: string;
	profile?: Profile;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const WalletUpdate = ({ isOpen, onClose, onCancel, version }: WalletUpdateProps) => {
	const [activeStep, setActiveStep] = useState(1);

	const { t } = useTranslation();
	const { downloadUpdate, downloadProgress, downloadStatus, cancel, quitInstall } = useUpdater();

	const handleUpdateNow = () => {
		downloadUpdate();
		setActiveStep(2);
	};

	const handleInstall = () => {
		quitInstall();
	};

	const handleClose = () => {
		setActiveStep(1);

		cancel();
		onClose?.();
	};

	const handleCancel = () => {
		onCancel?.();
	};

	useEffect(() => {
		if (downloadStatus === "completed") {
			setActiveStep(3);
		}
	}, [downloadStatus, setActiveStep]);

	return (
		<Modal
			title={t("WALLETS.MODAL_WALLET_UPDATE.TITLE", { version })}
			image={
				activeStep < 3 ? (
					<Image name="WalletUpdateBanner" domain="wallet" className="my-8" />
				) : (
					<Image name="WalletUpdateReadyBanner" domain="wallet" className="my-8" />
				)
			}
			isOpen={isOpen}
			onClose={handleClose}
		>
			<Tabs activeId={activeStep}>
				<TabPanel tabId={1}>
					<FirstStep />
				</TabPanel>
				<TabPanel tabId={2}>
					<SecondStep {...downloadProgress} />
				</TabPanel>
				<TabPanel tabId={3}>
					<ThirdStep />
				</TabPanel>

				<div className="flex flex-col justify-center space-x-0 sm:flex-row sm:space-x-3">
					{activeStep === 1 && (
						<>
							<Button
								variant="secondary"
								className="mt-2 sm:mt-0"
								onClick={handleCancel}
								data-testid="WalletUpdate__cancel-button"
							>
								{t("COMMON.UPDATE_LATER")}
							</Button>
							<Button onClick={handleUpdateNow} data-testid="WalletUpdate__update-button">
								{t("COMMON.UPDATE_NOW")}
							</Button>
						</>
					)}

					{activeStep === 3 && (
						<Button data-testid="WalletUpdate__install-button" onClick={handleInstall}>
							{t("COMMON.INSTALL")}
						</Button>
					)}
				</div>
			</Tabs>
		</Modal>
	);
};

WalletUpdate.defaultProps = {
	isOpen: false,
};
