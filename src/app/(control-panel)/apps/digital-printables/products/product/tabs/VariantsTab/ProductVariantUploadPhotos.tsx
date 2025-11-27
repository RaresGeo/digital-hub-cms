import { lighten } from "@mui/material/styles";
import FuseUtils from "@fuse/utils";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import { DigitalPrintableProductVariant } from "../../../../DigitalPrintablesApi";
import { useAppDispatch } from "@/store/hooks";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { useCallback, useMemo } from "react";
import clsx from "clsx";
import ConfirmRemoveDialog from "@/app/(control-panel)/components/dialogs/RemoveDialog";

type ProductVariantTabProps = {
	variantId: string;
};

function ProductVariantUploadPhotos({ variantId }: ProductVariantTabProps) {
	const dispatch = useAppDispatch();
	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	const variants = watch("variants") as DigitalPrintableProductVariant[];

	const variantIndex = useMemo(() => {
		return variants.findIndex((v) => v.id === variantId);
	}, [variants, variantId]);

	const handleOnRemovePhoto = useCallback(
		(photoId) => {
			const photos = variants[variantIndex]?.photos || [];
			const photoToRemove = photos.find((photo) =>
				photo.id === photoId
			);

			if (!photoToRemove) {
				return;
			}

			dispatch(
				openDialog({
					children: (
						<ConfirmRemoveDialog
							onCancel={() =>
								dispatch(
									closeDialog(),
								)}
							onRemove={async () => {
								const newPhotos =
									photos.map(
										(
											photo,
										) => {
											return {
												...photo,
												sortOrder:
													photo.sortOrder >
														photoToRemove
															.sortOrder
														? photo.sortOrder -
														1
														: photo.sortOrder,
											};
										},
									);

								setValue(
									`variants.${variantIndex}.photos`,
									newPhotos
										.filter(
											(
												photo,
											) => photo
												.id !==
												photoId
										),
								);

								dispatch(
									closeDialog(),
								);
							}}
						/>
					),
				}),
			);
		},
		[dispatch, setValue, variantIndex, variants],
	);

	return (
		<div className="flex justify-center sm:justify-start flex-wrap -mx-3">
			<Controller
				name={`variants.${variantIndex}.photos`}
				control={control}
				render={({ field: { onChange, value } }) => (
					<Box
						sx={(theme) => ({
							backgroundColor:
								lighten(
									theme.palette
										.background
										.default,
									0.02,
								),
							...theme.applyStyles(
								"light",
								{
									backgroundColor:
										lighten(
											theme.palette
												.background
												.default,
											0.2,
										),
								},
							),
						})}
						component="label"
						htmlFor={`button-file-variant-${variantId}`}
						className="productImageUpload flex items-center justify-center relative w-32 h-32 rounded-lg mx-3 mb-6 overflow-hidden cursor-pointer shadow-sm hover:shadow-lg"
					>
						<input
							accept="image/*"
							className="hidden"
							id={`button-file-variant-${variantId}`}
							type="file"
							onChange={async (e) => {
								function readFileAsync() {
									return new Promise(
										(
											resolve,
											reject,
										) => {
											const file =
												e?.target
													?.files?.[
												0
												];

											if (!file) {
												return reject(
													new Error(
														"No file selected",
													),
												);
											}

											const reader =
												new FileReader();
											reader.onload =
												() => {
													const base64String =
														reader.result as string;
													const base64Data =
														base64String
															.split(",")[
														1
														];

													resolve({
														id: FuseUtils
															.generateGUID(),
														url: `data:${file.type};base64,${base64Data}`,
														type: "image",
													});
												};
											reader.onerror =
												reject;
											reader.readAsDataURL(
												file,
											);
										},
									);
								}

								const newImage =
									await readFileAsync();
								console.log(
									newImage,
								);
								onChange([
									{
										...(newImage as {
											url: string;
											id: string;
										}),
										id: `new-${newImage.id}`,
										sortOrder:
											Number(
												value?.length ??
												0,
											),
									},
									...((value ??
										[]) as DigitalPrintableProductVariant[
										"photos"
										]),
								]);
							}}
						/>
						<FuseSvgIcon
							size={32}
							color="action"
						>
							heroicons-outline:arrow-up-on-square
						</FuseSvgIcon>
					</Box>
				)}
			/>
			<Controller
				name="featuredImageId"
				control={control}
				defaultValue=""
				render={({ field: { onChange, value } }) => {
					return (
						<>
							{variants[variantIndex]
								.photos.map((
									media,
								) => (
									<Box
										sx={(
											theme,
										) => ({
											backgroundColor:
												lighten(
													theme.palette
														.background
														.default,
													0.02,
												),
											...theme.applyStyles(
												"light",
												{
													backgroundColor:
														lighten(
															theme.palette
																.background
																.default,
															0.2,
														),
												},
											),
										})}
										role="button"
										tabIndex={0}
										className={clsx(
											"productImageItem flex items-center justify-center relative w-32 h-32 rounded-lg mx-3 mb-6 overflow-hidden outline-hidden shadow-sm hover:shadow-lg",
											media.id ===
											value &&
											"featured",
										)}
										key={media
											.id}
									>
										<FuseSvgIcon
											onClick={() =>
												onChange(
													media.id,
												)}
											className="productImageFeaturedStar"
										>
											heroicons-solid:star
										</FuseSvgIcon>
										<FuseSvgIcon
											onClick={() =>
												handleOnRemovePhoto(
													media.id,
												)}
											className="productImageRemoveTrash"
										>
											heroicons-solid:trash
										</FuseSvgIcon>
										<img
											className="max-w-none w-auto h-full"
											src={media
												.url}
											alt="product"
										/>
									</Box>
								))}
						</>
					);
				}}
			/>
		</div>
	);
}

export default ProductVariantUploadPhotos;
