import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { Location } from "history";

export interface MiddlewareParams {
	location: Location;
	env: Environment;
	redirect: (url: string) => void;
}

export interface Middleware {
	handler(params: MiddlewareParams): boolean;
}
