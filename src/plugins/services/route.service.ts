import { RouteProps } from "react-router-dom";

export class RoutePluginService {
	_routes: Record<string, RouteProps[]> = {};

	all() {
		return Object.values(this._routes).flat();
	}

	add(id: string, routes: RouteProps[]) {
		this._routes[id] = routes;
	}

	remove(id: string) {
		if (!id || !this._routes[id]) {
			return;
		}

		delete this._routes[id];
	}
}
