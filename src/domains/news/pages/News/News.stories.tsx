import React from "react";

import { news } from "../../data";
import { News } from "./News";

export default { title: "Domains / News / Pages / News" };

export const Default = () => <News news={news} />;
