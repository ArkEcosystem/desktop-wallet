import React from "react";
import SVG from "react-inlinesvg";
// Assets
import SvgCollection from "resources/assets/svg";

type Props = {
	name: string;
	width: number;
	height: number;
};

const SvgIcon = ({ name, width, height }: Props) => {
	return <SVG src={SvgCollection[name]} width={width} height={height} />;
};

SvgIcon.defaultProps = {
	width: 20,
	height: 20,
};

export default SvgIcon;
