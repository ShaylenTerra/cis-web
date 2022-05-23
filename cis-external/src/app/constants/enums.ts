export const UserAccountStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};

export const AccountStatus = {
    ISAPPROVED: 'ISAPPROVED',
    APPROVED: 'APPROVED',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    REJECTED: 'REJECTED',
    WAITING: 'WAITING',
    PENDING: 'PENDING',
    NO_ACTIVE_ROLES: 'NO_ACTIVE_ROLES'
};
export const UserTypes = {
    EXTERNAL: 'EXTERNAL',
    INTERNAL: 'INTERNAL'
};
export const ApprovedStatus = {
    PENDING: 'PENDING',
    WAITING: 'WAITING',
    YES: 'YES'
};
export const RoleCodes = {
    ARCHITECT: 'EX002',
    LAND_SURVEYOR: 'EX010',
    LAND_SURVEYOR_ASSISTANT: 'EX011'
};
export const TaskType = {
    'EXTERNAL_USER_PENDING_APPROVAL': 'EXTERNAL_USER_PENDING_APPROVAL'
};
export const TaskStatus = {
    OPEN: 'OPEN'
};
export class EnumEx {
    static getNames(e: any) {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues(e: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues(e: any): Array<ValuePair> {
        return EnumEx.getValues(e).map(v => ({ id: v, name: e[v] as string }));
    }
}
export interface ValuePair {
    id: number;
    name: string;
}
export enum notification_users {
    ALL_INTERNAL_USERS = 49,
    ALL_EXTERNAL_USERS = 50,
    ALL_SURVEYORS = 51,
    ALL_ARCHITECTS = 52
}
export enum issueType {
    REGISTRATION = 42,
    DIGITAL_TOUR = 43,
    BENEFITS_OF_REGISTRATION = 44,
    FREEZING_SYSTEM = 45,
    GUIDE_TO_WEBSITE = 46,
    OTHER = 47
}
export enum list_master {
    MODULE = 1,
    USERTYPE = 2,
    SECTORS = 3,
    ORGANIZATIONS = 4,
    SECURITYQUESTION = 5,
    COMMUNICATIONMODE = 6,
    TITLE = 7,
    TEMPLATE = 8,
    ISSUETYPE = 9,
    NOTIFICATIONUSERTYPE = 10,
    NOTIFICATIONSUBTYPE = 11,
    NOTIFICATIONTYPE = 12,
    INTERNALUSERMENUITEMS = 13,
    INTERNALUSERHOMEMENUITEMS = 14,
    EXTERNALUSERMENUITEMS = 15,
    DELIVERYMETHOD = 16,
    FORMATTYPE = 17,
    MEDIATYPE = 18,
    SECTIONS = 19,
    STATUS = 20,
    PAPERSIZE = 22,
    ALPHADOCUMENTFORMAT = 23,
    SPATIALDOCUMENTFORMAT = 24,
    CERTIFICATES = 25,
    DOCUMENTFORMAT = 26
}

export const list_FeeCategoryType = {
    CADASTRAL_IMAGES: 1,
    Spatial_Data: 2,
    Alpha_Numerics: 3,
    Certificates: 4,
    Cordinates: 5,
    Advisory_Service: 6,
    General_Plans: 7,
    Miscellaneous: 8,
    NGI_DATA: 9
};
export enum ReservationAction {
    TASKALLOCATION = 247,
    APPLICATIONVERIFICATION = 250,
    QUALITYASSURANCE = 248,
    RESUBMITREQUEST = 242,
    RESUBMITMODIFY = 251,
    DELETEACTION = 243,
    CANCELACTION = 19,
    MODIFYACTION = 13,
    PROCESSACTION = 241,
    REVIEW = 15
}

export enum ReservationReason {
    REDESIGNATION = 647,
    AMENDINGGENERALPLANS = 649,
    ANCILLARYRIGHTSIPROCLAMATION = 651,
    CONSOLIDATION = 597,
    CREATIONOFFARMS = 602,
    CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS = 601,
    EXCISION = 600,
    EXTENSIONOFTOWNSHIPS = 599,
    LEASE = 648,
    PARTIALCANCELLATIONOFGENERALPLAN = 650,
    PUBLICPLACECLOSURE = 646,
    STREETCLOSURE = 603,
    SUBDIVISION = 596
}

export enum ProcessID {
    ReservationRequest = 229,
    ReservationTransfer = 239,
    Lodgement = 278
}

export enum LODGEMENTFORM {
    REQUESTREVIEW = 501,
    QUALITYASSURANCE = 502,
    DISPATCH = 503,
    NUMBERING = 504,
    REQUESTDETAIL = 505
}