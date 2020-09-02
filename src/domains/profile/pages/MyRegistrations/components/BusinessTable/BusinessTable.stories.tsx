import React from "react";

import { BusinessTable } from "./BusinessTable";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / BusinessTable",
};

export const Default = () => <BusinessTable businesses={[]} onAction={console.log} />;
