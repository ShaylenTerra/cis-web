import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

@Injectable()
export class RestcallService extends BaseService {

    constructor(protected http: HttpClient, public authService: AuthService) {
        super(http, authService);
    }

    tokenAuth(data: any): Observable<any> {
        const url = environment.tokenUrl;
        return this.postAuth(data, url);
    }

    updateSecurityQuestions(data): Observable<any> {
        return this.postTextResponse(data, environment.uamBaseUrl + environment.updateSecurityQuestions);
    }

    listPlsUsers(payload: any, pageNo: any) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.listPlsUsers +
            payload + '?page=' + (pageNo - 1) + '&sort=createdDate,DESC');
    }

    updateInternalUser(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateInternalUser;
        return this.post(data, url);
    }

    deactivateUser(userId: number): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.deactivateUser}${userId}&status=INACTIVE`;
        return this.get(new HttpParams(), url);
    }

    activateUser(userId: number): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.deactivateUser}${userId}&status=ACTIVE`;
        return this.get(new HttpParams(), url);
    }

    getUserList(pageNo: number, pageSize: number, userType: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserList
            + pageNo + '&paged=true&size=' + pageSize + '&sort.sorted=true&userType=' + userType;
        return this.get(new HttpParams(), url);
    }

    getHolidays(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.getHolidays + data;
        return this.get(new HttpParams(), url);
    }

    addHoliday(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addHoliday;
        return this.post(data, url);
    }

    getAllTemplates(id): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllTemplates + id;
        return this.get(new HttpParams(), url);
    }

    addTemplate(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addTemplate;
        return this.post(data, url);
    }

    sendSMS(phoneNumber: string, body: string): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.sendSMS}${phoneNumber}&smsBody=${body}`;
        return this.get(new HttpParams(), url);
    }

    getPdf(formData: FormData): Observable<any> {
        const url = 'http://10.1.15.226:9096/createpdf';
        return this.postFormTextResponse(formData, url);
    }

    getListItems(listId: number): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.getListItems}${listId}`;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    getRoles(roleId: string): Observable<any> {
        const url = `${environment.uamBaseUrl}${environment.getRoles}${roleId}`;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    getProvinces(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getProvinces;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    getLocation(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getLocation;
        return this.get(new HttpParams(), url);
    }

    getDataViewerObjectType(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDataViewerObjectType;
        return this.get(new HttpParams(), url);
    }

    getDataViewerObjectName(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDataViewerObjectName + data;
        return this.get(new HttpParams(), url);
    }

    getDataViewerColumns(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDataViewerColumns + data;
        return this.get(new HttpParams(), url);
    }

    logDataViewerQuery(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.dataViewerLog;
        return this.post(data, url);
    }

    getDataViewerExecuteCustomQuery(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDataViewerExecuteCustomQuery;
        return this.post(data, url);
    }

    registerNewUser(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.registerUser;
        return this.postWithoutAuth(data, url);
    }

    getSecurityQuestions(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getSecurityQuestions;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    getAllFeeCategories(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getFeeCategories;
        return this.get(new HttpParams(), url);
    }

    getAllFeeSubCategories(categoryId): Observable<any> {
        const url = environment.uamBaseUrl + environment.getSubCategories + '?categoryId=' + categoryId;
        return this.get(new HttpParams(), url);
    }

    addCategory(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addCategory;
        return this.post(payload, url);
    }

    saveFeeMaster(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveFeeMaster;
        return this.post(payload, url);
    }

    addSubCategory(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addSubCategory;
        return this.post(payload, url);
    }

    getAllFeeType(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllFeeType;
        return this.get(new HttpParams(), url);
    }

    getFeeMaster(feeScaleId: number, subCatid: number): Observable<any> {
        const url = environment.uamBaseUrl + environment.getFeeMaster
            + '?feeScaleId=' + feeScaleId + '&subCategoryId=' + subCatid;
        return this.get(new HttpParams(), url);
    }

    addNewFeeScale(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addNewFeeSacale;
        return this.postFormdata(data, url);
    }

    getAllFeeScales(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllFeeScale;
        return this.get(new HttpParams(), url);
    }

    updateTemplate(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateTemplate;
        return this.postTextResponse(payload, url);
    }

    getAllInternalPrivileges(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllRolePrivileges;
        return this.get(new HttpParams(), url);
    }

    updateInternalPrevileges(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateInternalPrevileges;
        return this.post(payload, url);
    }

    getHomePageSetting(userId: number): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserHomePageSetting + userId;
        return this.get(new HttpParams(), url);
    }

    saveHomePageSetting(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveUserHomePageSetting;
        return this.post(payload, url);
    }

    getMenuItemByRoleName(roleName: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getMenuByRoleName + roleName;
        return this.get(new HttpParams(), url);
    }

    getUserHolidays(userId: number) {
        const url = environment.uamBaseUrl + environment.getUserHolidays + userId;
        return this.get(new HttpParams(), url);
    }

    activateUserHoliday(leaveId: number, action: string) {
        const url = environment.uamBaseUrl + environment.activateUserHoliday + leaveId + '&status=' + action;
        return this.post('', url);
    }

    createUserHoliday(data) {
        const url = environment.uamBaseUrl + environment.saveUserHoliday;
        return this.postFormdata(data, url);
    }

    getOfficeTimes(provinceCode) {
        const url = environment.uamBaseUrl + environment.getOfficeTimings + String(provinceCode);
        return this.get(new HttpParams(), url);
    }

    getOfficeHolidays(provinceCode) {
        const url = environment.uamBaseUrl + environment.getOfficeHolidays + String(provinceCode);
        return this.get(new HttpParams(), url);
    }

    removeOfficeTime(officeTimeId) {
        const url = environment.uamBaseUrl + environment.updateOfficeTimeStatus + String(officeTimeId) + '&status=0';
        return this.get(new HttpParams(), url);
    }

    addOfficeTiming(payload) {
        const url = environment.uamBaseUrl + environment.addOfficeTiming;
        return this.post(payload, url);
    }

    getAllMasterList() {
        const url = environment.uamBaseUrl + environment.getAllMasterList;
        return this.get(new HttpParams(), url);
    }

    updateListItemStatus(status, itemId) {
        const url = environment.uamBaseUrl + environment.updateListItemStatus + status + '&itemId=' + itemId;
        return this.get(new HttpParams(), url);
    }

    addListItem(payload) {
        const url = environment.uamBaseUrl + environment.addListItem;
        return this.post(payload, url);
    }

    logoutUser(data: any) {
        const url = environment.uamBaseUrl + environment.logoutUser;
        return this.logout(data, url);
    }

    addPLSUser(data) {
        const url = environment.uamBaseUrl + environment.saveProfessional;
        return this.post(data, url);
    }

    updatePLSUser(data) {
        const url = environment.uamBaseUrl + environment.updatePLSUser;
        return this.post(data, url);
    }

    getSearchTypeCriteria(searchTypeParentId: any) {
        const url = environment.uamBaseUrl + environment.getSearchTypeCriteria + searchTypeParentId;
        return this.get(new HttpParams(), url);
    }

    getAllUserTypes() {
        const url = environment.uamBaseUrl + environment.getAllUserTypes;
        return this.get(new HttpParams(), url);
    }

    getExternalUserDataByUserId(userId: number) {
        const url = environment.uamBaseUrl + environment.getExternalUserDataByUserId + userId;
        return this.get(new HttpParams(), url);
    }

    getExternalUserRoleBasedOnUserId(userId: number) {
        const url = environment.uamBaseUrl + environment.getExternalUserRoleBasedOnUserId + userId;
        return this.get(new HttpParams(), url);
    }

    updateSearchTypeOfficeMappings(data) {
        const url = environment.uamBaseUrl + environment.updateSearchTypeOfficeMappings;
        return this.post(data, url);
    }

    searchByNumberSgNo(provCode, sgNo) {
        const url = environment.uamBaseUrl + environment.searchByNumberSgNo + provCode + '&sgNo=' + sgNo;
        return this.get(new HttpParams(), url);
    }

    searchByRefNo(referenceNo) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchMyRequestsByReferenceNo
            + referenceNo);
    }

    getAllSearchTypeOfficeMapping(searchTypeId, userTypes) {
        const url = environment.uamBaseUrl + environment.getAllSearchTypeOfficeMapping + searchTypeId
            + '&userTypes=' + userTypes;
        return this.get(new HttpParams(), url);
    }

    getAllInternalUsers() {
        const url = environment.uamBaseUrl + environment.getAllInternalUsers;
        return this.get(new HttpParams(), url);
    }

    getAllUserByUserType(userType) {
        const url = environment.uamBaseUrl + environment.getAllUserByUserType + '?size=100&userType=' + userType;
        return this.get(new HttpParams(), url);
    }

    addUserDelegations(data) {
        const url = environment.uamBaseUrl + environment.addUserDelegations;
        return this.post(data, url);
    }

    getAllUserDelegations(page, size, userId) {
        const url = environment.uamBaseUrl + environment.getAllUserDelegations
            + page + '&paged=true&size=' + size + '&userId=' + userId;
        return this.get(new HttpParams(), url);
    }

    updateUserDelegations(id, status) {
        const url = environment.uamBaseUrl + environment.updateUserDelegations + id + '&statusItemId=' + status;
        return this.get(new HttpParams(), url);
    }

    getMyRequests(page, size, activefield, userId, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getMyRequests
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + '&userId=' + userId + sortData);
    }

    getInboxTasks(page, size, activefield, userId, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getInboxTasks
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + '&userId=' + userId + sortData);
    }

    getInboxTask(userId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInboxTasks
            + '?&userId=' + userId);
    }

    getWorkflowTasks(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowTasks
            + '?workflowId=' + workflowId);
    }

    getSupportingDocuments(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getSupportingDocuments
            + '?workflowId=' + workflowId);
    }

    getAllWorkflowToReassign(userId) {
        const url = environment.uamBaseUrl + environment.getAllWorkflowToReassign + userId;
        return this.get(new HttpParams(), url);
    }

    getPriorityFlag() {
        const url = environment.uamBaseUrl + environment.getPriorityFlag;
        return this.get(new HttpParams(), url);
    }

    getAllReferrals(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllReferrals
            + '?workflowId=' + workflowId);
    }

    loadTaskFlow(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.loadTaskFlow
            + '?workflowId=' + workflowId);
    }

    getWorkflowDocument(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowDocument
            + '?workflowId=' + workflowId);
    }

    getRequestorInformation(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getRequestorInformation
            + '?workflowId=' + workflowId);
    }

    listItemsByListCode(listCode) {
        return this.getWithoutAuth(new HttpParams(), environment.uamBaseUrl + environment.listItemsByListCode
            + '?listCode=' + listCode);
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

    getCartItemDocument(cartItemId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getCartItemDocument
            + '?cartItemId=' + cartItemId);
    }

    deleteWorkflowDocs(documentId, workflowId) {
        const url = environment.uamBaseUrl + environment.deleteWorkflowDocs
            + '?documentId=' + documentId + '&workflowId=' + workflowId;
        return this.get(new HttpParams(), url);
    }

    reassignWorkflow(payload) {
        const url = environment.uamBaseUrl + environment.reassignWorkflow;
        return this.post(payload, url);

    }

    expiditeTask(payload) {
        const url = environment.uamBaseUrl + environment.expiditeTask;
        return this.post(payload, url);

    }

    addDiariseDate(payload) {
        const url = environment.uamBaseUrl + environment.addDiariseDate;
        return this.post(payload, url);

    }

    cancelTask(payload) {
        const url = environment.uamBaseUrl + environment.cancelTask;
        return this.post(payload, url);

    }

    closeTask(payload) {
        const url = environment.uamBaseUrl + environment.closeTask;
        return this.post(payload, url);

    }

    reopenTask(payload) {
        const url = environment.uamBaseUrl + environment.reopenTask;
        return this.post(payload, url);

    }

    triggertask(data) {
        const url = environment.triggerUrl + environment.triggertask;
        return this.post(data, url);
    }

    processtask(data) {
        const url = environment.triggerUrl + environment.processtask;
        return this.post(data, url);
    }

    getNodeDetails(processId, nodeId) {
        return this.get(new HttpParams(), environment.triggerUrl + environment.getNodeDetails
            + '?processId=' + processId + '&nodeId=' + nodeId);
    }

    getInvoiceData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInvoiceData
            + '?workflowId=' + workflowId);
    }

    getInformationRequestItem(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getInformationRequestItem
            + '?workflowId=' + workflowId);
    }

    getDispatchTemplateData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDispatchTemplateData
            + '?workflowId=' + workflowId);
    }

    addCartItemDispatchInfo(data) {
        const url = environment.uamBaseUrl + environment.addCartItemDispatchInfo;
        return this.post(data, url);
    }

    addDispatchDetails(data) {
        const url = environment.uamBaseUrl + environment.addDispatchDetails;
        return this.post(data, url);
    }

    cartCheckout(data) {
        const url = environment.uamBaseUrl + environment.cartCheckout;
        return this.post(data, url);
    }

    notification(payload) {
        const url = environment.uamBaseUrl + environment.notification;
        return this.post(payload, url);

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

    getSubscriptionNotify(payload) {
        const url = environment.uamBaseUrl + environment.getSubscriptionNotify;
        return this.post(payload, url);
    }

    getScaleDoc(feeScaleId, fileName): Observable<any> {
        const url = environment.uamBaseUrl + environment.getScaleDoc
            + '?feeScaleId=' + feeScaleId + '&fileName=' + fileName;
        return this.getFileResponse(url);
    }

    addPrePackageConfig(payload) {
        const formData: FormData = new FormData();
        formData.append('prePackageId', payload.prePackageId);
        formData.append('sampleImageFile', payload.sampleImageFile);
        formData.append('transactionId', payload.transactionId);
        formData.append('sampleFileName', payload.sampleFileName);
        formData.append('prePackageDataType', payload.prePackageDataType);
        formData.append('name', payload.name);
        formData.append('folder', payload.folder);
        formData.append('description', payload.description);
        formData.append('cost', payload.cost);
        formData.append('configurationData', payload.configurationData);
        formData.append('active', payload.active);
        const url = environment.uamBaseUrl + environment.addPrePackageConfig;
        return this.postFormdata(formData, url);

    }


    getSearchData(page, size, activefield, userId, sortData) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl + environment.getSearchData
            + '?page=' + page + '&size=' + size + '&sort=' + activefield + '&userId=' + userId + sortData);
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

    sectionalFarmSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalFarmSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
    }

    sectionalErfSearch(payload, pageNo) {
        const url = environment.uamBaseUrl + environment.sectionalErfSearch + (pageNo - 1);
        return this.postHeaderResponse(payload, url);
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

    getAllMunicipalitiesByProvinceCode(provinceCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllMunicipalitiesByProvinceCode
            + '?provinceCode=' + provinceCode);
    }

    getMunicipality(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMunicipality
            + '?provinceId=' + provinceId);
    }

    getMajorRegionOrAdminDistrict(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMajorRegionOrAdminDistrict
            + '?provinceId=' + provinceId + '&size=' + 500);
    }

    getMinorRegion(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getMinorRegion
            + '?provinceId=' + provinceId + '&size=' + 500);
    }


    getTownship(provinceCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getTownship
            + '?provinceCode=' + provinceCode);
    }

    getSearchFilterByProvince(parentSearchTypeId, provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getSearchTypeByProvince
            + '?parentSearchTypeId=' + parentSearchTypeId + '&provinceId=' + provinceId + '&userTypes=INTERNAL');
    }

    downloadSampleTemplate(filterType): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadSampleTemplate + '?type=' + filterType;
        return this.getFileResponse(url);
    }

    addToCart(payload) {
        const url = environment.uamBaseUrl + environment.addToCart;
        return this.post(payload, url);
    }

    downloadZippedImages(payload) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.downloadZippedImages);
    }

    getCartDetails(userId) {
        const url = environment.uamBaseUrl + environment.getCartDetails + userId;
        return this.get(new HttpParams(), url);
    }

    getPrepackagedImage(prepackagedId: any) {
        return this.getFileResponse(environment.uamBaseUrl + environment.getPrepackagedImage
            + '?prepackageId=' + prepackagedId);
    }

    subscribePrePackageConfigs(data) {
        const url = environment.uamBaseUrl + environment.subscribePrePackageConfigs;
        return this.post(data, url);
    }

    getAllSubscriptionByUser(userid: any) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllSubscriptionByUser
            + '?userId=' + userid);
    }

    updateSubscriptionStatus(subscriptionId: any, subscriptionStatus: any, useid: any) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.updateSubscriptionStatus
            + '?subscriptionId=' + subscriptionId + '&subscriptionStatus=' + subscriptionStatus + '&userId=' + useid);
    }

    emptyCart(cartId) {
        const url = environment.uamBaseUrl + environment.emptyCart + cartId;
        return this.get(new HttpParams(), url);
    }

    removeCartItem(cartId, cartStageDataId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.removeCart
            + '?cartId=' + cartId + '&cartStageDataId=' + cartStageDataId);
    }

    updateCart(data) {
        const url = environment.uamBaseUrl + environment.updateCart;
        return this.post(data, url);
    }

    notificationForWorkflowRequest(data) {
        return this.post(data, environment.uamBaseUrl + environment.workflowNotification);
    }

    uploadSupportingDocument(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.uploadSupportingDocument);
    }

    getTextSearch(data, pageNo): Observable<any> {
        const url = environment.uamBaseUrl + environment.getTextSearch + (pageNo - 1);
        return this.postHeaderResponse(data, url);
    }

    getWorkflowBasedItem(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowBasedItem
            + '?workflowId=' + workflowId);
    }

    getWorkflowDataForRequestType(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowDataForRequestType
            + '?workflowId=' + workflowId);
    }

    saveInvoiceData(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveInvoiceData;
        return this.post(data, url);
    }

    partialSaveInvoiceData(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.partialSaveInvoiceData;
        return this.post(data, url);
    }

    getAllSiteRolesWithAllPrivileges(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllSiteRolesWithAllPrivileges;
        return this.get(new HttpParams(), url);
    }

    getAllSiteMap(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllSiteMap;
        return this.get(new HttpParams(), url);
    }

    updateSiteMapRole(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.updateSiteMapRole;
        return this.post(payload, url);
    }

    getSiteMapItemByRoleId(roleId: number): Observable<any> {
        const url = environment.uamBaseUrl + environment.getSiteMapByRoleId + roleId;
        return this.get(new HttpParams(), url);
    }

    getInvoiceItemCosting(data): Observable<any> {
        const url = environment.uamBaseUrl + environment.getInvoiceItemCosting;
        return this.post(data, url);
    }

    getAllProviceAddress(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getProvinces;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    updateprovinceAddress(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.saveProvinceAddress;
        return this.post(payload, url);
    }

    getAddressBasedOnProvinceId(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAddressBasedOnProvinceId
            + '?provinceId=' + provinceId);
    }

    deleteHoliday(data: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.deleteHoliday;
        return this.post(data, url);
    }

    uploadProofOfPayment(formData: any): Observable<any> {
        return this.postFormdata(formData, environment.uamBaseUrl + environment.uploadProofOfPayment);
    }

    generateInvoicePdf(workflowId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.generateInvoicePdf + workflowId;
        return this.getFileResponse(url);
    }

    downloadCartItemsDoc(documentId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadCartItemsDoc + '?documentId=' + documentId;
        return this.getFileResponse(url);
    }

    downloadInvoicePdf(workflowId): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadInvoicePdf + workflowId;
        return this.getFileResponse(url);
    }

    getPaymentInfo(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getPaymentInfo
            + '?workflowId=' + workflowId);
    }

    markWorkflowPending(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.markWorkflowPending;
        return this.post(payload, url);
    }

    changeWorkflowProvince(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.changeWorkflowProvince;
        return this.post(payload, url);
    }

    getWorkflowUploadedDocument(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getWorkflowUploadedDocument
            + '?workflowId=' + workflowId + '&documentTypeId=133');
    }

    paymentDocument(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.paymentDocument
            + '?documentId=' + documentId);
    }

    downloadSgDataImage(payload) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.downloadSgDataImage);
    }

    activateUserStatus(status: any, userId: number): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.activateUserStatus
            + '?status=' + status + '&userId=' + userId);
    }

    deleteUserLeave(data) {

        const url = environment.uamBaseUrl + environment.deleteUserLeave;

        return this.post(data, url);

    }

    downloadUserLeaveSupportingDocuments(leaveID, contestTypeID) {

        const url = environment.uamBaseUrl + environment.downloadLeaveDocument + '?contextId='
            + leaveID + '&contextTypeId=' + contestTypeID;

        return this.getFileResponse(url);

    }
    getUserLeaveSupportingDocuments(leaveID, contestTypeID) {
        const url = environment.uamBaseUrl + environment.getLeaveDocument + '?contextId='
            + leaveID + '&contextTypeId=' + contestTypeID;
        return this.get(new HttpParams(), url);

    }


    getLeaveForReview(userRoleId: number) {

        const url = environment.uamBaseUrl + environment.getLeaveforReview + userRoleId;

        return this.get(new HttpParams(), url);

    }


    reviewUserLeaves(leaveId: number, action: string, note: string, loggedInUser: number) {

        const url = environment.uamBaseUrl + environment.activateUserHoliday + leaveId + '&status=' + action + '&note=' + note + '&loggedInUser=' + loggedInUser;

        return this.post('', url);

    }

    getDispatchDocs(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDispatchDocs
            + '?workflowId=' + workflowId);
    }

    downloadZippedDocs(workflowId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadZippedDocs + '?workflowId=' + workflowId);
    }

    uploadDispatchDocsToFtp(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.uploadDispatchDocsToFtp
            + '?workflowId=' + workflowId);
    }

    simulateProcess() {
        const url = environment.uamBaseUrl + environment.simulateProcess;
        return this.get(new HttpParams(), url);
    }

    getTaskDurationDetails(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getTaskDurationDetails
            + '?workflowId=' + workflowId);
    }

    downloadWorkflowSupportingDocs(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadWorkflowSupportingDocs
            + '?documentId=' + documentId);
    }

    getOfficeTimingForUserId(userId: number) {
        const url = environment.uamBaseUrl + environment.getOfficeTimingForUserId + userId;
        return this.get(new HttpParams(), url);
    }

    getDataProfileFromLpiCode(lpicode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getDataProfileFromLpiCode + lpicode);
    }

    getUsersStatistics(payload) {
        const url = environment.uamBaseUrl + environment.getUsersStatistics;
        return this.post(payload, url);
    }

    addRole(payload) {
        const url = environment.uamBaseUrl + environment.addRole;
        return this.post(payload, url);
    }
    getUserNotification(loggedInUserId) {
        const url = environment.uamBaseUrl + environment.getUserNotification + loggedInUserId;
        return this.get(new HttpParams(), url);
    }
    addUserNotification(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.addUserNotification;
        return this.post(payload, url);
    }

    createProductivityForWorkflow(workfloId) {
        const url = environment.uamBaseUrl + environment.createProductivityForWorkflow + workfloId;
        return this.get(new HttpParams(), url);
    }

    getUserByUserID(userID) {
        const url = environment.uamBaseUrl + environment.getUserByUserId + userID;
        return this.get(new HttpParams(), url);
    }

    getDataViewerRequest(userID) {
        const url = environment.uamBaseUrl + environment.getDataViewerRequest + userID;
        return this.get(new HttpParams(), url);
    }

    getTopCountersForinformationRequest(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getTopCountersForinformationRequest;
        return this.post(payload, url);
    }

    getTopCountersForProcessSummary(payload) {
        const url = environment.uamBaseUrl + environment.getTopCountersForProcessSummary;
        return this.post(payload, url);
    }

    getProcessSummaryClosedRequests(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryClosedRequests;
        return this.post(payload, url);
    }

    getProcessSummaryOpenRequests(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryOpenRequests;
        return this.post(payload, url);
    }

    getProcessSummaryManagerAlerts(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryManagerAlerts;
        return this.post(payload, url);
    }

    getProcessSummaryBilling(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummarybilling;
        return this.post(payload, url);
    }

    getProcessSummaryTaskDistibution(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryrequestDistributionMonthly;
        return this.post(payload, url);
    }

    getProcessSummaryRequestDistibution(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryinvoiceDistributionMonthly;
        return this.post(payload, url);
    }

    getTaskDistributionAfterTurnaroundTime(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getTaskDistributionAfterTurnaroundTime;
        return this.post(payload, url);
    }

    gettaskDistributionBeforeTurnaroundTime(payload: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.gettaskDistributionBeforeTurnaroundTime;
        return this.post(payload, url);
    }

    getIRTaskDistributionByMonth(payload: any) {
        const url = environment.uamBaseUrl + environment.getIRTaskDistributionByMonth;
        return this.post(payload, url);
    }

    getTaskDistributionByRole(payload: any) {
        const url = environment.uamBaseUrl + environment.getTaskDistributionByRole;
        return this.post(payload, url);
    }

    getTaskDistributionByUser(payload: any) {
        const url = environment.uamBaseUrl + environment.getTaskDistributionByUser;
        return this.post(payload, url);
    }

    getUserSummaryTotalTask(body) {
        const url = environment.uamBaseUrl + environment.getUserSummaryTotalTask;
        return this.post(body, url);
    }

    getUserRegistrationTopCounter(body) {
        const url = environment.uamBaseUrl + environment.getUserRegistrationTopCounter;
        return this.post(body, url);
    }

    getUserSummaryTaskAfterTurnaroundTime(body) {
        const url = environment.uamBaseUrl + environment.getUserSummaryTaskAfterTurnaroundTime;
        return this.post(body, url);
    }

    getUserSummaryTaskBeforeTurnaroundTime(body) {
        const url = environment.uamBaseUrl + environment.getUserSummaryTaskBeforeTurnaroundTime;
        return this.post(body, url);
    }

    userSummaryGetMonthlyTaskDuration(body) {
        const url = environment.uamBaseUrl + environment.userSummaryGetMonthlyTaskDuration;
        return this.post(body, url);
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

    getProcessSummaryAlertList(payload) {
        const url = environment.uamBaseUrl + environment.getProcessSummaryAlertList;
        return this.post(payload, url);
    }

    getinvoiceOverviewStatus(payload) {
        const url = environment.uamBaseUrl + environment.getinvoiceOverviewStatus;
        return this.post(payload, url);
    }

    getexecutePrepackageSubscriptionChange() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.executePrepackageSubscriptionChange);
    }

    getexecutePrepackageSubscription() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.executePrepackageSubscription);
    }
    getOfficeTimingByProvinceIdAndDate(fromDate, provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getOfficeTimingByProvinceIdAndDate
            + '?fromDate=' + fromDate + '&provinceId=' + provinceId);
    }

    getPrepackageExecutionStatus(subscriptionId): Observable<any> {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getPrepackageExecutionStatus
            + '?size=500' + '&subscriptionId=' + subscriptionId);
    }
    getRelatedDateForLpicode(lpiCode, pageNo) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getRelatedDataForLpi +
            '?lpiCode=' + lpiCode + '&page=' + pageNo);
    }

    getRelatedDateDetailForLpiCodeAndSgno(lpiCode, sgno) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getRelatedDataDetailsForLpi
            + '?lpiCode=' + lpiCode + '&sgno=' + sgno);
    }

    getLpiNotes(lpiCode) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getLpiNotes
            + '?lpi=' + lpiCode);
    }

    saveLpiNote(payload) {
        const url = environment.uamBaseUrl + environment.saveLpiNote;
        return this.post(payload, url);
    }

    verifyIfUserNameExist(userName: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.verifyIfUserNameExist + userName;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    getProfileImage() {
        return this.getFileResponse(environment.uamBaseUrl + environment.getUserDisplayImage);
    }

    updateProfileImage(payload: any) {
        return this.postFileResponse(payload, environment.uamBaseUrl + environment.saveUserProfileImage);
    }

    getUserMetaData(userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserMetaData + userId;
        return this.get(new HttpParams(), url);
    }

    saveUserMetaData(payload) {
        const url = environment.uamBaseUrl + environment.saveUserMetaData;
        return this.post(payload, url);
    }

    getUserRole(userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserRoles + userId;
        return this.get(new HttpParams(), url);
    }

    saveUserRole(payload) {
        const url = environment.uamBaseUrl + environment.saveUserRole;
        return this.post(payload, url);
    }

    updatePersonalInfo(payload) {
        const url = environment.uamBaseUrl + environment.updatePersonalInfo;
        return this.post(payload, url);
    }

    getUserDocuments(docType: string, userId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserDocuments + docType + '&userId=' + userId;
        return this.get(new HttpParams(), url);
    }

    downloadUserSupportingDocument(id): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadUserDocument + id;
        return this.getFileResponse(url);
    }

    getDisplayProfileImage(userId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.getDisplayImageByUserId + userId);
    }

    saveProfessional(payload) {
        const url = environment.uamBaseUrl + environment.saveProfessional;
        return this.post(payload, url);
    }

    getDcoumentForRecord(recordId: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getDcoumentForRecord + recordId;
        return this.getHeaderResponse(new HttpParams(), url);
    }

    getInformationType(documentSubtype: string, documentType: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getInformationType + 'documentSubtype=' +
            documentSubtype + '&documentType=' + documentType;
        return this.get(new HttpParams(), url);
    }

    deleteUserRole(userRoleId) {
        const url = environment.uamBaseUrl + environment.deleteUserRole + userRoleId;
        return this.delete(url);
    }

    getUsersList(pageNo: number, userType: string): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserList
            + (pageNo - 1) + '&paged=true&sort=createdDate,DESC&userType=' + userType;
        return this.getHeaderResponse(new HttpParams(), url);
    }

    getSystemConfiguration(): Observable<any> {
        const url = environment.uamBaseUrl + environment.SystemConfiguration;
        return this.get(new HttpParams(), url);
    }

    saveSystemConfiguration(payload) {
        const url = environment.uamBaseUrl + environment.SystemConfiguration;
        return this.post(payload, url);
    }

    saveListItemDataColl(payload) {
        const url = environment.uamBaseUrl + environment.saveListItemDataColl;
        return this.post(payload, url);
    }

    removeSystemConfiguration(id) {
        const url = environment.uamBaseUrl + environment.SystemConfiguration + '/' + id;
        return this.delete(url);
    }

    getUserByRoleIdProvinceId(provinceId: any, roleId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getUserByRoleIdProvinceId + provinceId + '&roleId=' + roleId;
        return this.get(new HttpParams(), url);
    }

    previewEmail(workflowId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.previewEmail + workflowId;
        return this.get(new HttpParams(), url);
    }

    updateInvoiceEmailTemplate(payload) {
        const url = environment.uamBaseUrl + environment.updateInvoiceEmailTemplate;
        return this.post(payload, url);
    }

    sendDispatchEmail(workflowId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.sendDispatchEmail + workflowId;
        return this.get(new HttpParams(), url);
    }

    getAllRoleBasedReportsByModuleId(reportModuleId: any): Observable<any> {
        const url = environment.uamBaseUrl + environment.getAllRoleBasedReportsByModuleId + reportModuleId;
        return this.get(new HttpParams(), url);
    }

    getUserSummaryReport(payload) {
        const url = environment.uamBaseUrl + environment.getUserSummaryReport;
        return this.postFileResponse(payload, url);
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

    getReferralInputData(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReferralInputData + workflowId);
    }

    imageConfig() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.imageConfig);
    }

    getTemplateHistory(id): Observable<any> {
        const url = environment.uamBaseUrl + environment.getTemplateHistory + id;
        return this.get(new HttpParams(), url);
    }

    listActiveRolesBySectionId(id): Observable<any> {
        const url = environment.uamBaseUrl + environment.listActiveRolesBySectionId + id;
        return this.getWithoutAuth(new HttpParams(), url);
    }

    listAllRolesBySectionId(id): Observable<any> {
        const url = environment.uamBaseUrl + environment.listAllRolesBySectionId + id;
        return this.get(new HttpParams(), url);
    }

    downloadTemplateSearchResultFile(id): Observable<Blob> {
        const url = environment.uamBaseUrl + environment.downloadTemplateSearchResultFile + id;
        return this.getFileResponse(url);
    }

    getManagerBySectionAndProvince(pid, sid): Observable<any> {
        const url = environment.uamBaseUrl + environment.getManagerBySectionAndProvince + pid + '&sectionItemId=' + sid;
        return this.get(new HttpParams(), url);
    }

    sendToSectionWorkflow(payload) {
        const url = environment.uamBaseUrl + environment.sendToSectionWorkflow;
        return this.post(payload, url);
    }

    addBulkToCart(payload) {
        const url = environment.uamBaseUrl + environment.addBulkToCart;
        return this.post(payload, url);
    }

    resetPassword(email): Observable<any> {
        const url = environment.uamBaseUrl + environment.resetPassword + email;
        return this.get(new HttpParams(), url);
    }

    getNgiSearchResult(payload) {
        const url = environment.uamBaseUrl + environment.getNgiSearchResult;
        return this.post(payload, url);
    }

    updateListItemIsDefault(itemId, listCode, setDefault) {
        const url = environment.uamBaseUrl + environment.updateListItemIsDefault + itemId + '&listCode=' + listCode
            + '&setDefault=' + setDefault;
        return this.get(new HttpParams(), url);
    }

    getReservationType(listCode, parentId): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationType + listCode + '&parentItemId=' + parentId;
        return this.get(new HttpParams(), url);
    }

    getReservationSubType(listCode, parentId): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationSubType + listCode + '&parentItemId=' + parentId;
        return this.get(new HttpParams(), url);
    }

    getReservationTownshipAllotment(provinceId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationTownshipAllotment + provinceId);
    }

    processReservation(payload) {
        const url = environment.uamBaseUrl + environment.processReservation;
        return this.post(payload, url);
    }

    getListItemsData(dataTypeItemId, listCode): Observable<any> {
        const url = environment.uamBaseUrl + environment.getListItemsData + dataTypeItemId + '&listCode=' + listCode;
        return this.get(new HttpParams(), url);
    }

    getProvinceByCategory() {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getProvinceByCategory);
    }

    saveLocationReservationSystem(payload) {
        const url = environment.uamBaseUrl + environment.saveLocationReservationSystem;
        return this.post(payload, url);
    }

    getReservationSystemNonProvinceLocations(parentBoundaryId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationSystemNonProvinceLocations + parentBoundaryId);
    }

    searchUserByKey(keyValue) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.searchUserByKey + keyValue);
    }

    saveReservationDraft(payload) {
        const url = environment.uamBaseUrl + environment.saveReservationDraft;
        return this.post(payload, url);
    }

    getAllReservationDraft(peocessId) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllReservationDraft + peocessId);
    }

    getReservationDraftById(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationDraftById + draftId);
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

    downloadWorkAnnexureFile(documentId) {
        return this.getFileResponse(environment.uamBaseUrl + environment.downloadWorkAnnexureFile + documentId);
    }

    addDraftSteps(payload) {
        const url = environment.uamBaseUrl + environment.addDraftSteps;
        return this.post(payload, url);
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

    getAllDraftSteps(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAllDraftSteps + draftId);
    }

    getAnnexurebyDraftId(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getAnnexure + draftId);
    }

    processDraftStepsRequest(payload) {
        const url = environment.uamBaseUrl + environment.processDraftStepsRequest;
        return this.post(payload, url);
    }

    updateDraft(payload) {
        const url = environment.uamBaseUrl + environment.updateDraft;
        return this.post(payload, url);
    }

    getAllReservationWorkflow(processId, userId) {
        return this.getHeaderResponse(new HttpParams(), environment.uamBaseUrl
            + environment.getAllReservationWorkflow + processId + '&userId=' + userId);
    }

    deleteDraftByDraftId(draftRequestId) {
        const url = environment.uamBaseUrl + environment.deleteDraftByDraftId + draftRequestId;
        return this.delete(url);
    }

    checkoutDraft(draftId, workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.checkoutDraft + draftId + '&workflowId=' + workflowId);
    }

    getReservationDraftByWorkFlowId(workflowId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationDraftByWorkFlowId + workflowId);
    }

    generateNumberingForLandParcel(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.generateNumberingForLandParcel + draftId);
    }

    updateListItem(payload) {
        const url = environment.uamBaseUrl + environment.updateListItem;
        return this.post(payload, url);
    }

    getReservationConditions(draftId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.getReservationConditions + draftId);
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

    notifyForReservation(data) {
        const url = environment.uamBaseUrl + environment.notifyForReservation;
        return this.post(data, url);
    }

    getProfessionalByPPNNumber(ppnNumber) {
        const url = environment.uamBaseUrl + environment.getProfessionalByPPNNumber + ppnNumber;
        return this.get(new HttpParams(), url);
    }

    getverifyRecord(recordId) {
        return this.get(new HttpParams(), environment.uamBaseUrl + environment.verifyRecord + recordId);
    }

    getReservationTransfers(): Observable<any> {
        const url = environment.uamBaseUrl + environment.getReservationTransfers;
        return this.get(new HttpParams(), url);
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
        const url = environment.uamBaseUrl + environment.notifyForLodgement;
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

    /* Examination Requests */

   saveExamination(examination){
       const url = environment.uamBaseUrl + environment.saveExaminatiion;
       return this.post(examination,url);
   }
       
   getExaminationById(examination){
    //const url = environment.uamBaseUrl + environment.getExaminationById;
    return this.get(new HttpParams(),environment.uamBaseUrl + environment.getExaminationById + examination);
   }

   getExaminationByWorkflowId(workflowId){
    return this.get(new HttpParams(),environment.uamBaseUrl + environment.getExaminationByWorkflowId + workflowId);
   }

}

