export class Actions {
    name?: string;
    label?: string;
    icon?: string;
    click?: Function;
    disabled?: Function = (item?: any): boolean => {
      return false;
    };
    restricao?: any;
    hidden?:  Function = (item?: any): boolean => {
      return false;
    };
  }
  
