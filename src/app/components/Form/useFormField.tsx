import React from "react";

interface FieldContext {
	isInvalid: boolean;
	name: string;
	errorMessage?: string;
}

const Context = React.createContext<FieldContext | undefined>(undefined);

export const FormFieldProvider = Context.Provider;
export const FormFieldConsumer = Context.Consumer;
export const useFormField = () => React.useContext(Context);
