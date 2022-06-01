export const UserTypes = {
    EXTERNAL: 'EXTERNAL',
    INTERNAL: 'INTERNAL'
};

export class EnumEx {
    static getNames(e: any) {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues(e: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues(e: any): Array<ValuePair> {
        return EnumEx.getValues(e).map(v => {
            return { id: v, name: e[v] as string };
        });
    }
}

export interface ValuePair {
    id: number;
    name: string;
}

export enum modules {
    USER_ACCESS_MANAGEMENT = 1,
    INFORMATION_MANAGEMENT = 2
}

export enum List_Master {
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
    PAPERSIZE = 22,
    ALPHADOCUMENTFORMAT = 23,
    SPATIALDOCUMENTFORMAT = 24,
    CERTIFICATES = 25,
    DOCUMENTFORMAT = 26
}

export enum Roles {
    INTERNAL = 3,
    EXTERNAL = 4
}

export enum provinces {
    MPUMALANGA = 2,
    NATIONAL = -1,
    LIMPOPO = 1,
    GAUTENG = 3,
    NORTH_WEST = 4,
    FREE_STATE = 5,
    KWAZULU_NATAL = 6,
    EASTERN_CAPE = 7,
    NORTHERN_CAPE = 8,
    WESTERN_CAPE = 9
}

export enum titles {
    DR = 33,
    MR = 34,
    MS = 35,
    MRS = 36
}

export const htmlContent = {
    htmlStartText: `<!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="UTF-8">
        <style type="text/css">
            @page {

                @bottom-center {
                    content: "Invoice";
                    vertical-align: top;
                    padding-top: 10px;
                }

                @bottom-right {
                    content: counter(page) " of " counter(pages);
                }
                margin: 1cm;
                size: A4 portrait;

            }

            .font {
                font-family: Arial, Helvetica, sans-serif;
            }

            table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }

            table tr {
                page-break-inside: avoid;
            }

            .table td,
            .table th {
                border: 1px solid #ddd;
                text-align: left;
                padding: 8px;
            }

            .table tr:nth-child(even) {

                background-color: #dddddd;
            }


            #customers {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }

            #customers td,
            #customers th {
                border: 1px solid #ddd;
                padding: 8px;
            }

            #customers tr:nth-child(even) {
                background-color: #f2f2f2;
            }

            #customers tr:hover {
                background-color: #ddd;
            }

            #customers th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #4CAF50;
                color: white;
            }

            .row:after {
                content: "";
                display: table;
                clear: both;
            }

            .w-100 {
                width: 100%;
            }

            .column {
                float: left;
                width: 50%;
                padding: 10px;
                height: 300px;
            }

            * {
                box-sizing: border-box;
            }

            .details-table th {
                text-align: left;
            }

            .details-table td,
            .details-table th {
                padding-bottom: 8px;
                font-size: 14px;
            }

            .heading,
            .value {
                padding-bottom: 8px;
                font-size: 14px;
            }

            .bolder {
                font-weight: bolder;
            }
        </style>
    </head>
    <body>`,
    htmlTextEnd: `</body>
    </html>`
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
    SUBDIVISION = 596,
    RELAYOUT = 1086
}

export enum ProcessID {
    ReservationRequest = 229,
    ReservationTransfer = 239,
    Lodgement = 278,
    Examination = 322
}

export enum LODGEMENTFORM {
    REQUESTREVIEW = 501,
    QUALITYASSURANCE = 502,
    DISPATCH = 503,
    NUMBERING = 504,
    REQUESTDETAIL = 505
}