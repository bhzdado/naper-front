import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  logo: "logo_transparente.png",
  urlApi: 'https://api.teste.com.br/v1/',
  title: 'Painel Administrativo',
  recaptcha: {
    siteKey: '6LeIAv0qAAAAAF_kArvXsXMTVHk5Vnhhij17q11h',
  }
};
