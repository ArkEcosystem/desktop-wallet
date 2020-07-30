import React from "react";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

export default {
	title: "Domains / Help / Pages / Faq",
};

export const Default = () => <Faq articles={faqArticles} />;
