const fs = require('fs');
const objectHash = require('object-hash');
const path = require('path');

const cachePath = path.join(__dirname, '.cache.json');
const cache = loadCache();

function loadCache () {
  try {
    return JSON.parse(fs.readFileSync(cachePath));
  } catch (e) {
    return {};
  }
}

function setCached (obj, cached) {
  const hash = objectHash(obj);
  if (cached) cache[hash] = true;
  else delete cache[hash];
}

function saveCache () {
  fs.writeFileSync(cachePath, JSON.stringify(cache));
}

function isCached (obj) {
  return Boolean(cache[objectHash(obj)]);
}

module.exports = {
  isCached,
  setCached,
  saveCache
};
