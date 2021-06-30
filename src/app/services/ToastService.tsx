import { Alert, AlertVariant } from "app/components/Alert";
import { OriginalButton } from "app/components/Button/OriginalButton";
import { Icon } from "app/components/Icon";
import cn from "classnames";
import React from "react";
import { Id as ToastId, toast, ToastContent, ToastContentProps, ToastOptions, TypeOptions } from "react-toastify";

const { TYPE } = toast;

type ToastTypeOptions = Exclude<TypeOptions, "default" | "dark">;

export const ToastMessage = ({
	children,
	type,
	closeToast,
}: { children: React.ReactNode; type: ToastTypeOptions } & ToastContentProps) => {
	const typeVariants: Record<ToastTypeOptions, AlertVariant> = {
		error: "danger",
		info: "info",
		success: "success",
		warning: "warning",
	};

	const variant = typeVariants[type];

	return (
		<Alert variant={variant}>
			<div className="flex items-center space-x-4">
				<div data-testid="ToastMessage__content" className="flex-1 text-theme-text">{children}</div>

				<OriginalButton
					data-testid="ToastMessage__close-button"
					variant="transparent"
					size="icon"
					onClick={closeToast}
					className={cn(
						"w-11 h-11 text-theme-secondary-900",
						`bg-theme-${variant === "info" ? "primary" : variant}-100 hover:bg-theme-${
							variant === "info" ? "primary" : variant
						}-200`,
						"dark:bg-theme-secondary-900 dark:text-theme-secondary-600 dark:hover:bg-theme-secondary-700 dark:hover:text-theme-secondary-400",
					)}
				>
					<Icon name="CrossSlim" width={14} height={14} />
				</OriginalButton>
			</div>
		</Alert>
	);
};

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

	private toast(type: ToastTypeOptions, content: ToastContent, options?: ToastOptions): ToastId {
		return toast(
			(properties) => (
				<ToastMessage type={type} {...properties}>
					{content}
				</ToastMessage>
			),
			{ ...this.options(), ...(options || {}) },
		);
	}

	public info(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.INFO as ToastTypeOptions, content, options);
	}

	public success(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.SUCCESS as ToastTypeOptions, content, options);
	}

	public warning(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.WARNING as ToastTypeOptions, content, options);
	}

	public error(content: ToastContent, options?: ToastOptions): ToastId {
		return this.toast(TYPE.ERROR as ToastTypeOptions, content, options);
	}

	public dismiss(id?: ToastId) {
		toast.dismiss(id);
	}
}
