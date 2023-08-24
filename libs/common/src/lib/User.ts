import { BaseUser as IyioUser, BaseUserOptions } from "@iyio/common";
import { BaseUser } from "./common-types";

export class User extends IyioUser implements BaseUser {
    public readonly firstName?: string | undefined;
    public readonly lastName?: string | undefined;
    public readonly fullName?: string | undefined;
    public readonly phone?: string | undefined;

    public constructor(options:BaseUserOptions)
    {
        super(options);
    }
}