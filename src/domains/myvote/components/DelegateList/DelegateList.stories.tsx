import React from "react";

import { delegateListData } from "../../data";
import { DelegateList } from "./DelegateList";

export default { title: "My Votes / Components / DelegateList" };

export const Default = () => <DelegateList data={delegateListData} />;
