import { cognitoIdentityPoolIdParam, cognitoUserPoolClientIdParam, cognitoUserPoolIdParam, defaultRegionParam, registrationFuncUrlParam } from "../../libs/common/src/index";
import * as cdk from 'aws-cdk-lib';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from 'constructs';
import { AdditionalFuncOptions, createFunction, CreateFunctionResult } from "./create-function";
import { ParamOutput } from "./ParamOutput";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {

    public readonly params = new ParamOutput();
    
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.params.setParam(defaultRegionParam, this.region);

        const { userPool, userPoolClient, idPool, cognitoUserRole } = this.createUserPool();
        this.params.setParam(cognitoUserPoolIdParam, userPool.userPoolId);
        this.params.setParam(cognitoUserPoolClientIdParam, userPoolClient.userPoolClientId);
        this.params.setParam(cognitoIdentityPoolIdParam, idPool.ref);

        const { func: registrationFunc, url: registrationFuncUrl } = this.createFunctionAndUrl("registration", {
            createPublicUrl: true,
            timeout: cdk.Duration.minutes(1),
        });
        this.params.setParam(registrationFuncUrlParam, registrationFuncUrl.url);

        this.params.generateOutputs(this);

        
    }

    private setFuncEnvs() {
        for (const func of this.allFunctions) {
            for (const e in this.params.params) {
                if (e.endsWith('FuncUrl') || e.endsWith('FuncArn')) {
                    continue;
                }
                func.func.addEnvironment(e, this.params.params[e])
            }
        }
    }

    private readonly allFunctions: CreateFunctionResult[] = [];

    createFunctionAndUrl(name: string, props: Partial<lambdaNode.NodejsFunctionProps> & AdditionalFuncOptions = {}): CreateFunctionResult {
        if (!props.timeout) {
            props = {
                ...props,
                timeout: props.timeout ?? cdk.Duration.minutes(1)
            }
        }
        const result = createFunction(this, name, props);

        this.allFunctions.push(result);
        return result;
    }

    createFunction(name: string, props: Partial<lambdaNode.NodejsFunctionProps> & AdditionalFuncOptions = {}): lambda.Function {
        return this.createFunctionAndUrl(name, props).func;
    }

    createUserPool() {


        // User Pool
        const userPool = new cognito.UserPool(this, "userPool", {
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: true,
                    mutable: true,
                },
            },
            customAttributes: {
                country: new cognito.StringAttribute({ mutable: true }),
                city: new cognito.StringAttribute({ mutable: true }),
                isAdmin: new cognito.StringAttribute({ mutable: true }),
            },
            passwordPolicy: {
                minLength: 6,
                requireLowercase: true,
                requireDigits: true,
                requireUppercase: true,
                requireSymbols: true,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const standardCognitoAttributes = {
            givenName: true,
            familyName: true,
            email: true,
            emailVerified: true,
            address: true,
            birthdate: true,
            gender: true,
            locale: true,
            middleName: true,
            fullname: true,
            nickname: true,
            phoneNumber: true,
            phoneNumberVerified: true,
            profilePicture: true,
            preferredUsername: true,
            profilePage: true,
            timezone: true,
            lastUpdateTime: true,
            website: true,
        };

        const clientReadAttributes = new cognito.ClientAttributes()
            .withStandardAttributes(standardCognitoAttributes)
            .withCustomAttributes(...["country", "city", "isAdmin"]);

        const clientWriteAttributes = new cognito.ClientAttributes()
            .withStandardAttributes({
                ...standardCognitoAttributes,
                emailVerified: false,
                phoneNumberVerified: false,
            })
            .withCustomAttributes(...["country", "city"]);

        // User Pool Client
        const userPoolClient = new cognito.UserPoolClient(
            this,
            "userpoolClient",
            {
                userPool,
                authFlows: {
                    adminUserPassword: true,
                    custom: true,
                    userSrp: true,
                },
                supportedIdentityProviders: [
                    cognito.UserPoolClientIdentityProvider.COGNITO,
                ],
                readAttributes: clientReadAttributes,
                writeAttributes: clientWriteAttributes,
            }
        );


        const idPool = new cognito.CfnIdentityPool(this, "identityPool", {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: userPoolClient.userPoolClientId,
                providerName: userPool.userPoolProviderName
            }]
        });

        const cognitoUserRole = new iam.Role(this, "cognitoUserRole", {
            description: "Default role for authenticated cognito users",
            assumedBy: new iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": idPool.ref,
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated",
                    },
                },
                "sts:AssumeRoleWithWebIdentity"
            )
        });

        new cognito.CfnIdentityPoolRoleAttachment(
            this,
            "identity-pool-role-attachment",
            {
                identityPoolId: idPool.ref,
                roles: {
                    authenticated: cognitoUserRole.roleArn,
                },
            }
        );

        this.params.setParam(cognitoUserPoolIdParam, userPool.userPoolId);
        this.params.setParam(cognitoUserPoolClientIdParam, userPoolClient.userPoolClientId);
        this.params.setParam(cognitoIdentityPoolIdParam, idPool.ref);

        return {
            userPool,
            userPoolClient,
            idPool,
            cognitoUserRole
        };
    }
}
