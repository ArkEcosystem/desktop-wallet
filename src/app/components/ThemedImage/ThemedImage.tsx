import { images } from "app/assets/images";
import { useDarkMode } from "app/hooks";
import React from "react";
import styled from "styled-components";

type Props = {
  name: string;
  width?: number | string;
  height?: number | string;
  domain?: string;
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

export const ThemedImage = ({ name, domain, width, height, ...props }: Props) => {
  const isDark = useDarkMode();

  const [imageName, setImageName] = React.useState("");

  React.useLayoutEffect(() => {
    setImageName(isDark ? `${name}Dark` : name);
  }, [name, isDark]);

  if (imageName) {
    const Image = images[domain][imageName];

    return (
      <Wrapper width={width} height={height} {...props}>
        <Image />
      </Wrapper>
    );
  }

  return null;
};

ThemedImage.defaultProps = {
  domain: "common",
};
