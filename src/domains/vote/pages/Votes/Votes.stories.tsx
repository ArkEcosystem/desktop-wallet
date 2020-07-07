import React from "react";

import { addressListData, delegateListData,networks } from "../../data";
import { Votes } from "./Votes";

export default { title: "Domains / Vote / Pages / Votes" };

export const Default = () => (
	<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />
);
