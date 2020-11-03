import React from "react";

import { networks, peers } from "../../data";
import { PeerTable } from "./PeerTable";

export default { title: "Domains / Setting / Components / PeerTable" };

export const Default = () => <PeerTable networks={networks} peers={peers} />;
