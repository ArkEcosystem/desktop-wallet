import styled, { CSSObject } from "styled-components";

interface Properties {
	styled: CSSObject;
}

export const Box = styled.div<Properties>((properties: Properties) => properties.styled);
