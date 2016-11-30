'use strict';

module.exports = {
  refreshSubscribes: (sites, body) => {
      sites.forEach((site, i) => {
          for (let keys in site) {
              site[keys] = body[i][keys];
          }
      });
  }
};