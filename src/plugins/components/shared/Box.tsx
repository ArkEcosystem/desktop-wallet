import styled, { CSSObject } from "styled-components";

interface Props {
	styled: CSSObject;
}

export const Box = styled.div<Props>((props: Props) => props.styled);
