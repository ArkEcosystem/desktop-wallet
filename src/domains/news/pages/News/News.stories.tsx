import React from "react";

import { assets, categories, news } from "../../data";
import { News } from "./News";

export default { title: "Domains / News / Pages / News" };

export const Default = () => <News news={news} categories={categories} assets={assets} />;
