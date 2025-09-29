import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  logo: "logo_transparente.png",
  urlApi: 'https://api.fiscal3.com.br/v1/', 
  urlSite: 'https://novo.fiscal3.com.br/',
  title: 'Fiscal 3',
  recaptcha: {
    siteKey: '6LeIAv0qAAAAAF_kArvXsXMTVHk5Vnhhij17q11h',
  }
};
