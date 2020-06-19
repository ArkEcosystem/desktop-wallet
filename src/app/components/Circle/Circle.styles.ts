import tw, { css } from "twin.macro";

const defaultStyle = (noShadow: boolean) => [
	tw`inline-flex items-center justify-center align-middle border-2 rounded-full`,
	!noShadow &&
		css`
			& {
				box-shadow: 0 0 0 6px var(--theme-background-color);
			}
		`,
];

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`w-8 h-8 px-2 py-1 text-sm`;
		case "large":
			return tw`px-2 py-1 text-sm w-11 h-11`;
		default:
			return tw`w-10 h-10 px-4 py-2 text-base`;
	}
};

const getAvatarCss = (avatarId: any): any => {
	if (!avatarId) return [];

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
	size?: string;
	avatarId?: string | null;
	noShadow?: boolean;
}) => {
	return [...defaultStyle(noShadow!), getSize(size!), ...getAvatarCss(avatarId)];
};
