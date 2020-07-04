import { DashboardRoutes } from "domains/dashboard/routing";
import { ProfileRoutes } from "domains/profile/routing";

export const routes: Array<Object> = [...DashboardRoutes, ...ProfileRoutes];
