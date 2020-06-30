import React from "react";

import { Toggle } from "./Toggle";

export default { title: "App / Components / Toggle" };

export const Default = () => <Toggle onChange={(e) => console.log(e.target.checked)} />;
