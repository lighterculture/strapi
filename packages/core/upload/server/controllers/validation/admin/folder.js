'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');
const { folderExists, isFolderUnique } = require('./utils');

const NO_SLASH_REGEX = /^[^/]+$/;
const NO_SPACES_AROUND = /^(?! ).+(?<! )$/;

const validateCreateFolderSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(1)
      .matches(NO_SLASH_REGEX, 'name cannot contain slashes')
      .matches(NO_SPACES_AROUND, 'name cannot start or end with a whitespace')
      .required(),
    parent: yup
      .strapiID()
      .nullable()
      .test('folder-exists', 'parent folder does not exist', folderExists),
  })
  .noUnknown()
  .required()
  .test('is-folder-unique', 'folder already exists', isFolderUnique());

const validateUpdateFolderSchema = id =>
  yup
    .object()
    .shape({
      name: yup
        .string()
        .min(1)
        .matches(NO_SLASH_REGEX, 'name cannot contain slashes')
        .matches(NO_SPACES_AROUND, 'name cannot start or end with a whitespace'),
      parent: yup
        .strapiID()
        .nullable()
        .test('folder-exists', 'parent folder does not exist', folderExists),
    })
    .noUnknown()
    .required()
    .test('is-folder-unique', 'folder already exists', isFolderUnique(id, true));

module.exports = {
  validateCreateFolder: validateYupSchema(validateCreateFolderSchema),
  validateUpdateFolder: id => validateYupSchema(validateUpdateFolderSchema(id)),
};
