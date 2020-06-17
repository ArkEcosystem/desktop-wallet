import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type InstallPluginProps = {
	// TODO: This props `step` is used only as a mock to navigate between steps
	step?: number;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDownload?: any;
};

export const InstallPlugin = ({ step, isOpen, onClose, onCancel, onDownload }: InstallPluginProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t(step === 1 ? "COMMON.ATTENTION" : "COMMON.DOWNLOADED")} isOpen={isOpen} onClose={onClose}>
			<div className="container">
				{step === 1 && (
					<>
						<p className="mt-4 text-base font-semibold text-theme-neutral-dark">
							{t("PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION")}
						</p>
						<ul className="max-w-xs mt-2 text-sm leading-8 list-inside list-circle text-theme-neutral-dark">
							<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_1")}</li>
							<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_2")}</li>
							<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_3")}</li>
						</ul>
						<div className="flex justify-end mt-8">
							<Button
								color="primary"
								variant="plain"
								className="mr-2"
								onClick={onCancel}
								data-testid="install-plugin__cancel-button"
							>
								{t("COMMON.CANCEL")}
							</Button>
							<Button
								type="button"
								color="primary"
								variant="solid"
								onClick={onDownload}
								data-testid="install-plugin__download-button"
							>
								{t("COMMON.DOWNLOAD")}
							</Button>
						</div>
					</>
				)}

				{step === 2 && (
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
									<p className="text-sm font-semibold text-theme-neutral-light">
										{t("COMMON.PLUGIN")}
									</p>
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
				)}

				{step === 3 && (
					<>
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
										<p className="text-sm font-semibold text-theme-neutral-light">
											{t("COMMON.PLUGIN")}
										</p>
										<p className="font-semibold text-theme-black">ARK Explorer</p>
									</div>
									<div className="flex justify-between">
										<span>
											<p className="text-sm font-semibold text-theme-neutral-light">
												{t("COMMON.DOWNLOADED")}
											</p>
											<p className="text-sm font-bold text-theme-neutral-dark">
												{t("COMMON.COMPLETED")}
											</p>
										</span>
										<div className="">
											<Circle
												size="large"
												className="relative z-10 bg-theme-background border-theme-neutral-300"
											>
												<span className="text-theme-success-600">
													<Icon name="Checkmark" width={28} height={28} />
												</span>
											</Circle>
											<Circle
												size="large"
												className="relative z-0 -ml-1 bg-theme-background border-theme-success-600"
											>
												<span className="text-xs font-semibold text-theme-success-600">
													100%
												</span>
											</Circle>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end mt-8">
							<Button
								color="primary"
								variant="plain"
								className="mr-2"
								onClick={onCancel}
								data-testid="install-plugin__cancel-button"
							>
								{t("COMMON.CANCEL")}
							</Button>
							<Button
								type="button"
								color="primary"
								variant="solid"
								data-testid="install-plugin__install-button"
							>
								{t("COMMON.INSTALL")}
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	step: 1,
	isOpen: false,
};
