import React, { useState } from "react";
import "../../styles/components/forms/UtilitiesBarForm.css";

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
            className="utilities-bar"
            onSubmit={handleSearchSubmit}
        >
            <button
                className=" btn btn-create"
                type="button"
                onClick={onCreate}
            >
                Create a task
            </button>

            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <button
                className="btn btn-search"
                type="submit"
            >
                Search
            </button>
            

            <label>
                <input type="checkbox" onChange={(e) => onToggleShowDone(e.target.checked)} />
                <span>Show done tasks</span>
            </label>

            <label>
                <input type="checkbox" onChange={(e) => onToggleShowMine(e.target.checked)} />
                <span>Show my tasks only</span>
            </label>

        </form>
    );
}