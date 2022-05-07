export enum ApiResultCode {
  REQ_SUCCESS = "00000000",
  REQ_FUNC_NOT_SUPPORTED = "00000001",
  REQ_HTTP_METHOD_NOT_SUPPORTED = "00000002",
  UNAUTHORIZED_USER = "00000003",
  UNAUTHENTICATED_USER = "00000004",
  AUTHORIZATION_HEADER_NOT_FOUND = "00000005",
  BEARER_TOKEN_NOT_FOUND = "00000006",
  INVALID_BASE64_STRING = "00000007",
  USER_NOT_FOUND = "00000008",
  USER_NOT_ALLOWED_TO_CHANGE_USERNAME = "00000009",
  USERNAME_EXISTS = "000000010",
  FAILED_TO_CREATE_NEW_USER = "000000011",
  FAILED_TO_UPDATE_USER = "000000012",
  UPDATE_USER_DECLINED = "00000013",
  FAILED_TO_CREATE_NEW_GAME = "00000014",
  FAILED_TO_ADD_GAME_TO_LEADERBOARD = "00000015",
  INVALID_REQ_PARAMS = "00000016",
}
