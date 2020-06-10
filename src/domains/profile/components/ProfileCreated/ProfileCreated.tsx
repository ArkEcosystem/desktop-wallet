import React from "react";

// UI Elements
import { Modal } from "app/components/Modal";

type ProfileCreatedProps = {
	isOpen: boolean;
};

export const ProfileCreated = ({ ...props }: ProfileCreatedProps) => {
	return <Modal title="Profile Created!" isOpen={props.isOpen}></Modal>;
};

ProfileCreated.defaultProps = {
	isOpen: false,
};
