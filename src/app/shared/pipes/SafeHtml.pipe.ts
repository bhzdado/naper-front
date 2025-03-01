import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: "safeHtml",
    standalone: true,
  })
  export class SafeHtmlPipe implements PipeTransform  {
    constructor(private sanitizer: DomSanitizer) {}
  
    transform(html) {
        console.log(html);
        console.log(this.sanitizer.bypassSecurityTrustHtml(html));
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }