import { Alert, AlertVariant } from "app/components/Alert";
import { OriginalButton } from "app/components/Button/OriginalButton";
import { Icon } from "app/components/Icon";
import cls from "classnames";
import React from "react";
import { Id as ToastId, toast, ToastContent, ToastContentProps, ToastOptions, TypeOptions } from "react-toastify";

const { TYPE } = toast;

export const ToastMessage = ({
	children,
	type,
	...props
}: { children: React.ReactNode; type: TypeOptions } & ToastContentProps) => {
	const typeVariant: Record<TypeOptions, AlertVariant> = {
		info: "info",
		dark: "hint",
		default: "info",
		success: "success",
		error: "danger",
		warning: "warning",
	};

	const variant = typeVariant[type];

	const colorVariant: Record<AlertVariant, string> = {
		info: "primary",
		success: "success",
		warning: "warning",
		danger: "danger",
		hint: "hint",
	};

	const buttonColorVariant: Record<AlertVariant, string> = {
		info: "primary-100",
		success: "success-200",
		warning: "warning-100",
		danger: "danger-100",
		hint: "hint-100",
	};

	return (
		<Alert
			variant={variant}
			className={`border border-transparent shadow-sm dark:shadow-none dark:border-theme-${colorVariant[variant]}-200`}
		>
			<div className="flex items-center space-x-4">
				<div className="flex-1 text-theme-text">{children}</div>

				<OriginalButton
					data-testid="ToastMessage__close-button"
					variant="transparent"
					size="icon"
					onClick={props.closeToast}
					className={cls(
						"w-11 h-11 text-theme-secondary-900",
						`bg-theme-${buttonColorVariant[variant]}`,
						"dark:bg-theme-secondary-700 dark:text-theme-secondary-200",
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

	private toast(type: TypeOptions, content: ToastContent, options?: ToastOptions): ToastId {
		return toast(
			(props) => (
				<ToastMessage type={type} {...props}>
					{content}
				</ToastMessage>
			),
			{ ...this.options(), ...(options || {}) },
		);
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
