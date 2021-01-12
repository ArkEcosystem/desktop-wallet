import styled, { CSSObject } from "styled-components";

type Props = { styled: CSSObject };

export const Box = styled.div<Props>((props: Props) => props.styled);
