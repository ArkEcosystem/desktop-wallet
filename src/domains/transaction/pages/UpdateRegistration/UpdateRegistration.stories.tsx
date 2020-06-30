import React from "react";

import { UpdateRegistration } from "./UpdateRegistration";

export default { title: "Domains / Transaction / Pages / UpdateRegistration" };

export const Default = () => <UpdateRegistration onDownload={() => alert("download")} />;
