import React from "react";

import { Reply } from "./Reply";

export default { title: "Plugins / Components / Review Box / Components / Comments / Components / Reply" };

const date = "2020-06-19T14:48:00.000Z";
const content = "<a href='#'>@Gerard Blezer</a> Our GitHub bount reward program utlilizes a tiered structure.";

export const Default = () => <Reply date={date} content={content} />;
