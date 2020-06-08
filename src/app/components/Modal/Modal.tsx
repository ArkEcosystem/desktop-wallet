import React from "react";
// UI Elements
import { Button } from "app/components/Button";
import { SvgIcon } from "app/components/SvgIcon";

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
		<div className="fixed z-10 left-0 right-0 max-w-lg max-h-1/2 rounded-xl bg-theme-background mx-auto mt-24 pt-6 pb-8 px-10">
			<div className="absolute right-0 top-0 mt-4 mr-4">
				<Button color="neutral" variant="plain" size="icon" onClick={props.onClick}>
					<SvgIcon name="crossSlim" width={10} height={10} />
				</Button>
			</div>

			<h2>{props.title}</h2>
			{props.description ? <div className="text-theme-neutral-500">{props.description}</div> : ''}

			{props.children}
		</div>
	);
};

export const Modal = (props: ModalProps) => {
	if (!props.isOpen) {
		return <></>;
	}

	return (
		<>
			<div
				className="fixed inset-0 z-10 bg-black opacity-50"
				data-testid="modal__overlay"
			/>

			<ModalContent
			 	data-testid="modal__inner"
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

Modal.defaultProps = {

}

Modal.displayName = "Modal";
