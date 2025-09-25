export interface AppConfig {
    companyName: string;
    baseUrl: string;
    primaryColor: string;
}

export const defaultConfig: AppConfig = {
    companyName: "online_store",
    baseUrl: "https://web.gridsweb.com:9008/bomain",
    primaryColor: "#00ff88",
};
