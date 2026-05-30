export type ApiClientConfig = {
  baseUrl: string;
};

export const createApiClient = ({ baseUrl }: ApiClientConfig) => ({
  baseUrl,
  buildUrl(path: string) {
    return new URL(path, baseUrl).toString();
  },
});
