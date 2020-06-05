import React from "react";
import SVG from "react-inlinesvg";

type Props = {
	name: string;
	width: number;
	height: number;
};

const SvgIcon = ({ name, width, height }: Props) => {
	// TODO: Find a better way to deal with this require, this shouldn't be done
	// this way since it's gonna be impossible to test once the test file will override
	// the require relative location :/
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const Icon = require(`../../../resources/assets/svg/${name}.svg`);

	return <SVG src={Icon} width={width} height={height} />;
};

SvgIcon.defaultProps = {
	width: 20,
	height: 20,
};

export default SvgIcon;
