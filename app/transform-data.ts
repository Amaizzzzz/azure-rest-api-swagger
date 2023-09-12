import urls from "../public/urls.json";

export interface IApiOption {
    label: string;
    value: {
        path: string;
        versions: IApiVersionOption[];
    }
}

export interface IApiVersionOption {
    label: string;
    value: string;
}

function transformUrlsJSON() {
    return urls.map((it) => {
        const { label, path_without_api_version, api_version_options } = it;
        return {
            label,
            value: {path: path_without_api_version,
            versions: api_version_options.map((it) => ({
                label: it.api_version,
                value: it.url,
            }))},
        }
    })
}

export const apiOptions: IApiOption[] = transformUrlsJSON();