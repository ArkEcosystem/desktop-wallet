import React from "react";
// UI Elements
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";

type ModalProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
	isOpen: boolean;
	onClose?: any;
};

type ModalContentProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
	onClose?: any;
};

const ModalContent = (props: ModalContentProps) => {
	return (
		<div
			data-testid="modal__inner"
			className="fixed flex flex-col z-10 left-0 right-0 max-w-lg max-h-1/2 rounded-xl bg-theme-background mx-auto mt-24 pt-6 pb-8 px-10"
		>
			<div className="absolute right-0 top-0 mt-4 mr-4">
				<Button color="neutral" variant="plain" size="icon" onClick={props.onClose}>
					<Icon name="crossSlim" width={10} height={10} />
				</Button>
			</div>

			<h2>{props.title}</h2>

			<div className="flex-1 overflow-auto">
				{props.description ? <div className="text-theme-neutral-500">{props.description}</div> : ""}

				{props.children}
			</div>
		</div>
	);
};

export const Modal = (props: ModalProps) => {
	if (!props.isOpen) {
		return <></>;
	}

	return (
		<>
			<div className="fixed inset-0 z-10 bg-black opacity-50" data-testid="modal__overlay" />

			<ModalContent
				aria-selected={props.isOpen}
				title={props.title}
				description={props.description}
				onClose={props.onClose}
			>
				{props.children}
			</ModalContent>
		</>
	);
};

Modal.defaultProps = {
	isOpen: false,
};

Modal.displayName = "Modal";
