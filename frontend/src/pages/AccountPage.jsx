import React, { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useAuthLogout } from "../hooks/useAuthLogout";
import { useSessionExpiry } from "../hooks/useSessionExpiry";

import UserService from "../services/UserService";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
import ChangeNameForm from "../components/forms/ChangeNameForm";
import TopBar from "../components/shared/TopBar";
import SessionExpiredModal from "../components/modals/SessionExpiredModal";

export default function AccountPage() {
    const { token } = useContext(AuthContext);
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { sessionExpired, setSessionExpired } = useSessionExpiry(token);
    const handleLogout = useAuthLogout();

    const [activeTab, setActiveTab] = useState("account");
    
    const handlePasswordChange = async ({ oldPassword, newPassword }) => {
        UserService.changePassword(oldPassword, newPassword);
    }

    const handleNameChange = ({ firstName, lastName }) => {
        (async () => {
            UserService.changeNames(firstName, lastName);

            const updatedUser = await UserService.getCurrentUser();
            setCurrentUser(updatedUser);
        })();        
    };

    return (
        <>
            <TopBar email={currentUser?.email} onLogout={handleLogout} />
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
                            <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                                <ChangeNameForm
                                    initialFirstName={currentUser?.firstName}
                                    initialLastName={currentUser?.lastName}
                                    onSubmit={handleNameChange}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Security</h2>
                            <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                                <ChangePasswordForm
                                    onSubmit={handlePasswordChange}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
            <SessionExpiredModal show={sessionExpired} onClose={() => setSessionExpired(false)} />

        </>            
    );
}