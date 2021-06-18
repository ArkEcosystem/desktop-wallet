export type Color = "info" | "success" | "warning" | "danger" | "hint";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "icon";

export type Position = "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left";

export type ButtonVariant = "primary" | "secondary" | "danger" | "transparent" | "info";

export type NavbarVariant = "full" | "logo-only";

export type Theme = "system" | "dark" | "light";

export interface TransactionFees {
	static: number;
	max: number;
	min: number;
	avg: number;
}
