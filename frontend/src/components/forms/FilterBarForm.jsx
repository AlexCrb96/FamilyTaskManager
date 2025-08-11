import React from "react";

export default function FilterBarForm({
    onCreate,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
}) {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}>
            <button type="button" onClick={onCreate}>Create a task</button>
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
            <button type="submit">Search</button>
        </form>
    );
}