'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

var editFieldType = {
  name: 'required',
  url: 'required',
  updated: 'required',
  author: 'optional',
  tags: 'optional',
  comment: 'optional'
};

function validUrl(url) {
  var urlPattern = /^(https?:\/\/){1}[^-][a-z0-9.-]+[^-]\.[a-z]{2,4}$/;
  if (url.match(urlPattern)) {
    return true;
  }
  return false;
}

function validateSite(site) {
  var errors = [];
  for (var field in siteFieldType) {
    var type = siteFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  }
  var url = site['url'];
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com');
  }
  if (errors.length > 0) {
    return errors;
  } else {
    return null;
  }
}

function validateEdit(site) {
  var errors = [];
  for (var field in editFieldType) {
    var type = editFieldType[field];
    if (type === 'required' && !site[field]) {
      errors.push(field + ' is required');
    }
  }
  var url = site['url'];
  if (url && !validUrl(url)) {
    errors.push('Please enter a valid url. E.g., http://www.example.com');
  }
  if (errors.length > 0) {
    return errors;
  } else {
    return null;
  }
}

exports.validateSite = validateSite;
exports.validateEdit = validateEdit;
//# sourceMappingURL=bookmark.js.map