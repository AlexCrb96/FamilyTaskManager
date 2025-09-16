import React, { useState, useContext } from "react";
import "../styles/pages/AccountPage.css";

import { AuthContext } from "../context/AuthContext";
import { useAuthLogout } from "../hooks/useAuthLogout";
import { useSessionExpiry } from "../hooks/useSessionExpiry";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { showErrorToast } from "../components/shared/ErrorToast";

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
    const handleError = useErrorHandler();

    const [activeTab, setActiveTab] = useState("account");
    const tabs = [
        { id: "account", label: "Account" },
        { id: "security", label: "Security" }
    ]
    
    const handlePasswordChange = async ({ oldPassword, newPassword }) => {
        try {
            UserService.changePassword(oldPassword, newPassword);
        } catch (error) {
            const errorObj = handleError(error);
            showErrorToast(errorObj);
        }        
    }

    const handleNameChange = async ({ firstName, lastName }) => {
        try {
            await UserService.changeNames(firstName, lastName);
            setCurrentUser((prev) => ({
                ...prev,
                firstName,
                lastName
            }));
        } catch (error) {
            const errorObj = handleError(error);
            showErrorToast(errorObj);
        }       
    };

    return (
        <>
            <TopBar email={currentUser?.email} onLogout={handleLogout} />
            <div className="account-page-container">

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
                <div className="account-content">
                    {activeTab === "account" && (
                        <div>
                            <h2>Account Details</h2>
                            <div>
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
                            <h2>Security</h2>
                            <div>
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