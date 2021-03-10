import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { usePrevious } from "../../hooks";
import { modalOffsetClass, useModal } from "./";

type ModalProps = {
	children: React.ReactNode;
	title: string | React.ReactNode;
	titleClass?: string;
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
	titleClass?: string;
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

const ModalContent = (props: ModalContentProps) => {
	const [offsetClass, setOffsetClass] = useState<string>();
	const modalRef = useRef<any>();

	const previousHeight = usePrevious(modalRef?.current?.clientHeight);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const currentHeight = modalRef?.current?.clientHeight;

		if (previousHeight !== currentHeight) {
			setOffsetClass(modalOffsetClass(currentHeight, window.innerHeight));
		}
	});

	return (
		<ModalContainer
			ref={modalRef}
			size={props.size}
			className={`absolute left-0 right-0 z-50 flex flex-col p-10 mx-auto overflow-hidden rounded-2xl bg-theme-background shadow-2xl ${offsetClass}`}
			data-testid="modal__inner"
		>
			<div className="absolute top-0 right-0 z-50 mt-5 mr-5 rounded transition-all duration-100 ease-linear bg-theme-primary-100 hover:bg-theme-primary-300 dark:bg-theme-secondary-800 dark:text-theme-secondary-600 dark:hover:bg-theme-secondary-700 dark:hover:text-theme-secondary-400">
				<Button
					data-testid="modal__close-btn"
					variant="transparent"
					size="icon"
					onClick={props.onClose}
					className="w-11 h-11"
				>
					<Icon name="CrossSlim" width={14} height={14} />
				</Button>
			</div>

			<div className="relative">
				{props.banner ? (
					<div className="relative -mx-10 mb-10 -mt-10 h-56">
						{props.banner}

						<div className="absolute bottom-0 left-0 mb-10 ml-10">
							<h2
								className={`text-4xl font-extrabold leading-tight m-0 ${
									props.titleClass || "text-theme-text"
								}`}
							>
								{props.title}
							</h2>
						</div>
					</div>
				) : (
					<h2 className="mb-0 text-3xl font-bold">{props.title}</h2>
				)}

				<div className="flex-1">
					{props.image}

					{props.description && (
						<div className="mt-1 text-theme-secondary-text whitespace-pre-line">{props.description}</div>
					)}

					{props.children}
				</div>
			</div>
		</ModalContainer>
	);
};

export const Modal = ({
	isOpen,
	description,
	title,
	titleClass,
	banner,
	image,
	size,
	children,
	onClose,
}: ModalProps) => {
	useModal({ isOpen, onClose });

	if (!isOpen) {
		return <></>;
	}

	return (
		<div className="flex fixed inset-0 z-50 justify-center items-center w-full h-full overflow-overlay">
			<div
				className="fixed z-50 w-full h-full bg-black opacity-50"
				data-testid="modal__overlay"
				onClick={onClose}
			/>

			<ModalContent
				aria-selected={isOpen}
				title={title}
				titleClass={titleClass}
				description={description}
				banner={banner}
				image={image}
				size={size}
				onClose={onClose}
			>
				{children}
			</ModalContent>
		</div>
	);
};

Modal.defaultProps = {
	isOpen: false,
};

Modal.displayName = "Modal";
