import React from "react";
import "../../styles/components/shared/ActionButtonsPair.css";

const ActionButtonsPair = ({
    primaryLabel,
    onPrimaryClick,
    secondaryLabel,
    onSecondaryClick,
    primaryType = "button",
    secondaryType = "button",
    primaryColor = "primary",
    secondaryColor = "ghost",
    className = "",
}) => {

    return (
        <div className={`action-buttons ${className || ""}`}>
            <button
                className={`btn btn-${primaryColor}`}
                type={primaryType}
                onClick={onPrimaryClick}
            >
                {primaryLabel}
            </button>

            {secondaryLabel && (
                <button
                    className={`btn btn-${secondaryColor}`}
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