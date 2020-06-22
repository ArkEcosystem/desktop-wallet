import React from "react";

import { Button } from "../Button";
import { Collapse } from "./Collapse";

export default { title: "Basic / Collapse" };

export const Default = () => {
	const [show, setShow] = React.useState(false);

	return (
		<div>
			<Button onClick={() => setShow(!show)}>Toggle</Button>
			<Collapse isOpen={show} className="mt-2 overflow-y-auto">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio non aliquid, tempore, voluptatum
				inventore, tempora odit commodi temporibus exercitationem hic omnis porro atque suscipit officiis
				voluptate debitis aspernatur minima odio.
			</Collapse>
		</div>
	);
};
