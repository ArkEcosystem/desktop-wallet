import React from "react";

import { Link } from "./Link";

export default { title: "App / Components / Link" };

export const Default = () => <Link to="/wallets">Wallets</Link>;

export const External = () => (
	<Link to="https://ark.io" isExternal>
		ARK.io
	</Link>
);

export const WithTooltip = () => <Link to="https://ark.io" isExternal tooltip="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />;
