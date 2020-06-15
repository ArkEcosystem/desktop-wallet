import React from "react";
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";

type InstallPluginProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const InstallPlugin = ({ isOpen, onClose, onCancel }: InstallPluginProps) => {
	return (
		<Modal title="Attention" isOpen={isOpen} onClose={onClose}>
			<div className="container">
				<p className="mt-4 text-base font-semibold text-theme-neutral-dark md:text-lg">
					This plugin needs the following permissions:
				</p>
				<ul className="mt-2 text-sm leading-8 list-inside list-circle text-theme-neutral-dark md:text-base">
					<li>Allows access to the Desktop Wallet alerts</li>
					<li>Allows access to play audio from within the Desktop Wallet</li>
					<li>Allows access to the Desktop Wallet events</li>
				</ul>
				<div className="flex justify-end mt-8">
					<Button color="primary" variant="plain" onClick={onCancel} className="mr-2">
						Cancel
					</Button>
					<Button type="submit" color="primary" variant="solid">
						Download
					</Button>
				</div>
			</div>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	isOpen: false,
};
