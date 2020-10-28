import { Id as ToastId, toast, ToastContent, ToastOptions, TypeOptions } from "react-toastify";

const { TYPE } = toast;

export class ToastService {
	private readonly defaultOptions: ToastOptions = {
		autoClose: 5000,
		closeButton: false,
		hideProgressBar: true,
		pauseOnFocusLoss: true,
		position: "bottom-right",
	};

	public options() {
		return this.defaultOptions;
	}

	private toast(type: TypeOptions, content: ToastContent, options?: ToastOptions): ToastId {
		// @ts-ignore
		return toast[type](content, { ...this.options(), ...(options || {}) });
	}

	public info(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.INFO, content, options);
	}

	public success(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.SUCCESS, content, options);
	}

	public warning(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.WARNING, content, options);
	}

	public error(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.ERROR, content, options);
	}

	public dismiss(id?: ToastId) {
		toast.dismiss(id);
	}
}
