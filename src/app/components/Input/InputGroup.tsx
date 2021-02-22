import React from "react";
import tw, { styled } from "twin.macro";

const InputAddonStyle = styled.div`
	${tw`absolute inset-y-0 flex items-center justify-center overflow-hidden`};
`;

const InputAddonStartStyle = styled(InputAddonStyle)`
	${tw`left-0 border border-transparent rounded-l`}
`;

const InputAddonEndStyle = styled(InputAddonStyle)`
	${tw`right-0 border border-transparent rounded-r`}
`;

const InputGroupStyle = styled.div`
	${tw`relative flex`}
`;

export const InputAddon = (props: any) => <InputAddonStyle {...props} />;

export const InputAddonStart = (props: any) => <InputAddonStartStyle {...props} />;

export const InputAddonEnd = (props: any) => <InputAddonEndStyle {...props} />;

export const InputGroup = (props: any) => <InputGroupStyle {...props} />;
