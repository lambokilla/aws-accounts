import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

export const createFunction = (scope: Construct, name: string, {
    createPublicUrl,
    publicUrlAccessors,
    ...props
}: Partial<lambdaNode.NodejsFunctionProps> & AdditionalFuncOptions = {}): CreateFunctionResult => {

    const id = name + "-func";
    const func = new lambdaNode.NodejsFunction(scope, id, {
        runtime: lambda.Runtime.NODEJS_18_X,
        architecture: lambda.Architecture.ARM_64,
        entry: path.join(__dirname, `../../libs/functions/src/lib/${id}.ts`),
        handler: 'handler',
        memorySize: 512,
        ...props,
    });

    let url: lambda.FunctionUrl | undefined = undefined;

    if (createPublicUrl) {
        url = func.addFunctionUrl({
            authType: publicUrlAccessors === undefined ?
                lambda.FunctionUrlAuthType.NONE :
                lambda.FunctionUrlAuthType.AWS_IAM,
            cors: {
                allowCredentials: true,
                allowedHeaders: ['*'],
                allowedMethods: [lambda.HttpMethod.ALL],
                allowedOrigins: ['*'],
                maxAge: cdk.Duration.days(1),
            }
        });

        if (publicUrlAccessors) {
            for (const a of publicUrlAccessors) {
                url.grantInvokeUrl(a);
            }
        } else if (publicUrlAccessors !== false) {
            url.grantInvokeUrl(new iam.AnyPrincipal());
        }
        new cdk.CfnOutput(scope, "funcUrl00" + name, { value: url.url });
    }

    new cdk.CfnOutput(scope, "funcName00" + name, { value: func.functionName });
    return { name, upperName: getFuncUpperName(name), func, url };
}

export interface AdditionalFuncOptions {
    createPublicUrl?: boolean;
    publicUrlAccessors?: iam.IGrantable[] | false;
}

export interface CreateFunctionResult {
    upperName: string;
    name: string;
    func: lambda.Function;
    url?: lambda.FunctionUrl;
}

export const getFuncUpperName = (name: string) => name.replace(/[_\W]/g,'').toUpperCase();