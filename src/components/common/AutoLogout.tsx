"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import PopupWrapper from "../ui/popup-wrapper";
import { getAccessToken, removeAccessToken } from "@/utilities/tokenHelpers";
import { useAuthStore } from "@/store";

const events = ["mousemove", "mousedown", "click", "scroll", "keypress"];

function AutoLogout({ children }: { children: React.ReactNode; }) {
   
    const router = useRouter();

      const {
            logout,
            } = useAuthStore()

     const getToken = getAccessToken();

    const handleLogOut = () => {
        logout()
        router.push("/signin"); // Redirect to sign-in page after logout
    };

   
    const [showPopup, setShowPopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(60);

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetTimers = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        if (intervalRef.current) clearInterval(intervalRef.current);

        setShowPopup(false);
        setTimeLeft(60);
        startInactivityTimer();
    };

    const startInactivityTimer = () => {
        console.log("dfjhhjdf");
        
        inactivityTimer.current = setTimeout(() => {
            setShowPopup(true);
            startLogoutTimer();
        }, 300000); // 5 minutes of inactivity
    };

    const startLogoutTimer = () => {
        logoutTimer.current = setTimeout(() => {
            handleLogOut(); // Logout after 1 minute of showing the popup
        }, 60000);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const updatedTime = prev - 1;
                if (updatedTime <= 0 && intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return updatedTime > 0 ? updatedTime : 0;
            });
        }, 1000);
    };

    const handleUserActivity = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (target && target.closest(".no-reset")) return;
        resetTimers();
    };

    useEffect(() => {
        events.forEach((event) =>
            window.addEventListener(event, handleUserActivity)
        );

        startInactivityTimer();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, handleUserActivity)
            );
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            if (logoutTimer.current) clearTimeout(logoutTimer.current);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    return (
        <>
            {getToken?.refresh_token ? (
                <>
                    {children}

                    {showPopup && (
                        <PopupWrapper
                            isActive={showPopup}
                            toggleIsActive={() => setShowPopup(false)}
                        >


                            
                            <div className="space-y-8">
                                <h1 className="text-3xl">Still with us?</h1>

                                <p className="text-lg font-semibold">
                                    Your session will expire in{" "}
                                    <span className="text-brand-green font-bold">
                                        {`${Math.floor(timeLeft / 60)}:${(
                                            timeLeft % 60
                                        )
                                            .toString()
                                            .padStart(2, "0")}`}
                                    </span>{" "}
                                    due to inactivity.
                                </p>

                                <p>
                                    Please click{" "}
                                    <span className="text-brand-orange font-bold">
                                        "Refresh Session"
                                    </span>{" "}
                                    to continue using the application or{" "}
                                    <span className="text-brand-red font-bold">
                                        "Logout"
                                    </span>{" "}
                                    to terminate your session.
                                </p>

                                <button
                                    className="mr-4 bg-primary  py-2 px-4 rounded hover:bg-gray-500/50"
                                    onClick={resetTimers}
                                    type="button"
                                >
                                    Refresh Session
                                </button>

                                
                                <button
                                    className="mr-4 bg-yellow-300 hover:bg-yellow-200 py-2 px-4 rounded  no-reset"
                                    onClick={handleLogOut}
                                    type="button"
                                >
                                    Logout
                                </button>
                            </div>
                        </PopupWrapper>
                    )}
                </>
            ) : (
                <>{router.push("/signin")}</> // Redirect if not authenticated
            )}
        </>
    );
}

export default AutoLogout;
