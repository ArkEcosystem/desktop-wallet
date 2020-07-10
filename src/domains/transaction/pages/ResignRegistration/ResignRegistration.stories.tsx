import React from "react";

import { ResignRegistration } from "./ResignRegistration";

export default { title: "Domains / Transaction / Pages / ResignRegistration" };

export const Default = () => <ResignRegistration onDownload={() => alert("download")} />;
