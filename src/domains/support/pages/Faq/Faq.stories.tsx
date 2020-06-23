import React from "react";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

export default {
	title: "Support / Pages / Portfolio",
};

export const Default = () => {
	return <Faq articles={faqArticles} />;
};
