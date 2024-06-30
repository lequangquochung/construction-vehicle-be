export interface PagingParams {
  pageIndex?: number;
  pageSize?: number;
  start?: number;
  skip?: number;
}

export interface NewPagingParams {
  pageIndex?: number;
  pageSize?: number;
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