/* Do not change, this code is generated from Golang structs */


export interface CarouselArrow {
    Id: string;
    Icon: string;
}
export interface SectionTitle {
    Icon: string;
    Title: string;
}
export interface Product {
    Id: number;
    IamgeSrc: string;
    Marker: string;
    Title: string;
    Price: string;
    Labels: string[];
}
export interface Brand {
    Image: string;
    Name: string;
}
export interface CarouselSlide {
    Id: number;
    Image: string;
}
export interface Searcher {
    Suggestions: string;
    Input: string;
    ClearHistory: string;
    ClearInput: string;
    Filters: string;
    FilterPopup: string;
    FilterTrigger: string;
    FilterTitles: string;
    FilterStatus: string;
    FilterCriteria: string;
    FilterManufacters: string;
    ResultsContainer: string;
    FilterPopupSelectedHeader: string;
    FiltersClearAll: string;
}
export interface Ids {
    Searcher: Searcher;
    PageLoader: string;
    IdsData: string;
    Carousel: string;
    CarouselPagination: string;
    CarouselPaginationPage: string;
    CarouselArrowLeft: string;
    CarouselArrowRight: string;
}
export interface HomePageData {
    Title: string;
    NavigationItems: string[];
    Ids: Ids;
    Json: string;
    Alert: string[];
    Carousel: CarouselSlide[];
    Brand: Brand[];
    Preorder: Product[];
    Exclusives: Product[];
    PreorderSectionTitle: SectionTitle;
    ExclusivesSectionTitle: SectionTitle;
    LeftCarouselArrow: CarouselArrow;
    RightCarouselArrow: CarouselArrow;
    SearchInputDefaultValue: string;
}
export interface Checkbox {
    Id: number;
    Label: string;
}
export interface Checkboxes {
    DefaultLabel: string;
    Checkboxes: Checkbox[];
    Type: string;
    Ids: Ids;
}
export interface SearchPageData {
    Title: string;
    NavigationItems: string[];
    Ids: Ids;
    Json: string;
    Titles: Checkboxes;
    Manufacters: Checkboxes;
    Status: Checkboxes;
    Criteria: Checkboxes;
    SearchResults: Product[];
    SearchInputDefaultValue: string;
}