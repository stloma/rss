'use strict';

var siteFieldType = {
  name: 'required',
  url: 'required',
  created: 'required',
  author: 'optional',
  private: 'optional',
  tags: 'optional'
};

function validateSite(site) {
  for (var field in siteFieldType) {
    var type = siteFieldType[field];
    if (!type) {
      delete site[field];
    } else if (type === 'required' && !site[field]) {
      return field + ' is required.';
    }
  }

  return null;
}

module.exports = {
  validateSite: validateSite
};
//# sourceMappingURL=bookmark.js.map