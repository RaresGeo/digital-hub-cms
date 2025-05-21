import { orange, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { DigitalPrintableProductVariant } from '../../../../DigitalPrintablesApi';
import { Button, TextField } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useCallback, useMemo } from 'react';
import ProductVariantUploadPhotos from './ProductVariantUploadPhotos';
import ProductVariantUploadDigitalAsset from './ProductVariantUploadDigitalAsset';
import ConfirmRemoveDialog from '@/app/(control-panel)/components/dialogs/RemoveDialog';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 5,
		right: 5,
		color: orange[400],
		opacity: 0,
		cursor: 'pointer'
	},
	'& .productImageRemoveTrash': {
		position: 'absolute',
		bottom: 5,
		right: 5,
		color: red[400],
		opacity: 0.8,
		cursor: 'pointer'
	},
	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1
			},
			'& .productImageRemoveTrash': {
				opacity: 0
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

type ProductVariantTabProps = {
	variantId: string;
};

function ProductVariantTab({ variantId }: ProductVariantTabProps) {
	const dispatch = useAppDispatch();
	const methods = useFormContext();
	const { control, watch, formState, setValue } = methods;
	const { errors } = formState;

	const variants = watch('variants') as DigitalPrintableProductVariant[];

	const variantIndex = useMemo(() => {
		return variants.findIndex((v) => v.id === variantId);
	}, [variants, variantId]);

	const error = useMemo(() => {
		return errors.variants?.[variantIndex];
	}, [errors.variants, variantIndex]);

	const handleOnRemoveVariant = useCallback(() => {
		if (variants?.length < 2) {
			return;
		}

		const thisVariant = variants[variantIndex];

		if (!thisVariant) {
			return;
		}

		dispatch(
			openDialog({
				children: (
					<ConfirmRemoveDialog
						onCancel={() => dispatch(closeDialog())}
						onRemove={async () => {
							const newVariants = variants.map((v) => {
								return {
									...v,
									sortOrder: v.sortOrder > thisVariant.sortOrder ? v.sortOrder - 1 : v.sortOrder
								};
							});

							setValue(
								'variants',
								newVariants.filter((v) => v.id !== variantId)
							);

							dispatch(closeDialog());
						}}
					/>
				)
			})
		);
	}, [dispatch, setValue, variants, variantIndex, variantId]);

	return (
		<>
			<Root>
				<Controller
					name={`variants.${variantIndex}.title`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							id={`variants.${variantIndex}.title`}
							className="mt-2 mb-4"
							required
							label="Title"
							autoFocus
							variant="outlined"
							fullWidth
							error={!!error?.title}
							helperText={error?.title?.message as string}
						/>
					)}
				/>

				<Controller
					name={`variants.${variantIndex}.price`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							id={`variants.${variantIndex}.price`}
							className="mt-2 mb-4"
							required
							label="Price ($)"
							type="number"
							variant="outlined"
							fullWidth
							error={!!error?.price}
							helperText={error?.price?.message as string}
						/>
					)}
				/>

				<ProductVariantUploadPhotos variantId={variantId} />

				<ProductVariantUploadDigitalAsset variantId={variantId} />

				<Controller
					name={`variants.${variantIndex}.active`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-2 mb-4 w-full max-w-36 cursor-pointer!"
							id="active"
							label="Active"
							type="checkbox"
							variant="outlined"
							value={undefined}
							slotProps={{
								htmlInput: {
									checked: Boolean(field.value)
								}
							}}
						/>
					)}
				/>
			</Root>
			<div className="w-full flex justify-end">
				<Button
					onClick={handleOnRemoveVariant}
					variant="contained"
					color="error"
					disabled={variants?.length < 2}
				>
					<FuseSvgIcon color="white">heroicons-outline:trash</FuseSvgIcon>
					<span className="mx-2">Remove variant</span>
				</Button>
			</div>
		</>
	);
}

export default ProductVariantTab;
