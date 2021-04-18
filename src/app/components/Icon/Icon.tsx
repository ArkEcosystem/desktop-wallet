// Assets
import { SvgCollection } from "app/assets/svg";
import React from "react";
import styled from "styled-components";

type Props = {
	name: string;
	width: number | string;
	height: number | string;
	as?: React.ElementType;
	fallback?: React.ReactNode;
} & React.HTMLProps<any>;

type WrapperProps = {
	width: number | string;
	height: number | string;
};

const Wrapper = styled.div(({ width, height }: WrapperProps) => ({
	svg: {
		width,
		height,
	},
}));

export const Icon = ({ name, width, height, fallback, ...props }: Props) => {
	const Svg = SvgCollection[name];

	return (
		<Wrapper width={width} height={height} {...props}>
			{Svg ? <Svg /> : fallback}
		</Wrapper>
	);
};

Icon.defaultProps = {
	width: "1em",
	height: "1em",
};
