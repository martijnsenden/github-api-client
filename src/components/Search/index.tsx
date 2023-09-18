import React from 'react';

export type SearchVariant = 'initial' | 'dirty';

type Props = {
	variant: SearchVariant;
};

export function Search({ variant }: Props) {}
