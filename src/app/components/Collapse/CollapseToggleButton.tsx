import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { Icon } from "../Icon";

const ToggleIcon = styled.span<{ isOpen: boolean, isDisabled?: boolean }>`
	${tw`w-4 h-4 inline-flex items-center justify-center rounded-full transition duration-200 transform bg-theme-primary-100 dark:bg-theme-secondary-800 text-theme-primary-600 dark:text-theme-secondary-200`}
	${({ isOpen }) => (isOpen ? tw`bg-theme-primary-600 text-theme-primary-100 rotate-180` : "")}
	${({ isDisabled }) => (isDisabled ? tw`bg-theme-secondary-200 text-theme-secondary-400 dark:bg-theme-secondary-800 dark:text-theme-secondary-700` : "")}
`;

type Props = {
	isOpen?: boolean;
	label?: React.ReactNode;
	alternativeLabel?: React.ReactNode;
} & React.ButtonHTMLAttributes<any>;

export const CollapseToggleButton = ({ isOpen, className, label, alternativeLabel, ...props }: Props) => {
	const { t } = useTranslation();

	return (
		<button
			data-testid="CollapseToggleButton"
			className={`flex items-center py-2 font-semibold rounded focus:outline-none space-x-2 ${
				className || "text-theme-secondary-500"
			}`}
			{...props}
		>
			<span>{isOpen ? label || t("COMMON.HIDE") : alternativeLabel || label || t("COMMON.SHOW")}</span>
			<ToggleIcon isOpen={isOpen!} isDisabled={props.disabled}>
				<Icon name="ChevronDown" width={8} height={5} />
			</ToggleIcon>
		</button>
	);
};

CollapseToggleButton.defaultProps = {
	isOpen: false,
};
