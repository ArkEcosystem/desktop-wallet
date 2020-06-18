/* eslint-disable @typescript-eslint/no-unused-vars */

import tw, { styled } from "twin.macro";

const InputAddon = styled.div`
	${tw`absolute inset-y-0 flex items-center justify-center overflow-hidden`};
`;

export const InputAddonStart = styled(InputAddon)`
	${tw`left-0 rounded-l border border-transparent`}
`;

export const InputAddonEnd = styled(InputAddon)`
	${tw`right-0 rounded-r border border-transparent`}
`;

export const InputGroup = styled.div`
	${tw`relative flex`}
`;
