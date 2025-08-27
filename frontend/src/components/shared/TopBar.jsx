import React, { useState } from "react";

export default function TopBar({ email, onChangePassword, onLogout }) {
    const [open, setOpen] = useState(false);
    
    return (
        <div className="w-full max-w-3xl flex justify-end mb-4 relative">
            <div className="relative">
                <button
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(!open)}
                >
                    {email}
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <button
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => { setOpen(false); onChangePassword(); }}
                        >
                            Change Password
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) }
            </div>
        </div>
    );
}