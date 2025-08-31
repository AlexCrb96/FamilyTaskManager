import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ tabs = [], activeTab, setActiveTab, title = "Settings", breadcrumbs = [] }) => {
    return (
        <div className="w-64 bg-gray-100 p-4 border-r">

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="text-sm text-gray-500 mb-2">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            {crumb.path ? (
                                <Link to={crumb.path} className="text-sm text-gray-500 mb-2 hover:underline">
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
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            {/* Tabs */}
            <ul>
                {tabs.map((tab) => (
                    <li key={tab.id}>
                        <button
                            className={`w-full text-left px-3 py-2 rounded ${activeTab === tab.id ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                                }`}
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