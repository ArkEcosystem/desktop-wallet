import React from "react";

import { networks,peers } from "../../data";
import { PeerList } from "./PeerList";

export default { title: "Domains / Setting / Components / PeerList" };

export const Default = () => {
	return <PeerList networks={networks} peers={peers} />;
};
