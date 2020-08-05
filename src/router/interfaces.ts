import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { History, Location } from "history";

export interface MiddlewareParams {
	location: Location;
	env: Environment;
	redirect: (url: string) => void;
	history: History;
}

export interface Middleware {
	handler(params: MiddlewareParams): boolean;
}
