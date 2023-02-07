export default class HTTPError extends Error {
  constructor(
    readonly body: any = { message: "Internal server error" },
    readonly code: number = 500,
  ) {
    if (typeof body === "string") {
      body = {message: body};
    }
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}
