import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import tw, { styled } from "twin.macro";

type ModalProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
	banner?: React.ReactNode;
	image?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
	isOpen: boolean;
	onClose?: any;
	onClick?: any;
};

type ModalContentProps = {
	children: React.ReactNode;
	title: string;
	description?: string;
	banner?: React.ReactNode;
	image?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
	onClose?: any;
};

const ModalContainer = styled.div<{ size: string }>`
	${({ size }) => {
		switch (size) {
			case "sm":
				return tw`max-w-sm`;
			case "md":
				return tw`max-w-md`;
			case "lg":
				return tw`max-w-lg`;
			case "xl":
				return tw`max-w-xl`;
			case "3xl":
				return tw`max-w-3xl`;
			case "4xl":
				return tw`max-w-4xl`;
			case "5xl":
				return tw`max-w-5xl`;
			default:
				return tw`max-w-2xl`;
		}
	}}
`;

const ModalContent = (props: ModalContentProps) => {
	return (
		<ModalContainer
			size={props.size!}
			className="fixed left-0 right-0 z-10 flex flex-col px-12 pt-6 pb-8 mx-auto mt-24 overflow-hidden rounded-xl bg-theme-background"
			data-testid="modal__inner"
		>
			<div className="absolute top-0 right-0 mt-4 mr-4">
				<Button
					data-testid="modal__close-btn"
					color="neutral"
					variant="plain"
					size="icon"
					onClick={props.onClose}
				>
					<Icon name="CrossSlim" width={10} height={10} />
				</Button>
			</div>

			<div className="py-4">
				{props.banner ? (
					<div className="absolute top-0 left-0 right-0">
						{props.banner}

						<h1 className="absolute bottom-0 left-0 ml-12 mb-8">{props.title}</h1>
					</div>
				) : (
					<h2>{props.title}</h2>
				)}

				<div className={`flex-1 ${props.banner ? "mt-40" : ""}`}>
					{props.image}

					{props.description && <div className="text-theme-neutral-700">{props.description}</div>}

					{props.children}
				</div>
			</div>
		</ModalContainer>
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
				banner={props.banner}
				image={props.image}
				size={props.size}
				onClose={props.onClose}
			>
				{props.children}
			</ModalContent>
		</>
	);
};

Modal.defaultProps = {
	size: "2xl",
	isOpen: false,
};

Modal.displayName = "Modal";
