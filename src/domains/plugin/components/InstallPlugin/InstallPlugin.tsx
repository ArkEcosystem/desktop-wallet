
import { Circle } from "app/components/Circle";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import React from "react";
import { useTranslation } from "react-i18next";

type InstallPluginProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__first-step">
			<p className="mt-4 text-base font-semibold text-theme-neutral-dark">
				{t("PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION")}
			</p>
			<ul className="mt-2 text-sm leading-8 list-inside list-circle text-theme-neutral-dark">
				<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_1")}</li>
				<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_2")}</li>
				<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_3")}</li>
			</ul>
		</section>
	);
};

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__second-step">
			<div className="flex mt-4">
				<div className="flex-shrink-0 mr-6">
					<img
						className="rounded-xl"
						src="https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/explorer/master/images/logo.png"
					/>
				</div>
				<div className="flex-1">
					<div className="flex flex-col justify-around h-full">
						<div>
							<p className="text-sm font-semibold text-theme-neutral-light">{t("COMMON.PLUGIN")}</p>
							<p className="font-semibold text-theme-black">ARK Explorer</p>
						</div>
						<div className="flex justify-between">
							<span>
								<p className="text-sm font-semibold text-theme-neutral-light">
									{t("COMMON.DOWNLOADED")}
								</p>
								<p className="text-sm font-bold text-theme-neutral-dark">154 KB / 154 KB</p>
							</span>
							<div className="mr-2">
								<CircularProgressBar value={78} size={50} strokeWidth={4} fontSize={0.8} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__third-step">
			<div className="flex mt-4">
				<div className="flex-shrink-0 mr-6">
					<img
						className="rounded-xl"
						src="https://raw.githubusercontent.com/ark-ecosystem-desktop-plugins/explorer/master/images/logo.png"
					/>
				</div>
				<div className="flex-1">
					<div className="flex flex-col justify-around h-full">
						<div>
							<p className="text-sm font-semibold text-theme-neutral-light">{t("COMMON.PLUGIN")}</p>
							<p className="font-semibold text-theme-black">ARK Explorer</p>
						</div>
						<div className="flex justify-between">
							<span>
								<p className="text-sm font-semibold text-theme-neutral-light">
									{t("COMMON.DOWNLOADED")}
								</p>
								<p className="text-sm font-bold text-theme-neutral-dark">{t("COMMON.COMPLETED")}</p>
							</span>
							<div className="">
								<Circle
									size="lg"
									className="relative z-10 bg-theme-background border-theme-neutral-300"
								>
									<span className="text-theme-success-600">
										<Icon name="Checkmark" width={28} height={28} />
									</span>
								</Circle>
								<Circle
									size="lg"
									className="relative z-0 -ml-1 bg-theme-background border-theme-success-600"
								>
									<span className="text-xs font-semibold text-theme-success-600">100%</span>
								</Circle>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export const InstallPlugin = ({ isOpen, onClose, onCancel }: InstallPluginProps) => {
	const { t } = useTranslation();
	const [activeStep, setActiveStep] = React.useState(1);

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
			</Tabs>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	isOpen: false,
};
