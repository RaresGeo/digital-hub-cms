import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, Chip, Paper, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { MRT_ColumnFiltersState } from 'material-react-table';
import { MRT_PaginationState, MRT_SortingState, type MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import DataTable from 'src/components/data-table/DataTable';
import { DigitalPrintableListItem, useGetDigitalPrintablesProductsQuery } from '../DigitalPrintablesApi';
import UseProductFilters from './UseProductFilters';

function ProductsTable() {
	// State for MRT's column filters
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const [sorting, setSorting] = useState<MRT_SortingState>([{ id: 'createdAt', desc: true }]);

	// State for global filter (search)
	const [globalFilter, setGlobalFilter] = useState('');

	// Custom filters state derived from MRT column filters
	const [customFilters, setCustomFilters] = useState({
		title: undefined as string | undefined,
		minPrice: undefined as number | undefined,
		maxPrice: undefined as number | undefined,
		tags: undefined as string[] | undefined,
		createdAt: undefined as Date | undefined,
		updatedAt: undefined as Date | undefined,
		active: undefined as boolean | undefined
	});

	const { columnFiltersFromCustom, handleColumnFiltersChange } = UseProductFilters({
		customFilters,
		setCustomFilters,
		setPagination
	});

	// Combine state into query params
	const queryParams = useMemo(
		() => ({
			isAdmin: true, // Assuming this is an admin view
			cursor: pagination.pageIndex * pagination.pageSize,
			limit: pagination.pageSize,
			sortBy: (sorting[0]?.id || 'createdAt') as 'price' | 'createdAt' | 'title',
			sortOrder: sorting[0]?.desc ? 'desc' : ('asc' as 'asc' | 'desc'),
			search: globalFilter,
			...customFilters
		}),
		[pagination, sorting, globalFilter, customFilters]
	);

	const { data, isLoading } = useGetDigitalPrintablesProductsQuery(queryParams);

	const products = useMemo(() => data?.products || [], [data?.products]);
	const totalCount = data?.totalCount || 0;

	const columns = useMemo<MRT_ColumnDef<DigitalPrintableListItem>[]>(
		() => [
			{
				accessorFn: (row) => row.thumbnailUrl,
				id: 'thumbnailUrl',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original.thumbnailUrl ? (
							<img
								className="w-full max-h-9 max-w-9 block rounded-sm"
								src={row.original.thumbnailUrl}
								alt={row.original.title}
							/>
						) : (
							<img
								className="w-full max-h-9 max-w-9 block rounded-sm"
								src="/assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.title}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'title',
				header: 'Title',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/digital-printables/products/${row.original.id}`}
						role="button"
					>
						<u>{row.original.title}</u>
					</Typography>
				)
			},
			{
				accessorKey: 'price',
				header: 'Price',
				Cell: ({ row }) => <Typography>{row.original.price}</Typography>,
				filterVariant: 'range-slider',
				filterFn: 'betweenInclusive'
			},
			{
				accessorKey: 'tags',
				header: 'Tags',
				Cell: ({ row }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.tags?.map((tag, index) => (
							<div
								key={index}
								className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100"
							>
								{tag}
							</div>
						)) || 'No tags'}
					</div>
				),
				enableMultiFilter: true,
				filterFn: (row, columnId, filterValue) => {
					// If no filter value or empty array, show all rows
					if (!filterValue || !filterValue.length) return true;

					// Get tags array from the row
					const rowTags: string[] = row.getValue(columnId);

					// If row has no tags and we're filtering, don't show it
					if (!rowTags || !rowTags.length) return false;

					// Check if any tag in the row's tags array exists in the filterValue array
					return rowTags.some((tag) => filterValue.includes(tag));
				},
				Filter: ({ column, table }) => {
					// Get all unique tags from all rows
					const allTags = useMemo(() => {
						const uniqueTags = new Set();
						table.getPreFilteredRowModel().rows.forEach((row) => {
							const tags = row.getValue(column.id);

							if (tags && Array.isArray(tags)) {
								tags.forEach((tag) => uniqueTags.add(tag));
							}
						});
						return Array.from(uniqueTags).sort();
					}, [table, column.id]);

					const filterValue = customFilters.tags || [];

					return (
						<Autocomplete
							multiple
							id="tags-filter"
							options={allTags}
							disableCloseOnSelect
							value={filterValue}
							onChange={(_, newValue) => {
								column.setFilterValue(newValue.length ? newValue : undefined);
							}}
							renderOption={(props, option: string) => {
								const isSelected = filterValue.includes(option);
								const newProps = { ...props };
								delete newProps['key'];

								return (
									<li
										{...newProps}
										key={option}
									>
										<Checkbox
											icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
											checkedIcon={<CheckBoxIcon fontSize="small" />}
											style={{ marginRight: 8 }}
											checked={isSelected}
										/>
										{option}
									</li>
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									placeholder="Filter tags"
									size="small"
								/>
							)}
							renderTags={(selected: string[], getTagProps) => (
								<div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
									{selected.map((value, index) => (
										<Chip
											{...getTagProps({ index })}
											key={value}
											label={value}
											size="small"
											sx={{ margin: '2px' }}
										/>
									))}
								</div>
							)}
							size="small"
							sx={{
								minWidth: '200px',
								'& .MuiOutlinedInput-root': {
									flexWrap: 'wrap',
									maxHeight: '100px',
									overflow: 'auto'
								},
								'& .MuiAutocomplete-endAdornment': {
									top: '8px'
								}
							}}
							slotProps={{
								listbox: {
									sx: { maxHeight: '200px' }
								}
							}}
						/>
					);
				}
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.createdAt), //convert to date for sorting and filtering
				id: 'createdAt',
				header: 'Created At',
				filterVariant: 'datetime-range',
				Cell: ({ cell }) =>
					`${cell.getValue<Date>().toLocaleDateString()} ${cell.getValue<Date>().toLocaleTimeString()}` // convert back to string for display
			},
			{
				accessorFn: (originalRow) => new Date(originalRow.updatedAt), //convert to date for sorting and filtering
				id: 'updatedAt',
				header: 'Updated At',
				filterVariant: 'datetime-range',
				Cell: ({ cell }) =>
					`${cell.getValue<Date>().toLocaleDateString()} ${cell.getValue<Date>().toLocaleTimeString()}` // convert back to string for display
			},
			{
				header: 'Active',
				id: 'active',
				accessorFn: (originalRow) => (originalRow.active ? 'true' : 'false'),
				filterVariant: 'checkbox',
				Cell: ({ cell }) =>
					cell.getValue() === 'true' ? (
						<FuseSvgIcon
							className="text-green-500"
							size={20}
						>
							heroicons-outline:check-circle
						</FuseSvgIcon>
					) : (
						<FuseSvgIcon
							className="text-red-500"
							size={20}
						>
							heroicons-outline:minus-circle
						</FuseSvgIcon>
					)
			}
		],
		[customFilters]
	);

	const handleGlobalFilterChange = (value: string) => {
		setGlobalFilter(value);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full"
			elevation={0}
		>
			<DataTable
				data={products}
				columns={columns}
				state={{
					pagination,
					sorting,
					isLoading,
					globalFilter,
					columnFilters: columnFiltersFromCustom
				}}
				rowCount={totalCount}
				manualPagination
				manualSorting
				manualFiltering
				onPaginationChange={setPagination}
				onSortingChange={setSorting}
				onGlobalFilterChange={handleGlobalFilterChange}
				onColumnFiltersChange={handleColumnFiltersChange}
				enableGlobalFilter
				positionGlobalFilter="left"
			/>
		</Paper>
	);
}

export default ProductsTable;
