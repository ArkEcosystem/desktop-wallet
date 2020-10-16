import { images } from "app/assets/images";
import { useDarkMode } from "app/hooks";
import React from "react";

type Props = {
	name: string;
	domain: string;
} & React.HTMLProps<any>;

export const Image = ({ name, domain, ...props }: Props) => {
	const isDark = useDarkMode();

	const [imageName, setImageName] = React.useState("");

	React.useLayoutEffect(() => {
		setImageName(isDark ? `${name}Dark` : name);
	}, [name, isDark]);

	// @ts-ignore
	const Image = images[domain][imageName] || images[domain][name];

	return Image ? <Image {...props} /> : null;
};

Image.defaultProps = {
	domain: "common",
};
