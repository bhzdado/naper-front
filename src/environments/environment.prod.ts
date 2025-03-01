import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  urlApi: 'https://api.rnldo.com.br/v1/',
  logo: "logo_cdc.webp",
  title: 'Painel Administrativo'
};
