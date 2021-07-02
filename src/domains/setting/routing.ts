import { ExportSettings, GeneralSettings, PasswordSettings } from "domains/setting/pages";

export const SettingRoutes = [
	{
		component: GeneralSettings,
		exact: true,
		path: "/profiles/:profileId/settings/general",
	},
	{
		component: PasswordSettings,
		exact: true,
		path: "/profiles/:profileId/settings/password",
	},
	{
		component: ExportSettings,
		exact: true,
		path: "/profiles/:profileId/settings/export",
	},
	{
		component: GeneralSettings,
		exact: true,
		path: "/profiles/:profileId/settings",
	},
];
