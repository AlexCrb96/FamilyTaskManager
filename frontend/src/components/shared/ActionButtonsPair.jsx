import React from "react";

const ActionButtonsPair = ({
    primaryLabel,
    onPrimaryClick,
    secondaryLabel,
    onSecondaryClick,
    primaryType = "button",
    secondaryType = "button",
    primaryColor = "",
    secondaryColor = "",
    className = "",
}) => {
    return (
        <div>
            <button
                type={primaryType}
                onClick={onPrimaryClick}
            >
                {primaryLabel}
            </button>

            {secondaryLabel && (
                <button
                    type={secondaryType}
                    onClick={onSecondaryClick}
                >
                    {secondaryLabel}
                </button>
            )}
            
        </div>
    );
};

export default ActionButtonsPair;