import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { addressListData, delegateListData } from "../../data";
import { Votes } from "./Votes";

export default { title: "Domains / Vote / Pages / Votes" };

export const Default = () => (
	<Votes networks={availableNetworksMock} addressList={addressListData} delegateList={delegateListData} />
);
