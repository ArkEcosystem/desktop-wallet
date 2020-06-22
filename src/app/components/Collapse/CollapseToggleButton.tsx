import React from "react";
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

export const CollapseToggleButton = ({ isOpen, ...props }: Props) => {
	return (
		<button
			data-testid="CollapseToggleButton"
			className="flex items-center px-4 py-2 font-medium rounded text-theme-neutral focus:outline-none focus:shadow-outline space-x-2"
			{...props}
		>
			<span>{isOpen ? "Hide" : "Show"}</span>
			<ToggleIcon isOpen={isOpen!}>
				<Icon name="ChevronDown" />
			</ToggleIcon>
		</button>
	);
};

CollapseToggleButton.defaultProps = {
	isOpen: false,
};
