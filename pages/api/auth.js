import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req, res) {
    // Get token fromthe cookie
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.auth_token;



    if (!token) {
        // return res.status(401).json({ error: "Unauthorized: No token provided" });
        console.log("No token provided");
        console.log(token);


    }

    try {
        // Verify the token
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        // Token is valid, return the user ID
        return res.status(200).json({ userId: decoded.userId });

    } catch (error) {

        console.error("JWT verification failed:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}