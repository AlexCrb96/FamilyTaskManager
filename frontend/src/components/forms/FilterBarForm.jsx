import React, { useState } from "react";

export default function FilterBarForm({ onCreate, onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        //onSearch(searchTerm) // refresh the list as user types -> doesn't really work well enough
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
        </form>
    );
}