import React from "react";

import { EntityTable } from "./EntityTable";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / EntityTable",
};

export const Default = () => <EntityTable entities={[]} onAction={console.log} />;
