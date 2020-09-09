import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";
import { openFile } from "utils/electron-utils";

type SelectProfileImageProps = {
	value?: string;
	name?: string;
	onSelect: (raw: string) => void;
};

const ProfileImageStyled = styled.div`
	& {
		${tw`relative inline-flex items-center justify-center overflow-hidden rounded`};
	}
	&:after {
		content: "";
		box-shadow: 0px 0px 0px 100px rgba(0, 0, 0, 0.4);
		${tw`absolute w-22 h-22 left-1 top-1 rounded-full`};
	}
`;

export const SelectProfileImage = ({ value, name, onSelect }: SelectProfileImageProps) => {
	const { t } = useTranslation();

	const handleUploadImage = async () => {
		const raw = await openFile(null, {
			filters: { name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] },
			encoding: "base64",
		});

		if (raw) {
			onSelect(`data:image/png;base64,${raw}`);
		}
	};

	const isSvg = useMemo(() => value && value.endsWith("</svg>"), [value]);

	return (
		<div className="group">
			<span className="text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary text-theme-neutral-dark">
				{t("SETTINGS.GENERAL.PERSONAL.PROFILE_IMAGE")}
			</span>

			<div className="flex flex-row mt-2">
				<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-primary-contrast">
					<div className="overflow-hidden rounded-full w-22 h-22">
						<Button
							className="w-22 h-22"
							variant="plain"
							onClick={handleUploadImage}
							data-testid="SelectProfileImage__upload-button"
						>
							<Icon name="Upload" />
						</Button>
					</div>
				</div>
				{value && !isSvg && (
					<div className="relative w-24 h-24 rounded bg-theme-neutral-contrast">
						<ProfileImageStyled>
							<img
								src={isSvg ? `data:image/svg+xml;utf8,${value}` : value}
								className="object-cover w-24 h-24 bg-center bg-no-repeat bg-cover rounded"
								alt="Profile avatar"
							/>
							{isSvg && (
								<span className="absolute text-2xl font-semibold text-theme-background">
									{name?.slice(0, 2).toUpperCase()}
								</span>
							)}
						</ProfileImageStyled>
						<Button
							data-testid="SelectProfileImage__remove-button"
							size="icon"
							color="danger"
							variant="plain"
							className="absolute flex items-center justify-center w-6 h-6 p-1 -top-3 -right-3"
							onClick={() => onSelect("")}
							disabled={!!isSvg}
						>
							<Icon name="Close" width={12} height={12} />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
