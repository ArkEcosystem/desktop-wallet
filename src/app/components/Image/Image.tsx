import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { useActiveProfile } from "app/hooks";
import React from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

type Properties = {
	name: string;
	domain: string;
} & React.HTMLProps<any>;

export const Image = ({ name, domain, ...properties }: Properties) => {
	const [imageName, setImageName] = React.useState("");

	let profile: Contracts.IProfile | undefined;
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		profile = useActiveProfile();
	} catch {
		profile = undefined;
	}

	React.useLayoutEffect(() => {
		let imageName: string = name;

		if (shouldUseDarkColors()) {
			imageName = `${imageName}Dark`;
		} else {
			imageName = `${imageName}Light`;
		}

		// @TODO: get colour scheme from profile settings once appearance tab is implemented
		let theme = "green";
		theme = theme.charAt(0).toUpperCase() + theme.slice(1);

		setImageName(`${imageName}${theme}`);
	}, [name, profile]);

	// @ts-ignore
	const Image = images[domain][imageName] || images[domain][name];

	return Image ? <Image {...properties} /> : null;
};

Image.defaultProps = {
	domain: "common",
};
