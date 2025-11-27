import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper, Rating } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import FuseLoading from '@fuse/core/FuseLoading';
import {
	DigitalPrintableReviewListItem,
	useGetDigitalPrintablesReviewsQuery,
	useDeleteDigitalPrintablesReviewMutation
} from '../DigitalPrintablesApi';

function ReviewsTable() {
	// TODO: Replace with actual product ID - for now showing all reviews
	const [productId] = useState<string>(''); // Empty for now - needs product selection

	const { data, isLoading } = useGetDigitalPrintablesReviewsQuery(
		{ productId, cursor: 0, limit: 20 },
		{ skip: !productId } // Skip query if no product selected
	);
	const [removeReview] = useDeleteDigitalPrintablesReviewMutation();

	const reviews = data?.reviews || [];

	const columns = useMemo<MRT_ColumnDef<DigitalPrintableReviewListItem>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'Review',
				size: 200,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/digital-printables/reviews/${row.original.id}`}
						role="button"
					>
						<u>{row.original.title}</u>
					</Typography>
				)
			},
			{
				id: 'author',
				accessorFn: (row) => row.author.name,
				header: 'Author',
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

	if (!productId) {
		return (
			<Paper
				className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full items-center justify-center"
				elevation={0}
			>
				<Typography variant="h6" color="text.secondary">
					Please select a product to view reviews
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20
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
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								selectedRows.forEach((row) => removeReview(row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-9 ltr:mr-2 rtl:ml-2"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-2">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default ReviewsTable;
