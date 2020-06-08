import React from "react";
import { Button } from "./Button";

export default {
	title: "Basic / Button",
};

export const Primary = () => (
	<div className="inline-flex space-x-4">
		<Button color="primary" variant="solid">
			Solid
		</Button>
		<Button color="primary" variant="plain">
			Plain
		</Button>
		<Button color="primary" variant="outline">
			Outline
		</Button>
	</div>
);

export const Success = () => (
	<div className="inline-flex space-x-4">
		<Button color="success" variant="solid">
			Solid
		</Button>
		<Button color="success" variant="plain">
			Plain
		</Button>
		<Button color="success" variant="outline">
			Outline
		</Button>
	</div>
);

export const Danger = () => (
	<div className="inline-flex space-x-4">
		<Button color="danger" variant="solid">
			Solid
		</Button>
		<Button color="danger" variant="plain">
			Plain
		</Button>
		<Button color="danger" variant="outline">
			Outline
		</Button>
	</div>
);

export const Neutral = () => (
	<div className="inline-flex space-x-4">
		<Button color="neutral" variant="solid">
			Solid
		</Button>
		<Button color="neutral" variant="plain">
			Plain
		</Button>
		<Button color="neutral" variant="outline">
			Outline
		</Button>
	</div>
);
