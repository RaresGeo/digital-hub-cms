import { DigitalPrintableProduct } from '@/app/(control-panel)/apps/digital-printables/DigitalPrintablesApi';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import ReorderVariants from './ReorderVariants';
import { useEffect } from 'react';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	useEffect(() => {
		console.log("~formState", formState)
	}, [formState])

	return (
		<div>
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-2 mb-4"
						required
						label="Title"
						autoFocus
						id="title"
						variant="outlined"
						fullWidth
						error={!!errors.title}
						helperText={errors?.title?.message as string}
					/>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-2 mb-4"
						id="description"
						label="Description"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-2 mb-4"
						multiple
						freeSolo
						options={[]}
						value={value as DigitalPrintableProduct['tags']}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple tags"
								label="Tags"
								variant="outlined"
								slotProps={{
									inputLabel: {
										shrink: true
									}
								}}
							/>
						)}
					/>
				)}
			/>

			<Controller
				name="active"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-2 mb-4 w-full max-w-36 cursor-pointer!"
						id="active"
						label="Active"
						type="checkbox"
						variant="outlined"
						value={undefined}
						slotProps={{
							htmlInput: {
								checked: Boolean(field.value)
							}
						}}
					/>
				)}
			/>

			<ReorderVariants />
		</div>
	);
}

export default BasicInfoTab;
