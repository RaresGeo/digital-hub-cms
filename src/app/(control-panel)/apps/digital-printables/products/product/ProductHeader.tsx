import useNavigate from "@fuse/hooks/useNavigate";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import { motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";
import PageBreadcrumb from "src/components/PageBreadcrumb";
import {
	DigitalPrintableProduct,
	useCreateDigitalPrintablesProductMutation,
	useDeleteDigitalPrintablesProductMutation,
	useUpdateDigitalPrintablesProductMutation,
} from "../../DigitalPrintablesApi";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { NEW_PRODUCT_PREFIX } from "../../orders/constants/helpers";

/**
 * The product header.
 */
function ProductHeader() {
	const [loading, setLoading] = useState(false);
	const routeParams = useParams<{ productId: string }>();
	const { productId } = routeParams;

	const [createProduct] = useCreateDigitalPrintablesProductMutation();
	const [saveProduct] = useUpdateDigitalPrintablesProductMutation();
	const [removeProduct] = useDeleteDigitalPrintablesProductMutation();

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { title, thumbnailUrl, featuredImageId, variants } =
		watch() as DigitalPrintableProduct;

	function handleSaveProduct() {
		saveProduct(getValues() as DigitalPrintableProduct)
			.unwrap()
			.then(() => {
				navigate(`/apps/digital-printables/products/`);
				setLoading(false);
			})
			.catch(() => setLoading(false));

		setLoading(true);
	}

	function handleCreateProduct() {
		createProduct(getValues() as DigitalPrintableProduct)
			.unwrap()
			.then(() => {
				navigate(`/apps/digital-printables/products/`);
				setLoading(false);
			})
			.catch(() => setLoading(false));

		setLoading(true);
	}

	function handleRemoveProduct() {
		removeProduct(productId);
		navigate("/apps/e-commerce/products");
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-2 sm:space-y-0 py-6 sm:py-8">
			<div className="flex flex-col items-start space-y-2 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{
						x: 20,
						opacity: 0,
					}}
					animate={{
						x: 0,
						opacity: 1,
						transition: { delay: 0.3 },
					}}
				>
					<PageBreadcrumb className="mb-2" />
				</motion.div>

				<div className="flex items-center max-w-full space-x-3">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<img
							className="w-8 sm:w-12 rounded-sm"
							src={
								(variants ?? [])
									.flatMap((variant) => variant.photos)
									.find((photo) => photo.id === featuredImageId)?.url ||
								thumbnailUrl ||
								"/assets/images/apps/ecommerce/product-image-placeholder.png"
							}
							alt={title}
						/>
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-lg sm:text-2xl truncate font-semibold">
							{title || "New Printable"}
						</Typography>
						<Typography variant="caption" className="font-medium">
							Product Detail
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{productId !== NEW_PRODUCT_PREFIX ? (
					<>
						{/* <Button
							className="whitespace-nowrap mx-1"
							variant="contained"
							color="secondary"
							onClick={handleRemoveProduct}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
						>
							Remove
						</Button> */}
						<Button
							className="whitespace-nowrap mx-1"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							onClick={handleSaveProduct}
						>
							Save
						</Button>
					</>
				) : (
					<LoadingButton
						className="whitespace-nowrap mx-1"
						variant="contained"
						color="secondary"
						loading={loading}
						disabled={_.isEmpty(dirtyFields) || !isValid || loading}
						onClick={handleCreateProduct}
					>
						Add
					</LoadingButton>
				)}
			</motion.div>
		</div>
	);
}

export default ProductHeader;
