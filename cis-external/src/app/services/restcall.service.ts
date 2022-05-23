import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

@Injectable()
export class RestcallService extends BaseService {

    constructor(protected http: HttpClient, public authService: AuthService) {
        super(http, authService);
    }

    login(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.login;
        return this.post(data, url);
    }

    tokenAuth(data: any): Observable<any> {
        const url = environment.tokenUrl;
        return this.postAuth(data, url);
    }

    getUserInfoByEmail(email: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserInfoByEmail + email;
        return this.get(new HttpParams(), url);
    }

    getListItems(listId: number): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.getListItems}${listId}`;
        return this.get(new HttpParams(), url);
    }

    getExternalRoles(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getExternalRoles;
        return this.get(new HttpParams(), url);
    }

    getTopNotifications(userTypeId: number): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.getTopNotifications}${userTypeId}&perPage=3`;
        return this.get(new HttpParams(), url);
    }

    getMyRequests(page, size, userId) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getMyRequests
            + '?page=' + page + '&size=' + size + '&userId=' + userId);
    }

    getProvinces(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getProvinces;
        return this.get(new HttpParams(), url);
    }

    logoutUser(data: any) {
        const url = environment.uamBaseUrl + environment.logoutUser;
        return this.logout(data, url);
    }

    registerExternalUser(data: any): Observable<any> {
        return this.post(data, environment.uamBaseUrl + environment.registerExternalUser);
    }

    // registerPLSUser(formData: any): Observable<any> {
    //     return this.postFormdata(formData, environment.uamBaseUrl + environment.registerPlsUser);
    // }

    uploadSupportingDocument(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.uploadSupportingDocument);
    }

    resetPassword(data): Observable<any> {
        return this.post(data, environment.uamBaseUrl + environment.resetPassword);
    }

    forgotPassword(email): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.forgotPassword + email);
    }

    updateSecurityQuestions(data): Observable<any> {
        return this.post(data, environment.uamBaseUrl + environment.updateSecurityQuestions);
    }

    checkUserExist(email: string): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.checkUserExist + email);
    }

    validatePlsUser(plscode: string) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.validatePlsUser + plscode);
    }

    getAllPlsAssistants(userId: number) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllPlsAssistants + userId);
    }

    searchAssistant(email: string, roleId: number) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchPlsAssistant + email + '&roleId=' + roleId);
    }

    addAssistant(data) {
        return this.post(data, environment.uamBaseUrl + environment.addAssistant);
    }

    changeAssistantStatus(data) {
        return this.post(data, environment.uamBaseUrl + environment.changeAssistantStatus);
    }

    removePlsAssistant(data) {
        return this.post(data, environment.uamBaseUrl + environment.removeAssistant);
    }

    getPpNumber(ppno: string) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getPpNumber + ppno);
    }

    registerNewExternalRole(data) {
        return this.post(data, environment.uamBaseUrl + environment.registerNewExternalRole);
    }

    updatePassword(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updatePassword;
        return this.post(data, url);
    }

    updateExternalUserEmail(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateExternalUserEmail;
        return this.post(data, url);
    }

    updateProfile(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateProfile;
        return this.post(data, url);
    }

    deActivateExternalUser(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.deActivateExternalUser + 'userId=' + data + '&status=INACTIVE';
        return this.get(new HttpParams(), url);
    }

    getQueries(page, size, userId): Observable<any> {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getQueries
            + '?page=' + page + '&size=' + size + '&userId=' + userId);
    }

    createQuery(data: any) {
        const url = environment.uamBaseUrl + environment.createNewQuery;
        return this.post(data, url);
    }

    getTitles() {
        const url = environment.uamBaseUrl + environment.getTitles;
        return this.get(new HttpParams(), url);
    }

    getOrganizations() {
        const url = environment.uamBaseUrl + environment.getOrganizations;
        return this.get(new HttpParams(), url);
    }

    getSectors() {
        const url = environment.uamBaseUrl + environment.getSectors;
        return this.get(new HttpParams(), url);
    }

    getCommModes() {
        const url = environment.uamBaseUrl + environment.getCommModes;
        return this.get(new HttpParams(), url);
    }

    getSecurityQuestions() {
        const url = environment.uamBaseUrl + environment.getSecurityQuestions;
        return this.get(new HttpParams(), url);
    }

    getHolidays(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.getHolidays + data;
        return this.get(new HttpParams(), url);
    }

    getOfficeTimings(): Observable<any> {
        const url = environment.uamBaseUrl + environment.officeTimings;
        return this.get(new HttpParams(), url);
    }

    validatePPNO(ppno: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.validatePlscode + ppno;
        return this.get(new HttpParams(), url);
    }

    getOfficeTimes(provinceCode) {
        const url = environment.uamBaseUrl + environment.getOfficeTimings + String(provinceCode);
        return this.get(new HttpParams(), url);
    }

    getOfficeHolidays(provinceCode) {
        const url = environment.uamBaseUrl + environment.getOfficeHolidays + String(provinceCode);
        return this.get(new HttpParams(), url);
    }

    getSearchTypeCriteria(searchTypeParentId: any) {
        const url = environment.uamBaseUrl + environment.getSearchTypeCriteria + searchTypeParentId;
        return this.get(new HttpParams(), url);
    }

    // getSearchTypeConfig(parentId) {
    //     const url = environment.uamBaseUrl + environment.getSearchTypeConfig + parentId;
    //     return this.get(new HttpParams(), url);
    // }

    getSearchFilterByProvince(parentSearchTypeId, provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getSearchTypeByProvince
            + '?parentSearchTypeId=' + parentSearchTypeId + '&provinceId=' + provinceId + '&userTypes=EXTERNAL_OTHER');
    }

    searchBySgNumber(data, pageNo) {
        const url = environment.uamBaseUrl + environment.searchBySgNumber + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    searchByCompilationNo(data, pageNo) {
        const url = environment.uamBaseUrl + environment.searchByCompilationNo + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    searchByDeedNo(data, pageNo) {
        const url = environment.uamBaseUrl + environment.searchByDeedNo + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    searchBySurveyRecordNo(data, pageNo) {
        const url = environment.uamBaseUrl + environment.searchBySurveyRecordNo + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    searchByLeaseNo(data, pageNo) {
        const url = environment.uamBaseUrl + environment.searchByLeaseNo + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    getSearchData(page, size, activefield, userId, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getSearchData
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + '&userId=' + userId + sortData);
    }

    downloadSgDataImage(payload) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.downloadSgDataImage);
    }

    downloadZippedImages(payload) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.downloadZippedImages);
    }

    getCartDetails(userId) {
        const url = environment.uamBaseUrl + environment.getCartDetails + userId;
        return this.get(new HttpParams(), url);
    }

    addToCart(payload) {
        const url = environment.uamBaseUrl + environment.addToCart;
        return this.post(payload, url);
    }

    emptyCart(cartId) {
        const url = environment.uamBaseUrl + environment.emptyCart + cartId;
        return this.get(new HttpParams(), url);
    }

    updateCart(data) {
        const url = environment.uamBaseUrl + environment.updateCart;
        return this.post(data, url);
    }

    triggertask(data) {
        const url = environment.triggerUrl + environment.triggertask;
        return this.post(data, url);
    }

    notificationForWorkflowRequest(data) {
        return this.post(data, environment.uamBaseUrl + environment.workflowNotification);
    }

    cartCheckout(data) {
        const url = environment.uamBaseUrl + environment.cartCheckout;
        return this.post(data, url);
    }

    searchByRefNoAndUserId(refNo, userId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchByRefNoAndUserId
            + '?referenceNo=' + refNo + '&userId=' + userId);
    }

    searchByRefNo(refNo) {
        return this.getWithoutAuth(new HttpParams(), environment.uamBaseUrl + environment.searchByRefNo
            + '?referenceNo=' + refNo);
    }

    getNodeDetails(processId, nodeId) {
        return this.get(new HttpParams(), environment.triggerUrl + environment.getNodeDetails
            + '?processId=' + processId + '&nodeId=' + nodeId);
    }

    listItemsByListCode(listCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.listItemsByListCode
            + '?listCode=' + listCode);
    }

    getInformationRequestItem(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInformationRequestItem
            + '?workflowId=' + workflowId);
    }


    notification(payload) {
        const url = environment.uamBaseUrl + environment.notification;
        return this.post(payload, url);

    }

    removeCartItem(cartId, cartStageDataId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.removeCart
            + '?cartId=' + cartId + '&cartStageDataId=' + cartStageDataId);
    }

    getRequestorInformation(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getRequestorInformation
            + '?workflowId=' + workflowId);
    }

    uploadProofOfPayment(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.uploadProofOfPayment);
    }

    getAllMunicipalitiesByProvinceCode(provinceCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllMunicipalitiesByProvinceCode
            + '?provinceCode=' + provinceCode);
    }

    getTownship(provinceCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getTownship
            + '?provinceCode=' + provinceCode);
    }


    farmSearch(farm, pageNo) {
        const url = environment.uamBaseUrl + environment.farmSearch + (pageNo - 1);
        return this.postHeaderResponse(farm, url);
    }

    erfSearch(erf, pageNo) {
        const url = environment.uamBaseUrl + environment.erfSearch + (pageNo - 1);
        return this.postHeaderResponse(erf, url);
    }

    holdingSearch(holding, pageNo) {
        const url = environment.uamBaseUrl + environment.holdingSearch + (pageNo - 1);
        return this.postHeaderResponse(holding, url);

    }

    lpiSearch(lpi, pageNo) {
        const url = environment.uamBaseUrl + environment.lpiSearch + (pageNo - 1);
        return this.postHeaderResponse(lpi, url);
    }

    sectionalSchemeNameSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalSchemeNameSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalSchemeNoSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalSchemeNoSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalFilingNoSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalFilingNoSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalTitleSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalTitleSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalSgNoSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalSgNoSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    downloadSampleTemplate(filterType): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadSampleTemplate + '?type=' + filterType;
        return this.getFileResponse(url);
    }

    templateSearchCompilationNumber(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.templateSearchCompilationNumber);
    }

    templateSearchParcelErf(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.templateSearchParcelErf);
    }

    templateSearchSgNumber(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.templateSearchSgNumber);
    }

    templateSearchSurveyRecordNumber(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.templateSearchSurveyRecordNumber);
    }

    getTextSearch(data, pageNo): Observable<any> {
        const url = environment.uamBaseUrl + environment.getTextSearch + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    sectionalFarmSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalFarmSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalErfSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalErfSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    getAllPrePackageConfigs(page, size, activefield, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllPrePackageConfigs
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + sortData);
    }

    getAllPrePackageConfigListing(page, size, activefield, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllPrePackageConfigListing
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + sortData);
    }

    getAllSubscriptionByUser(userid: any) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllSubscriptionByUser
            + '?userId=' + userid);
    }

    updateSubscriptionStatus(subscriptionId: any, subscriptionStatus: any, useid: any) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.updateSubscriptionStatus
            + '?subscriptionId=' + subscriptionId + '&subscriptionStatus=' + subscriptionStatus + '&userId=' + useid);
    }

    subscribePrePackageConfigs(data) {
        const url = environment.uamBaseUrl + environment.subscribePrePackageConfigs;
        return this.post(data, url);
    }

    getRangeFarmSearchData(data, pageNo) {
        const url = environment.uamBaseUrl + environment.getRangeFarmSearchData + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    getRangeErfPortionSearchData(data, pageNo) {
        const url = environment.uamBaseUrl + environment.getRangeErfPortionSearchData + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }


    getRangeErfParcelSearchData(data, pageNo) {
        const url = environment.uamBaseUrl + environment.getRangeErfParcelSearchData + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    getPrepackagedImage(prepackagedId: any) {
        return this.getFileResponse(environment.uamBaseUrl + environment.getPrepackagedImage
            + '?prepackageId=' + prepackagedId);
    }

    getSubscriptionNotify(payload) {
        const url = environment.uamBaseUrl + environment.getSubscriptionNotify;
        return this.post(payload, url);
    }

    getWorkflowBasedItem(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowBasedItem
            + '?workflowId=' + workflowId);
    }

    getWorkflowDataForRequestType(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowDataForRequestType
            + '?workflowId=' + workflowId);
    }

    getAddressBasedOnProvinceId(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAddressBasedOnProvinceId
            + '?provinceId=' + provinceId);
    }

    generateInvoicePdf(workflowId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.generateInvoicePdf + workflowId;
        return this.getFileResponse(url);
    }

    getPaymentInfo(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getPaymentInfo
            + '?workflowId=' + workflowId);
    }
    getUserByUserID(userID) {
        const url = environment.uamBaseUrl + environment.getUserByUserId + userID;
        return this.get(new HttpParams(), url);
    }

    getMunicipality(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMunicipality
            + '?provinceId=' + provinceId);
    }

    getMajorRegionOrAdminDistrict(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMajorRegionOrAdminDistrict
            + '?provinceId=' + provinceId + '&size=' + 500);
    }

    getDcoumentForRecord(recordId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDocumentForRecord + recordId;
        return this.getHeaderResponse(new HttpParams(), url);
    }

    getInformationType(documentSubtype: string, documentType: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getInformationType
            + 'documentSubtype=' + documentSubtype + '&documentType=' + documentType;
        return this.get(new HttpParams(), url);
    }
    getSecurityInfoByEmail(email: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getSecurityQuestionsByEmail + email;
        return this.get(new HttpParams(), url);
    }

    verifySecurityAnswerByEmail(securityQuestionTypeItemId, answer, email): Observable<any> {
        const url = environment.uamBaseUrl + environment.verifyQuestionsByEmail
            + 'securityQuestionTypeItemId=' + securityQuestionTypeItemId
            + '&answer=' + answer + '&email=' + email;
        return this.get(new HttpParams(), url);
    }

    getProfileImage() {
        return this.getFileResponse(environment.uamBaseUrl + environment.getUserDisplayImage);
    }

    updateProfileImage(payload: any) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.saveUserProfileImage);
    }

    getUserDocuments(docType: string, userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserDocuments + docType + '&userId=' + userId;
        return this.get(new HttpParams(), url);
    }
    getUserRole(userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserRoles + userId;
        return this.get(new HttpParams(), url);
    }

    getRoles(roleId: string): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.getRoles}${roleId}`;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    tcTemplate(id: number): Observable<any> {
        const url = environment.uamBaseUrl + environment.tcTemplate + id;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    saveUserRole(data: any): Observable<any> {
        return this.post(data, environment.uamBaseUrl + environment.saveUserRole);
    }
    deleteUserRole(userRoleId) {
        const url = environment.uamBaseUrl + environment.deleteUserRole + userRoleId;
        return this.delete(url);
    }

    getUserMetaData(userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserMetaData + userId;
        return this.get(new HttpParams(), url);
    }

    getUserByEmail(email: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserByEmail + email;
        return this.get(new HttpParams(), url);
    }
    saveUserMetaData(payload) {
        const url = environment.uamBaseUrl + environment.saveUserMetaData;
        return this.post(payload, url);
    }

    changeUserStatus(status: any, userId: number): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.changeUserStatus
            + '?status=' + status + '&userId=' + userId);
    }
    downloadUserSupportingDocument(id): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadUserDocument + id;
        return this.getFileResponse(url);
    }

    getPrepackageExecutionStatus(subscriptionId): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getPrepackageExecutionStatus
            + '?size=500' + '&subscriptionId=' + subscriptionId);
    }

    getMinorRegion(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMinorRegion
            + '?provinceId=' + provinceId + '&size=' + 500);
    }

    getLocation(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getLocation;
        return this.get(new HttpParams(), url);
    }

    getUserNotification(loggedInUserId) {
        const url = environment.uamBaseUrl + environment.getUserNotification + loggedInUserId;
        return this.get(new HttpParams(), url);
    }

    cancelTask(payload) {
        const url = environment.uamBaseUrl + environment.cancelTask;
        return this.post(payload, url);
    }

    processtask(data) {
        const url = environment.triggerUrl + environment.processtask;
        return this.post(data, url);
    }

    addUserNotification(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addUserNotification;
        return this.post(payload, url);
    }

    getRangeHoldingPortionSearchData(data, pageNo) {
        const url = environment.uamBaseUrl + environment.getRangeHoldingPortionSearchData + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }


    getRangeHoldingParcelSearchData(data, pageNo) {
        const url = environment.uamBaseUrl + environment.getRangeHoldingParcelSearchData + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    share(payload) {
        const url = environment.uamBaseUrl + environment.share;
        return this.post(payload, url);
    }

    imageConfig() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.imageConfig);
    }

    downloadTemplateSearchResultFile(id): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadTemplateSearchResultFile + id;
        return this.getFileResponse(url);
    }

    addBulkToCart(payload) {
        const url = environment.uamBaseUrl + environment.addBulkToCart;
        return this.post(payload, url);
    }

    userEmailAvailability(email): Observable<any> {
        const url = environment.uamBaseUrl + environment.emailAvailability + email;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    notificationWithoutToken(payload) {
        const url = environment.uamBaseUrl + environment.notification;
        return this.postWithoutAuth(payload, url);

    }

    getNgiDataInformationCategory(catId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getNgiDataInformationCategory + catId;
        return this.get(new HttpParams(), url);
    }

    ngiDataInformationType(): Observable<any> {
        const url = environment.uamBaseUrl + environment.ngiDataInformationType;
        return this.get(new HttpParams(), url);
    }

    getNgiSearchResult(payload) {
        const url = environment.uamBaseUrl + environment.getNgiSearchResult;
        return this.post(payload, url);
    }

    feeSimulator(payload) {
        const url = environment.uamBaseUrl + environment.feeSimulator;
        return this.post(payload, url);
    }

    getLodegementType(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getLodegementType;
        return this.get(new HttpParams(), url);
    }

    getLodegementCategory(id: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getLodegementCategory + id;
        return this.get(new HttpParams(), url);
    }
    getSiteMapItemByRoleId(roleId: number): Observable<any> {
        const url = environment.uamBaseUrl + environment.getSiteMapByRoleId + roleId;
        return this.get(new HttpParams(), url);
    }
    getAllReservationDraft(peocessId) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllReservationDraft + peocessId);
    }
    getAllReservationWorkflow(processId, userId) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllReservationWorkflow + processId + '&userId=' + userId);
    }
    saveReservationDraft(payload) {
        const url = environment.uamBaseUrl + environment.saveReservationDraft;
        return this.post(payload, url);
    }
    deleteDraftByDraftId(draftRequestId) {
        const url = environment.uamBaseUrl + environment.deleteDraftByDraftId + draftRequestId;
        return this.delete(url);
    }
    getReservationDraftById(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationDraftById + draftId);
    }

    getAnnexurebyDraftId(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAnnexure + draftId);
    }
    searchUserByKey(keyValue) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchUserByKey + keyValue);
    }
    getDisplayProfileImage(userId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.getDisplayImageByUserId + userId);
    }
    downloadWorkAnnexureFile(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadWorkAnnexureFile + documentId);
    }
    uploadAddAnnexure(obj) {

        const formData: FormData = new FormData();

        formData.append('document', obj.document);
        formData.append('typeId', obj.typeId);
        formData.append('draftId', obj.draftId);

        const url = environment.uamBaseUrl + environment.addAnnexure;

        return this.postFormdata(formData, url);
    }
    deleteAnnexure(documentId) {
        const url = environment.uamBaseUrl + environment.deleteAnnexure
            + '?documentId=' + documentId;
        return this.delete(url);
    }
    updateDraft(payload) {
        const url = environment.uamBaseUrl + environment.updateDraft;
        return this.post(payload, url);
    }
    getReservationType(listCode, parentId): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationType + listCode + '&parentItemId=' + parentId;
        return this.get(new HttpParams(), url);
    }
    addDraftSteps(payload) {
        const url = environment.uamBaseUrl + environment.addDraftSteps;
        return this.post(payload, url);
    }
    getAllDraftSteps(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllDraftSteps + draftId);
    }
    getReservationRequest(locationId, provinceId, searchText) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationRequest + locationId
            + '&provinceId=' + provinceId + '&searchTerm=' + searchText);
    }

    addDraftRequest(payload) {
        const url = environment.uamBaseUrl + environment.addDraftRequest;
        return this.post(payload, url);
    }
    deleteDraftRequestById(draftRequestId) {
        const url = environment.uamBaseUrl + environment.deleteDraftRequest
            + '?draftRequestId=' + draftRequestId;
        return this.delete(url);
    }
    processDraftStepsRequest(payload) {
        const url = environment.uamBaseUrl + environment.processDraftStepsRequest;
        return this.post(payload, url);
    }
    checkoutDraft(draftId, workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.checkoutDraft + draftId + '&workflowId=' + workflowId);
    }
    getProfessionlByAssisitantId(assistantId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getProfessionalsByAssistant + assistantId);
    }
    getProfessionalByPPNNumber(ppnNumber) {
        const url = environment.uamBaseUrl + environment.getProfessionalByPPNNumber + ppnNumber;
        return this.get(new HttpParams(), url);
    }
    getReservationDraftByWorkFlowId(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationDraftByWorkFlowId + workflowId);
    }
    getUserByRoleIdProvinceId(provinceId: any, roleId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserByRoleIdProvinceId + provinceId + '&roleId=' + roleId;
        return this.get(new HttpParams(), url);
    }
    generateNumberingForLandParcel(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.generateNumberingForLandParcel + draftId);
    }
    getUserSummaryDistributionByAction(body) {
        const url = environment.uamBaseUrl + environment.getUserSummaryDistributionByAction;
        return this.post(body, url);
    }
    getUserSummaryalertDetails(body) {
        const url = environment.uamBaseUrl + environment.getUserSummaryalertDetails;
        return this.post(body, url);
    }
    getUserSummaryTaskList(body) {
        const url = environment.uamBaseUrl + environment.getUserSummarytaskList;
        return this.post(body, url);
    }
    getWorkflowTasks(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowTasks
            + '?workflowId=' + workflowId);
    }
    sendSMS(phoneNumber: string, body: string): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.sendSMS}${phoneNumber}&smsBody=${body}`;
        return this.get(new HttpParams(), url);
    }
    getAllReferrals(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllReferrals
            + '?workflowId=' + workflowId);
    }

    uploadSupportingDocs(obj) {

        const formData: FormData = new FormData();

        formData.append('file', obj.file);
        formData.append('documentType', obj.documentType);
        formData.append('comment', obj.comment);
        formData.append('userId', obj.userId);
        formData.append('workflowId', obj.workflowId);

        const url = environment.uamBaseUrl + environment.uploadSupportingDocs;

        return this.postFormdata(formData, url);
    }
    downloadWorkflowSupportingDocs(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadWorkflowSupportingDocs
            + '?documentId=' + documentId);
    }
    notifyForReservation(data) {
        const url = environment.uamBaseUrl + environment.notifyForReservation;
        return this.post(data, url);
    }
    getSupportingDocuments(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getSupportingDocuments
            + '?workflowId=' + workflowId);
    }
    getProvinceByCategory() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getProvinceByCategory);
    }

    getListItemsData(dataTypeItemId, listCode): Observable<any> {
        const url = environment.uamBaseUrl + environment.getListItemsData + dataTypeItemId + '&listCode=' + listCode;
        return this.get(new HttpParams(), url);
    }
    getUsersStatistics(payload) {
        const url = environment.uamBaseUrl + environment.getUsersStatistics;
        return this.post(payload, url);
    }
    simulateProcess() {
        const url = environment.uamBaseUrl + environment.simulateProcess;
        return this.get(new HttpParams(), url);
    }
    saveResCond(payload) {
        const url = environment.uamBaseUrl + environment.saveResCond;
        return this.post(payload, url);
    }
    deleteResCond(conditionId) {
        const url = environment.uamBaseUrl + environment.deleteResCond + conditionId;
        return this.delete(url);
    }
    downloadAckLetter(workflowId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadAckLetter + workflowId;
        return this.getFileResponse(url);
    }
    getReservationConditions(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationConditions + draftId);
    }
    closeTask(payload) {
        const url = environment.uamBaseUrl + environment.closeTask;
        return this.post(payload, url);

    }
    reopenTask(payload) {
        const url = environment.uamBaseUrl + environment.reopenTask;
        return this.post(payload, url);

    }
    reassignWorkflow(payload) {
        const url = environment.uamBaseUrl + environment.reassignWorkflow;
        return this.post(payload, url);

    }
    getAllUserByUserType(userType) {
        const url = environment.uamBaseUrl + environment.getAllUserByUserType + '?size=100&userType=' + userType;
        return this.get(new HttpParams(), url);
    }
    paymentDocument(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.paymentDocument
            + '?documentId=' + documentId);
    }
    downloadInvoicePdf(workflowId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadInvoicePdf + workflowId;
        return this.getFileResponse(url);
    }
    etWorkflowUploadedDocument(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowUploadedDocument
            + '?workflowId=' + workflowId + '&documentTypeId=133');
    }
    getInvoiceItemCosting(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.getInvoiceItemCosting;
        return this.post(data, url);
    }
    getWorkflowUploadedDocument(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowUploadedDocument
            + '?workflowId=' + workflowId + '&documentTypeId=133');
    }
    deleteWorkflowDocs(documentId, workflowId) {
        const url = environment.uamBaseUrl + environment.deleteWorkflowDocs
            + '?documentId=' + documentId + '&workflowId=' + workflowId;
        return this.get(new HttpParams(), url);
    }
    addDispatchDetails(data) {
        const url = environment.uamBaseUrl + environment.addDispatchDetails;
        return this.post(data, url);
    }
    partialSaveInvoiceData(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.partialSaveInvoiceData;
        return this.post(data, url);
    }
    getInvoiceData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInvoiceData
            + '?workflowId=' + workflowId);
    }
    getManagerBySectionAndProvince(pid, sid): Observable<any> {
        const url = environment.uamBaseUrl + environment.getManagerBySectionAndProvince + pid + '&sectionItemId=' + sid;
        return this.get(new HttpParams(), url);
    }
    sendToSectionWorkflow(payload) {
        const url = environment.uamBaseUrl + environment.sendToSectionWorkflow;
        return this.post(payload, url);
    }
    getPriorityFlag() {
        const url = environment.uamBaseUrl + environment.getPriorityFlag;
        return this.get(new HttpParams(), url);
    }
    getWorkflowDocument(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowDocument
            + '?workflowId=' + workflowId);
    }
    saveInvoiceData(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveInvoiceData;
        return this.post(data, url);
    }
    downloadCartItemsDoc(documentId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadCartItemsDoc + '?documentId=' + documentId;
        return this.getFileResponse(url);
    }
    uploadDispatchDocsToFtp(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.uploadDispatchDocsToFtp
            + '?workflowId=' + workflowId);
    }
    getTaskDurationDetails(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getTaskDurationDetails
            + '?workflowId=' + workflowId);
    }
    getCartItemDocument(cartItemId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getCartItemDocument
            + '?cartItemId=' + cartItemId);
    }
    createProductivityForWorkflow(workfloId) {
        const url = environment.uamBaseUrl + environment.createProductivityForWorkflow + workfloId;
        return this.get(new HttpParams(), url);
    }
    uploaddispatchDocs(obj) {
        const formData: FormData = new FormData();
        formData.append('file', obj.file);
        formData.append('documentTypeId', obj.documentType);
        formData.append('notes', obj.notes);
        formData.append('userId', obj.userId);
        formData.append('workflowId', obj.workflowId);
        formData.append('cartItemId', obj.cartItemId);

        const url = environment.uamBaseUrl + environment.uploaddispatchDocs;

        return this.postFormdata(formData, url);
    }
    addCartItemDispatchInfo(data) {
        const url = environment.uamBaseUrl + environment.addCartItemDispatchInfo;
        return this.post(data, url);
    }
    getDispatchTemplateData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDispatchTemplateData
            + '?workflowId=' + workflowId);
    }
    getReferralInputData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReferralInputData + workflowId);
    }
    loadTaskFlow(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.loadTaskFlow
            + '?workflowId=' + workflowId);
    }
    updateInvoiceEmailTemplate(payload) {
        const url = environment.uamBaseUrl + environment.updateInvoiceEmailTemplate;
        return this.post(payload, url);
    }
    getOfficeTimingForUserId(userId: number) {
        const url = environment.uamBaseUrl + environment.getOfficeTimingForUserId + userId;
        return this.get(new HttpParams(), url);
    }
    sendDispatchEmail(workflowId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.sendDispatchEmail + workflowId;
        return this.get(new HttpParams(), url);
    }

    getUserHolidays(userId: number) {
        const url = environment.uamBaseUrl + environment.getUserHolidays + userId;
        return this.get(new HttpParams(), url);
    }
    expiditeTask(payload) {
        const url = environment.uamBaseUrl + environment.expiditeTask;
        return this.post(payload, url);

    }
    markWorkflowPending(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.markWorkflowPending;
        return this.post(payload, url);
    }
    previewEmail(workflowId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.previewEmail + workflowId;
        return this.get(new HttpParams(), url);
    }
    downloadZippedDocs(workflowId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadZippedDocs + '?workflowId=' + workflowId);
    }
    getDispatchDocs(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDispatchDocs
            + '?workflowId=' + workflowId);
    }
    changeWorkflowProvince(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.changeWorkflowProvince;
        return this.post(payload, url);
    }
    addDiariseDate(payload) {
        const url = environment.uamBaseUrl + environment.addDiariseDate;
        return this.post(payload, url);

    }

    getReservationTownshipAllotment(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationTownshipAllotment + provinceId);
    }

    getverifyRecord(recordId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.verifyRecord + recordId);
    }

    getReservationTransfers(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationTransfers;
        return this.get(new HttpParams(), url);
    }


    getInboxTask(userId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInboxTasks
            + '?&userId=' + userId);
    }

    addDraftToTransfer(draftId, outcomeId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.addDraftToTransfer + draftId + '&outcomeId=' + outcomeId);
    }

    getAllDraftTransfer(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllDraftTransfer + draftId);
    }

    deleteTransferDraft(draftId) {
        const url = environment.uamBaseUrl + environment.deleteTransferDraft + draftId;
        return this.delete(url);
    }


    getInboxTasks(page, size, activefield, userId, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getInboxTasks
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + '&userId=' + userId + sortData);
    }

    deleteDraftSteps(stepId) {
        const url = environment.uamBaseUrl + environment.deleteDraftSteps + stepId;
        return this.delete(url);
    }

    getConfigByTag(tag) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getConfigByTag + tag);
    }

    getApplicantFeedbacks(applicantId) {
        const url = environment.uamBaseUrl + environment.getApplicantFeedbacks + applicantId;
        return this.get(new HttpParams(), url);
    }

    getWorkflowUserFeedbackYearlyStatus(data) {
        const url = environment.uamBaseUrl + environment.getWorkflowUserFeedbackYearlyStatus;
        return this.post(data, url);
    }

    saveWorkflowUserFeedback(data) {
        const url = environment.uamBaseUrl + environment.saveWorkflowUserFeedback;
        return this.post(data, url);
    }

    saveLodgementDraft(data) {
        const url = environment.uamBaseUrl + environment.saveLodgementDraft;
        return this.post(data, url);
    }

    getAllLodgementDraft() {
        const url = environment.uamBaseUrl + environment.getAllLodgementDraft;
        return this.get(new HttpParams(), url);
    }

    updateLodgementDraft(payload) {
        const url = environment.uamBaseUrl + environment.updateLodgementDraft;
        return this.post(payload, url);
    }

    getLodgementDraftById(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementDraftById + draftId);
    }

    addLodgementAnnexure(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.addLodgementAnnexure);
    }

    // getLodgementAnnexure(draftId: string): Observable<any> {
    //     const url = environment.uamBaseUrl + environment.getLodgementAnnexure + draftId;
    //     return this.getHeaderResponse(new HttpParams(), url);
    // }

    getLodgementAnnexure(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementAnnexure + draftId);
    }

    addLodgementPayment(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.addLodgementPayment);
    }


    getLodgementDraftPayments(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementDraftPayments + draftId);
    }

    getDraftPaymentDocument(paymentId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.getDraftPaymentDocument + paymentId;
        return this.getFileResponse(url);
    }

    getAnnexureDocument(annexureId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.getAnnexureDocument + annexureId;
        return this.getFileResponse(url);
    }

    removeAnnexure(annexureId) {
        const url = environment.uamBaseUrl + environment.removeAnnexure + annexureId;
        return this.delete(url);
    }

    saveLodgementDraftSteps(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveLodgementDraftSteps;
        return this.post(payload, url);
    }

    getAllLodgementDraftSteps(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllLodgementDraftSteps + draftId);
    }


    searchDraftRequest(searchTerm) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchDraftRequest + searchTerm);
    }

    addLodgementDraftRequest(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addLodgementDraftRequest;
        return this.post(payload, url);
    }

    addLodgementRequest(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addLodgementRequest;
        return this.post(payload, url);
    }

    uploadLodgementDocument(formData: any) {

        const url = environment.uamBaseUrl + environment.uploadLodgementDocument;

        return this.postFormdata(formData, url);
    }

    getLdgResDetailDoc(draftId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.getLdgResDetailDoc + draftId;
        return this.getFileResponse(url);
    }

    getLodgementsList(draftId, userId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementsList + draftId + '&userId=' + userId);
    }

    checkoutLodgementDraft(draftId, workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.checkoutLodgementDraft + draftId + '&workflowId=' + workflowId);
    }

    getLodgementDraftByWorkFlowId(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementDraftByWorkFlowId + workflowId);
    }

    deleteLodgementDraftByDraftId(draftRequestId) {
        const url = environment.uamBaseUrl + environment.deleteLodgementDraftByDraftId + draftRequestId;
        return this.delete(url);
    }

    getALlDocumentForRequest(requestId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getALlDocumentForRequest + requestId);
    }

    notifyForLodgement(data) {
        const url = environment.triggerUrl + environment.notifyForLodgement;
        return this.post(data, url);
    }

    deleteLdgResDocument(documentId) {
        const url = environment.uamBaseUrl + environment.deleteLdgResDocument + documentId;
        return this.delete(url);
    }

    deleteDraftPayment(payId) {
        const url = environment.uamBaseUrl + environment.deleteDraftPayment + payId;
        return this.delete(url);
    }

    updateDraftPayment(data) {
        const url = environment.uamBaseUrl + environment.updateDraftPayment;
        return this.post(data, url);
    }

    removeRequestFromStep(requestId) {
        const url = environment.uamBaseUrl + environment.removeRequestFromStep + requestId;
        return this.delete(url);
    }

    addStepsByReservationRef(draftId, referenceNo) {
        debugger;
        let fileRefNo = "Moss";
        let name = "ShaylenLodgement";
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.addStepsByReservationRef + draftId + '&referenceNo=' + referenceNo + '&fileRefNo='+ fileRefNo +'&name=' +name);
    }

    getWorkFlow(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkFlow + workflowId);
    }

    getDocumentSummary(draftId, stepId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDocumentSummary + draftId + '&stepId=' + stepId);
    }

    getReservationSubType(listCode, parentId): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationSubType + listCode + '&parentItemId=' + parentId;
        return this.get(new HttpParams(), url);
    }

    generatePerformaInvoice(draftId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.generatePerformaInvoice + draftId;
        return this.getFileResponse(url);
    }

    issueBatchLodgement(data) {
        const url = environment.uamBaseUrl + environment.issueBatchLodgement;
        return this.post(data, url);
    }

    getLdgDraftAcknowledement(draftId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.getLdgDraftAcknowledement + draftId;
        return this.getFileResponse(url);
    }

    getBatchDetails(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getBatchDetails + draftId);
    }

    getLodgementAllDocument(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLodgementAllDocument + draftId);
    }
}
