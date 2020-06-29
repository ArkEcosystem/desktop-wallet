import React from "react";

import { addressListData } from "../../data";
import { AddressList } from "./AddressList";

export default { title: "My Votes / Components / AddressList" };

export const Default = () => <AddressList data={addressListData} />;
