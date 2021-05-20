export class ErrorCode {
  public static REQUEST_VALIDATION_ERROR = 1
  public static USER_NOT_AUTHENTICATED = 2
  public static USER_NOT_AUTHORIZED = 3
  public static LINK_COULD_NOT_BE_FOUND = 4
  public static BIOLINK_COULD_NOT_BE_FOUND = 5
  public static EMAIL_ALREADY_EXISTS = 6
  public static USERNAME_ALREADY_EXISTS = 7
  public static USERNAME_BLACKLISTED = 8
  public static CATEGORY_COULD_NOT_BE_FOUND = 9
  public static SHORTENED_URL_ALREADY_EXISTS = 10
  public static INVALID_TOKEN = 11
  public static EMAIL_COULD_NOT_BE_FOUND = 12
  public static PASSWORD_DID_NOT_MATCH = 12
  public static BIOLINK_ALREADY_VERIFIED = 13
  public static PLAN_COULD_NOT_BE_FOUND = 14
  public static CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST = 15
  public static UPLOAD_ERROR = 16

  public static DATABASE_ERROR = 9999
}