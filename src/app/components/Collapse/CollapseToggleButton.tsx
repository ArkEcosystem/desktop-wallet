import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { Icon } from "../Icon";

const ToggleIcon = styled.span<{ isOpen: boolean }>`
	${tw`w-4 h-4 inline-flex items-center justify-center rounded-full transition duration-200 transform bg-theme-primary-100 dark:bg-theme-neutral-800 text-theme-primary-600 dark:text-theme-neutral-200`}
	${({ isOpen }) => (isOpen ? tw`bg-theme-primary-600 text-theme-primary-100 rotate-180` : "")}
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
				className || "text-theme-neutral"
			}`}
			{...props}
		>
			<span>{isOpen ? label || t("COMMON.HIDE") : alternativeLabel || label || t("COMMON.SHOW")}</span>
			<ToggleIcon isOpen={isOpen!}>
				<Icon name="ChevronDown" width={10} height={10} />
			</ToggleIcon>
		</button>
	);
};

CollapseToggleButton.defaultProps = {
	isOpen: false,
};
