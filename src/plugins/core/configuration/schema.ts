import * as yup from "yup";

export const schema = yup.object().shape({
	"desktop-wallet": yup.object().shape({
		categories: yup.array().of(yup.string()),
		logo: yup.string(),
		minimumVersion: yup.string(),
		permissions: yup.array().of(yup.string()),
		title: yup.string(),
		urls: yup.array().of(yup.string()),
	}),
	keywords: yup
		.array()
		.required()
		.of(yup.string())
		.test(
			"missing-keywords",
			"Does not contain required keywords",
			(keywords) => !!(keywords?.includes("@arkecosystem") && keywords?.includes("desktop-wallet")),
		),
	name: yup.string().required(),

	version: yup.string(),
});
