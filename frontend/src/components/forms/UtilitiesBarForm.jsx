import React, { useState } from "react";

export default function UtilitiesBarForm({ onCreate, onSearch, onToggleShowDone, onToggleShowMine }) {
    const [searchTerm, setSearchTerm] = useState("");    

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        //onSearch(searchTerm) // refresh the list as user types -> doesn't really work well enough -> needs handling of 404 error
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form
            className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 mb-4"
            onSubmit={handleSearchSubmit}
        >
            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="button"
                onClick={onCreate}
            >
                Create a task
            </button>

            <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="submit"
            >
                Search
            </button>

            <label>
                <input className="form-checkbox" type="checkbox" onChange={(e) => onToggleShowDone(e.target.checked)} />
                <span>Show done tasks</span>
            </label>

            <label>
                <input className="form-checkbox" type="checkbox" onChange={(e) => onToggleShowMine(e.target.checked)} />
                <span>Show my tasks only</span>
            </label>

        </form>
    );
}