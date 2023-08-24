import { createHttpEventRouter } from "@iyio/common";
import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { cognitoUserPoolClientIdParam, cognitoUserPoolIdParam, User } from "@aws-accounts/common";
import { initBackend } from "@aws-accounts/backend";

const debugging = true;

initBackend();

export const handler = createHttpEventRouter({
    cors: false,
}, {
    POST: async (_, data?: ImportCommand): Promise<AuthRegisterResult | Verify> => {
        log("In registration");
        if (!data) {
            return {
                status: 'error',
                error: true,
                message: "Missing required information"
            };
        }
        log(data.method);

        if (data.method === 'register') {
            log('register');
            if (!data.userData || !data.email || !data.password) {
                return {
                    status: 'error',
                    error: true,
                    message: "Missing required information"
                };
            }

            const result: AuthRegisterResult | undefined = await registerUserAsync(data.email, data.password, data.userData);

            if (!result) {
                return ({
                    status: 'error',
                    message: "Error in registration"
                });
            } else if (result.status === 'success' || result.status === 'verificationRequired') {
                return result;
            } else if (result.status === 'error') {
                return result;
            } else {
                return ({
                    status: "error",
                    message: "Error in registration",
                    error: true
                });
            }
        } else if (data.method === 'verify') {
            log('verify');
            if (!data.email || !data.code) {
                return ({
                    status: 'error',
                    message: "Missing required information",
                    error: true
                });
            }

            const result: Verify | undefined = await verifyEmailAsync(data.email, data.code);

            if (!result) {
                return ({
                    status: 'error',
                    message: "Error verifying user",
                    error: true
                });
            } else {
                return result;
            }
        } else if (data.method === 'registerAdmin') {
            log("registerAdmin");
            if (!data.email || !data.password || !data.userData) {
                return ({
                    status: 'error',
                    message: "Missing required information",
                    error: true
                });
            }

            log(data);

            const result: AuthRegisterResult = await registerAdminUser(data.email, data.password, data.userData);

            return result;
        } else {
            return {
                error: true,
                status: 'error',
                message: "Invalid request"
            }
        }
    }
});

const log = (message: any) => {
    if (debugging) {
        console.log(message);
    }
}

const registerUserAsync = async (email: string, password: string, userData: User): Promise<AuthRegisterResult | undefined> => {
    return new Promise<AuthRegisterResult | undefined>((resolve) => {
        const UserPoolId = "us-east-1_voJGYqlOP";
        const ClientId = "4hbiu92lg087u61v8i60q60i99";

        const poolData = {
            UserPoolId,
            ClientId
        }

        if (!userData.firstName) {
            userData.firstName = "";
        }
        if (!userData.lastName) {
            userData.lastName = "";
        }
        if (!userData.phone) {
            userData.phone = "";
        }

        const attributes: CognitoUserAttribute[] = [
            new CognitoUserAttribute({
                Name: 'email',
                Value: email
            }),
            new CognitoUserAttribute({
                Name: 'given_name',
                Value: userData.firstName
            }),
            new CognitoUserAttribute({
                Name: 'family_name',
                Value: userData.lastName
            }),
            new CognitoUserAttribute({
                Name: 'phone_number',
                Value: userData.phone
            })
        ];

        const userPool = new CognitoUserPool(poolData);

        userPool.signUp(email, password, attributes, [], async (err, result) => {
            if (err || !result?.user) {
                console.error(`From registration-func: error. Error: ${err}`);
                resolve({
                    status: 'error',
                    message: "Registration failed",
                    error: true
                });
            } else if (result.userConfirmed) {
                resolve({
                    status: "success"
                });
            } else {
                resolve({
                    status: 'verificationRequired',
                    message: `A verification code has been sent to ${email}`,
                    verificationDestination: email
                });
            }
        })
    });
}

const verifyEmailAsync = async (email: string, code: string): Promise<Verify | undefined> => {
    return new Promise<Verify | undefined>((resolve) => {
        const UserPoolId = "us-east-1_voJGYqlOP";
        const ClientId = "4hbiu92lg087u61v8i60q60i99";

        const poolData = {
            UserPoolId,
            ClientId
        }

        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: email,
            Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, async (err, result) => {
            if (err) {
                console.error(`From registration-func: error. Error: ${err}`);
                resolve({
                    status: "error",
                    message: "Error verifying user",
                    error: true
                });
            } else {
                resolve({
                    status: "success",
                    message: result
                });
            }
        });
    });
}

const registerAdminUser = async (email: string, password: string, userData: User): Promise<AuthRegisterResult> => {
    return new Promise<AuthRegisterResult>((resolve) => {
        const UserPoolId = "us-east-1_voJGYqlOP";
        const ClientId = "4hbiu92lg087u61v8i60q60i99";

        const poolData = {
            UserPoolId,
            ClientId
        }

        if (!userData.firstName) {
            userData.firstName = "";
        }
        if (!userData.lastName) {
            userData.lastName = "";
        }
        if (!userData.phone) {
            userData.phone = "";
        }

        const attributes: CognitoUserAttribute[] = [
            new CognitoUserAttribute({
                Name: 'email',
                Value: email
            }),
            new CognitoUserAttribute({
                Name: 'given_name',
                Value: userData.firstName
            }),
            new CognitoUserAttribute({
                Name: 'family_name',
                Value: userData.lastName
            }),
            new CognitoUserAttribute({
                Name: 'phone_number',
                Value: userData.phone
            }),
            new CognitoUserAttribute({
                Name: 'custom:isAdmin',
                Value: 'true'
            })
        ];

        const userPool = new CognitoUserPool(poolData);

        userPool.signUp(email, password, attributes, [], async (err, result) => {
            if (err || !result?.user) {
                console.error(`From registration-func: error. Error: ${err}`);
                resolve({
                    status: 'error',
                    message: "Admin registration failed",
                    error: true
                });
            } else if (result.userConfirmed) {
                resolve({
                    status: "success"
                });
            } else {
                resolve({
                    status: 'verificationRequired',
                    message: `A verification code has been sent to ${email}`,
                    verificationDestination: email
                });
            }
        })
    });
}

interface ImportCommand {
    method: Method;
    code?: string;
    email: string;
    password?: string;
    userData?: User;
}

interface Verify {
    status: Status;
    message?: string;
    error?: boolean;
}

declare type Method = 'register' | 'verify' | 'registerAdmin';

declare type Status = 'success' | 'verificationRequired' | 'error';

declare type AuthRegisterResult = {
    status: 'success';
} | {
    status: 'verificationRequired';
    message: string;
    /**
     * A email or phone number the verification was sent to.
     */
    verificationDestination: string;
} | {
    status: 'error';
    message: string;
    error?: boolean;
};