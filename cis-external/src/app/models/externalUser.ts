
export class User {
    communicationModeCode: string;
    communicationModeName: string;
    countryCode: string;
    email: string;
    firstLogin: string;
    firstName: string;
    mobileNo: string;
    orgCode: string;
    orgName: string;
    postalAddrLine1: string;
    postalAddrLine2: string;
    postalAddrLine3: string;
    postalCode: string;
    roles: Array<UserRoles> = [];
    sectorCode: string;
    sectorName: string;
    securityInfo: Array<UserSecurity>;
    status: string;
    subscribeEvents: string;
    subscribeNews: string;
    subscribeNotifications: string;
    surname: string;
    telephoneNo: string;
    titleItemId: string;
    userCode: string;
    userId: number;
    userName: string;
    userTypeItemId: string;
    valid: string;
}

export class UserRoles {
    CREATEDDATE: string;
    EXTERNALROLECODE: string;
    ISACTIVE: string;
    USERCODE: string;
    USERID: number;
    USERNAME: string;
    USERPROVINCECODE: string;
    USERPROVINCENAME: string;
    USERROLECODE: string;
    USERROLEID: number;
    USERROLENAME: string;
}

export class UserSecurity {
    SECURITYANSWER1: string;
    SECURITYANSWER2: string;
    SECURITYANSWER3: string;
    SECURITYQUESTION1: string;
    SECURITYQUESTION2: string;
    SECURITYQUESTION3: string;
    SECURITYQUESTIONTYPECODE1: string;
    SECURITYQUESTIONTYPECODE2: string;
    SECURITYQUESTIONTYPECODE3: string;
}
