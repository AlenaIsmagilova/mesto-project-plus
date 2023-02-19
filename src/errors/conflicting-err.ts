export default class ConflictingError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}
