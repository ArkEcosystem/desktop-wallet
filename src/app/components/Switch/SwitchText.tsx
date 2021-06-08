import { PropsWithChildren } from "react";
import tw, { styled } from "twin.macro";

interface Props {
	selected?: boolean;
}

export const SwitchText = styled.span<PropsWithChildren<Props>>`
	${tw`text-lg font-semibold text-theme-secondary-500 dark:text-theme-secondary-700`}

	${({ selected }) => selected && tw`text-theme-secondary-700 dark:text-theme-secondary-200`}
`;
