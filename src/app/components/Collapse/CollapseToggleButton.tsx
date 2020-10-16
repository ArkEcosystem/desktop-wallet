import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { Icon } from "../Icon";

const ToggleIcon = styled.span<{ isOpen: boolean }>`
	${tw`w-5 h-5 inline-flex items-center justify-center rounded-full transition-colors duration-200 transform`}
	${({ isOpen }) =>
		isOpen
			? tw`bg-theme-primary text-theme-primary-contrast rotate-180`
			: tw`text-theme-primary bg-theme-primary-contrast`}
`;

type Props = { isOpen?: boolean } & React.ButtonHTMLAttributes<any>;

export const CollapseToggleButton = ({ isOpen, className, ...props }: Props) => {
	const { t } = useTranslation();

	return (
		<button
			data-testid="CollapseToggleButton"
			className={`flex items-center px-4 py-2 font-semibold rounded focus:outline-none space-x-2 ${
				className || "text-theme-neutral"
			}`}
			{...props}
		>
			<span>{isOpen ? t("COMMON.HIDE") : t("COMMON.SHOW")}</span>
			<ToggleIcon isOpen={isOpen!}>
				<Icon name="ChevronDown" width={10} height={10} />
			</ToggleIcon>
		</button>
	);
};

CollapseToggleButton.defaultProps = {
	isOpen: false,
};
