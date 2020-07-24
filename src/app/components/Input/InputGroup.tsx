import tw, { styled } from "twin.macro";

export const InputAddon = styled.div`
	${tw`absolute inset-y-0 flex items-center justify-center overflow-hidden`};
`;

export const InputAddonStart = styled(InputAddon)`
	${tw`left-0 border border-transparent rounded-l`}
`;

export const InputAddonEnd = styled(InputAddon)`
	${tw`right-0 border border-transparent rounded-r`}
`;

export const InputGroup = styled.div`
	${tw`relative flex`}
`;
