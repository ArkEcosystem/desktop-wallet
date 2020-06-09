import React from "react";
// UI Elements
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";

type ModalProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
	isOpen: boolean;
} & React.HTMLProps<any>;

type ModalContentProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
} & React.HTMLProps<any>;

const ModalContent = (props: ModalContentProps) => {
	return (
		<div
			data-testid="modal__inner"
			className="fixed flex flex-col z-10 left-0 right-0 max-w-2xl rounded-xl bg-theme-background mx-auto mt-24 pt-6 pb-8 px-16"
		>
			<div className="absolute right-0 top-0 mt-4 mr-4">
				<Button color="neutral" variant="plain" size="icon" onClick={props.onClick}>
					<Icon name="crossSlim" width={10} height={10} />
				</Button>
			</div>

			<div className="py-4">
				<h2>{props.title}</h2>

				<div className="flex-1 overflow-auto">
					{props.description ? <div className="text-theme-neutral-500">{props.description}</div> : ""}

					{props.children}
				</div>
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
				onClick={props.onClick}
			>
				{props.children}
			</ModalContent>
		</>
	);
};

Modal.defaultProps = {};

Modal.displayName = "Modal";
