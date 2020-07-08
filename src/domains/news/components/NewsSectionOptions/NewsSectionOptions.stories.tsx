import React from "react";

import { assets, categories } from "../../data";
import { NewsSectionOptions } from "./NewsSectionOptions";

export default { title: "Domains / News / Components / News Section Options" };

export const Default = () => <NewsSectionOptions categories={categories} selectedAssets={assets} />;
