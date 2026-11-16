// HttpError: خطأ معاه كود حالة HTTP، الكنترولرز بترميه وerrorHandler بيتعامل معاه
class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}
module.exports = HttpError;
