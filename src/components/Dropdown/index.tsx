import React from 'react';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type DropdownProps = {
	items: { description: string; value: string }[];
	listLabel: string;
	onChange: (selectedValue: string) => void;
	selectLabel: string;
	value: number;
	width: string;
};

export function Dropdown({ items, listLabel, onChange, value, width }: DropdownProps) {
	function handleSelectChange(value: string) {
		onChange(value);
	}

	return (
		<Label>
			<Select onValueChange={handleSelectChange} value={`${value}`}>
				<SelectTrigger className={width}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{listLabel}</SelectLabel>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.description}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Label>
	);
}
