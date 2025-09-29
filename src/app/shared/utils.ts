import { ElementRef, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export default class Utils {
    public static padLeft(text: number, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).substr(size * -1, size);
    }

    public static showHideSidebar() {
        let elementRef: ElementRef<HTMLElement>
        const element = document.getElementById("sidebar-hide mobile-collapse");
        element.click();
    }

    public static showSidebar() {
        let elementRef: ElementRef<HTMLElement>
        const element = document.getElementById("sidebar-hide mobile-collapse");
        if (element.classList.contains('on')) {
            element.click();
        }
    }

    public static hideSidebar() {
        let elementRef: ElementRef<HTMLElement>
        const element = document.getElementById("sidebar-hide mobile-collapse");
        if (!element.classList.contains('on')) {
            element.click();
        }
    }

    public static dateDifference(date1, date2) {
        const diffInMilliseconds = Math.abs(date2 - date1);
        const diffInSeconds = diffInMilliseconds / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;
        const diffInMonths = diffInDays / 30.436875;
        const diffInYears = diffInMonths / 12;

        return {
            diffInMilliseconds,
            diffInSeconds,
            diffInMinutes,
            diffInHours,
            diffInDays,
            diffInMonths,
            diffInYears
        };
    }

    public static convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
      
        var pad = function (n) { return n < 10 ? '0' + n : n; };
      
        if(d>0){
            return 'Faltam ' + d + ' dias ' + pad(h) + ':' + pad(m) + ':' + pad(s) + ' para fechamento desta avaliação.';
        }

        if(h<2){
            return 'Faltam ' + pad(h) + ':' + pad(m) + ':' + pad(s) + ' para fechamento desta avaliação.';
        }
        
        return 'Faltam ' + pad(h) + ':' + pad(m) + ':' + pad(s) + ' para fechamento desta avaliação.';
      };


    public static msToTime(milliseconds) {
        if(milliseconds<= 0)
            return '';

        return this.convertMS(milliseconds);
        // //Get hours from milliseconds
        // var hours = milliseconds / (1000 * 60 * 60);
        // var absoluteHours = Math.floor(hours);
        // var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        // //Get remainder from hours and convert to minutes
        // var minutes = (hours - absoluteHours) * 60;
        // var absoluteMinutes = Math.floor(minutes);
        // var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

        // //Get remainder from minutes and convert to seconds
        // var seconds = (minutes - absoluteMinutes) * 60;
        // var absoluteSeconds = Math.floor(seconds);
        // var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

        // let dias = 0;
        // if(Number(h) > 23){
        //     dias = Math.trunc(Number(h)/24);
        //     h = Math.floor(Number(h));
        // }

        // if(dias){
        //    return dias + ' dias ' + h + ':' + m + ':' + s;
        // }

        // return h + ':' + m + ':' + s;
    }
}
