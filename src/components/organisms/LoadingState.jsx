import React from 'react';

const LoadingState = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                        <div className="aspect-video bg-gray-200"></div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingState;