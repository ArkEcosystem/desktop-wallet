import { images } from "app/assets/images";
import React from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

type Properties = {
	name: string;
	domain: string;
} & React.HTMLProps<any>;

export const Image = ({ name, domain, ...properties }: Properties) => {
	const [imageName, setImageName] = React.useState("");

	React.useLayoutEffect(() => {
		setImageName(shouldUseDarkColors() ? `${name}Dark` : name);
	}, [name]);

	// @ts-ignore
	const Image = images[domain][imageName] || images[domain][name];

	return Image ? <Image {...properties} /> : null;
};

Image.defaultProps = {
	domain: "common",
};
