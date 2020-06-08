import React from "react";
import tw, { styled } from "twin.macro";
import { imagesConfig } from "resources/assets/images";

type ArkLogoProps = {
	className?: string;
};

const commonAssets = imagesConfig.common;

const Div = styled.div`
	${tw`flex rounded-lg p-2 bg-logo`}
`;

export const ArkLogo: React.FC<ArkLogoProps> = ({ className }: { className?: string }) => (
	<Div>
		<img src={commonAssets.ARKLogo} className={className} alt="ARK Logo" />
	</Div>
);
