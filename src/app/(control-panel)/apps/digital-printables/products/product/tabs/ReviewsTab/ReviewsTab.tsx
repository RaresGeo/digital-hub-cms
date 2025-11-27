import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper, Rating } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import { useParams } from 'react-router';
import {
	DigitalPrintableReviewListItem,
	useGetDigitalPrintablesReviewsQuery,
	useDeleteDigitalPrintablesReviewMutation,
	useGetDigitalPrintablesReviewStatsQuery,
} from '../../../../DigitalPrintablesApi';

/**
 * The ReviewsTab component - shows all reviews for a product
 */
function ReviewsTab() {
	const { productId } = useParams();

	const { data, isLoading } = useGetDigitalPrintablesReviewsQuery(
		{ productId: productId!, cursor: 0, limit: 50 },
		{ skip: !productId || productId === 'new' }
	);

	const { data: stats } = useGetDigitalPrintablesReviewStatsQuery(productId!, {
		skip: !productId || productId === 'new'
	});

	const [removeReview] = useDeleteDigitalPrintablesReviewMutation();

	const reviews = data?.reviews || [];

	const columns = useMemo<MRT_ColumnDef<DigitalPrintableReviewListItem>[]>(
		() => [
			{
				id: 'author',
				accessorFn: (row) => row.author.name,
				header: 'Author',
				size: 200,
				Cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<img
							src={row.original.author.picture}
							alt={row.original.author.name}
							className="w-8 h-8 rounded-full"
						/>
						<Typography>{row.original.author.name}</Typography>
					</div>
				)
			},
			{
				accessorKey: 'rating',
				header: 'Rating',
				size: 120,
				Cell: ({ row }) => (
					<Rating
						value={row.original.rating}
						readOnly
						size="small"
					/>
				)
			},
			{
				accessorKey: 'title',
				header: 'Title',
				size: 200,
			},
			{
				accessorKey: 'content',
				header: 'Review',
				Cell: ({ row }) => (
					<Typography className="line-clamp-2">
						{row.original.content || 'No content'}
					</Typography>
				)
			},
			{
				accessorKey: 'helpfulCount',
				header: 'Helpful',
				size: 80,
				Cell: ({ row }) => (
					<Typography>{row.original.helpfulCount}</Typography>
				)
			},
			{
				accessorKey: 'verifiedPurchase',
				header: 'Verified',
				size: 80,
				Cell: ({ row }) => (
					row.original.verifiedPurchase ? (
						<FuseSvgIcon
							className="text-green-500"
							size={20}
						>
							heroicons-outline:check-circle
						</FuseSvgIcon>
					) : (
						<FuseSvgIcon
							className="text-gray-400"
							size={20}
						>
							heroicons-outline:minus-circle
						</FuseSvgIcon>
					)
				)
			},
			{
				accessorFn: (row) => new Date(row.createdAt),
				id: 'createdAt',
				header: 'Created',
				size: 150,
				Cell: ({ cell }) => (
					<Typography>
						{cell.getValue<Date>().toLocaleDateString()}
					</Typography>
				)
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (productId === 'new') {
		return (
			<Paper className="p-6">
				<Typography variant="h6" color="text.secondary">
					Save the product first to view reviews
				</Typography>
			</Paper>
		);
	}

	return (
		<div className="space-y-4">
			{/* Review Stats */}
			{stats && (
				<Paper className="p-6">
					<Typography variant="h6" className="mb-4">
						Review Statistics
					</Typography>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<Typography variant="body2" color="text.secondary">
								Average Rating
							</Typography>
							<div className="flex items-center gap-2 mt-1">
								<Rating
									value={stats.averageRating}
									readOnly
									precision={0.1}
								/>
								<Typography variant="h6">
									{stats.averageRating.toFixed(1)}
								</Typography>
							</div>
						</div>
						<div>
							<Typography variant="body2" color="text.secondary">
								Total Reviews
							</Typography>
							<Typography variant="h6" className="mt-1">
								{stats.totalReviews}
							</Typography>
						</div>
						<div>
							<Typography variant="body2" color="text.secondary" className="mb-2">
								Rating Distribution
							</Typography>
							{Object.entries(stats.ratingDistribution)
								.reverse()
								.map(([rating, count]) => (
									<div key={rating} className="flex items-center gap-2 text-sm">
										<span className="w-12">{rating} stars</span>
										<div className="flex-1 bg-gray-200 rounded h-2">
											<div
												className="bg-yellow-400 h-2 rounded"
												style={{
													width: `${stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0}%`
												}}
											/>
										</div>
										<span className="w-8 text-right">{count}</span>
									</div>
								))}
						</div>
					</div>
				</Paper>
			)}

			{/* Reviews Table */}
			<Paper className="flex flex-col flex-auto shadow-1 rounded-lg overflow-hidden">
				<DataTable
					initialState={{
						density: 'spacious',
						showColumnFilters: false,
						showGlobalFilter: true,
						pagination: {
							pageIndex: 0,
							pageSize: 10
						}
					}}
					data={reviews}
					columns={columns}
					renderRowActionMenuItems={({ closeMenu, row, table }) => [
						<MenuItem
							key={0}
							onClick={() => {
								removeReview(row.original.id);
								closeMenu();
								table.resetRowSelection();
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
							</ListItemIcon>
							Delete
						</MenuItem>
					]}
				/>
			</Paper>
		</div>
	);
}

export default ReviewsTab;
