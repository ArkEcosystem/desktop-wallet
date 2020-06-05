import React from "react";
import SVG from "react-inlinesvg";

type Props = {
	name: string;
	width: number;
	height: number;
};

const SvgIcon = ({ name, width, height }: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const Icon = require(`../../../resources/assets/svg/${name}.svg`);

	return <SVG src={Icon} width={width} height={height} />;
};

SvgIcon.defaultProps = {
	width: 20,
	height: 20,
};

export default SvgIcon;
