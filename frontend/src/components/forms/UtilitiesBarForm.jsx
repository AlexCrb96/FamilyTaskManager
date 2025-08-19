import React, { useState } from "react";

export default function UtilitiesBarForm({ onCreate, onSearch, onToggleShowDone }) {
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
        <form onSubmit={handleSearchSubmit}>
            <button type="button" onClick={onCreate}>Create a task</button>

            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={handleSearchChange} />
            <button type="submit">Search</button>

            <label><input type="checkbox" onChange={(e) => onToggleShowDone(e.target.checked)} />Show done tasks</label>
        </form>
    );
}