import { THIRTY_DAYS } from "../constants/authConstants";
import { loginUser, logoutUser, refreshUser, registerUser } from "../services/auth";

function setupSession (res, session) {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session.session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
};

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('sessionId', session.userId, {
        httpOnly: true,
        expires: THIRTY_DAYS,
    });
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: THIRTY_DAYS,
    });

    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: session.accessToken,
    });
};

export const refreshUserController = async (req, res) => {
    const session = await refreshUser({sessionId: req.cookies.sessionId, refreshToken: req.cookies.refreshToken});
    setupSession(res, session);
    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: session.accessToken,
    });
};

export const logoutUserController = async (req, res) => {
    if(req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    };
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();

};
