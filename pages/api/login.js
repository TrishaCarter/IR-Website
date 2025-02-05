import jwt from "jsonwebtoken";

export default function handler(req, res) {

    // No POSTing to this endpoint
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // UID is sent as request body
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is Required" });

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    const token = jwt.sign({ userId }, secret, { expiresIn: '12h' });

    // Set JWT as a HTTPOnly Cookie and return
    res.setHeader("Set-Cookie", `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
    res.status(200).json({ message: 'User authenticated successfully' })
}