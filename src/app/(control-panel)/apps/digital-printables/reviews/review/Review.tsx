import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Link from '@fuse/core/Link';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SyntheticEvent, useState } from 'react';
import { useParams } from 'react-router';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import FuseTab from 'src/components/tabs/FuseTab';
import FuseTabs from 'src/components/tabs/FuseTabs';
import { useGetECommerceOrderQuery } from '../../DigitalPrintablesApi';
import DetailsTab from './tabs/details/DetailsTab';
import InvoiceTab from './tabs/invoice/InvoiceTab';
import ProductsTab from './tabs/products/ProductsTab';

/**
 * The review.
 */
function Review() {
	const routeParams = useParams();
	const { reviewId } = routeParams;

	const {
		data: reviewId,
		isLoading,
		isError
	} = useGetECommerceOrderQuery(reviewId, {
		skip: !reviewId
	});

	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

	const [tabValue, setTabValue] = useState('details');

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
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
					There is no such order!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/orders"
					color="inherit"
				>
					Go to Orders Page
				</Button>
			</motion.div>
		);
	}

	return (
		<FusePageCarded
			header={
				reviewId && (
					<div className="flex flex-1 flex-col py-8">
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<PageBreadcrumb className="mb-2" />
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							className="flex flex-col min-w-0"
						>
							<Typography className="text-2xl truncate font-semibold">
								{`Order ${reviewId.reference}`}
							</Typography>
							<Typography
								variant="caption"
								className="font-medium"
							>
								{`From ${reviewId.customer.firstName} ${reviewId.customer.lastName}`}
							</Typography>
						</motion.div>
					</div>
				)
			}
			content={
				<div className="p-4 sm:p-6 w-full">
					<FuseTabs
						className="mb-8"
						value={tabValue}
						onChange={handleTabChange}
					>
						<FuseTab
							value="details"
							label="Order Details"
						/>
						<FuseTab
							value="products"
							label="Products"
						/>
						<FuseTab
							value="invoice"
							label="Invoice"
						/>
					</FuseTabs>
					{reviewId && (
						<>
							{tabValue === 'details' && <DetailsTab />}
							{tabValue === 'products' && <ProductsTab />}
							{tabValue === 'invoice' && <InvoiceTab order={reviewId} />}
						</>
					)}
				</div>
			}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Review;
