import React from "react";
import { useForm } from "react-hook-form";

type Props = {
	handleOnSubmit: any;
	children: React.ReactNode;
	id?: string;
};

export const Form = ({ handleOnSubmit, children, id }: Props) => {
	const { handleSubmit } = useForm();

	return (
		<form id={id} onSubmit={handleSubmit(handleOnSubmit)}>
			{children}
		</form>
	);
};
