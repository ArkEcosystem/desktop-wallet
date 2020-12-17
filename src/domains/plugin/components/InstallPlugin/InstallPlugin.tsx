import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

type InstallPluginProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const InstallPlugin = ({ isOpen, onClose, onCancel }: InstallPluginProps) => {
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
			title={t(activeStep === 1 ? "COMMON.ATTENTION" : "COMMON.DOWNLOADED")}
			size="lg"
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

				<div className="flex justify-end mt-8 space-x-3">
					{activeStep === 1 && (
						<>
							<Button variant="secondary" onClick={onCancel} data-testid="InstallPlugin__cancel-button">
								{t("COMMON.CANCEL")}
							</Button>
							<Button onClick={handleNext} data-testid="InstallPlugin__download-button">
								{t("COMMON.DOWNLOAD")}
							</Button>
						</>
					)}

					{/* TODO: Remove these buttons from the second step in the functional code */}
					{activeStep === 2 && (
						<>
							<Button variant="secondary" onClick={handleBack} data-testid="InstallPlugin__back-button">
								{t("COMMON.BACK")}
							</Button>
							<Button onClick={handleNext} data-testid="InstallPlugin__continue-button">
								{t("COMMON.CONTINUE")}
							</Button>
						</>
					)}

					{activeStep === 3 && (
						<>
							<Button variant="secondary" onClick={handleBack} data-testid="InstallPlugin__cancel-button">
								{t("COMMON.CANCEL")}
							</Button>
							<Button data-testid="InstallPlugin__install-button">{t("COMMON.INSTALL")}</Button>
						</>
					)}
				</div>
			</Tabs>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	isOpen: false,
};
