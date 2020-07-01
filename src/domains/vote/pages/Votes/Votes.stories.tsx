import React from "react";

import { addressListData, assets, delegateListData } from "../../data";
import { Votes } from "./Votes";

export default { title: "Domains / Vote / Pages / Votes" };

export const Default = () => <Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />;
