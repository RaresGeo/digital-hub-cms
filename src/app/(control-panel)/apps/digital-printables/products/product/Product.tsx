import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Link from '@fuse/core/Link';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { motion } from 'motion/react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import FuseTab from 'src/components/tabs/FuseTab';
import FuseTabs from 'src/components/tabs/FuseTabs';
import { z } from 'zod';
import { useGetDigitalPrintablesProductQuery } from '../../DigitalPrintablesApi';
import { NEW_PRODUCT_PREFIX } from '../../orders/constants/helpers';
import { ProductModel } from '../models/ProductModel';
import ProductHeader from './ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab/BasicInfoTab';
import ProductVariantsTab from './tabs/VariantsTab/ProductVariantsTab';
import ReviewsTab from './tabs/ReviewsTab/ReviewsTab';

const MAX_FILE_SIZE = 1024 * 1024 * 50; // 50MB

const convertKbToMb = (size: number) => size / 1024;

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().min(3, 'The product name must be at least 3 characters'),
	description: z.string().min(5, 'The product description must be at least 5 characters'),
	tags: z.array(z.string()),
	variants: z.array(
		z
			.object({
				id: z.string().optional(), // Assuming id might be optional for new variants
				title: z.string().min(5, 'The variant name must be at least 5 characters'),
				price: z.preprocess(
					(val) => (!isNaN(parseFloat('' + val)) ? Number(val) : val),
					z.number().min(0, 'The price must be at least 0')
				),
				sortOrder: z.number().min(0, 'The sort order must be at least 0'),
				photos: z
					.array(
						z.object({
							id: z.string().min(1, 'Please select a photo'),
							sortOrder: z.number().min(0, 'The sort order must be at least 0'),
							// For new photos, the url is a base64 string. For uploaded photos, it's the actual url
							url: z.string().min(1, 'Please select a photo')
						})
					)
					.nonempty(),
				digitalAsset: z.union([
					// For editing existing products
					z.object({
						url: z.string().min(1, 'Digital asset URL is required')
					}),
					// For creating new products
					z.object({
						file: z
							.any()
							.refine((data) => {
								if (!data) {
									return false;
								}

								return true;
							}, 'Please upload digital asset')
							.refine(
								(file) => file?.size < MAX_FILE_SIZE,
								`Max image size is ${convertKbToMb(MAX_FILE_SIZE)}MB`
							)
					})
				])
			})
			.refine(
				(variant) => {
					const hasNewDigitalAsset = variant.digitalAsset && 'file' in variant.digitalAsset;

					if (variant.id && !variant.id.startsWith(NEW_PRODUCT_PREFIX)) {
						const hasOldDigitalAsset = variant.digitalAsset && 'url' in variant.digitalAsset;

						// if is old variant
						return hasOldDigitalAsset || hasNewDigitalAsset;
					} else {
						// If is new variant
						return hasNewDigitalAsset;
					}
				},
				{
					message: 'Invalid digital asset format',
					path: ['digitalAsset']
				}
			)
	),
	featuredImageId: z.string().min(1, 'Please select a featured image')
});

/**
 * The product page.
 */
function Product() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { productId } = routeParams;

	const { data, isLoading, isError } = useGetDigitalPrintablesProductQuery(productId, {
		skip: !productId || productId === 'new'
	});

	const product = data?.product;

	const [tabValue, setTabValue] = useState('basic-info');

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);

	useEffect(() => {
		if (product) {
			reset({ ...product });
		}
	}, [product, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					transition: { delay: 0.1 }
				}}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such product!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/digital-printables/products"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (product && productId !== product.id && productId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
				content={
					<div className="p-4 sm:p-6 max-w-5xl space-y-6">
						<FuseTabs
							value={tabValue}
							onChange={handleTabChange}
						>
							<FuseTab
								value="basic-info"
								label="Basic Info"
							/>
							<FuseTab
								value="variants"
								label="Variants"
							/>
							<FuseTab
								value="reviews"
								label="Reviews"
							/>
						</FuseTabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'variants' ? 'hidden' : ''}>
								<ProductVariantsTab />
							</div>

							<div className={tabValue !== 'reviews' ? 'hidden' : ''}>
								<ReviewsTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Product;
