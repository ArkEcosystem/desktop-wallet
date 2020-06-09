import tw, { css } from "twin.macro";

const defaultStyle = [
	tw`rounded-full inline-flex items-center justify-center border-2 align-middle bg-theme-background`,
	css`
		& {
			box-shadow: 0px 0px 0px 6px white;
		}
	`,
];

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`w-8 h-8 text-sm px-2 py-1`;
		case "default":
			return tw`w-10 h-10 text-base px-4 py-2`;
	}
};

const getAvatarCss = (avatarId: any): any => {
	if (!avatarId) return [tw`bg-theme-background`];

	return [
		tw`border-0`,
		css`
			& {
				background: #bad6f0;
			}
		`,
	];
};

export const getStyles = ({ size, avatarId }: { size?: string; avatarId?: string | null }) => {
	return [...defaultStyle, getSize(size!), ...getAvatarCss(avatarId)];
};
