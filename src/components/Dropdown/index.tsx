import React, { ChangeEvent } from 'react';

type DropdownProps = {
	items: { description: string; value: string }[];
	label: string;
	onChange: (selectedValue: string) => void;
	value: number;
};

export function Dropdown({ items, label, onChange, value }: DropdownProps) {
	function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		onChange(event.target.value);
	}

	return (
		<label>
			<span>{label}</span>
			<select onChange={handleSelectChange} value={value}>
				{items.map((item) => (
					<option key={item.value} value={item.value}>
						{item.description}
					</option>
				))}
			</select>
		</label>
	);
}
