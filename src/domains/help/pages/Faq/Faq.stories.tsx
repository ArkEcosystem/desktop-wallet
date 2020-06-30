import React from "react";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

export default {
	title: "Domains / Help / Pages / Faq",
};

export const Default = () => {
	return (
		<div className="-m-5">
			<Faq articles={faqArticles} />
		</div>
	);
};
