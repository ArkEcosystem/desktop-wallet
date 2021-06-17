// Assets
import { SvgCollection } from "app/assets/svg";
import React from "react";
import styled from "styled-components";

type Properties = {
	name: string;
	width: number | string;
	height: number | string;
	as?: React.ElementType;
	fallback?: React.ReactNode;
} & React.HTMLProps<any>;

interface WrapperProperties {
	width: number | string;
	height: number | string;
}

const Wrapper = styled.div(({ width, height }: WrapperProperties) => ({
	svg: {
		width,
		height,
	},
}));

export const Icon = ({ name, width, height, fallback, ...properties }: Properties) => {
	const Svg = SvgCollection[name];

	return (
		<Wrapper width={width} height={height} {...properties}>
			{Svg ? <Svg /> : fallback}
		</Wrapper>
	);
};

Icon.defaultProps = {
	width: "1em",
	height: "1em",
};
