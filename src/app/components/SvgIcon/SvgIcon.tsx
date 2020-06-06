import React from "react";
import { ReactSVG } from "react-svg";
// Assets
import SvgCollection from "resources/assets/svg";

type Props = {
	name: string;
	width: number;
	height: number;
};

const SvgIcon = ({ name, width, height }: Props) => {
	return <ReactSVG src={SvgCollection[name]} width={width} height={height} />;
};

SvgIcon.defaultProps = {
	width: 20,
	height: 20,
};

export default SvgIcon;
