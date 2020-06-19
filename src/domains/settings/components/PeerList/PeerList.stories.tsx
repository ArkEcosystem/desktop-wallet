import React from "react";

import { peers } from "../../data";
import { PeerList } from "./PeerList";

export default { title: "Settings / Components / PeerList" };

export const Default = () => <PeerList peers={peers} />;
