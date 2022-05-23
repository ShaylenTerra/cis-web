// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    clientId: 'cis-rest-api',
    clientSecret: 'XY7kmzoNzl100',
    production: false,
    uamBaseUrl: 'http://10.1.15.226:8089/cis_uam/cisorigin.uam/api/v1/',
    gisServerUrl: 'http://dwapps.co.za/CSGGIS',
    tokenUrl: 'http://dwappdemo.co.za:8089/oauth/token',
    portalUrl: 'http://10.10.20.204/CIS-Portal/',
    getProvinces: 'province/list',
    login: 'user/authenticate',
    getExternalRoles: 'list-master/list-roles?userType=EXTERNAL',
    getListItems: 'list-master/list-items?listCode=',
    updatePassword: 'user/updatePassword',
    getTopNotifications: 'notifications/list?userTypeItemId=',
    updateExternalUserEmail: 'user/updateEmail',
    deActivateExternalUser: 'user/activate?',
    getQueries: 'workflow/queryByUser',
    createNewQuery: 'issuelog/add',
    getTitles: 'list-master/list-items?listCode=7',
    getOrganizations: 'list-master/list-items?listCode=4',
    getSectors: 'list-master/list-items?listCode=3',
    getCommModes: 'list-master/list-items?listCode=6',
    getSecurityQuestions: 'list-master/list-items?listCode=5',
    getHolidays: 'holiday/list?year=',
    officeTimings: 'office-timings/list',
    registerExternalUser: 'user/register',
    updateSecurityQuestions: 'user/updateSecurityInfo',
    updateProfile: 'user/updatePersonalInfo',
    getUserInfoByEmail: 'user/listUserInfo?email=',
    getSecurityQuestionsByEmail: 'user/listSecurityQuestions?email=',
    verifyQuestionsByEmail: 'user/verifySecurityAnswers?',
    fileUpload: 'file/upload',
    validatePlscode: 'user/verifyProfessional?ppnNo=',
    registerPlsUser: 'pls-user/register',
    getOfficeTimings: 'office-timings/list?officeTimingType=OFFICE_TIMING&provinceId=',
    getOfficeHolidays: 'office-timings/list?officeTimingType=OFFICE_HOLIDAY&provinceId=',
    getSearchTypeCriteria: 'search/config/',
    // getSearchTypeConfig: 'search/configById?searchTypeParentId=',
    getSearchTypeByProvince: 'search/getSearchTypeAndFilterForUserType',
    searchBySgNumber: 'search/number/sgnumber?page=',
    searchByCompilationNo: 'search/number/compilationNo?page=',
    searchByDeedNo: 'search/number/deedNo?page=',
    searchBySurveyRecordNo: 'search/number/surveyRecordNo?page=',
    searchByLeaseNo: 'search/number/leaseNo?page=',
    getSearchData: 'search/log',
    downloadSgDataImage: 'search/downloadImage',
    downloadZippedImages: 'search/downloadZippedImage',
    addToCart: 'cart/add',
    getCartDetails: 'cart/?userId=',
    emptyCart: 'cart/empty?cartId=',
    updateCart: 'cart/update',
    triggertask: 'triggertask',
    cartCheckout: 'cart/checkout',
    searchByRefNoAndUserId: 'workflow/dashboardSearch',
    searchByRefNo: 'workflow/seachByReference',
    getMyRequests: 'workflow/listByUser',
    uploadSupportingDocument: 'workflow/uploadDocs',
    workflowNotification: 'workflow/notifications',
    getNodeDetails: 'getNodeDetails',
    listItemsByListCode: 'list-master/list-items',
    getInformationRequestItem: 'workflow/requestItem',
    notification: 'workflow/notifications',
    removeCart: 'cart/removeCartItem',
    getRequestorInformation: 'workflow/requesterInfo',
    uploadProofOfPayment: 'workflow/addProofOfPayment',
    getAllMunicipalitiesByProvinceCode: 'search/municipalities',
    getTownship: 'search/township',
    farmSearch: 'search/parcel/farm?page=',
    erfSearch: 'search/parcel/erf?page=',
    holdingSearch: 'search/parcel/holding?page=',
    lpiSearch: 'search/parcel/lpi?page=',
    sectionalFarmSearch: 'search/sectional/farm?page=',
    sectionalErfSearch: 'search/sectional/erf?page=',
    sectionalSchemeNameSearch: 'search/sectional/schemeName?page=',
    sectionalSchemeNoSearch: 'search/sectional/schemeNo?page=',
    sectionalFilingNoSearch: 'search/sectional/filingNo?page=',
    sectionalTitleSearch: 'search/sectional/title?page=',
    sectionalSgNoSearch: 'search/sectional/sgNo?page=',
    downloadSampleTemplate: 'search/template/sample',
    templateSearchCompilationNumber: 'search/template/compilationNumber',
    templateSearchParcelErf: 'search/template/parcelErf',
    templateSearchSgNumber: 'search/template/sgNumber',
    templateSearchSurveyRecordNumber: 'search/template/surveyRecordNumber',
    getTextSearch: 'search/text?page=',
    getRangeFarmSearchData: 'search/range/farm?page=',
    getRangeErfPortionSearchData: 'search/range/erf/portion?page=',
    getRangeErfParcelSearchData: 'search/range/erf/parcel?page=',
    getAllPrePackageConfigs: 'prepackage',
    subscribePrePackageConfigs: 'prepackage/subscribe',
    getAllSubscriptionByUser: 'prepackage/subscription/list',
    updateSubscriptionStatus: 'prepackage/subscription/status',
    getPrepackagedImage: 'prepackage/sample/image',
    getAllPrePackageConfigListing: 'prepackage/listing',
    getSubscriptionNotify: 'prepackage/subscription/notify',
    getWorkflowBasedItem: 'workflow/requestWorkflowItem',
    getWorkflowDataForRequestType: 'workflow/requestTypeData',
    getAddressBasedOnProvinceId: 'province/list/address',
    generateInvoicePdf: 'invoice/download?workflowId=',
    getPaymentInfo: 'workflow/payment',
    imBaseUrl: 'http://10.1.15.226:8089/cis_uam/cisorigin.im/api/v1/',
    imSearchBaseUrl: 'http://10.1.15.226:8089/cis_search_uam/cisorigin.search/api/v1/',
    imReportBaseUrl: 'http://10.1.15.226:8089/cis_uam/cisorigin.cis/api/v1/',
    getInternalRoles: 'getRoles?type=INTERNAL',
    checkUserExist: 'checkUserExist?email=',
    validatePlsUser: 'validatePlsUser?plscode=',
    getAllPlsAssistants: 'user/listAssistants?userId=',
    searchPlsAssistant: 'user/userByEmailAndRoleId?email=',
    addAssistant: 'user/addAssistant',
    removeAssistant: 'user/removeAssistant',
    checkADUserExists: 'checkADUserExists',
    registerInternalUser: 'registerInternalUser',
    getSections: 'getSections',
    registerInternalUserRole: 'registerInternalUserRole',
    uploadSignedUserAccess: 'uploadSignedUserAccess',
    deleteInternalUserRole: 'deleteInternalUserRole',
    submitInternalUserForApproval: 'submitInternalUserForApproval',
    getInternalUserRolesByEmail: 'getInternalUserRolesByEmail?email=',
    forgotPassword: 'user/forgotpass?emailId=',
    resetPassword: 'updatePassword',
    getAllInternalUsers: 'getAllInternalUsers?provincecode=all&roleCode=all',
    getAllExternalUsers: 'getAllExternalUsers?provincecode=all&roleCode=all',
    getAllInternalUsersByProvinceCode: 'getAllInternalUsers?provincecode=',
    getAllExternalUsersByProvinceCode: 'getAllExternalUsers?provincecode=',
    deactivateUser: 'deactivateUser',
    deleteExternalUser: 'deleteExternalUser',
    getMyAssistants: 'getMyAssistants?surveyorusercode=',
    getMySurveyors: 'getMySurveyors?assistantusercode=',
    deleteAssistant: 'deleteAssistant',
    updateExternalUser: 'updateExternalUser',
    getAllPlsUsers: 'getAllPlsUsers',
    createCommType: 'createCommType',
    createOrgType: 'createOrgType',
    createSector: 'createSector',
    createSection: 'createSection',
    updateInternalUser: 'updateInternalUser',
    getAllTasks: 'getAllTasks',
    updateAccessRights: 'updateAccessRights',
    getUserSecurityQuestions: 'getUserSecurityQuestions',
    checkUserSecurityQuestions: 'checkUserSecurityQuestions',
    getRolesBySectionsAndProvince: 'getRolesBySectionsAndProvince?sectionCode=',
    updatePlsUser: 'updatePlsUser',
    registerNewExternalRole: 'registerNewExternalRole',
    getExternalRolesByRoleCode: 'getExternalRolesByRoleCode?roleCode=',
    getMenuOfUser: 'getMenuOfUser?roleCode=',
    createTask: 'createTask',
    closeTask: 'closeTask',
    approveRejectUser: 'approveRejectUser',
    downloadSignedUserAccess: 'downloadSignedUserAccess',
    getInternalRolesByRoleCode: 'getInternalRolesByRoleCode?roleCode=',
    getDashboardRights: 'getDashboardRights?userType=Internal&roleCode=',
    setDashboardRights: 'setDashboardRights',
    getUserRegisteredCounts: 'getUserRegisteredCounts?dashBoarID=1',
    userLogReport: 'userLogReport',
    userSummaryReport: 'userSummaryReport',
    quarterlyDeletedUserReport: 'quarterlyDeletedUserReport',
    quarterlyUpdatedUserReport: 'quarterlyUpdatedUserReport',
    issueLogUpdateStatus: 'issueLogUpdateStatus?issueID=',
    getIssueLogStatus: 'getIssueLogStatus',
    getAllIssueLogs: 'getAllIssueLogs',
    saveIssueLog: 'saveIssueLog',
    deactivateUserRole: 'deactivateUserRole',
    uploadDocumentationForExternalUsers: 'uploadDocumentationForInternalUsers',
    downloadDocumentation: 'downloadDocumentation',
    getPpNumber: 'getPpNumber?ppNumber=',
    getUserInfoLite: 'getUserInfoLite?email=',
    getMyIssues: 'getMyIssues?email=',
    getNotifications: 'getNotifications',
    saveNotification: 'saveNotification',
    getNotificationUserTypes: 'getNotificationUserTypes',
    uploadNotificationDoc: 'uploadNotificationDoc',
    deleteNotificationDoc: 'deleteNotificationDoc?documentPath=',
    getNotificationDocsList: 'getNotificationDocsList?notificationId=',
    downloadNotificationDocs: 'downloadNotificationDocs',
    logoutUser: 'user/logout',
    adUserLoginCheck: 'adUserLoginCheck',
    deleteCommunicationType: 'deleteCommunicationType?commTypeName=',
    deleteSector: 'deleteSector?sectorName=',
    deleteOrgnization: 'deleteOrgnization?orgName=',
    getCostCategories: 'getCostCategories',
    getPropertyValueByName: 'getPropertyValueByName?name=',
    getSubCostCategoriesByCostCategoryCode: 'getSubCostCategoriesByCostCategoryCode?costCategoryCode=',
    sendEmailWithInvoice: 'sendEmailWithInvoice?requestCode=',
    setPropertyValueByName: 'setPropertyValueByName',
    createCategory: 'createCategory',
    createSubCategory: 'createSubCategory',
    createRequestKind: 'createRequestKind',
    createRequestType: 'createRequestType',
    createMediaType: 'createMediaType',
    createFormatType: 'createFormatType',
    createDeliveryMethod: 'createDeliveryMethod',
    createGazzetteType: 'createGazzetteType',
    createRequest: 'createRequest',
    createRequestItem: 'createRequestItem',
    deleteRequestItem: 'deleteRequestItem',
    uploadPaymentConfirmation: 'uploadPaymentConfirmation',
    generateInvoice: 'generateInvoice?requestCode=',
    downloadPop: 'downloadPop',
    downloadInvoice: 'downloadInvoice',
    getRequestsOfUser: 'getRequestsOfUser?provinceCode=',
    getRequestItemsOfRequest: 'getRequestItemsOfRequest',
    getCategories: 'getCategories',
    getSubCategiesByCategoryCode: 'getSubCategiesByCategoryCode',
    getRequestTypes: 'getRequestTypes',
    getRequestKinds: 'getRequestKinds',
    getMediaTypes: 'getMediaTypes',
    getFormatTypes: 'getFormatTypes',
    getDeliveryMethods: 'getDeliveryMethods',
    getGazzetteTypes: 'getGazzetteTypes',
    searchByNumberProvinceCode: 'searchByNumberProvinceCode?sGNumber=',
    searchByCompilationNumberProvinceCode: 'searchByCompilationNumberProvinceCode?compilationNumber=',
    searchByFilingNumberProvinceCode: 'searchByFilingNumberProvinceCode?fillingNumber=',
    searchBySurveySGNumberProvinceCode: 'searchBySurveySGNumberProvinceCode?surveyRecordNumber=',
    searchByDeedsNumberProvinceCode: 'searchByDeedsNumberProvinceCode?deedNumber=',
    searchByLeaseNumberProvinceCode: 'searchByLeaseNumberProvinceCode?leaseNumber=',
    searchParcelByFarm: 'searchParcelByFarm?provinceCode=',
    searchParcelByERF: 'searchParcelByERF?provinceCode=',
    searchParcelByHoldings: 'searchParcelByHoldings?provinceCode=',
    searchParcelByLPI: 'searchParcelByLPI?provinceCode=',
    searchSectionalPortionByFarm: 'searchSectionalPortionByFarm?registrationDivision=',
    searchSectionalPortionByERF: 'searchSectionalPortionByERF?townShipName=',
    searchSectionalPortionByTitle: 'searchSectionalPortionByTitle?',
    getTaskTargetFlows: 'getTaskTargetFlows?taskid=',
    getRequestByRequestCode: 'getRequestByRequestCode?requestCode=',
    getOfficersOfMySection: 'getOfficersOfMySection?provinceCode=',
    processUserState: 'processUserState',
    getBulkRequestSubTypesByTypeCode: 'getBulkRequestSubTypesByTypeCode?bulkTypeCode=',
    getBulkRequestTypes: 'getBulkRequestTypes',
    createBulkRequestType: 'createBulkRequestType',
    createBulkSubType: 'createBulkSubType',
    uploadDispatchDocument: 'uploadDispatchDocument',
    deleteDispatchDocument: 'deleteDispatchDocument?documentPath=',
    getDispatchDocsList: 'getDispatchDocsList?requestCode=',
    getTasksLifeCycle: 'getTasksLifeCycle?taskReferenceCode=',
    downloadDispatchDocuments: 'downloadDispatchDocuments',
    uploadExternalUserRequestDocument: 'uploadExternalUserRequestDocument',
    deleteExternalUserRequestDocument: 'deleteExternalUserRequestDocument?documentPath=',
    getExternalUserRequestDocsList: 'getExternalUserRequestDocsList?requestCode=',
    getRequestStatus: 'getRequestStatus?requestcode=',
    getRequestsPaidInfoByProvince: 'getRequestsPaidInfoByProvince?provinceCode=',
    createBusinessRuleHistory: 'createBusinessRuleHistory',
    productionReport: 'productionReport',
    notificationReport: 'notificationReport',
    overriddenBusinessRulesReport: 'overriddenBusinessRulesReport',
    dispatchDocumentSendMail: 'dispatchDocumentSendMail',
    userProductionReport: 'userProductionReport',
    updateCostSubCategory: 'updateCostSubCategory',
    uploadUserPaymentConfirmation: 'uploadUserPaymentConfirmation',
    getNotificationSubTypes: 'getNotificationSubTypes',
    downloadDocuments: 'downloadDocuments',
    getDocumentList: 'getDocumentList?documentStoreCode=',
    deleteDocument: 'deleteDocument?documentPath=',
    uploadDocumentFile: 'uploadDocumentFile',
    getUamDesignations: 'getUamDesignations',
    createUamDesignation: 'createUamDesignation',
    deleteUamDesignation: 'deleteUamDesignation?designationCode=',
    deleteDeliveryMethod: 'deleteDeliveryMethod',
    getCostOfCategory: 'getCostOfCategory?costSubCategoryName=',
    getRequestItemsFilesSendEmail: 'getRequestItemsFilesSendEmail',
    getRequestItemsFilesSendFTP: 'getRequestItemsFilesSendFTP',
    getRegistrationDivision: 'getRegistrationDivision?provinceCode=',
    getTownShipName: 'getTownShipName?provinceCode=',
    getPortionRegistrationDivision: 'getPortionRegistrationDivision?provinceCode=',
    getPortionTownShipName: 'getPortionTownShipName?provinceCode=',
    deleteFormatType: 'deleteFormatType',
    deactivateCategory: 'deactivateCategory',
    deactivateSubCategory: 'deactivateSubCategory',
    getInvoiceAmountDetails: 'getInvoiceAmountDetails?provienceCode',
    sendPopToCashier: 'sendPopToCashier',
    setRequestTrackingNo: 'setRequestTrackingNo?trackingNo=',
    getRequestTrackingNo: 'getRequestTrackingNo?requestCode=',
    getRequestDocuments: 'getRequestDocuments?requestCode=',
    cancelRequest: 'cancelRequest',
    getEmailInfo: 'getEmailInfo',
    getEmailInfoById: 'getEmailInfoById?id=',
    updateEmailInfoById: 'updateEmailInfoById',
    getInternalUserData: 'getInternalUserData?provinceCode=',
    sendPasswordToEmail: 'sendPasswordToEmail?email=',
    captchaSiteKey: '6Lfb1pMUAAAAAL5VRlg2jUtcbiCAkR4DWG6gZUxO',
    getUserByUserId: 'user/',
    getMunicipality: 'prepackage/municipality',
    getMajorRegionOrAdminDistrict: 'prepackage/majorRegionOrAdminDistrict',
    getDocumentForRecord: 'search/details/',
    getInformationType: 'search/getInformationType?',
    getUserDisplayImage: 'user/profileImage',
    saveUserProfileImage: 'user/saveProfileImage',
    getUserDocuments: 'user/document?documentTypeId=',
    getUserRoles: 'roles/userRoles/',
    getRoles: 'list-master/list-roles?userType=',
    tcTemplate: 'template/',
    changeAssistantStatus: 'user/changeProfessionalAssistantStatus',
    saveUserRole: 'roles/saveUserRole',
    deleteUserRole: 'roles/userRoles/',
    getUserMetaData: 'user/userMetaData/',
    getUserByEmail: 'user/searchUserByEmail/?userEmail=',
    saveUserMetaData: 'user/saveUserMetaData',
    changeUserStatus: 'user/changeStatus',
    downloadUserDocument: 'user/download/',
    getPrepackageExecutionStatus: 'prepackage/subscription/execution/status',
    getLocation: 'prepackage/province',
    getMinorRegion: 'prepackage/minorRegion',
    getUserNotification: 'workflow/userNotifications?userId=',
    cancelTask: 'workflow/cancelTask',
    processtask: 'processtask',
    addUserNotification: 'notifications/addUserNotifications',
    getRangeHoldingPortionSearchData: 'search/range/holding/portion?page=',
    getRangeHoldingParcelSearchData: 'search/range/holding/parcel?page=',
    share: 'search/share',
    imageConfig: 'system-config/tag?tag=IMAGE_DOWNLOAD_MB',
    downloadTemplateSearchResultFile: 'search/template/resultAuditFile/',
    addBulkToCart: 'cart/bulkAdd',
    emailAvailability: 'user/emailAvailability?emailAddress=',
    getNgiDataInformationCategory: 'list-master/ngiDataInformationCategory?categoryId=',
    ngiDataInformationType: 'list-master/ngiDataInformationType',
    getNgiSearchResult: 'search/ngi',
    feeSimulator: 'list-master/feeSimulator',
    getLodegementType: 'list-master/feeSimulator/lodgementType',
    getLodegementCategory: 'list-master/feeSimulator/lodgementCategory?categoryId=',
    getSiteMapByRoleId: 'roles/siteMap/',
    saveLocationReservationSystem: 'province/saveLocationReservationSystem',
    getReservationSystemNonProvinceLocations: 'province/location-reservation-system?categories=T&parentBoundaryId=',
    searchUserByKey: 'user/searchUsers?searchKey=',
    saveReservationDraft: 'reservation/saveDraft',
    getAllReservationDraft: 'reservation/getDraft?processId=',
    getReservationDraftById: 'reservation/draft/',
    addAnnexure: 'reservation/addAnnexure',
    deleteAnnexure: 'reservation/deleteAnnexure',
    downloadWorkAnnexureFile: 'reservation/getAnnexure/',
    addDraftSteps: 'reservation/addDraftStep',
    getReservationRequest: 'reservation/getRequest?locationId=',
    addDraftRequest: 'reservation/addDraftRequest',
    deleteDraftRequest: 'reservation/deleteDraftRequest',
    getAllDraftSteps: 'reservation/getDraftSteps?draftId=',
    getAnnexure: 'reservation/getAnnexure?draftId=',
    processDraftStepsRequest: 'reservation/processDraftStepsRequests',
    updateDraft: 'reservation/updateDraft',
    getAllReservationWorkflow: 'reservation/listReservationDraft?processId=',
    deleteDraftByDraftId: 'reservation/draft/',
    getDisplayImageByUserId: 'user/profileImage/',
    getReservationType: 'reservation/getType?listCode=',
    checkoutDraft: 'reservation/checkoutDraft?draftId=',
    getProfessionalsByAssistant: 'user/listProfessionalsPerAssistant?assistantId=',
    getProfessionalByPPNNumber: 'user/professionalUser/',
    getReservationDraftByWorkFlowId: 'reservation/draft?workflowId=',
    generateNumberingForLandParcel: 'reservation/generateNumbering?draftId=',
    updateListItem: 'list-master/updateListItem',
    getReservationConditions: 'reservation/getResCondition?draftId=',
    saveResCond: 'reservation/saveResCond',
    deleteResCond: 'reservation/deleteResCond?conditionId=',
    downloadAckLetter: 'reservation/downloadAckLetter?draftId=',
    notifyForReservation: 'reservation/notifyForReservation',
    simulateProcess: 'workflow/simulateProcess',
    getUsersStatistics: 'dashboard/userRegistration/getData',
    getSupportingDocuments: 'workflow/documents',
    getProvinceByCategory: 'province/location-category?categories=P',
    getListItemsData: 'list-master/list-items-data?dataTypeItemId=',
    downloadWorkflowSupportingDocs: 'workflow/downloadSupportingDocs',
    uploadSupportingDocs: 'workflow/uploadDocs',
    getAllReferrals: 'workflow/referral',
    sendSMS: 'sms?phoneNumber=',
    getWorkflowTasks: 'workflow/tasks',
    getUserSummarytaskList: 'dashboard/userSummary/taskList',
    getUserSummaryalertDetails: 'dashboard/userSummary/alertDetails',
    getUserSummaryDistributionByAction: 'dashboard/userSummary/distributionByAction',
    getUserByRoleIdProvinceId: 'user/decision?provinceId=',
    getWorkflowUploadedDocument: 'workflow/getPaymentDocumentInfo',
    getInvoiceItemCosting: 'invoice/items/cost',
    downloadInvoicePdf: 'invoice/download?workflowId=',
    paymentDocument: 'workflow/getPaymentDocument',
    getAllUserByUserType: 'user/list',
    reopenTask: 'workflow/reOpenTask',
    reassignWorkflow: 'workflow/reassign',
    deleteWorkflowDocs: 'workflow/deleteDocs',
    sendToSectionWorkflow: 'workflow/sendToSection',
    getManagerBySectionAndProvince: 'user/getManagerBySection?provinceId=',
    getInvoiceData: 'invoice/getInvoiceTemplateData',
    partialSaveInvoiceData: 'invoice/partialSave',
    addDispatchDetails: 'dispatch/addDispatchDetails',
    getPriorityFlag: 'workflow/priority',
    getWorkflowDocument: 'workflow/documents',
    saveInvoiceData: 'invoice/save',
    downloadCartItemsDoc: 'dispatch/downloadCartItemsDoc',
    uploadDispatchDocsToFtp: 'dispatch/uploadDispatchDocsToFtp',
    getTaskDurationDetails: 'workflow/taskDurationProductivityDetails',
    getCartItemDocument: 'dispatch/getCartItemDocs',
    createProductivityForWorkflow: 'workflow/productivity?workflowId=',
    uploaddispatchDocs: 'dispatch/uploadCartItemsDocs',
    addCartItemDispatchInfo: 'dispatch/addCartItemDispatchInfo',
    getDispatchTemplateData: 'dispatch/getDispatchTemplateData',
    getReferralInputData: 'workflow/referralInputData/',
    loadTaskFlow: 'workflow/tasks',
    updateInvoiceEmailTemplate: 'invoice/previewEmail',
    getOfficeTimingForUserId: 'office-timings/listByUserId?userId=',
    sendDispatchEmail: 'invoice/sendDispatchEmail/',
    getUserHolidays: 'user/leave?userId=',
    expiditeTask: 'workflow/expiditeTask',
    markWorkflowPending: 'workflow/markPending',
    previewEmail: 'invoice/previewEmail/',
    downloadZippedDocs: 'dispatch/downloadDispatchDocs',
    getDispatchDocs: 'dispatch/getDocDetails',
    changeWorkflowProvince: 'workflow/changeProvince',
    addDiariseDate: 'workflow/addToDiary',
    getReservationTownshipAllotment: 'reservation/getTownship?provinceId=',
    verifyRecord: 'reservation/verifyRecord/',
    getReservationTransfers: 'reservation/listReservationTransfer',
    getInboxTasks: 'workflow/lists',
    deleteTransferDraft: 'reservation/deleteTransferDraft?transferId=',
    getAllDraftTransfer: 'reservation/getAllDraftTransfer?draftId=',
    addDraftToTransfer: 'reservation/addDraftToTransfer?draftId=',
    deleteDraftSteps: 'reservation/deleteDraftSteps/',
    getConfigByTag: 'system-config/tag?tag=',
    getApplicantFeedbacks: 'workflow/applicantWorkflowFeedbacks/',
    getWorkflowUserFeedbackYearlyStatus: 'workflow/getWorkflowUserFeedbackYearlyStatus',
    saveWorkflowUserFeedback: 'workflow/saveWorkflowUserFeedback',
    saveLodgementDraft: 'lodgement/saveDraft',
    getAllLodgementDraft: 'lodgement/getLodgementDrafts',
    getLodgement: 'lodgement/listLodgementDraft',
    updateLodgementDraft: 'lodgement/updateDraft',
    getLodgementDraftById: 'lodgement/draft/',
    addLodgementAnnexure: 'lodgement/addAnnexure',
    getLodgementAnnexure: 'lodgement/getAnnexure?draftId=',
    addLodgementPayment: 'lodgement/addDraftPayment',
    getLodgementDraftPayments: 'lodgement/getDraftPayments?draftId=',
    getDraftPaymentDocument: 'lodgement/getPayment/',
    getAnnexureDocument: 'lodgement/getAnnexure/',
    removeAnnexure: 'lodgement/deleteAnnexure?annexureId=',
    saveLodgementDraftSteps: 'lodgement/saveDraftSteps',
    getAllLodgementDraftSteps: 'lodgement/getDraftSteps?draftId=',
    searchDraftRequest: 'lodgement/searchDraftRequest?searchTerm=',
    addLodgementDraftRequest: 'lodgement/addDraftRequest',
    addLodgementRequest: 'lodgement/addRequestToDraftStep',
    uploadLodgementDocument: 'lodgement/uploadLdgResDetailDoc',
    getLdgResDetailDoc: 'lodgement/getLdgResDetailDoc?documentId=',
    getLodgementsList: 'lodgement/listLodgementDraft?processId=',
    checkoutLodgementDraft: 'lodgement/checkoutLodgementDraft?draftId=',
    getLodgementDraftByWorkFlowId: 'lodgement/draft?workflowId=',
    deleteLodgementDraftByDraftId: 'lodgement/draft/',
    getALlDocumentForRequest: 'lodgement/getAllDocumentForRequest?requestId=',
    notifyForLodgement: 'lodgement/notifyForLodgement',
    deleteLdgResDocument: 'lodgement/deleteLdgResDocument?documentId=',
    deleteDraftPayment: 'lodgement/deleteDraftPayment?payId=',
    updateDraftPayment: 'lodgement/updateDraftPayment',
    removeRequestFromStep: 'lodgement/removeRequest?requestId=',
    addStepsByReservationRef: 'lodgement/addStepsByReservationRef?draftId=',
    getWorkFlow: 'workflow/?workflowId=',
    getDocumentSummary: 'lodgement/documentSummary?draftId=',
    getReservationSubType: 'reservation/getSubType?listId=',
    generatePerformaInvoice: 'lodgement/generatePerformaInvoice?draftId=',
    issueBatchLodgement: 'lodgement/issueBatch',
    getLdgDraftAcknowledement: 'lodgement/getLdgDraftAcknowledement?draftId=',
    getBatchDetails: 'lodgement/getBatchDetails?draftId=',
    getLodgementAllDocument: 'lodgement/getLodgementAllDocument?draftId='
};
