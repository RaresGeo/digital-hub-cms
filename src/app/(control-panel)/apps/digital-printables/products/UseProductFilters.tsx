import { MRT_ColumnFiltersState, MRT_PaginationState } from 'material-react-table';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

interface CustomFilters {
	title?: string;
	minPrice?: number;
	maxPrice?: number;
	tags?: string[];
	createdAt?: Date;
	updatedAt?: Date;
	active?: boolean;
}

interface Props {
	customFilters: CustomFilters;
	setCustomFilters: Dispatch<SetStateAction<CustomFilters>>;
	setPagination: Dispatch<SetStateAction<MRT_PaginationState>>;
}

function UseProductFilters({ customFilters, setCustomFilters, setPagination }: Props) {
	const columnFiltersFromCustom = useMemo(() => {
		const filters = [];

		// Handle title
		if (customFilters.title !== undefined) {
			filters.push({
				id: 'title',
				value: customFilters.title
			});
		}

		// Handle active
		if (customFilters.active !== undefined) {
			filters.push({
				id: 'active',
				value: customFilters.active ? 'true' : 'false'
			});
		}

		// Handle price (min/max → combined range filter)
		if (customFilters.minPrice !== undefined || customFilters.maxPrice !== undefined) {
			filters.push({
				id: 'price',
				value: [
					customFilters.minPrice === undefined ? '' : customFilters.minPrice,
					customFilters.maxPrice === undefined ? '' : customFilters.maxPrice
				]
			});
		}

		// Handle tags
		if (customFilters.tags !== undefined && customFilters.tags.length > 0) {
			filters.push({
				id: 'tags',
				value: customFilters.tags
			});
		}

		// Handle dates if needed
		if (customFilters.createdAt !== undefined) {
			filters.push({
				id: 'createdAt',
				value: customFilters.createdAt
			});
		}

		if (customFilters.updatedAt !== undefined) {
			filters.push({
				id: 'updatedAt',
				value: customFilters.updatedAt
			});
		}

		return filters;
	}, [customFilters]);

	const handleColumnFiltersChange = useCallback(
		(updateColumnFilters: () => MRT_ColumnFiltersState) => {
			const newCustomFilters = {
				title: undefined as string | undefined,
				minPrice: undefined as number | undefined,
				maxPrice: undefined as number | undefined,
				tags: undefined as string[] | undefined,
				createdAt: undefined as Date | undefined,
				updatedAt: undefined as Date | undefined,
				active: undefined as boolean | undefined
			};

			const updatedColumnFilters = updateColumnFilters();

			if (!Array.isArray(updatedColumnFilters)) return;

			updatedColumnFilters.forEach((filter) => {
				switch (filter.id) {
					case 'title':
						newCustomFilters.title = filter.value as string;
						break;
					case 'active':
						newCustomFilters.active = filter.value === 'true';
						break;
					case 'price': {
						if (Array.isArray(filter.value)) {
							const [min, max] = filter.value.map(Number);

							if (!isNaN(min)) newCustomFilters.minPrice = min;

							if (!isNaN(max)) newCustomFilters.maxPrice = max;
						}

						break;
					}
					case 'tags':
						if (Array.isArray(filter.value)) {
							newCustomFilters.tags = filter.value as string[];
						}

						break;
					case 'createdAt':
						newCustomFilters.createdAt = filter.value as Date;
						break;
					case 'updatedAt':
						newCustomFilters.updatedAt = filter.value as Date;
						break;
					default:
						break;
				}
			});

			setCustomFilters(newCustomFilters);
			setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on filter change
		},
		[setCustomFilters, setPagination]
	);

	return {
		columnFiltersFromCustom,
		handleColumnFiltersChange
	};
}

export default UseProductFilters;
