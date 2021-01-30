import * as yup from "yup";

export const schema = yup.object().shape({
	keywords: yup.array().of(yup.string()),
	name: yup.string().required(),
	version: yup.string(),

	"desktop-wallet": yup.object().shape({
		categories: yup.array().of(yup.string()),
		logo: yup.string(),
		permissions: yup.array().of(yup.string()),
		title: yup.string(),
		urls: yup.array().of(yup.string()),
	}),
});
