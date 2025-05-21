import { Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { DigitalPrintableProductVariant } from '../../../../DigitalPrintablesApi';

interface VariantListItemProps {
	variant: DigitalPrintableProductVariant;
	featured: boolean;
	index: number;
}

function VariantListItem({ variant, featured, index }: VariantListItemProps) {
	const active = variant.active;

	return (
		<Draggable
			draggableId={variant.id}
			index={index}
		>
			{(provided) => (
				<ListItem
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="border-b-1 last:border-b-0 bg-white grid grid-cols-11 relative"
				>
					<ListItemIcon
						{...provided.dragHandleProps}
						className="cursor-move min-w-40 col-span-1"
					>
						<DragIndicatorIcon />
					</ListItemIcon>
					<ListItemText
						className="col-span-7"
						primary={variant.title || `Variant ${index + 1}`}
						secondary={`Price: $${variant.price}`}
					/>
					<ListItemText
						className={active ? 'text-green-500' : 'text-red-500'}
						primary={'Active'}
						secondary={active ? 'Yes' : 'No'}
					/>
					<ListItemText
						primary={'Order'}
						secondary={variant.sortOrder + 1}
					/>
					<ListItemText
						className={featured ? 'text-green-500' : 'text-red-500'}
						primary={'Featured'}
						secondary={featured ? 'Yes' : 'No'}
					/>
				</ListItem>
			)}
		</Draggable>
	);
}

export default VariantListItem;
