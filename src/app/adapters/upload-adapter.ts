import { environment } from "src/environments/environment";

export class UploadAdapter {
    loader: any;
    xhr: any;
    httpClient: any;

    constructor(loader, httpClient) {
        this.loader = loader;
        this.httpClient = httpClient;
    }
    upload() {
        // return this.loader.file
        // .then(file => new Promise((resolve, reject) => {
        //   const data = new FormData();
        //   data.append('arquivo', file);
        //   this.httpClient.post(environment.urlApi + 'media/upload', data);
        // }));

        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                // const toBase64 = (file) =>
                //     new Promise((resolve, reject) => {
                //       const reader = new FileReader();
                //       reader.readAsDataURL(file);
                //       reader.onload = () => resolve(reader.result);
                //       reader.onerror = (error) => reject(error);
                //     });
                //   const base64_image = toBase64(file).then((data) => {
                //     return resolve({
                //       default: data
                //     });
                //   });
                //   this.loader.uploaded = true;
                  //return base64_image;

                this._initRequest();
                this._initListeners(resolve, reject, file);
                this._sendRequest(file);
            }));
    }
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', environment.urlApi + 'media/upload', true); 
        // xhr.responseType = 'json';
        // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Accept", "application/json");
        // xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("API_TOKEN", localStorage.getItem('api_token'));
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('access_token'));
    }
    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;
        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }
            resolve({
                default: environment.urlApi + 'media/' + JSON.parse(response).url
            });
        });
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }
    
    _sendRequest(file) {
        const data = new FormData();
        
        data.append('arquivo', file);
        this.xhr.send(data);
    }
}