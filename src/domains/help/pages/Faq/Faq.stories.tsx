import React from "react";

import { faqArticles } from "../../data";
import { Faq } from "./Faq";

export default {
	title: "Help / Pages / Portfolio",
};

export const Default = () => {
	return (
		<div className="-m-5">
			<Faq articles={faqArticles} />
		</div>
	);
};
