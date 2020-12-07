import React from "react";

import { Collapse } from "./Collapse";
import { CollapseToggleButton } from "./CollapseToggleButton";

export default { title: "App / Components / Collapse" };

export const Default = () => {
	const [show, setShow] = React.useState(false);

	return (
		<div>
			<CollapseToggleButton isOpen={show} onClick={() => setShow(!show)} />
			<Collapse isOpen={show} className="overflow-y-auto mt-2">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio non aliquid, tempore, voluptatum
				inventore, tempora odit commodi temporibus exercitationem hic omnis porro atque suscipit officiis
				voluptate debitis aspernatur minima odio.
			</Collapse>
		</div>
	);
};
