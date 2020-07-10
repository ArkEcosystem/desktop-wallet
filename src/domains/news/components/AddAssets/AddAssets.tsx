import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { SelectNetwork } from "app/components/SelectNetwork";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
	selectedAssets?: any[];
	allAssets?: any[];
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onUpdate?: any;
};

export const AddAssets = ({ selectedAssets, allAssets, isOpen, onClose, onCancel, onUpdate }: Props) => {
	const form = useForm({ mode: "onChange" });

	return (
		<Modal
			title="Add Assets"
			description="Select which assets you would like to follow"
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Form context={form} onSubmit={onUpdate}>
				<FormField name="network" className="mt-8">
					<FormLabel>Cryptoasset</FormLabel>
					<SelectNetwork networks={[]} placeholder="Enter the asset name" />
					<FormHelperText />
				</FormField>

				<div className="flex flex-col space-y-10">
					<div>
						<span className="font-semibold text-theme-neutral-dark">Your Selections</span>
						<div className="mt-3">
							<FilterNetwork networks={selectedAssets} hideViewAll />
						</div>
					</div>

					<div>
						<span className="mb-3 font-semibold text-theme-neutral-dark">All Cryptoassets</span>
						<div className="flex flex-wrap mt-3 -mx-3">
							{allAssets?.map((asset, index) => (
								<Circle
									key={index}
									size="lg"
									className="relative m-3 border-theme-neutral-200 text-theme-neutral-300"
								>
									<Icon name="Ark" width={20} height={20} />
									<Badge className="border-theme-neutral-200" />
								</Circle>
							))}

							<Circle
								size="lg"
								className="relative m-3 ml-5 border-theme-neutral-200 text-theme-neutral-300"
							>
								<div className="text-xs text-theme-primary-500">+443</div>
							</Circle>
						</div>
					</div>
				</div>

				<div className="float-right mt-4">
					<Button className="mr-3" variant="plain">
						Cancel
					</Button>
					<Button type="submit">Update</Button>
				</div>
			</Form>
		</Modal>
	);
};

AddAssets.defaultProps = {
	isOpen: false,
};
