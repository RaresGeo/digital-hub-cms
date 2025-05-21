import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';
import { DigitalPrintableProduct, DigitalPrintableProductVariant } from '../../../../DigitalPrintablesApi';
import FuseTabs from '@/components/tabs/FuseTabs';
import { SyntheticEvent, useState } from 'react';
import FuseTab from '@/components/tabs/FuseTab';
import ProductVariantTab from './ProductVariantTab';
import { Button } from '@mui/material';
import { VariantModel } from '../../../models/ProductModel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
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
			'&:hover .productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

/**
 * The product images tab.
 */
function ProductVariantsTab() {
	const methods = useFormContext();
	const { watch, setValue } = methods;

	const { featuredImageId, variants } = watch() as DigitalPrintableProduct;

	const [tabValue, setTabValue] = useState(variants?.[0].id || '');

	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	function handleAddVariant() {
		const currentVariants = variants || [];
		const newVariant = {
			...VariantModel({}),
			sortOrder: currentVariants.length
		} as DigitalPrintableProductVariant;

		setValue('variants', [...currentVariants, newVariant]);

		setTabValue(newVariant.id);
	}

	return (
		// <div className="p-4 sm:p-6 max-w-5xl space-y-6">
		<Root>
			<div className="w-full flex justify-between pb-[24px] mb-6 border-b border-gray-300">
				<FuseTabs
					value={tabValue}
					onChange={handleTabChange}
				>
					{(variants ?? [])
						.sort((a, b) => a.sortOrder - b.sortOrder)
						.map((variant) => (
							<FuseTab
								key={variant.id}
								value={variant.id}
								label={variant.title || `Variant ${variant.sortOrder + 1}`}
								className={
									variant.photos.some(({ id }) => id === featuredImageId)
										? 'bg-orange-400 font-bold'
										: ''
								}
							/>
						))}
				</FuseTabs>
				<Button
					onClick={handleAddVariant}
					variant="outlined"
				>
					<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
					<span className="mx-2">New variant</span>
				</Button>
			</div>

			<div className="">
				{(variants ?? []).map((variant, index) => (
					<div
						key={variant.id || index}
						className={tabValue !== variant.id ? 'hidden' : ''}
					>
						<ProductVariantTab variantId={variant.id} />
					</div>
				))}
			</div>
		</Root>
		// </div>
	);
}

export default ProductVariantsTab;
