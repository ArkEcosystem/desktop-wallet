import React from "react";

import { images } from "app/assets/images";

// UI Elements
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";

type ProfileCreatedProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSend: any;
};

const { ProfileCreatedBanner } = images.profile.components.profileCreated;

export const ProfileCreated = ({ ...props }: ProfileCreatedProps) => {
	return (
		<Modal title="Profile Created!" isOpen={props.isOpen} onClose={props.onClose}>
			<div className="container">
				<div className="my-10">
					<ProfileCreatedBanner />
				</div>

				<div className="text-center mb-6">
					<p className="text-sm text-theme-neutral-dark mb-1 md:text-base">
						If you are new to the ARK Desktop Wallet, view our tutorial to get started.
					</p>
					<p className="text-sm text-theme-neutral-dark md:text-base">
						If not, you can skip the tutorial to go directly to your portfolio.
					</p>
				</div>

				<div className="flex flex-col justify-center sm:flex-row">
					<Button color="primary" variant="solid" className="mr-2" onClick={props.onSend}>
						Start Tutorial
					</Button>
					<Button color="primary" variant="plain" className="mt-2 sm:mt-0" onClick={props.onCancel}>
						Skip Tutorial
					</Button>
				</div>
			</div>
		</Modal>
	);
};

ProfileCreated.defaultProps = {
	isOpen: false,
};
