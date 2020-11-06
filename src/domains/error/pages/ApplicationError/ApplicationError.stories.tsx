import React from "react";

import { ApplicationError } from "./ApplicationError";

export default {
	title: "Domains / Error / Pages / ApplicationError",
};

export const Default = () => <ApplicationError resetErrorBoundary={() => alert("reseted")} />;
