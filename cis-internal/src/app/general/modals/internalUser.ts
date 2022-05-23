export class InternalUserModel {
    'role': RoleInfo;
    'userInfo': InternalUserInfo;
    'username': string;
}

export class RoleInfo {
    'internalRoleCode': string;
    'isActive': string;
    'signedAccessDocPath': string;
    'userCode': string;
    'userName': string;
    'userProvinceCode': string;
    'userProvinceName': string;
    'userRoleCode': string;
    'userRoleName': string;
    'userSectionCode': string;
    'userSectionName': string;
}

export class InternalUserInfo {
    'countryCode': string;
    'createdDate': Date = new Date();
    'email': string;
    'firstName': string;
    'lastUpdatedDate': Date = new Date();
    'mobileNo': string;
    'status' = 'ACTIVE';
    'surname': string;
    'password': string;
    'telephoneNo': string;
    'titleItemId': string;
    'userCode': string;
    'userName': string;
    'userTypeItemId': string;
}
