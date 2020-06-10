import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Helpers
import { buildTranslations } from "./helpers";

const resources = {
	en: {
		translation: buildTranslations("en-US"),
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "en",
});

export { i18n };
