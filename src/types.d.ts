import "twin.macro";

import styledComponent, { css as cssProperty } from "styled-components";

declare module "twin.macro" {
	const css: typeof cssProperty;
	const styled: typeof styledComponent;
}

export type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "icon";

export type ButtonVariant = "solid" | "plain" | "outline" | "transparent";

export type NavbarVariant = "full" | "logo-only";
