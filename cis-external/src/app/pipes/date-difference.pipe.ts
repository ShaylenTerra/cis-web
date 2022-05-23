import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateDifference',
    pure: true
})
export class DateDifference implements PipeTransform {

    transform(startingDate: Date, endingDate: Date): any {
        let startDate = new Date(startingDate);

        // user not pass endingDate then set current date as end date.
        if (!endingDate) {
            endingDate = new Date();
        }
        let endDate = new Date(endingDate);

        // chack start date and end date and base on condication alter date.
        if (startDate > endDate) {
            const swap = startDate;
            startDate = endDate;
            endDate = swap;
        }

        // This is for leap year.
        const startYear = startDate.getFullYear();
        const february =
            (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
                ? 29
                : 28;
        const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        let yearDiff = endDate.getFullYear() - startYear;
        let monthDiff = endDate.getMonth() - startDate.getMonth();
        if (monthDiff < 0) {
            yearDiff--;
            monthDiff += 12;
        }
        let dayDiff = endDate.getDate() - startDate.getDate();
        const hourDiff = endDate.getHours() - startDate.getHours();
        const minuteDiff = endDate.getMinutes() - startDate.getMinutes();
        const secondDiff = endDate.getSeconds() - startDate.getSeconds();
        if (dayDiff < 0) {
            if (monthDiff > 0) {
                monthDiff--;
            } else {
                yearDiff--;
                monthDiff = 11;
            }
            dayDiff += daysInMonth[startDate.getMonth()];
        }

        if (yearDiff === 0) {
            if (monthDiff === 0) {
                if (dayDiff === 0) {
                    if (hourDiff === 0) {
                        if (minuteDiff === 0) {
                            return secondDiff + (dayDiff > 1 ? ' Seconds' : ' Second');
                        }
                        return minuteDiff + (dayDiff > 1 ? ' Minutes' : ' Minute');
                    }
                    return hourDiff + (dayDiff > 1 ? ' Hours' : ' Hour');
                }
                return dayDiff + (dayDiff > 1 ? ' Days' : ' Day');
            }
            return monthDiff + (dayDiff > 1 ? ' Months' : ' Month');
        }
    }
}
