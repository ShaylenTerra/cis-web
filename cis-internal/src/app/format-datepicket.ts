import {MatDateFormats, NativeDateAdapter} from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            let day: string = date.getDate().toString();
            day = +day < 10 ? '0' + day : day;
            const month: string = date.toLocaleString('default', {month: 'short'});
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return date.toDateString();
    }
}

export const APP_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
    },
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'numeric'},
        dateA11yLabel: {
            year: 'numeric', month: 'long', day: 'numeric'
        },
        monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
};
