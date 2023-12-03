import React from 'react';

export interface NewComponent2Props {
    className?: string;
}

export const NewComponent2: React.FC<NewComponent2Props> = ({ className = '' }) => (
    <div className={className}>NewComponent2</div>
);