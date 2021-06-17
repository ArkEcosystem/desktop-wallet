import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

interface Properties {
	permissions: string[];
	isOpen: boolean;
	onClose?: () => void;
}

export const PluginPermissionsModal = ({ permissions, isOpen, onClose }: Properties) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("PLUGINS.PLUGIN_INFO.PERMISSIONS")} isOpen={isOpen} onClose={onClose}>
			<section data-testid="PluginPermissionsModal">
				<p className="mt-4 text-lg font-semibold text-theme-secondary-text">
					{t("PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION")}
				</p>
				<div className="w-full">
					<ul className="mt-2 ml-5 leading-8 list-outside list-circle text-theme-secondary-text">
						{permissions.map((permission: string) => (
							<li key={permission}>{permission}</li>
						))}
					</ul>
				</div>
			</section>
		</Modal>
	);
};

PluginPermissionsModal.defaultProps = {
	isOpen: false,
	permissions: [],
};
