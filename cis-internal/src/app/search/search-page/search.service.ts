import {Injectable} from '@angular/core';
import {RestcallService} from '../../services/restcall.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    data = {
        results: null,
        searchData: null
    };
    cartLength = 0;
    cartStageData = [];
    cartId = null;
    userProfileImage: any = '';

    constructor(private restService: RestcallService) {
        this.trigger();
    }

    setData(results, searchData) {
        this.data.results = results;
        this.data.searchData = searchData;
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = {
            results: null,
            searchData: null
        };
    }

    trigger() {
        this.getCartDetails();
    }

    getCartDetails() {
        sessionStorage.removeItem('cartId');
        sessionStorage.removeItem('cartItems');
        this.restService.getCartDetails(this.userId).subscribe(response => {
            const data = response.data;

            if (response.code !== 50000) {
                if (response.data === null) {
                    this.cartStageData = [];
                    this.cartLength = 0;
                } else {
                    this.cartLength = data?.cartStageData.length;
                    this.cartId = data?.cartId;
                    sessionStorage.setItem('cartId', this.cartId);
                    sessionStorage.setItem('cartItems', JSON.stringify(data.cartStageData));
                    const arr = [];
                    for (const x of data.cartStageData) {
                        arr.push(x);
                    }
                    this.cartStageData = arr;
                }
            } else {
                this.cartStageData = [];
                this.cartLength = 0;
            }
        });
    }

    getCart() {
        return this.cartStageData;
    }

    getProfileImage() {
        this.restService.getProfileImage().subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.userProfileImage = reader.result;
            };
        });
    }


    getCartData = async () => {
        sessionStorage.removeItem('cartId');
        sessionStorage.removeItem('cartItems');
        await this.restService.getCartDetails(this.userId).subscribe(response => {
            const data = response.data;
            if (data) {
                this.cartLength = data?.cartStageData.length;
                this.cartId = data?.cartId;
                sessionStorage.setItem('cartId', this.cartId);
                sessionStorage.setItem('cartItems', JSON.stringify(data.cartStageData));
                const arr = [];
                for (const x of data.cartStageData) {
                    arr.push(x);
                }
                this.cartStageData = arr;
            } else {
                this.cartStageData = [];
                this.cartLength = 0;
            }
        });
    }
}
