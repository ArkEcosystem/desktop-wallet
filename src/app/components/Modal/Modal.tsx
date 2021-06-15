import { OriginalButton } from "app/components/Button/OriginalButton";
import { Icon } from "app/components/Icon";
import cs from "classnames";
import React, { useRef } from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { useModal } from ".";

interface ModalProps {
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
}

interface ModalContentProps {
	children: React.ReactNode;
	title: string | React.ReactNode;
	titleClass?: string;
	description?: string;
	banner?: React.ReactNode;
	image?: React.ReactNode;
	onClose?: any;
}

const ModalContainer = styled.div<{ size?: Size }>`
	${tw`flex-1 m-auto`}
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
	<div
		className="flex overflow-hidden relative flex-col p-10 shadow-2xl rounded-2.5xl bg-theme-background"
		data-testid="modal__inner"
	>
		<div className="absolute top-0 right-0 z-10 mt-5 mr-5 rounded transition-all duration-100 ease-linear bg-theme-primary-100 dark:bg-theme-secondary-800 dark:text-theme-secondary-600 dark:hover:bg-theme-secondary-700 dark:hover:text-theme-secondary-400 hover:bg-theme-primary-300">
			<OriginalButton
				data-testid="modal__close-btn"
				variant="transparent"
				size="icon"
				onClick={props.onClose}
				className="w-11 h-11"
			>
				<Icon name="CrossSlim" width={14} height={14} />
			</OriginalButton>
		</div>

		<div className="relative space-y-4">
			{props.banner && (
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
			)}

			{!props.banner && props.title && (
				<h2 className={cs("mb-0 text-3xl font-bold", props.titleClass)}>{props.title}</h2>
			)}

			<div className="flex-1">
				{props.image}

				{props.description && (
					<div className="whitespace-pre-line text-theme-secondary-text">{props.description}</div>
				)}

				{props.children}
			</div>
		</div>
	</div>
);

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
	const refShouldClose = useRef<boolean | null>(null);
	useModal({ isOpen, onClose });

	if (!isOpen) {
		return <></>;
	}

	const handleClickOverlay = () => {
		if (refShouldClose.current === null) {
			refShouldClose.current = true;
		}

		if (!refShouldClose.current) {
			refShouldClose.current = null;
			return;
		}

		onClose();
	};

	const handleClickContent = () => {
		refShouldClose.current = false;
	};

	return (
		<div
			className="flex fixed inset-0 z-50 py-20 w-full h-full bg-opacity-60 dark:bg-opacity-80 bg-theme-secondary-900-rgba overflow-overlay dark:bg-black-rgba"
			onClick={handleClickOverlay}
			data-testid="modal__overlay"
		>
			<ModalContainer
				size={size}
				onMouseDown={handleClickContent}
				onMouseUp={handleClickContent}
				onClick={handleClickContent}
				tabIndex={-1}
			>
				<ModalContent
					aria-selected={isOpen}
					title={title}
					titleClass={titleClass}
					description={description}
					banner={banner}
					image={image}
					onClose={onClose}
				>
					{children}
				</ModalContent>
			</ModalContainer>
		</div>
	);
};

Modal.defaultProps = {
	isOpen: false,
};

Modal.displayName = "Modal";
