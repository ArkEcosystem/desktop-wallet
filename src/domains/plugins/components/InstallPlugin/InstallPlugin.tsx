import React from "react";
import { Button } from "app/components/Button";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Modal } from "app/components/Modal";

type InstallPluginProps = {
	step?: number;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const InstallPlugin = ({ step, isOpen, onClose, onCancel }: InstallPluginProps) => {
	return (
		<Modal title="Attention" isOpen={isOpen} onClose={onClose}>
			<div className="container">
				{step === 1 && (
					<>
						<p className="mt-4 text-base font-semibold text-theme-neutral-dark">
							This plugin needs the following permissions:
						</p>
						<ul className="max-w-xs mt-2 text-sm leading-8 list-inside list-circle text-theme-neutral-dark">
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
									<p className="text-sm font-semibold text-theme-neutral-light">Plugin</p>
									<p className="font-semibold text-theme-black">ARK Explorer</p>
								</div>
								<div className="flex justify-between">
									<span>
										<p className="text-sm font-semibold text-theme-neutral-light">Downloaded</p>
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
			</div>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	step: 2,
	isOpen: false,
};
