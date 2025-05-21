import { DragDropContext, Droppable, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { DigitalPrintableProductVariant } from '../../../../DigitalPrintablesApi';
import VariantListItem from './VariantListItem';

/**
 * Component for reordering product variants using drag and drop.
 */
function ReorderVariants() {
	const { getValues, setValue, watch } = useFormContext();
	const variants = watch('variants') as DigitalPrintableProductVariant[];
	const featuredImageId = watch('featuredImageId') as string;

	const reorderList = useCallback(
		({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
			const variants = getValues('variants') as DigitalPrintableProductVariant[];

			const result = Array.from(variants);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);

			const newVariants = result.map((variant, index) => ({
				...variant,
				sortOrder: index
			}));

			setValue('variants', newVariants);
		},
		[getValues, setValue]
	);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { source, destination } = result;

			if (!destination) {
				return;
			}

			const { index: destinationIndex } = destination;
			const { index: sourceIndex } = source;

			if (destinationIndex === sourceIndex) {
				return;
			}

			reorderList({
				startIndex: sourceIndex,
				endIndex: destinationIndex
			});
		},
		[reorderList]
	);

	if (!variants.length) {
		return (
			<div className="flex flex-1 items-center justify-center py-4">
				<Typography
					color="text.secondary"
					variant="body1"
				>
					No variants added yet
				</Typography>
			</div>
		);
	}

	return (
		<div className="mt-4">
			<Typography
				variant="subtitle1"
				className="mb-2"
			>
				Variants (drag to reorder)
			</Typography>
			<List className="w-full m-0 p-0 border-1 rounded">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable
						droppableId="variants-list"
						type="variants"
						direction="vertical"
					>
						{(provided: DroppableProvided) => (
							<>
								<div ref={provided.innerRef}>
									{_.cloneDeep(variants)
										.sort((a, b) => a.sortOrder - b.sortOrder)
										.map((variant, index) => (
											<VariantListItem
												key={variant.id}
												variant={variant}
												featured={variant.photos.some(({ id }) => id === featuredImageId)}
												index={index}
											/>
										))}
								</div>
								{provided.placeholder}
							</>
						)}
					</Droppable>
				</DragDropContext>
			</List>
		</div>
	);
}

export default ReorderVariants;
