import React from "react";

import { comments } from "../../data";
import { Comments } from "./Comments";

export default { title: "Domains / Plugin / Components / Comments" };

const sortOptions = {
	type: "Best",
	direction: "desc",
};

export const Default = () => <Comments sortOptions={sortOptions} comments={comments} />;
