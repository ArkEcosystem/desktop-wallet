import { Image } from "app/components/Image";
import React from "react";

type ExchangeImageProps = {
	logoURL?: string;
};

export const ExchangeImage = ({ logoURL }: ExchangeImageProps) => {
	if (!logoURL) {
		return (
			<div data-testid="ExchangeImage__placeholder">
				<Image name="PluginLogoPlaceholder" domain="plugin" />
			</div>
		);
	}

	return <img data-testid="ExchangeImage__logo" src={logoURL} alt="Exchange Logo" width={100} height={100} />;
};
