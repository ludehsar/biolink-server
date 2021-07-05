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
  public static ADMIN_ROLE_NOT_FOUND = 17
  public static VERIFICATION_NOT_FOUND = 18
  public static USER_NOT_FOUND = 19
  public static CATEGORY_ALREADY_EXISTS = 20
  public static PLAN_ALREADY_EXISTS = 21
  public static USERNAME_ALREADY_CHANGED_ONCE = 22
  public static LINK_IS_MALICIOUS = 23
  public static REPORT_NOT_FOUND = 24
  public static SUPPORT_NOT_FOUND = 25
  public static TAX_NOT_FOUND = 26

  public static DATABASE_ERROR = 9999
  public static CLIENT_SIDE_ERROR = 10000
}
