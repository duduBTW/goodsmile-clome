import { PageDataWithJson, SearchPageData } from "./client/backend-model";

declare global {
  interface Window {
    home: PageDataWithJson;
    search: SearchPageData;
  }
}
