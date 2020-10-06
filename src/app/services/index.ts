import { HttpClient } from "./HttpClient";
import { ToastService } from "./ToastService";

export const httpClient = new HttpClient(10);
export const toasts = new ToastService();
