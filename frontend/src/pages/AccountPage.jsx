import React, { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useAuthLogout } from "../hooks/useAuthLogout";
import { useSessionExpiry } from "../hooks/useSessionExpiry";

import UserService from "../services/UserService";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";
import ChangeNameForm from "../components/forms/ChangeNameForm";
import TopBar from "../components/shared/TopBar";
import SessionExpiredModal from "../components/modals/SessionExpiredModal";
import Sidebar from "../components/shared/Sidebar";

export default function AccountPage() {
    const { token } = useContext(AuthContext);
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { sessionExpired, setSessionExpired } = useSessionExpiry(token);
    const handleLogout = useAuthLogout();

    const [activeTab, setActiveTab] = useState("account");
    const tabs = [
        { id: "account", label: "Account" },
        { id: "security", label: "Security" }
    ]
    
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
                <Sidebar
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    breadcrumbs={[
                        {label: "Home", path: "/home"},
                        {label: "Account", path: "/account"}
                    ]}
                />

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
            {sessionExpired && <SessionExpiredModal show={sessionExpired} onClose={() => setSessionExpired(false)} />}

        </>            
    );
}