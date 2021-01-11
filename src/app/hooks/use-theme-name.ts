import { shouldUseDarkColors } from "utils/electron-utils";

export const useThemeName = () => (shouldUseDarkColors() ? "dark" : "light");
