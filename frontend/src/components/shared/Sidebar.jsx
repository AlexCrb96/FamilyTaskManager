import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/shared/Sidebar.css";

const Sidebar = ({ tabs = [], activeTab, setActiveTab, title = "Settings", breadcrumbs = [] }) => {
    return (
        <div className="sidebar">

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="breadcrumbs">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className={index === breadcrumbs.length - 1 ? "active" : ""}>
                            {crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : <span>{crumb.label}</span>}
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
                            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
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