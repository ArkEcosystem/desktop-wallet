import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Select } from "app/components/Select";
import React from "react";
import { useForm } from "react-hook-form";

type CustomPeersProps = {
	isOpen: boolean;
	onClose?: any;
	onAddPeer?: any;
};

export const CustomPeers = ({ isOpen, onClose, onAddPeer }: CustomPeersProps) => {
	const form = useForm({ mode: "onChange" });

	return (
		<Modal title="Custom Peers" size="xl" isOpen={isOpen} onClose={onClose}>
			<Form context={form} onSubmit={onAddPeer}>
				<FormField name="network">
					<FormLabel>Network</FormLabel>
					<Select ref={form.register({ required: "Field required" })}>
						<option value="">Select</option>
						<option value="ark-ecosystem">ARK Ecosystem</option>
					</Select>
					<FormHelperText />
				</FormField>

				<FormField name="name">
					<FormLabel>Name</FormLabel>
					<Input ref={form.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="peer-ip">
					<FormLabel>Peer IP http://</FormLabel>
					<Input ref={form.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="peer-type">
					<FormLabel>Peer Type</FormLabel>
					<label htmlFor="multisig" className="inline-flex items-center">
						<Checkbox />
						<span className="ml-2 text-sm font-semibold text-theme-neutral-dark">Multisig</span>
					</label>
				</FormField>

				<div className="float-right mt-4">
					<Button type="submit" color="primary" variant="solid" data-testid="peer-list__add-button">
						Add Peer
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

CustomPeers.defaultProps = {
	isOpen: false,
};
