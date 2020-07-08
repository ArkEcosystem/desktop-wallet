import React from "react";

import { news } from "../../data";
import { NewsCard } from "./NewsCard";

export default { title: "Domains / News / Components / News Card" };

export const Default = () => <NewsCard {...news[0]} />;

export const WithCoverImage = () => <NewsCard {...news[0]} />;
