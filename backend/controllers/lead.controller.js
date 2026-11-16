// كنترولر العملاء: بيتعامل مع إضافة وقراءة وتعديل وحذف العملاء (المنطق فقط)
const Lead = require('../models/lead.model');
const { STATUSES, SERVICES } = require('../config/constants');
const HttpError = require('../utils/httpError');

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid lead id.');
  return id;
}

function create(req, res) {
  const lead = Lead.create(req.body);
  res.status(201).json({ data: lead, message: 'Your request has been submitted successfully.' });
}

function list(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  const status = STATUSES.includes(req.query.status) ? req.query.status : '';
  const service = SERVICES.includes(req.query.service) ? req.query.service : '';

  const { rows, total } = Lead.list({ search, status, service, page, limit });
  res.json({ data: rows, meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) } });
}

function getOne(req, res) {
  const lead = Lead.findById(parseId(req.params.id));
  if (!lead) throw new HttpError(404, 'Lead not found.');
  res.json({ data: lead });
}

function update(req, res) {
  const id = parseId(req.params.id);
  if (!Lead.findById(id)) throw new HttpError(404, 'Lead not found.');
  res.json({ data: Lead.update(id, req.body) });
}

function remove(req, res) {
  if (!Lead.remove(parseId(req.params.id))) throw new HttpError(404, 'Lead not found.');
  res.json({ message: 'Lead deleted.' });
}

module.exports = { create, list, getOne, update, remove };
