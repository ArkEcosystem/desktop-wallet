import React from "react";
import { useForm } from "react-hook-form";

type Props = {
	handleOnSubmit: any;
	children: React.ReactNode;
};

export const Form = ({ handleOnSubmit, children }: Props) => {
	const { handleSubmit } = useForm();

	return <form onSubmit={handleSubmit(handleOnSubmit)}>{children}</form>;
};
