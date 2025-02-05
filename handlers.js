export const loginUser = async (userId) => {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });

    if (response.ok) {
        console.log("User authenticated successfully");
        return true;
    } else {
        console.error("Authentication failed");
        return false;
    }
};

export const getUserSession = async () => {
    const response = await fetch("/api/auth");

    if (response.ok) {
        const { userId } = await response.json();
        console.log("Authenticated User ID:", userId);
        return userId;
    } else {
        console.error("User not authenticated");
        return null;
    }
};