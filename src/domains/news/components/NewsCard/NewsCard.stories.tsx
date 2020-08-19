import React from "react";
import blockfolioFixture from "tests/fixtures/news/page-1.json";

import { NewsCard } from "./NewsCard";

export default { title: "Domains / News / Components / News Card" };

export const Default = () => <NewsCard {...blockfolioFixture.data[0]} coin="ark" />;

export const WithCoverImage = () => <NewsCard {...blockfolioFixture.data[1]} coin="ark" />;
