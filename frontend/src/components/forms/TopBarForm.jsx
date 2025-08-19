import React from "react";

export default function TopBarForm({ onLogout }) {
    return (
        <div className="w-full max-w-3xl flex justify-end mb-4">
            <button
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onLogout}
            >
                Logout
            </button>
        </div>
    );
}