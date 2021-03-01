import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { Table, TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";

type Props = {
	isOpen: boolean;
	plugins: any[];
	onClose?: () => void;
	onContinue?: () => void;
};

export const PluginUpdatesConfirmation = ({ isOpen, plugins, onClose, onContinue }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.NAME"),
			accessor: "name",
		},
		{
			Header: t("PLUGINS.REQUIRED_VERSION"),
			accessor: "minimumVersion",
		},
	];

	return (
		<Modal
			title={t("PLUGINS.MODAL_UPDATES_CONFIRMATION.TITLE")}
			image={<Image name="DeleteBanner" className="w-3/5 m-auto my-8" />}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div data-testid="PluginUpdatesConfirmation">
				<Table data={plugins} columns={columns}>
					{(pluginData: any) => (
						<TableRow>
							<TableCell innerClassName="space-x-2">
								<PluginImage logoURL={pluginData.logo} className="w-14 h-14" />

								<span className="font-semibold link important:px-0 flex items-center">
									{pluginData.title}
								</span>

								{pluginData.isOfficial && <Icon name="OfficialArkPlugin" width={18} height={18} />}
								{pluginData.isGrant && <Icon name="Grant" width={14} height={20} />}
							</TableCell>

							<TableCell>
								<span>{pluginData.minimumVersion}</span>
							</TableCell>
						</TableRow>
					)}
				</Table>

				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="secondary" onClick={onClose} data-testid="PluginUpdates__cancel-button">
						{t("COMMON.CANCEL")}
					</Button>

					<Button onClick={onContinue} data-testid="PluginUpdates__continue-button">
						<span>{t("COMMON.CONTINUE")}</span>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

PluginUpdatesConfirmation.defaultProps = {
	isOpen: false,
};