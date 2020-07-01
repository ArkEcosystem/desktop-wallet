import React from "react";

import { Avatar } from "./Avatar";

export default { title: "App / Components / Avatar" };

export const Default = () => {
	return (
		<div className="inline-flex space-x-5">
			<Avatar address="APTzMNCTPsDj6VcL8egi2weXJFgHGmCZGp" size="small" />
			<Avatar address="DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq" size="default" />
			<Avatar address="12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX" size="large" />
		</div>
	);
};
