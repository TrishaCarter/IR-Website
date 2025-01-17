const setCookie = (jwt) => {
    const url = '/api/createCookies';
    let res;
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
    };

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    getAuth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: 'success' }));
            },
            (error) => {
                res.status(401).send('UNAUTHORIZED REQUEST!');
            }
        );

    return fetch(url, init)
        .then((res) => res.json())
        .then((data) => data);
};