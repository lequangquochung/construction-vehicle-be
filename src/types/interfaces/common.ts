export interface PagingParams {
  pageIndex?: number;
  take?: number;
  start?: number;
  skip?: number;
}

export interface ILogging {
  originalUrl: string;
  userId?: number;
  memberId?: number;
}

export interface ITranslation {
  contentEng: string;
  contentVie: string;
}