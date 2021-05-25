declare module "*.svg" {
	import React = require("react");
	export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

declare module "password-pwnd" {
	const pwnd: (value: string) => Promise<number>;
	const strong: (value: string) => Promise<1 | 0>;
}
