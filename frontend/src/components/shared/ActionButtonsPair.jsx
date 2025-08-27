import React from "react";

const ActionButtonsPair = ({
    primaryLabel,
    onPrimaryClick,
    secondaryLabel,
    onSecondaryClick,
    primaryType = "button",
    secondaryType = "button",
    primaryColor = "bg-blue-600 hover:bg-blue-700 text-white",
    secondaryColor = "bg-gray-300 hover:bg-gray-400 text-gray-800",
    className = "",
}) => {
    return (
        <div className={`flex justify-end space-x-2 mt-2 ${className}`}>
            <button
                className={`px-4 py-2 rounded-lg ${primaryColor}`}
                type={primaryType}
                onClick={onPrimaryClick}
            >
                {primaryLabel}
            </button>
            <button
                className={`px-4 py-2 rounded-lg ${secondaryColor}`}
                type={secondaryType}
                onClick={onSecondaryClick}
            >
                {secondaryLabel}
            </button>
        </div>
    );
};

export default ActionButtonsPair;