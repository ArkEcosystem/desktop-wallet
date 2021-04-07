import tw, { css } from "twin.macro";
import { Size } from "types";

const defaultStyle = (noShadow: boolean) => [
	tw`transition-all duration-100 inline-flex items-center justify-center align-middle border-2 rounded-full`,
	noShadow ? tw`ring-0` : tw`ring-6`,
];

const getSize = (size?: Size): any => {
	switch (size) {
		case "sm":
			return tw`w-8 h-8 px-2 py-1 text-sm`;
		case "lg":
			return tw`px-2 py-1 w-11 h-11`;
		case "xl":
			return tw`px-2 py-1 text-lg w-16 h-16`;
		default:
			return tw`w-10 h-10 px-4 py-2`;
	}
};

const getAvatarCss = (avatarId: any): any => {
	if (!avatarId) {
		return [];
	}

	return [
		tw`border-0`,
		css`
			& {
				background: #bad6f0;
			}
		`,
	];
};

export const getStyles = ({
	size,
	avatarId,
	noShadow,
}: {
	size?: Size;
	avatarId?: string | null;
	noShadow?: boolean;
}) => [...defaultStyle(noShadow!), getSize(size), ...getAvatarCss(avatarId)];
