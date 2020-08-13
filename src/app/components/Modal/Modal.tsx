import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useEffect } from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

type ModalProps = {
	children: React.ReactNode;
	title: string | React.ReactNode;
	description?: string;
	banner?: React.ReactNode;
	image?: React.ReactNode;
	size?: Size;
	isOpen: boolean;
	onClose?: any;
	onClick?: any;
};

type ModalContentProps = {
	children: React.ReactNode;
	title: string | React.ReactNode;
	description?: string;
	banner?: React.ReactNode;
	image?: React.ReactNode;
	size?: Size;
	onClose?: any;
};

const ModalContainer = styled.div<{ size?: Size }>`
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

const ModalContent = (props: ModalContentProps) => (
	<ModalContainer
		size={props.size}
		className="absolute top-0 left-0 right-0 z-50 flex flex-col px-10 pt-6 mt-24 mb-24 mx-auto rounded-xl bg-theme-background"
		data-testid="modal__inner"
	>
		<div className="relative">
			<div className="absolute top-0 right-0 z-50 mt-5 mr-5">
				<Button
					data-testid="modal__close-btn"
					color="neutral"
					variant="plain"
					size="icon"
					onClick={props.onClose}
				>
					<div className="p-1">
						<Icon name="CrossSlim" width={12} height={12} />
					</div>
				</Button>
			</div>

			<div className="py-4">
				{props.banner ? (
					<div className="relative mb-10 -mx-10 -mt-10">
						{props.banner}

						<h1 className="absolute bottom-0 left-0 mb-8 ml-12">{props.title}</h1>
					</div>
				) : (
					<h2 className="mb-0 text-3xl font-bold">{props.title}</h2>
				)}

				<div className="flex-1">
					{props.image}

					{props.description && <div className="mt-1 text-theme-neutral-dark">{props.description}</div>}

					{props.children}
				</div>
			</div>
		</div>
	</ModalContainer>
);

interface BodyRightOffset {
	[key: string]: string;
}

export const Modal = (props: ModalProps) => {
	// Disable scrolling when open
	useEffect(() => {
		const originalStyle = window.getComputedStyle(document.body).overflow;

		// Prevent body content `glitching` upon change,
		// by right padding if scrollbar existed initially
		const rightPadding: BodyRightOffset = {
			visible: "15px",
			hidden: "0",
		};

		if (props.isOpen) {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = rightPadding[originalStyle];
		}

		return () => {
			document.body.style.overflow = originalStyle;
			document.body.style.paddingRight = "0";
			return;
		};
	}, [props.isOpen]);

	if (!props.isOpen) {
		return <></>;
	}

	return (
		<div className="w-full h-full z-50 fixed inset-0 overflow-y-scroll">
			<div
				className="w-full h-full fixed z-50 bg-black opacity-50"
				data-testid="modal__overlay"
				onClick={props.onClose}
			/>

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
		</div>
	);
};

Modal.defaultProps = {
	isOpen: false,
};

Modal.displayName = "Modal";
