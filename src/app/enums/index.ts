export enum ErrorCode {
  Unknown_Error,
  Invalid_Input,
  Member_Blocked,
  Username_Or_Password_Invalid,
  Token_Not_Exist,
  User_Blocked,
  Token_Expired,
  /**The client not send the required token in header */
  Refresh_Token_Not_Exist,
  /**The client send the expire token or invalid token*/
  Refresh_Token_Expire,
  /**The client do not have permission for this action. */
  Permission_Denied,
  User_Not_Exist,
  Not_Found,
  Access_Denied,
  No_Data_Found,
  Employee_Not_Exist,
  File_Not_Found,
  Email_Existed,
  Phone_Number_Already_exist,
  ID_Or_Password_Invalid,
  Username_Existed,
  New_Password_Must_Be_Different,
  Password_Invalid,
  Category_Not_Exist,
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
