import { HttpClient } from "./HttpClient";
import { ToastService } from "./ToastService";
export * from "./Deeplinker";

export const httpClient = new HttpClient(10);
export const toasts = new ToastService();
