import { OriginalButton } from "app/components/Button/OriginalButton";
import { Icon } from "app/components/Icon";
import cs from "classnames";
import React, { useRef } from "react";
import tw, { styled } from "twin.macro";
import { Size } from "types";

import { useModal } from ".";

interface ModalProperties {
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

interface ModalContentProperties {
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

const ModalContent = (properties: ModalContentProperties) => (
	<div
		className="flex overflow-hidden relative flex-col p-10 shadow-2xl rounded-2.5xl bg-theme-background"
		data-testid="modal__inner"
	>
		<div className="absolute top-0 right-0 z-10 mt-5 mr-5 rounded transition-all duration-100 ease-linear bg-theme-primary-100 dark:bg-theme-secondary-800 dark:text-theme-secondary-600 dark:hover:bg-theme-secondary-700 dark:hover:text-theme-secondary-400 hover:bg-theme-primary-300">
			<OriginalButton
				data-testid="modal__close-btn"
				variant="transparent"
				size="icon"
				onClick={properties.onClose}
				className="w-11 h-11"
			>
				<Icon name="CrossSlim" width={14} height={14} />
			</OriginalButton>
		</div>

		<div className="relative space-y-4">
			{properties.banner && (
				<div className="relative -mx-10 mb-10 -mt-10 h-56">
					{properties.banner}

					<div className="absolute bottom-0 left-0 mb-10 ml-10">
						<h2
							className={`text-4xl font-extrabold leading-tight m-0 ${
								properties.titleClass || "text-theme-text"
							}`}
						>
							{properties.title}
						</h2>
					</div>
				</div>
			)}

			{!properties.banner && properties.title && (
				<h2 className={cs("mb-0 text-3xl font-bold", properties.titleClass)}>{properties.title}</h2>
			)}

			<div className="flex-1">
				{properties.image}

				{properties.description && (
					<div className="whitespace-pre-line text-theme-secondary-text">{properties.description}</div>
				)}

				{properties.children}
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
}: ModalProperties) => {
	const referenceShouldClose = useRef<boolean | null>(null);
	useModal({ isOpen, onClose });

	if (!isOpen) {
		return <></>;
	}

	const handleClickOverlay = () => {
		if (referenceShouldClose.current === null) {
			referenceShouldClose.current = true;
		}

		if (!referenceShouldClose.current) {
			referenceShouldClose.current = null;
			return;
		}

		onClose();
	};

	const handleClickContent = () => {
		referenceShouldClose.current = false;
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
