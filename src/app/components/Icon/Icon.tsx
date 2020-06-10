import React from "react";
import styled from "styled-components";
// Assets
import { SvgCollection } from "resources/assets/svg";

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

export const Icon = ({ name, width, height }: Props) => {
	const Svg = SvgCollection[name];

	return (
		<Wrapper width={width} height={height}>
			{Svg && <Svg />}
		</Wrapper>
	);
};

Icon.defaultProps = {
	width: "1em",
	height: "1em",
};
