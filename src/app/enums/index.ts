export enum ErrorCode {
  Unknown_Error = 1,
  Invalid_Input = 2,
  Member_Blocked = 3,
  Username_Or_Password_Invalid = 4,
  Token_Not_Exist = 5,
  User_Blocked = 6,
  Token_Expired = 7,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist = 8,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire = 9,
  /**The client do not have permission for this action. */
  Permission_Denied = 10,
  User_Not_Exist = 11,
  Not_Found = 12,
  Access_Denied = 13,
  No_Data_Found = 14,
  Employee_Not_Exist = 15,
  File_Not_Found = 16,
  Email_Existed = 17,
  Phone_Number_Already_exist = 18,
  ID_Or_Password_Invalid = 19,
  Username_Existed = 20,
  New_Password_Must_Be_Different = 21,
  Password_Invalid = 22,
  Category_Not_Exist = 23,
  Product_Not_Exist = 24,
  Order_Not_exist = 25,
  Order_Must_Be_Processing = 26,
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum BlockStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum Gender {
  FEMALE = 2,
  MALE = 1,
}

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum CommonStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum VerifiedCodeStatus {
  UNUSED = 1,
  USED = 2,
}

export enum CREATED_TYPE {
  USER = 1,
  ADMIN = 2,
}

export enum AccountStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED',
}

export enum LangKey {
  ENG = 'en',
  VIE = 'vi',
}
