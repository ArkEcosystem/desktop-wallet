/**
 * NetworkService
 * @constructor
 */
function StorageService() {
  let storage = {};
  let context = window.localStorage.getItem('context');

  function getContext() {
    return context;
  }

  function saveState() {
    window.localStorage.setItem(`storage-${context}`, JSON.stringify(storage));
    window.localStorage.setItem('lastsaved', JSON.stringify(new Date()));
  }

  function switchContext(contextname) {
    const temp = window.localStorage.getItem(`storage-${contextname}`);
    saveState();
    context = contextname;
    window.localStorage.setItem('context', context);
    if (!temp) {
      storage = {};
    } else {
      storage = JSON.parse(temp);
    }
    saveState();
    return context;
  }

  function get(key) {
    return storage[key];
  }

  function getGlobal(key) {
    return JSON.parse(window.localStorage.getItem(`global-${key}`));
  }

  function set(key, value, forcesave) {
    if (!value) {
      delete storage[key];
    } else {
      storage[key] = value;
    }
    if (forcesave) {
      saveState();
    }
    return value;
  }

  function setGlobal(key, value) {
    if (!value) {
      window.localStorage.removeItem(`global-${key}`);
    } else {
      window.localStorage.setItem(`global-${key}`, JSON.stringify(value));
    }
    return value;
  }

  function clearData() {
    window.localStorage.clear();
  }

  // function code starts here
  if (!context) {
    context = 'mainnet';
    window.localStorage.setItem('context', context);
  } else {
    switchContext(context);
  }

  setInterval(
    () => {
      saveState();
    },
    10000);

  return {
    switchContext,
    getContext,
    clearData,
    get,
    set,
    getGlobal,
    setGlobal,
    saveState
  };
}

angular.module('arkclient.coreServices')
  .service('storageService', [StorageService]);

