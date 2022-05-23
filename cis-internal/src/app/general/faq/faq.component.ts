import {Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
    searchedTerm: any;
    faqData: any [];
    constructor(private dom: DomSanitizer) {
        this.faqData = [
            {'title': 'What is a Diagram?', 'details': '<p>' +
            'The <strong>diagram</strong> is the fundamental registerable document prepared by the professional land' +
            'surveyor. The essential information shown on a diagram is:' +
            '</p>' +
            '<ul>' +
            '<li>The unique designation of the property.</li>' +
            '<li>An illustration depicting the property.</li>' +
            '<li>The boundary description listing the corner beacons and the details of any curvilinear boundary.' +
            '</li>' +
            '<li>Descriptions of the corner beacons.</li>' +
            '<li>A table listing the numerical data of the boundaries.</li>' +
            '<li>The area of the property.</li>' +
            '</ul>' +
            '<p>' +
            'The Surveyor-General gives each diagram a unique reference number. The most common type of diagram is a' +
            '<strong>subdivisional diagram</strong>. This is framed for the purpose of cutting off a portion of a' +
            'parent property. To view an example of a subdivisional diagram, click here. There are other types of' +
            'diagrams however, including:' +
            '</p>' +
            '<ul>' +
            '<li><strong>Servitude diagrams</strong> for registering servitudes over an existing property.</li>' +
            '<li><strong>Lease diagrams</strong> for registering long leases over portions of properties.</li>' +
            '<li><strong>Consolidation diagrams</strong> when it is required to consolidate several individual' +
            'properties into one, taking out certificates of consolidated title.' +
            '</li>' +
            '<li><strong>Mineral diagrams</strong> to register mineral rights separately from the land rights.</li>' +
            '<li><strong>Mining title diagrams</strong> for registering the right to extract minerals from the land.' +
            '</li>' +
            '</ul>' +
            '<p>' +
            'With the exception of mining title diagrams, which are registered with the Department of Minerals and' +
            'Energy, these diagrams are registered together with their deeds in a deeds registry.' +
        '</p>'},
            {'title': 'What is a General Plan?', 'details': '<p>' +
            'In the case of the subdivision of a piece of land into a number of pieces, the land surveyor usually' +
            'prepares a general plan instead of individual diagrams. This is a document showing the relative position' +
            'of two or more pieces of land together with the' +
            'same essential information in respect of each piece as is required on a diagram. It is also allocated a' +
            'unique reference number by the Surveyor-General. It is compulsory to prepare a general plan for any' +
            'subdivision into ten or more pieces' +
            'of land and when required in terms of any law, usually for township establishment or the amendment of an' +
            'existing general plan. General plans may comprise many sheets and depict a very large number of erven' +
            '(lots). To view an example of' +
            'a small general plan. <a href=' + 'http://csg.dla.gov.za/csg_images/genplan.gif' + ' target=' + '_blank' + '>Click' +
            'Here</a>' +
        '</p>'},
            {'title': 'What is a Section Title Plan?', 'details': '<p>' +
            'With the promulgation of the Sectional Title Act in 1971, it became possible for the first time in South' +
            'Africa, for portions of buildings to be separately owned. The 1971 Act has since been replaced by' +
            'Sectional Title Act 95 of 1986, and the new Act' +
            'made the Surveyor-General' + 's office responsible for examining and approving Sectional Plans before they' +
            'can be accepted in a Deeds Registry for opening a Sectional Title Register. Plans can be prepared by' +
            'land surveyors or architects who' +
            'have passed a special examination, although that sheet of the plan showing the positioning of the' +
            'buildings in relation to the land, known as the block plan, must be prepared by a land surveyor. The' +
            'individual sections are shown in relation' +
            'to the buildings in a simple diagrammatic manner and the floor area of each section is tabulated. The' +
            'proportion of the total floor area included in each section is listed and from this is determined the' +
            'proportional levy each owner has' +
            'to pay. To view extracts from a sectional plan. <a href=' + 'http://csg.dla.gov.za/csg_images/sectplan.gif' +
            'target=' + '_blank' + '>Click Here</a>' +
        '</p>'},
            {'title': 'What is a 21 Character Key?', 'details': '<div class=' + 'container-fluid' + '>' +
            '<p>' +
            '<strong>Alphanumeric Data - The Key (21 digits) of the Cadastral Land Parcel</strong> Examples of' +
            'this 21-digit code are as follows:' +
            '</p>' +
            '<table>' +
            '<tr>' +
            '<td>' +
            '<strong>T0IQ00990000012300001</strong>' +
            '</td>' +
            '<td>' +
            'Portion 1 of Holding 123 in Eldorado Agricultural Hodings in the Registration Division of IQ' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<strong>N0FU00990000012300001</strong>' +
                    '</td>' +
                    '<td>' +
                        'Portion 1 of Erf 123 in the Township of Everest Heights in the Registration Division of FU' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' +
                    '<strong>C01300140000012300000</strong>' +
                    '</td>' +
                    '<td>' +
                    'Erf 123 in the Allotment Area of Kleinmond in the Administrative Division of Caledon' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>F00300110000012300001</strong>' +
                    '</td>' +
                    '<td>' +
                    'Portion 1 of Erf 123 in the Township of Pentagon Park in the Administrative District of' +
                    'Bloemfontein' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>T0JR00000000012300001</strong>' +
                    '</td>' +
                    '<td>' +
                    'Portion 1 of Farm 123 in the Registration Division of JR' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>C00100000000012300001</strong>' +
                    '</td>' +
                    '<td>' +
                    'Portion 1 of Farm 123 in the Administrative District of Cape' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>C00100000000012300000</strong>' +
                    '</td>' +
                    '<td>' +
                    'The Farm 123 in the Administrative District of Cape' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '<br>' +
                    '<p>' +
                    'The key is compiled as follows:' +
                    '</p>' +
                    '<table>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>T</strong>' +
                    '</td>' +
                    '<td>' +
                    'refers to the Surveyor' + 's-General Office: T = Pretoria F = Free State C = Cape Town N =' +
                    'Kwazulu-Natal' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>0IQ</strong>' +
                    '</td>' +
                    '<td>' +
                    'refers to the Registration division used for registration in a deeds office in the old' +
                    'Transvaal and in Kwazulu-Natal. Examples = <strong>JR, IQ, FU</strong> This is a coded Map' +
                    'reference for a Degree Square with its origin' +
                    'at <strong>3411 = AA Latitude</strong> 33 will be equal to B, 32 = C, etc. with <strong>I =' +
                    '26</strong> degrees of latitude.' +
                    '<strong>Longitude</strong> 12 = B, 13 = C, etc. with <strong>Q = 27</strong> degrees of' +
                    'longitude.Thus, the registration division <strong>0IQ</strong> (zero IQ) refers to' +
                    'registration division in the Degree Square <strong>2627</strong>.' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>' +
                    '<p>001 013</p>' +
                    '<p>003</p>' +
                    '</strong>' +
                    '</td>' +
                    '<td>' +
                    'refers to the numeric code for Administrative Districts used for registration in the old' +
                    'Cape and Freestate provinces (the numeric code has been created for computerisation purposes' +
                    'only). Examples: Cape, Caledon, Bloemfontein, etc.' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>' +
                    '<p>0099</p>' +
                    '<p>0011</p>' +
                    '<p>0014</p>' +
                    '</strong>' +
                    '</td>' +
                    '<td>' +
                    'refers to the numeric code for townships / holdings in the Pretoria, Bloemfontein, and' +
                    'Pietermaritzburg SG offices, and to an Allotment area in the Cape Town SG office.' +
                    '<strong>Examples:</strong> 0099 is the numeric code for Eldorado Agricultural Holdings. The' +
                    'numbering of the holdings in Eldorado AH and its extensions are all consecutive under the' +
                    'name of Eldorado AH. Thus, in Natal, 0099' +
                    'is the numeric code for the township of Everest Heights. 0014 in Cape Town refers to the' +
                    'numeric code of Kleinmond Allotment Area, being a demarcated urban area within which erven' +
                    'are numbered consecutively. Such an Allotment' +
                    'Area can include portions of farm land which have urban designations (Erf). An Allotment' +
                    'Area can also include different townships. The numbering of the erven in such townships will' +
                    'relate to the numbering of the Allotment' +
                    'Area. There are no portions of erven in the Cape Town SG office.' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>0000</strong>' +
                    '</td>' +
                    '<td>' +
                    'If the Township / Allotment Area code = 0000 then the designation is that of a farm.' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>00000123</strong>' +
                    '</td>' +
                    '<td>' +
                    'This is the Parcel number: Erf / Holding / Farm number <strong>Erf 123 / Holding 123 / Farm' +
                    '123</strong>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>00001</strong>' +
                    '</td>' +
                    '<td>' +
                    'This refers to the portions of the Erf / Holding / Farm' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '<br>' +
                    '<p>' +
                    '<strong>Example of Portion 1 of Erf 2464 Pietermaritzburg</strong> KEY = N0FT02580000246400001' +
                    '</p>' +
                    '<table>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>Key Example</strong>' +
                    '</td>' +
                    '<td>' +
                    '<strong>No of Places</strong>' +
                    '</td>' +
                    '<td>' +
                    '<strong>Description</strong>' +
                    '</td>' +
                    '<td></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>N</strong>' +
                    '</td>' +
                    '<td>1</td>' +
                    '<td>' +
                    '<strong>SG Office</strong> N = Pietermaritzburg' +
                    '</td>' +
                    '<td>' +
                    '<img src=' + 'assets/images/t1.gif' + '>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>0FT</strong>' +
                    '</td>' +
                    '<td>3</td>' +
                    '<td>' +
                    '<strong>Major Region</strong> In Kwazulu-Natal this is the Registration Division of which' +
                    'there are 14: HS HT HU HV GS GT GU GV FS FT FU ER ES ET' +
                    '</td>' +
                    '<td>' +
                    '<img src=' + 'assets/images/t2.gif' + '>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>0258</strong>' +
                    '</td>' +
                    '<td>4</td>' +
                    '<td>' +
                    '<strong>Minor Region</strong> A region code has been allocated to each town. The region code' +
                    'for a farm is 0000.' +
                    '</td>' +
                    '<td>' +
                    '<img src=' + 'assets/images/t3.gif' + '>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<strong>0000246400001</strong>' +
                    '</td>' +
                    '<td>8 5</td>' +
                    '<td>' +
                    '<strong>Erf / Farm NumberPortion Number </strong>' +
                    '</td>' +
                    '<td>' +
                    '<img src=' + 'assets/images/t4.gif' + '>' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '<br>' +
                    '<p>' +
                    '<strong>To sum up</strong>: Portion 1 of Erf 2464 situated in the Registration Division FT, Province' +
                    'of Kwazulu-Natal.' +
                    '</p>' +
                    '<ul>' +
                    '<li>' +
                    '<strong>N  + 0FT  + 0258  + 00002464  + 00001</strong>' +
                    '</li>' +
                    '<li>' +
                    '<strong>N0FT02580000246400001</strong>' +
                    '</li>' +
            '</ul>' +
        '</div>'},
            {'title': 'What is a Region?', 'details': '<p>' +
            'Regions are the spatial demarcation of provinces into spatial areas that are used for numbering of land' +
            'parcels in the Surveyor-General offices. There is a major region and minor regions (which fall within' +
            'major regions). The major and minor regions have' +
            'codes and names. The codes are used as part of the key in the spatial data. <strong>Major' +
            'Region</strong> A major region is a ' + 'registration division' + ' in the following provinces:' +
            '</p>' +
            '<ul>' +
            '<li>Kwazulu-Natal</li>' +
            '<li>Gauteng</li>' +
            '<li>Mpumalanga</li>' +
            '<li>North West</li>' +
            '<li>Northern Province</li>' +
            '</ul>' +
            '<p>' +
            '<span style=' + 'text-decoration: underline;' + '>Examples</span>: IQ, JQ, JS A major region is an' +
            '' + 'administrative district' + ' in the following provinces:' +
            '</p>' +
            '<ul>' +
            '<li>Western Cape</li>' +
            '<li>Eastern Cape</li>' +
            '<li>Northern Cape</li>' +
            '<li>Free State</li>' +
            '</ul>' +
            '<p>' +
            '<span style=' + 'text-decoration: underline;' + '>Examples</span>: Cape, Caledon, Bloemfontein <strong>Minor' +
            'Region</strong> A minor region can be a ' + 'township or holding' + ' where the numbering of the township or' +
            'holdings and its extensions are all consecutive under the name of the township or holding. Townships or' +
            'holdings occur in the following' +
            'provinces:' +
            '</p>' +
            '<ul>' +
            '<li>Kwazulu-Natal</li>' +
            '<li>Gauteng</li>' +
            '<li>Mpumalanga</li>' +
            '<li>North West</li>' +
            '<li>Northern Province</li>' +
            '<li>Free State</li>' +
            '</ul>' +
            '<p>' +
            '<span style=' + 'text-decoration: underline;' + '>Examples</span>: Eldorado Agricultural Holdings, Everest' +
            'Heights A minor region can also be an ' + 'allotment area' + ' where an urban area is demarcated with' +
            'consecutively numbered erven. Such an Allotment' +
            'Area can include portions of farm land which have urban designations (Erf). An Allotment Area can also' +
            'include different townships. The numbering of the erven in such townships will relate to the numbering' +
            'of the Allotment Area. Allotment' +
            'areas occur in the following provinces:' +
            '</p>' +
            '<ul>' +
            '<li>Western Cape</li>' +
            '<li>Eastern Cape</li>' +
            '<li>Northern Cape</li>' +
            '</ul>' +
            '<p>' +
            '<span style=' + 'text-decoration: underline;' + '>Examples</span>: Kleinmond Allotment Area' +
        '</p>'},
            {'title': 'Cadastral Surveying: What is it and why do we need it?', 'details': '<p>' +
            'Cadastral surveying is that branch of surveying which is concerned with the survey and demarcation of' +
            'land for the purpose of defining parcels of land for registration in a land registry. Cadastral' +
            'surveying in South Africa is undertaken exclusively by' +
            'or under the control of professional land surveyors, and in this article the terms professional land' +
            'surveyor, land surveyor and cadastral surveyor are synonymous. South Africa not only allows the private' +
            'ownership of property but also,' +
            'in the case of land, actively encourages it. Initially all land derives from the State but, should the' +
            'State wish to give or lend a piece of land to one or more of its citizens for that person to develop and' +
            'to enjoy its use, cadastral' +
            'surveying becomes necessary. First of all cadastral surveying is used to define the land to be granted.' +
            'Later, should the owner then wish to sell off part of that land, the cadastral surveyor is again called' +
            'in to partition the land to' +
            'be sold. Furthermore, the services of the cadastral surveyor are required whenever a boundary beacon' +
            'must be found or replaced. Once the positions of the boundaries have been marked and recorded, the' +
            'cadastral surveyor and the conveyancer' +
            'work together to record ownership in a public register. This action ensures that the rights of the owner' +
            'can be upheld against false claims and that all persons may know who owns what.' +
            '</p>'}
            // {'title': 'List management', 'details':'<iframe allow='accelerometer; autoplay; clipboard-write;
            // encrypted-media; gyroscope; picture-in-picture' allowfullscreen frameborder='0' height='315' src='
            // + this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/DhdDnLKyh6c') + 'width='560'></iframe>'}
        ];
    }

    ngOnInit() {
    }

}
