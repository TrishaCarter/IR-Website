import { serialize } from 'cookie'
import { encrypt } from '@/app/lib/session'

export default function handler(req, res) {
    const sessionData = req.body
    const encryptedSessionData = encrypt(sessionData)

    const cookie = serialize('session', encryptedSessionData, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    })
    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ message: 'Successfully set cookie!' })
}