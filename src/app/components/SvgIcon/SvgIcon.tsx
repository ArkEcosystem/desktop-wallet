import React from "react";
import { ReactSVG } from "react-svg";
import styled from "styled-components";
// Assets
import SvgCollection from "resources/assets/svg";

type Props = {
	name: string;
	width: number;
	height: number;
};

type WrapperProps = {
	width: number;
	height: number;
};

const Wrapper = styled.div(({ width, height }: WrapperProps) => ({
	svg: {
		width,
		height,
	},
}));

const SvgIcon = ({ name, width, height }: Props) => {
	return (
		<Wrapper width={width} height={height}>
			<ReactSVG src={SvgCollection[name]} />
		</Wrapper>
	);
};

SvgIcon.defaultProps = {
	width: 20,
	height: 20,
};

export default SvgIcon;
