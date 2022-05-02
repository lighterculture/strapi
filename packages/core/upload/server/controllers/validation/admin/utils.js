'use strict';

const { isNil, isUndefined, get } = require('lodash/fp');
const { getService } = require('../../../utils');

const folderModel = 'plugin::upload.folder';

const folderExists = async folderId => {
  if (isNil(folderId)) {
    return true;
  }

  const exists = await getService('folder').exists({ id: folderId });

  return exists;
};

const isFolderUnique = id => async folder => {
  const { exists } = getService('folder');
  let name = folder.name;

  if (id && isUndefined(name)) {
    const existingFolder = await strapi.entityService.findOne(folderModel, id);
    name = get('name', existingFolder);
  }

  const doesExist = await exists({ parent: folder.parent || null, name });
  return !doesExist;
};

module.exports = {
  folderExists,
  isFolderUnique,
};
