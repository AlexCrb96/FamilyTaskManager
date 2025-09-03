import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ tabs = [], activeTab, setActiveTab, title = "Settings", breadcrumbs = [] }) => {
    return (
        <div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav>
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            {crumb.path ? (
                                <Link to={crumb.path}>
                                    {crumb.label}
                                </Link>
                            ) : (
                                    <span>{crumb.label}</span>
                            ) }
                            {index < breadcrumbs.length - 1 && " > "}
                        </span>
                    ))}
                </nav>
            )}

            {/* Title */}
            <h2>{title}</h2>

            {/* Tabs */}
            <ul>
                {tabs.map((tab) => (
                    <li key={tab.id}>
                        <button
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Sidebar;