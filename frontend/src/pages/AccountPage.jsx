import React, { useState } from "react";
import UserService from "../services/UserService";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("account");

    const handlePasswordChange = ({ oldPassword, newPassword }) => {
        UserService.changePassword(oldPassword, newPassword);
    }

    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <div className="w-64 bg-gray-100 p-4 border-r">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <ul>
                    <li>
                        <button className={`w-full text-left px-3 py-2 rounded ${activeTab === "account" ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("account")}
                        >
                            Account
                        </button>
                    </li>
                    <li>
                        <button className={`w-full text-left px-3 py-2 rounded ${activeTab === "security" ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                            }`}
                        onClick={() => setActiveTab("security")}>
                            Security
                        </button>
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                {activeTab === "account" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                    </div>
                )}

                {activeTab === "security" && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Security</h2>
                        <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                            <ChangePasswordForm
                                onSubmit={handlePasswordChange}
                                onCancel={() => setActiveTab("account")}
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}