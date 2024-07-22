export enum HttpStatusCode {
  OK = 200,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export enum HttpMessage {
  SUCCESS = 'Success',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error'
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export enum StatusTask {
  NOTSTARTED = 'Not Started',
  WORKING = 'Working on it',
  DONE = 'Done',
  STUCK = 'Stuck'
}
