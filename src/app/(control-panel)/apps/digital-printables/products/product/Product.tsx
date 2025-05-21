import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FuseTabs from 'src/components/tabs/FuseTabs';
import FuseTab from 'src/components/tabs/FuseTab';
import ProductHeader from './ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab/BasicInfoTab';
import ProductVariantsTab from './tabs/VariantsTab/ProductVariantsTab';
import { useGetDigitalPrintablesProductQuery } from '../../DigitalPrintablesApi';
import { ProductModel } from '../models/ProductModel';

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
		z.object({
			title: z.string().min(5, 'The variant name must be at least 5 characters'),
			price: z.preprocess(
				// Convert to number if it's not already
				(val) => (!isNaN(parseFloat('' + val)) ? Number(val) : val),
				// Then validate with your rule
				z.number().min(0, 'The price must be at least 0')
			),
			sortOrder: z.number().min(0, 'The sort order must be at least 0'),
			photos: z
				.array(
					z.object({
						id: z.string().min(1, 'Please select a photo'),
						sortOrder: z.number().min(0, 'The sort order must be at least 0'),
						// the url is the base64 string of the image
						url: z.string().min(1, 'Please select a photo')
					})
				)
				.nonempty(),
			digitalAsset: z.object({
				file: z
					.any()
					.refine((data) => {
						if (!data) {
							return false;
						}

						return true;
					})
					.refine((file) => file?.size < MAX_FILE_SIZE, `Max image size is ${convertKbToMb(MAX_FILE_SIZE)}MB`)
			})
		})
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
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
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
						</FuseTabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'variants' ? 'hidden' : ''}>
								<ProductVariantsTab />
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
