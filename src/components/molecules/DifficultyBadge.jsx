import React from 'react';

const DifficultyBadge = ({ difficulty }) => {
    const colors = {
        Easy: 'bg-success text-white',
        Medium: 'bg-warning text-white',
        Hard: 'bg-error text-white'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty] || ''}`}>
            {difficulty}
        </span>
    );
};

export default DifficultyBadge;