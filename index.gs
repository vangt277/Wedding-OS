/**
 * WeddingOS Google Apps Script bridge v9 — Secure Dynamic Schema
 *
 * Bảo mật và đồng bộ:
 * - Challenge–response cho tài khoản và quản trị; không gửi mật khẩu đăng nhập tới Apps Script.
 * - Session token ngắn hạn, phân quyền theo collection và kiểm soát tài khoản bị khóa.
 * - Data revision chống ghi đè thay đổi từ thiết bị khác.
 * - Sheet nhạy cảm được ẩn và bảo vệ; audit log ghi mọi thao tác thay đổi.
 * - Schema động, kiểm tra trường bắt buộc, kiểu dữ liệu, URL và chống formula injection.
 * - Có trigger tùy chọn để tạo cảnh báo hằng ngày trong sheet notifications.
 *
 * Cài đặt:
 * 1. Mở Google Sheets đích > Extensions > Apps Script.
 * 2. Dán toàn bộ file này và lưu.
 * 3. Chạy setupWeddingOSSpreadsheet() một lần.
 * 4. Nên chạy setWeddingOSPassword('mat-khau-ket-noi-manh') làm khóa khôi phục/bootstrap.
 * 5. Có thể chạy setWeddingOSSchemaAdminPassword('mat-khau-schema-rieng').
 * 6. Deploy Web app với Execute as: Me và giới hạn người truy cập phù hợp.
 * 7. Tùy chọn chạy installWeddingOSDailyNotificationTrigger().
 */

const WOS_SCHEMA_SHEET = '_wos_schema';
const WOS_README_SHEET = 'README';
const WOS_SCHEMA_HASH_KEY = 'WEDDINGOS_SCHEMA_HASH';
const WOS_SCHEMA_VERSION_KEY = 'WEDDINGOS_SCHEMA_VERSION';
const WOS_SPREADSHEET_ID_KEY = 'WEDDINGOS_SPREADSHEET_ID';
const WOS_PASSWORD_HASH_KEY = 'WEDDINGOS_PASSWORD_SHA256';
const WOS_SCHEMA_PASSWORD_HASH_KEY = 'WEDDINGOS_SCHEMA_PASSWORD_SHA256';
const WOS_DATA_REVISION_KEY = 'WEDDINGOS_DATA_REVISION';
const WOS_SESSION_SECRET_KEY = 'WEDDINGOS_SESSION_SECRET';
const WOS_LOG_SHEET = '_wos_log';
const WOS_SESSION_TTL_SECONDS = 6 * 60 * 60;
const WOS_CHALLENGE_TTL_SECONDS = 5 * 60;
const WOS_LOGIN_LOCK_SECONDS = 15 * 60;
const WOS_MAX_LOGIN_FAILURES = 6;
const WOS_DEFAULT_PASSWORD_ITERATIONS = 120000;

const WOS_JSON_PREFIX = '__WOS_JSON__:';
const WOS_TEXT_PREFIX = '__WOS_TEXT__:';
const WOS_MAX_BODY_BYTES = 20 * 1024 * 1024;
const WOS_MAX_CHANGES = 50000;
const WOS_MAX_RECORDS_PER_COLLECTION = 50000;
const WOS_MAX_MODULES = 50;
const WOS_MAX_FIELDS_PER_MODULE = 120;
const WOS_MAX_OPTIONS_PER_FIELD = 500;
const WOS_VALIDATION_ROWS = 2000;
const WOS_RESERVED_SHEETS = Object.freeze([
  WOS_SCHEMA_SHEET,
  WOS_README_SHEET,
  'validation_lists',
  WOS_LOG_SHEET
]);
const WOS_FIELD_TYPES = Object.freeze([
  'text', 'textarea', 'number', 'currency', 'date', 'time', 'datetime',
  'select', 'multiselect', 'rating', 'url', 'tel', 'boolean', 'json'
]);

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'status');
    if (action !== 'status') {
      return jsonResponse_({success: false, code: 'POST_REQUIRED', message: 'Hãy sử dụng POST cho thao tác này.'});
    }
    return jsonResponse_(buildPublicStatus_());
  } catch (error) {
    return jsonResponse_({success: false, code: safeErrorCode_(error), message: safeErrorMessage_(error)});
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let body = {};
  let access = null;
  try {
    body = parseRequestBody_(e);
    const action = String(body.action || '');

    if (action === 'getStatus') return jsonResponse_(Object.assign(buildPublicStatus_(), {requestId: safeText_(body.requestId, 120)}));
    if (action === 'loginChallenge') return jsonResponse_(handleLoginChallenge_(body));
    if (action === 'login') return jsonResponse_(handleLogin_(body));
    if (action === 'adminChallenge') return jsonResponse_(handleAdminChallenge_(body));
    if (action === 'adminLogin') return jsonResponse_(handleAdminLogin_(body));
    if (action === 'logout') return jsonResponse_(handleLogout_(body));

    if (action === 'load') {
      access = resolveAccess_(body, {allowBootstrap: true});
      const schemaState = getSchemaState_();
      const snapshot = loadSnapshotForAccess_(schemaState.schema, access);
      return jsonResponse_({
        success: true,
        data: snapshot,
        schema: publicSchemaState_(schemaState),
        revision: getDataRevision_(),
        profile: publicAccessProfile_(access),
        requestId: safeText_(body.requestId, 120)
      });
    }

    if (action === 'changePasswordChallenge') {
      access = resolveAccess_(body, {allowBootstrap: false});
      return jsonResponse_(handlePasswordChangeChallenge_(body, access));
    }
    if (action === 'changeOwnPassword') {
      access = resolveAccess_(body, {allowBootstrap: false});
      lock.waitLock(30000);
      const result = handleOwnPasswordChange_(body, access);
      auditRequest_(body, access, action, 'success', '', '', '', result.revision);
      return jsonResponse_(result);
    }

    if (['registerSchema', 'applyChanges', 'verifyWorkbook'].indexOf(action) === -1) {
      return jsonResponse_({success: false, code: 'UNSUPPORTED_ACTION', message: 'Unsupported action.'});
    }

    access = resolveAccess_(body, {allowBootstrap: true});
    lock.waitLock(30000);

    if (action === 'verifyWorkbook') {
      requireAdmin_(access);
      const report = verifyWeddingOSWorkbook();
      auditRequest_(body, access, action, 'success', '', '', '', getDataRevision_());
      return jsonResponse_({success: true, report: report, revision: getDataRevision_(), requestId: safeText_(body.requestId, 120)});
    }

    let schemaState = ensureSchemaForAccess_(body, access);
    if (action === 'registerSchema') {
      requireAdmin_(access);
      auditRequest_(body, access, action, 'success', '', '', '', getDataRevision_());
      return jsonResponse_({
        success: true,
        mode: 'schema',
        schema: publicSchemaState_(schemaState),
        changes: schemaState.changes || [],
        revision: getDataRevision_(),
        requestId: safeText_(body.requestId, 120)
      });
    }

    const schema = schemaState.schema;
    assertBaseRevision_(body.baseRevision);

    if (body.mode === 'full' && body.replaceRemote === true && body.snapshot) {
      requireAdmin_(access);
      const hasRemoteData = workbookHasData_(schema);
      if (hasRemoteData && body.confirmReplaceRemote !== true) {
        throw apiError_('REMOTE_NOT_EMPTY', 'Google Sheets đã có dữ liệu. Không thể ghi đè nếu chưa xác nhận rõ ràng.');
      }
      validateSnapshot_(body.snapshot, schema);
      assertSnapshotAllowed_(body.snapshot, schema, access);
      writeSnapshot_(body.snapshot, schema);
      const revision = incrementDataRevision_();
      auditRequest_(body, access, action, 'success', '*', '', 'full-replace', revision);
      return jsonResponse_({
        success: true,
        mode: 'full-replace',
        applied: countSnapshotRecords_(body.snapshot, schema),
        schema: publicSchemaState_(schemaState),
        schemaChanges: schemaState.changes || [],
        revision: revision,
        requestId: safeText_(body.requestId, 120)
      });
    }

    const changes = Array.isArray(body.changes) ? body.changes : [];
    if (changes.length > WOS_MAX_CHANGES) throw apiError_('TOO_MANY_CHANGES', 'Số lượng thay đổi vượt giới hạn an toàn.');
    assertChangesAllowed_(changes, schema, access);
    const applied = applyChanges_(changes, schema);
    const revision = applied ? incrementDataRevision_() : getDataRevision_();
    changes.forEach(function(change) {
      auditRequest_(body, access, action, 'success', safeText_(change.collection, 50), safeText_(change.id, 120), safeText_(change.op, 20), revision);
    });
    return jsonResponse_({
      success: true,
      mode: body.mode === 'full' ? 'full-upsert' : 'delta',
      applied: applied,
      schema: publicSchemaState_(schemaState),
      schemaChanges: schemaState.changes || [],
      revision: revision,
      requestId: safeText_(body.requestId, 120)
    });
  } catch (error) {
    try { auditRequest_(body, access, String(body.action || ''), 'error', '', '', safeErrorMessage_(error), getDataRevision_()); } catch (_) {}
    return jsonResponse_({success: false, code: safeErrorCode_(error), message: safeErrorMessage_(error), revision: getDataRevision_(), requestId: safeText_(body.requestId, 120)});
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/**
 * Chạy một lần trong Apps Script editor để cố định spreadsheet đích cho Web App.
 */
function setupWeddingOSSpreadsheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Không tìm thấy Google Sheets đang liên kết. Hãy mở Apps Script từ chính file Google Sheets đích.');
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty(WOS_SPREADSHEET_ID_KEY, spreadsheet.getId());
  ensureSessionSecret_();
  if (!properties.getProperty(WOS_DATA_REVISION_KEY)) properties.setProperty(WOS_DATA_REVISION_KEY, '0');
  ensureAuditSheet_(spreadsheet);
  return 'Đã liên kết WeddingOS v9 với spreadsheet: ' + spreadsheet.getName();
}

function getWeddingOSSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = String(properties.getProperty(WOS_SPREADSHEET_ID_KEY) || '');
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    properties.setProperty(WOS_SPREADSHEET_ID_KEY, active.getId());
    return active;
  }
  throw new Error('Chưa liên kết spreadsheet. Hãy chạy setupWeddingOSSpreadsheet() một lần trước khi deploy Web App.');
}

/** Thiết lập hoặc xóa mật khẩu đồng bộ. Chỉ chạy thủ công trong Apps Script editor. */
function setWeddingOSPassword(password) {
  return setPasswordProperty_(WOS_PASSWORD_HASH_KEY, password, 'mật khẩu đồng bộ');
}

/**
 * Thiết lập mật khẩu riêng cho việc tạo sheet/thêm cột.
 * Để trống để dùng chung mật khẩu đồng bộ.
 */
function setWeddingOSSchemaAdminPassword(password) {
  return setPasswordProperty_(WOS_SCHEMA_PASSWORD_HASH_KEY, password, 'mật khẩu quản trị cấu trúc');
}

function setPasswordProperty_(key, password, label) {
  const value = String(password || '');
  const properties = PropertiesService.getScriptProperties();
  if (!value) { properties.deleteProperty(key); return 'Đã tắt ' + label + ' WeddingOS.'; }
  const digest = sha256Hex_(ensureSessionSecret_() + '\u0000' + value);
  properties.setProperty(key, 'v9:' + digest);
  return 'Đã cập nhật ' + label + ' WeddingOS bằng hash có pepper máy chủ.';
}

function hasWeddingOSPassword_() {
  return Boolean(PropertiesService.getScriptProperties().getProperty(WOS_PASSWORD_HASH_KEY));
}

function verifyWeddingOSPassword_(password) {
  verifyPasswordProperty_(WOS_PASSWORD_HASH_KEY, password, 'Mật khẩu kết nối không đúng.');
}

function verifySchemaAdminPassword_(schemaPassword, fallbackPassword) {
  const expected = PropertiesService.getScriptProperties().getProperty(WOS_SCHEMA_PASSWORD_HASH_KEY);
  if (!expected) return;
  const candidate = schemaPassword !== undefined && schemaPassword !== null
    ? schemaPassword
    : fallbackPassword;
  const actual = sha256Hex_(String(candidate || ''));
  if (!constantTimeEquals_(expected, actual)) {
    throw new Error('Mật khẩu quản trị cấu trúc không đúng.');
  }
}

function verifyPasswordProperty_(key, password, message) {
  const expected = PropertiesService.getScriptProperties().getProperty(key);
  if (!expected) return;
  const value = String(password || '');
  const actual = expected.indexOf('v9:') === 0 ? 'v9:' + sha256Hex_(ensureSessionSecret_() + '\u0000' + value) : sha256Hex_(value);
  if (!constantTimeEquals_(expected, actual)) throw apiError_('INVALID_CONNECTION_PASSWORD', message);
}

function parseRequestBody_(e) {
  const raw = e && e.postData ? String(e.postData.contents || '') : '';
  if (!raw) throw new Error('Nội dung yêu cầu trống.');
  if (raw.length > WOS_MAX_BODY_BYTES) throw new Error('Nội dung yêu cầu vượt giới hạn an toàn.');
  let body;
  try { body = JSON.parse(raw); } catch (_) { throw new Error('JSON không hợp lệ.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Nội dung yêu cầu không hợp lệ.');
  return body;
}

function validateSchemaManifest_(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('Schema manifest không hợp lệ.');
  }
  const schemaVersion = Number(manifest.schemaVersion || manifest.version || 0);
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1 || schemaVersion > 1000000) {
    throw new Error('Phiên bản schema không hợp lệ.');
  }
  const rawModules = manifest.modules;
  if (!rawModules || typeof rawModules !== 'object' || Array.isArray(rawModules)) {
    throw new Error('Schema phải có danh sách modules.');
  }
  const moduleNames = Object.keys(rawModules);
  if (!moduleNames.length || moduleNames.length > WOS_MAX_MODULES) {
    throw new Error('Số lượng module không hợp lệ.');
  }

  const clean = {
    appId: safeText_(manifest.appId || 'WeddingOS', 80),
    schemaVersion: schemaVersion,
    modules: {}
  };
  const usedSheetNames = {};

  moduleNames.forEach(function(moduleKey) {
    const raw = rawModules[moduleKey];
    const collection = validateIdentifier_(raw && raw.collection ? raw.collection : moduleKey, 'collection', 50);
    if (collection !== moduleKey) throw new Error('Khóa module phải trùng collection: ' + moduleKey);
    const sheetName = validateSheetName_(raw && raw.sheetName ? raw.sheetName : collection);
    if (usedSheetNames[sheetName]) throw new Error('Tên sheet bị trùng: ' + sheetName);
    usedSheetNames[sheetName] = true;

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Module không hợp lệ: ' + collection);
    const rawFields = raw.fields;
    if (!Array.isArray(rawFields) || !rawFields.length || rawFields.length > WOS_MAX_FIELDS_PER_MODULE) {
      throw new Error('Danh sách trường không hợp lệ cho module: ' + collection);
    }

    const fields = [];
    const fieldKeys = {};
    rawFields.forEach(function(field) {
      const cleanField = validateSchemaField_(field, collection);
      if (fieldKeys[cleanField.key]) throw new Error('Trường bị trùng trong ' + collection + ': ' + cleanField.key);
      fieldKeys[cleanField.key] = true;
      fields.push(cleanField);
    });
    if (!fieldKeys.id) throw new Error('Module ' + collection + ' phải có trường id.');

    clean.modules[collection] = {
      collection: collection,
      sheetName: sheetName,
      title: safeText_(raw.title || collection, 120),
      dataShape: raw.dataShape === 'lookupMap' ? 'lookupMap' : 'records',
      sensitive: Boolean(raw.sensitive),
      adminOnly: Boolean(raw.adminOnly || raw.sensitive),
      ownerScoped: Boolean(raw.ownerScoped),
      fields: fields
    };
  });
  return clean;
}

function validateSchemaField_(field, collection) {
  if (!field || typeof field !== 'object' || Array.isArray(field)) {
    throw new Error('Trường schema không hợp lệ trong ' + collection + '.');
  }
  const key = validateIdentifier_(field.key, 'field', 80);
  const type = WOS_FIELD_TYPES.indexOf(String(field.type || 'text')) >= 0 ? String(field.type || 'text') : 'text';
  const clean = {
    key: key,
    label: safeText_(field.label || key, 120),
    type: type,
    required: Boolean(field.required),
    hidden: Boolean(field.hidden),
    allowBlank: field.allowBlank !== false,
    width: clampInteger_(field.width, 60, 500, defaultFieldWidth_(type))
  };
  if (field.renameFrom) clean.renameFrom = validateIdentifier_(field.renameFrom, 'field', 80);
  if (Array.isArray(field.options)) {
    if (field.options.length > WOS_MAX_OPTIONS_PER_FIELD) throw new Error('Danh sách lựa chọn quá dài: ' + collection + '.' + key);
    clean.options = uniqueStrings_(field.options, 200);
  }
  if (field.numberFormat) clean.numberFormat = safeText_(field.numberFormat, 80);
  if (field.helpText) clean.helpText = safeText_(field.helpText, 300);
  return clean;
}

function ensureWorkbookSchema_(manifest, force) {
  const schema = validateSchemaManifest_(manifest);
  const json = JSON.stringify(schema);
  const hash = sha256Hex_(json);
  const spreadsheet = getWeddingOSSpreadsheet_();
  const properties = PropertiesService.getScriptProperties();
  const storedHash = String(properties.getProperty(WOS_SCHEMA_HASH_KEY) || '');
  if (!force && storedHash === hash && schemaStructureComplete_(spreadsheet, schema)) {
    return {schema: schema, hash: hash, version: schema.schemaVersion, changes: []};
  }
  const changes = [];

  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    const result = ensureModuleSheet_(spreadsheet, moduleSpec);
    if (result.created) changes.push('Đã tạo sheet ' + moduleSpec.sheetName);
    result.renamed.forEach(function(item) { changes.push('Đã đổi cột ' + item.from + ' → ' + item.to + ' trong ' + moduleSpec.sheetName); });
    result.added.forEach(function(field) { changes.push('Đã thêm cột ' + field + ' vào ' + moduleSpec.sheetName); });
  });

  saveSchemaManifest_(spreadsheet, schema, hash);
  writeReadme_(spreadsheet, schema, hash, changes);

  properties.setProperties({
    [WOS_SCHEMA_HASH_KEY]: hash,
    [WOS_SCHEMA_VERSION_KEY]: String(schema.schemaVersion)
  });

  return {schema: schema, hash: hash, version: schema.schemaVersion, changes: changes};
}


function schemaStructureComplete_(spreadsheet, schema) {
  return Object.keys(schema.modules).every(function(collection) {
    const moduleSpec = schema.modules[collection];
    const sheet = spreadsheet.getSheetByName(moduleSpec.sheetName);
    if (!sheet) return false;
    const headers = readHeaderRow_(sheet);
    return moduleSpec.fields.every(function(field) { return headers.indexOf(field.key) >= 0; });
  });
}

function ensureModuleSheet_(spreadsheet, moduleSpec) {
  let sheet = spreadsheet.getSheetByName(moduleSpec.sheetName);
  const created = !sheet;
  if (!sheet) sheet = spreadsheet.insertSheet(moduleSpec.sheetName);

  const declaredFields = moduleSpec.fields;
  const declaredHeaders = declaredFields.map(function(field) { return field.key; });
  let existingHeaders = readHeaderRow_(sheet);
  const renamed = [];

  declaredFields.forEach(function(field) {
    if (!field.renameFrom || existingHeaders.indexOf(field.key) >= 0) return;
    const oldIndex = existingHeaders.indexOf(field.renameFrom);
    if (oldIndex >= 0) {
      sheet.getRange(1, oldIndex + 1).setValue(field.key);
      existingHeaders[oldIndex] = field.key;
      renamed.push({from: field.renameFrom, to: field.key});
    }
  });

  const finalHeaders = existingHeaders.filter(Boolean);
  const added = [];
  declaredHeaders.forEach(function(header) {
    if (finalHeaders.indexOf(header) === -1) {
      finalHeaders.push(header);
      added.push(header);
    }
  });

  if (!finalHeaders.length) finalHeaders.push('id');
  ensureSheetSize_(sheet, Math.max(WOS_VALIDATION_ROWS + 1, sheet.getMaxRows()), finalHeaders.length);
  sheet.getRange(1, 1, 1, finalHeaders.length).setValues([finalHeaders]);
  applyModuleFormatting_(sheet, moduleSpec, finalHeaders);
  if (moduleSpec.sensitive) protectSensitiveSheet_(sheet, moduleSpec);
  return {created: created, added: added, renamed: renamed};
}

function applyModuleFormatting_(sheet, moduleSpec, headers) {
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setFontWeight('bold')
    .setFontColor('#ffffff')
    .setBackground(moduleSpec.sensitive ? '#7f1d1d' : '#0f172a')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setNotes([headers.map(function(key) {
      const field = findField_(moduleSpec, key);
      return field ? field.label + ' · ' + field.type + (moduleSpec.sensitive ? ' · DỮ LIỆU NHẠY CẢM' : '') : '';
    })]);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);

  const validationRows = Math.max(WOS_VALIDATION_ROWS, sheet.getLastRow() + 500);
  ensureSheetSize_(sheet, validationRows + 1, headers.length);

  moduleSpec.fields.forEach(function(field) {
    const index = headers.indexOf(field.key) + 1;
    if (!index) return;
    const range = sheet.getRange(2, index, validationRows, 1);
    range.setVerticalAlignment('middle');
    if (field.type === 'textarea' || field.key === 'notes' || field.key === 'description') range.setWrap(true);
    const format = field.numberFormat || defaultNumberFormat_(field.type);
    if (format) range.setNumberFormat(format);
    range.clearDataValidations();
    if (!moduleSpec.sensitive && field.type === 'select' && Array.isArray(field.options) && field.options.length) {
      range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(field.options, true).setAllowInvalid(false).setHelpText(field.helpText || ('Chọn một giá trị hợp lệ cho ' + field.label)).build());
    }
    if (!moduleSpec.sensitive && field.type === 'boolean') range.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
    if (!moduleSpec.sensitive && field.type === 'rating') range.setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(0, 5).setAllowInvalid(false).setHelpText('Nhập điểm từ 0 đến 5.').build());
    sheet.setColumnWidth(index, field.width || defaultFieldWidth_(field.type));
    if (field.hidden || moduleSpec.sensitive) {
      try { sheet.hideColumns(index); } catch (_) {}
    } else {
      try { sheet.showColumns(index); } catch (_) {}
    }
  });

  try { const filter = sheet.getFilter(); if (filter) filter.remove(); } catch (_) {}
  try { sheet.getBandings().forEach(function(banding) { banding.remove(); }); } catch (_) {}
  if (!moduleSpec.sensitive) {
    try { sheet.getRange(1, 1, Math.max(2, sheet.getLastRow()), headers.length).createFilter(); } catch (_) {}
    try { sheet.getRange(1, 1, Math.max(2, sheet.getLastRow()), headers.length).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false); } catch (_) {}
  }
}

function saveSchemaManifest_(spreadsheet, schema, hash) {
  let sheet = spreadsheet.getSheetByName(WOS_SCHEMA_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(WOS_SCHEMA_SHEET);
  const json = JSON.stringify(schema);
  const chunkSize = 40000;
  const chunks = [];
  for (let index = 0; index < json.length; index += chunkSize) chunks.push(json.slice(index, index + chunkSize));
  const updatedAt = new Date().toISOString();
  const rows = [['schemaVersion', 'schemaHash', 'schemaChunk', 'chunkIndex', 'chunkCount', 'updatedAt']]
    .concat(chunks.map(function(chunk, index) {
      return [schema.schemaVersion, hash, chunk, index + 1, chunks.length, updatedAt];
    }));
  sheet.clear();
  sheet.getRange(1, 1, rows.length, 6).setValues(rows);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
  if (rows.length > 1) sheet.getRange(2, 1, rows.length - 1, 6).setNumberFormat('@');
  sheet.setFrozenRows(1);
  try { sheet.hideSheet(); } catch (_) {}
}

function getSchemaState_() {
  const spreadsheet = getWeddingOSSpreadsheet_();
  const schema = readStoredSchema_(spreadsheet) || discoverSchemaFromWorkbook_(spreadsheet);
  if (!schema) return {schema: null, hash: '', version: 0, changes: []};
  const clean = validateSchemaManifest_(schema);
  const hash = sha256Hex_(JSON.stringify(clean));
  return {schema: clean, hash: hash, version: clean.schemaVersion, changes: []};
}

function readStoredSchema_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(WOS_SCHEMA_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(6, sheet.getLastColumn())).getValues();
  const chunks = rows.map(function(row) {
    return {index: Number(row[3] || 1), value: String(row[2] || '')};
  }).sort(function(left, right) { return left.index - right.index; });
  let json = chunks.map(function(item) { return item.value; }).join('');
  if (json.indexOf(WOS_JSON_PREFIX) === 0) json = json.slice(WOS_JSON_PREFIX.length);
  try {
    const decoded = JSON.parse(json);
    return decoded && typeof decoded === 'object' && !Array.isArray(decoded) ? decoded : null;
  } catch (_) {
    return null;
  }
}

function discoverSchemaFromWorkbook_(spreadsheet) {
  const modules = {};
  spreadsheet.getSheets().forEach(function(sheet) {
    const sheetName = sheet.getName();
    if (WOS_RESERVED_SHEETS.indexOf(sheetName) >= 0) return;
    if (!/^[a-z][a-z0-9_]{0,49}$/.test(sheetName)) return;
    const headers = readHeaderRow_(sheet);
    if (!headers.length || headers.indexOf('id') === -1) return;
    modules[sheetName] = {
      collection: sheetName,
      sheetName: sheetName,
      title: sheetName,
      dataShape: sheetName === 'lookups' ? 'lookupMap' : 'records',
      sensitive: sheetName === 'security' || sheetName === 'accounts',
      adminOnly: sheetName === 'security' || sheetName === 'accounts' || sheetName === 'settings' || sheetName === 'lookups',
      ownerScoped: sheetName === 'preferences',
      fields: headers.map(function(key) {
        return {
          key: key,
          label: key,
          type: inferFieldTypeFromKey_(key),
          required: key === 'id',
          hidden: key === 'id' || key === 'updatedAt',
          allowBlank: key !== 'id',
          width: defaultFieldWidth_(inferFieldTypeFromKey_(key))
        };
      })
    };
  });
  if (!Object.keys(modules).length) return null;
  return {appId: 'WeddingOS', schemaVersion: 1, modules: modules};
}

function validateSnapshot_(snapshot, schema) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) throw new Error('Snapshot không hợp lệ.');
  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    const value = snapshot[collection];
    if (moduleSpec.dataShape === 'lookupMap') {
      if (value !== undefined && (!value || typeof value !== 'object' || Array.isArray(value))) {
        throw new Error('Dữ liệu ' + collection + ' phải là object.');
      }
      if (value && Object.keys(value).length > WOS_MAX_RECORDS_PER_COLLECTION) throw new Error('Dữ liệu ' + collection + ' vượt giới hạn.');
      return;
    }
    if (value !== undefined && !Array.isArray(value)) throw new Error('Dữ liệu ' + collection + ' phải là mảng.');
    if ((value || []).length > WOS_MAX_RECORDS_PER_COLLECTION) throw new Error('Dữ liệu ' + collection + ' vượt giới hạn.');
  });
}

function countSnapshotRecords_(snapshot, schema) {
  return Object.keys(schema.modules).reduce(function(total, collection) {
    const moduleSpec = schema.modules[collection];
    const value = snapshot[collection];
    if (moduleSpec.dataShape === 'lookupMap') return total + (value && typeof value === 'object' ? Object.keys(value).length : 0);
    return total + (Array.isArray(value) ? value.length : 0);
  }, 0);
}

function writeSnapshot_(snapshot, schema) {
  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    let records;
    if (moduleSpec.dataShape === 'lookupMap') {
      records = Object.keys(snapshot[collection] || {}).map(function(key) {
        return {id: key, key: key, values: snapshot[collection][key], updatedAt: new Date().toISOString()};
      });
    } else {
      records = snapshot[collection] || [];
    }
    writeCollection_(collection, records.map(function(record) { return validateRecord_(record, moduleSpec); }), schema);
  });
}

function applyChanges_(changes, schema) {
  const grouped = {};
  changes.forEach(function(change) {
    if (!change || typeof change !== 'object') return;
    const collection = validateCollectionName_(change.collection, schema);
    if (!grouped[collection]) grouped[collection] = [];
    grouped[collection].push(change);
  });

  let applied = 0;
  Object.keys(grouped).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    const rows = readCollection_(collection, schema);
    const byId = {};
    rows.forEach(function(row) { byId[String(row.id)] = row; });

    grouped[collection].forEach(function(change) {
      const id = validateRecordId_(change.id);
      if (change.op === 'delete') {
        delete byId[id];
        applied += 1;
        return;
      }
      if (change.op !== 'upsert') throw new Error('Loại thay đổi không được hỗ trợ.');
      const record = validateRecord_(Object.assign({}, change.record || {}, {id: id}), moduleSpec);
      byId[id] = record;
      applied += 1;
    });

    writeCollection_(collection, Object.keys(byId).map(function(id) { return byId[id]; }), schema);
  });
  return applied;
}

function loadSnapshot_(schema) {
  if (!schema) return {};
  const snapshot = {};
  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    const rows = readCollection_(collection, schema);
    if (moduleSpec.dataShape === 'lookupMap') {
      snapshot[collection] = {};
      rows.forEach(function(row) {
        const key = String(row.key || row.id || '');
        if (key) snapshot[collection][key] = Array.isArray(row.values) ? row.values : [];
      });
    } else {
      snapshot[collection] = rows;
    }
  });
  return snapshot;
}

function writeCollection_(collection, records, schema) {
  collection = validateCollectionName_(collection, schema);
  if (records.length > WOS_MAX_RECORDS_PER_COLLECTION) throw new Error('Bộ dữ liệu vượt giới hạn.');
  const spreadsheet = getWeddingOSSpreadsheet_();
  const moduleSpec = schema.modules[collection];
  const sheet = spreadsheet.getSheetByName(moduleSpec.sheetName);
  if (!sheet) throw new Error('Thiếu sheet ' + moduleSpec.sheetName + '. Hãy cập nhật schema trước.');

  const headers = readHeaderRow_(sheet);
  if (!headers.length) throw new Error('Sheet ' + moduleSpec.sheetName + ' chưa có header.');
  const declaredFields = {};
  moduleSpec.fields.forEach(function(field) { declaredFields[field.key] = true; });
  const existingById = {};
  readCollection_(collection, schema).forEach(function(row) { existingById[String(row.id || '')] = row; });

  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, maxRows, Math.max(headers.length, 1)).clearContent();
  if (!records.length) {
    refreshDataFilter_(sheet, headers.length);
    return;
  }

  ensureSheetSize_(sheet, records.length + 1, headers.length);
  const values = records.map(function(record) {
    const previous = existingById[String(record.id || '')] || {};
    return headers.map(function(key) {
      const value = declaredFields[key] ? record[key] : previous[key];
      return encodeCell_(value);
    });
  });
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  refreshDataFilter_(sheet, headers.length);
}

function refreshDataFilter_(sheet, columnCount) {
  try {
    const filter = sheet.getFilter();
    if (filter) filter.remove();
    if (!sheet.isSheetHidden()) sheet.getRange(1, 1, Math.max(2, sheet.getLastRow()), columnCount).createFilter();
  } catch (_) {}
}

function readCollection_(collection, schema) {
  collection = validateCollectionName_(collection, schema);
  const moduleSpec = schema.modules[collection];
  const sheet = getWeddingOSSpreadsheet_().getSheetByName(moduleSpec.sheetName);
  if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return [];

  const rowCount = sheet.getLastRow();
  const colCount = sheet.getLastColumn();
  const rawValues = sheet.getRange(1, 1, rowCount, colCount).getValues();
  const displayValues = sheet.getRange(1, 1, rowCount, colCount).getDisplayValues();
  const headers = rawValues.shift().map(function(value) { return String(value || '').trim(); });
  displayValues.shift();
  const timezone = getWeddingOSSpreadsheet_().getSpreadsheetTimeZone() || Session.getScriptTimeZone();

  return rawValues.map(function(row, rowIndex) {
    const record = {};
    headers.forEach(function(key, index) {
      if (!key) return;
      const field = findField_(moduleSpec, key);
      record[key] = decodeFieldCell_(row[index], displayValues[rowIndex][index], field, timezone);
    });
    return record;
  }).filter(function(record) { return record.id; });
}

function validateRecord_(record, moduleSpec) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw apiError_('INVALID_RECORD', 'Bản ghi không hợp lệ.');
  const id = validateRecordId_(record.id);
  const clean = {id: id};
  const allowed = {};
  moduleSpec.fields.forEach(function(field) { allowed[field.key] = field; });

  Object.keys(record).forEach(function(key) {
    if (!allowed[key] || key === 'id') return;
    clean[key] = sanitizeFieldValue_(record[key], allowed[key]);
  });
  clean.id = id;

  moduleSpec.fields.forEach(function(field) {
    if (field.key === 'id') return;
    const value = clean[field.key];
    const blank = value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
    if (field.required && field.allowBlank === false && blank) {
      throw apiError_('REQUIRED_FIELD', 'Trường bắt buộc đang trống: ' + moduleSpec.collection + '.' + field.key + '.');
    }
  });
  return clean;
}

function sanitizeFieldValue_(value, field) {
  if (value === null || value === undefined) return '';
  if (field.type === 'number' || field.type === 'currency' || field.type === 'rating') {
    if (value === '') return '';
    const number = Number(value);
    if (!Number.isFinite(number)) throw apiError_('INVALID_NUMBER', 'Giá trị số không hợp lệ cho ' + field.key + '.');
    if (field.type === 'rating' && (number < 0 || number > 5)) throw apiError_('INVALID_RATING', 'Đánh giá phải từ 0 đến 5.');
    return number;
  }
  if (field.type === 'multiselect') {
    const values = Array.isArray(value) ? value : (value === '' ? [] : [value]);
    return values.slice(0, WOS_MAX_OPTIONS_PER_FIELD).map(function(item) { return safeText_(item, 500); });
  }
  if (field.type === 'boolean') return value === true || value === 1 || String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'có';
  if (field.type === 'json') {
    const encoded = JSON.stringify(value);
    if (encoded.length > 500000) throw apiError_('JSON_TOO_LARGE', 'Dữ liệu JSON vượt giới hạn cho ' + field.key + '.');
    return value;
  }
  if (typeof value === 'object') return value;
  const text = safeText_(value, 50000);
  if (field.type === 'date' && text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) throw apiError_('INVALID_DATE', 'Ngày không đúng YYYY-MM-DD cho ' + field.key + '.');
  if (field.type === 'time' && text && !/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) throw apiError_('INVALID_TIME', 'Giờ không đúng HH:mm cho ' + field.key + '.');
  if (field.type === 'datetime' && text && Number.isNaN(Date.parse(text))) throw apiError_('INVALID_DATETIME', 'Ngày giờ không hợp lệ cho ' + field.key + '.');
  if (field.type === 'url' && text) {
    if (!/^https?:\/\//i.test(text) || /^javascript:/i.test(text.trim())) throw apiError_('INVALID_URL', 'URL chỉ được phép dùng http hoặc https cho ' + field.key + '.');
  }
  if (field.type === 'select' && Array.isArray(field.options) && field.options.length && text && field.options.indexOf(text) === -1) {
    throw apiError_('INVALID_OPTION', 'Giá trị lựa chọn không hợp lệ cho ' + field.key + '.');
  }
  return text;
}

function decodeFieldCell_(raw, display, field, timezone) {
  const decoded = decodeCell_(raw);
  if (!field) return decoded;
  if (decoded instanceof Date) {
    if (field.type === 'date') return Utilities.formatDate(decoded, timezone, 'yyyy-MM-dd');
    if (field.type === 'time') return Utilities.formatDate(decoded, timezone, 'HH:mm');
    return decoded.toISOString();
  }
  if (field.type === 'date' || field.type === 'time' || field.type === 'datetime' || field.type === 'tel') {
    return typeof decoded === 'string' ? decoded : String(display || decoded || '');
  }
  return decoded;
}

function validateCollectionName_(collection, schema) {
  const name = validateIdentifier_(collection, 'collection', 50);
  if (!schema || !schema.modules || !schema.modules[name]) throw new Error('Bộ dữ liệu chưa đăng ký trong schema: ' + name);
  return name;
}

function validateRecordId_(id) {
  const value = String(id || '');
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(value)) throw new Error('ID bản ghi không hợp lệ.');
  return value;
}

function validateIdentifier_(value, label, maxLength) {
  const text = String(value || '');
  const expression = label === 'collection'
    ? /^[a-z][a-z0-9_]{0,49}$/
    : /^[A-Za-z][A-Za-z0-9_]{0,79}$/;
  if (!expression.test(text) || text.length > maxLength) throw new Error('Tên ' + label + ' không hợp lệ: ' + text);
  return text;
}

function validateSheetName_(value) {
  const name = String(value || '');
  if (!/^[a-z][a-z0-9_]{0,49}$/.test(name)) throw new Error('Tên sheet không hợp lệ: ' + name);
  if (WOS_RESERVED_SHEETS.indexOf(name) >= 0) throw new Error('Tên sheet được dành riêng: ' + name);
  return name;
}

function readHeaderRow_(sheet) {
  if (!sheet || sheet.getLastColumn() < 1) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(function(value) { return String(value || '').trim(); })
    .filter(Boolean);
}

function ensureSheetSize_(sheet, rows, columns) {
  if (sheet.getMaxRows() < rows) sheet.insertRowsAfter(sheet.getMaxRows(), rows - sheet.getMaxRows());
  if (sheet.getMaxColumns() < columns) sheet.insertColumnsAfter(sheet.getMaxColumns(), columns - sheet.getMaxColumns());
}

function findField_(moduleSpec, key) {
  for (let i = 0; i < moduleSpec.fields.length; i += 1) {
    if (moduleSpec.fields[i].key === key) return moduleSpec.fields[i];
  }
  return null;
}

function defaultNumberFormat_(type) {
  if (type === 'currency') return '#,##0 "₫"';
  if (type === 'number' || type === 'rating') return '0.########';
  if (type === 'date' || type === 'time' || type === 'datetime' || type === 'text' || type === 'textarea' || type === 'tel' || type === 'url') return '@';
  return '';
}

function defaultFieldWidth_(type) {
  if (type === 'textarea') return 260;
  if (type === 'url') return 220;
  if (type === 'currency') return 140;
  if (type === 'date' || type === 'datetime') return 130;
  if (type === 'time') return 95;
  if (type === 'number' || type === 'rating') return 100;
  return 150;
}

function inferFieldTypeFromKey_(key) {
  if (/date$/i.test(key) || /Date$/.test(key)) return 'date';
  if (/time$/i.test(key) || /Time$/.test(key)) return 'time';
  if (/url$/i.test(key) || /Url$/.test(key)) return 'url';
  if (/notes|description|includes|terms/i.test(key)) return 'textarea';
  if (/budget|cost|price|quote|deposit|paid|payable|actual|remaining|variance|value/i.test(key)) return 'currency';
  if (/rating/i.test(key)) return 'rating';
  if (/count|size|days|minutes|score|number/i.test(key)) return 'number';
  return 'text';
}

function encodeCell_(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value) || typeof value === 'object') return WOS_JSON_PREFIX + JSON.stringify(value);
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return WOS_TEXT_PREFIX + value;
  return value;
}

function decodeCell_(value) {
  if (typeof value !== 'string') return value;
  if (value.indexOf(WOS_JSON_PREFIX) === 0) {
    try { return JSON.parse(value.slice(WOS_JSON_PREFIX.length)); } catch (_) { return null; }
  }
  if (value.indexOf(WOS_TEXT_PREFIX) === 0) return value.slice(WOS_TEXT_PREFIX.length);
  return value;
}

function writeReadme_(spreadsheet, schema, hash, changes) {
  let sheet = spreadsheet.getSheetByName(WOS_README_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(WOS_README_SHEET);
  const rows = [
    ['WeddingOS Dynamic Schema', ''],
    ['Schema version', schema.schemaVersion],
    ['Schema hash', hash],
    ['Updated at', new Date().toISOString()],
    ['', ''],
    ['Quy tắc', 'Không đổi tên sheet hoặc header do WeddingOS quản lý. Không ghi công thức trực tiếp vào vùng dữ liệu.'],
    ['Ngày', 'Lưu dạng YYYY-MM-DD'],
    ['Giờ', 'Lưu dạng HH:mm'],
    ['Array/Object', WOS_JSON_PREFIX + '<JSON>'],
    ['Chuỗi nguy cơ công thức', WOS_TEXT_PREFIX + '<text>'],
    ['', ''],
    ['Modules', '']
  ];
  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    rows.push([collection, moduleSpec.sheetName + ' · ' + moduleSpec.fields.length + ' cột · ' + moduleSpec.dataShape + (moduleSpec.sensitive ? ' · NHẠY CẢM/ĐÃ BẢO VỆ' : '')]);
  });
  if (changes && changes.length) {
    rows.push(['', ''], ['Thay đổi schema gần nhất', '']);
    changes.forEach(function(change) { rows.push(['', change]); });
  }
  rows.push(['', ''], ['Kiểm tra', 'Chạy verifyWeddingOSWorkbook() trong Apps Script editor.']);

  try { sheet.getDataRange().breakApart(); } catch (_) {}
  sheet.clear();
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange(1, 1, 1, 2).merge().setValue('WeddingOS — Hướng dẫn cấu trúc dữ liệu')
    .setFontWeight('bold').setFontSize(16).setBackground('#0f172a').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 190);
  sheet.setColumnWidth(2, 620);
  sheet.getRange(1, 1, rows.length, 2).setWrap(true).setVerticalAlignment('top');
}

/**
 * Kiểm tra workbook theo schema động. Có thể chạy thủ công hoặc gọi action verifyWorkbook.
 */
function verifyWeddingOSWorkbook() {
  const state = getSchemaState_();
  if (!state.schema) throw new Error('Chưa có schema WeddingOS.');
  const schema = state.schema;
  const spreadsheet = getWeddingOSSpreadsheet_();
  const report = {
    checkedAt: new Date().toISOString(),
    schemaVersion: schema.schemaVersion,
    schemaHash: state.hash,
    ok: true,
    modules: {},
    errors: [],
    warnings: []
  };

  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    const sheet = spreadsheet.getSheetByName(moduleSpec.sheetName);
    const moduleReport = {sheet: moduleSpec.sheetName, records: 0, errors: [], warnings: []};
    report.modules[collection] = moduleReport;
    if (!sheet) {
      moduleReport.errors.push('Thiếu sheet.');
      report.errors.push(collection + ': thiếu sheet.');
      return;
    }

    if (moduleSpec.sensitive && !sheet.isSheetHidden()) moduleReport.errors.push('Sheet nhạy cảm chưa được ẩn.');
    if (moduleSpec.sensitive && !sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).length) moduleReport.errors.push('Sheet nhạy cảm chưa được bảo vệ.');
    const headers = readHeaderRow_(sheet);
    moduleSpec.fields.forEach(function(field) {
      if (headers.indexOf(field.key) === -1) moduleReport.errors.push('Thiếu cột ' + field.key + '.');
    });

    let rows = [];
    try { rows = readCollection_(collection, schema); } catch (error) { moduleReport.errors.push(safeErrorMessage_(error)); }
    moduleReport.records = rows.length;
    const ids = {};
    rows.forEach(function(row, index) {
      const rowNo = index + 2;
      const id = String(row.id || '');
      if (!id) moduleReport.errors.push('Dòng ' + rowNo + ': ID trống.');
      else if (ids[id]) moduleReport.errors.push('Dòng ' + rowNo + ': ID trùng ' + id + '.');
      ids[id] = true;

      moduleSpec.fields.forEach(function(field) {
        const value = row[field.key];
        if (value === '' || value === null || value === undefined) return;
        if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) moduleReport.warnings.push('Dòng ' + rowNo + ': ' + field.key + ' không đúng YYYY-MM-DD.');
        if (field.type === 'time' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value))) moduleReport.warnings.push('Dòng ' + rowNo + ': ' + field.key + ' không đúng HH:mm.');
        if (field.type === 'rating' && (Number(value) < 0 || Number(value) > 5)) moduleReport.errors.push('Dòng ' + rowNo + ': rating ngoài 0–5.');
        if (field.key === 'score' && (Number(value) < 0 || Number(value) > 10)) moduleReport.errors.push('Dòng ' + rowNo + ': score ngoài 0–10.');
        if (field.type === 'url' && /^javascript:/i.test(String(value).trim())) moduleReport.errors.push('Dòng ' + rowNo + ': URL nguy hiểm.');
      });
    });

    if (moduleReport.errors.length) report.errors = report.errors.concat(moduleReport.errors.map(function(item) { return collection + ': ' + item; }));
    if (moduleReport.warnings.length) report.warnings = report.warnings.concat(moduleReport.warnings.map(function(item) { return collection + ': ' + item; }));
  });

  report.ok = report.errors.length === 0;
  appendVerificationReport_(spreadsheet, report);
  return report;
}

function appendVerificationReport_(spreadsheet, report) {
  let sheet = spreadsheet.getSheetByName(WOS_README_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(WOS_README_SHEET);
  const start = sheet.getLastRow() + 2;
  const rows = [
    ['KẾT QUẢ KIỂM TRA ' + report.checkedAt, report.ok ? 'ĐẠT' : 'CÓ LỖI'],
    ['Lỗi', report.errors.length],
    ['Cảnh báo', report.warnings.length]
  ];
  report.errors.slice(0, 100).forEach(function(item) { rows.push(['ERROR', item]); });
  report.warnings.slice(0, 100).forEach(function(item) { rows.push(['WARNING', item]); });
  sheet.getRange(start, 1, rows.length, 2).setValues(rows).setWrap(true);
  sheet.getRange(start, 1, 1, 2).setFontWeight('bold').setBackground(report.ok ? '#dcfce7' : '#fee2e2');
}

function publicSchemaState_(state) {
  return {
    version: Number(state.version || 0),
    hash: String(state.hash || ''),
    modules: state.schema ? Object.keys(state.schema.modules) : []
  };
}


function apiError_(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function safeErrorCode_(error) {
  return safeText_(error && error.code ? error.code : 'SERVER_ERROR', 80);
}

function ensureSessionSecret_() {
  const properties = PropertiesService.getScriptProperties();
  let secret = String(properties.getProperty(WOS_SESSION_SECRET_KEY) || '');
  if (!secret) {
    secret = randomToken_(48);
    properties.setProperty(WOS_SESSION_SECRET_KEY, secret);
  }
  return secret;
}

function randomToken_(bytes) {
  const seed = Utilities.getUuid() + '|' + Utilities.getUuid() + '|' + new Date().getTime() + '|' + Math.random();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, seed, Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, Math.max(8, Number(bytes || 32) - 32));
}

function sha256Base64_(value) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8));
}

function cacheKey_(prefix, value) {
  return prefix + sha256Hex_(String(value || '')).slice(0, 48);
}

function getDataRevision_() {
  return Math.max(0, Number(PropertiesService.getScriptProperties().getProperty(WOS_DATA_REVISION_KEY) || 0));
}

function incrementDataRevision_() {
  const properties = PropertiesService.getScriptProperties();
  const next = getDataRevision_() + 1;
  properties.setProperty(WOS_DATA_REVISION_KEY, String(next));
  return next;
}

function assertBaseRevision_(baseRevision) {
  const current = getDataRevision_();
  const supplied = Number(baseRevision);
  if (!Number.isFinite(supplied) || supplied !== current) {
    throw apiError_('REVISION_CONFLICT', 'Dữ liệu Google Sheets đã thay đổi trên thiết bị khác. Hãy tải lại dữ liệu trước khi đồng bộ.');
  }
}

function buildPublicStatus_() {
  const state = getSchemaState_();
  const accountCount = state.schema && state.schema.modules.accounts ? readCollection_('accounts', state.schema).length : 0;
  return {
    success: true,
    app: 'WeddingOS',
    bridgeVersion: '9',
    initialized: Boolean(state.schema),
    hasData: Boolean(state.schema && workbookHasData_(state.schema)),
    accountCount: accountCount,
    requiresAccountLogin: accountCount > 0,
    requiresConnectionPassword: hasWeddingOSPassword_(),
    revision: getDataRevision_(),
    schema: publicSchemaState_(state)
  };
}

function workbookHasData_(schema) {
  if (!schema) return false;
  const spreadsheet = getWeddingOSSpreadsheet_();
  return Object.keys(schema.modules).some(function(collection) {
    const moduleSpec = schema.modules[collection];
    const sheet = spreadsheet.getSheetByName(moduleSpec.sheetName);
    return sheet && sheet.getLastRow() > 1;
  });
}

function getAccountRows_() {
  const state = getSchemaState_();
  if (!state.schema || !state.schema.modules.accounts) return [];
  return readCollection_('accounts', state.schema);
}

function getSecurityRecord_() {
  const state = getSchemaState_();
  if (!state.schema || !state.schema.modules.security) return null;
  return readCollection_('security', state.schema).filter(function(row) {
    return row.id === 'security-settings-access' || row.kind === 'settingsAccess';
  })[0] || null;
}

function getLoginFailureKey_(subject) { return cacheKey_('wos_fail_', subject); }

function assertLoginAllowed_(subject) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get(getLoginFailureKey_(subject));
  if (!raw) return;
  const state = JSON.parse(raw);
  if (Number(state.count || 0) >= WOS_MAX_LOGIN_FAILURES) throw apiError_('LOGIN_THROTTLED', 'Đã có quá nhiều lần đăng nhập thất bại. Hãy thử lại sau 15 phút.');
}

function recordLoginFailure_(subject) {
  const cache = CacheService.getScriptCache();
  const key = getLoginFailureKey_(subject);
  let count = 0;
  try { count = Number(JSON.parse(cache.get(key) || '{}').count || 0); } catch (_) {}
  cache.put(key, JSON.stringify({count: count + 1, updatedAt: new Date().toISOString()}), WOS_LOGIN_LOCK_SECONDS);
}

function clearLoginFailures_(subject) { CacheService.getScriptCache().remove(getLoginFailureKey_(subject)); }

function createChallenge_(kind, subject, metadata) {
  const nonce = randomToken_(32);
  CacheService.getScriptCache().put(cacheKey_('wos_chal_', nonce), JSON.stringify({kind: kind, subject: subject, metadata: metadata || {}, createdAt: new Date().toISOString()}), WOS_CHALLENGE_TTL_SECONDS);
  return nonce;
}

function consumeChallenge_(nonce, kind, subject) {
  const cache = CacheService.getScriptCache();
  const key = cacheKey_('wos_chal_', nonce);
  const raw = cache.get(key);
  cache.remove(key);
  if (!raw) throw apiError_('CHALLENGE_EXPIRED', 'Yêu cầu xác thực đã hết hạn. Hãy thử đăng nhập lại.');
  const challenge = JSON.parse(raw);
  if (challenge.kind !== kind || challenge.subject !== subject) throw apiError_('INVALID_CHALLENGE', 'Yêu cầu xác thực không hợp lệ.');
  return challenge;
}

function handleLoginChallenge_(body) {
  const usernameHash = safeText_(body.usernameHash, 200);
  if (!usernameHash) throw apiError_('INVALID_LOGIN', 'Thông tin đăng nhập không hợp lệ.');
  assertLoginAllowed_(usernameHash);
  const row = getAccountRows_().filter(function(item) { return constantTimeEquals_(item.usernameHash, usernameHash); })[0];
  const usable = row && row.status !== 'locked';
  const subject = usernameHash;
  const nonce = createChallenge_('account', subject, {accountId: usable ? row.id : ''});
  return {
    success: true,
    nonce: nonce,
    passwordSalt: usable ? String(row.passwordSalt || '') : Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, randomToken_(24), Utilities.Charset.UTF_8)).slice(0, 24),
    passwordIterations: usable ? Number(row.passwordIterations || row.iterations || WOS_DEFAULT_PASSWORD_ITERATIONS) : WOS_DEFAULT_PASSWORD_ITERATIONS,
    requestId: safeText_(body.requestId, 120)
  };
}

function handleLogin_(body) {
  const usernameHash = safeText_(body.usernameHash, 200);
  const nonce = safeText_(body.nonce, 300);
  const proof = safeText_(body.proof, 300);
  assertLoginAllowed_(usernameHash);
  const challenge = consumeChallenge_(nonce, 'account', usernameHash);
  const row = getAccountRows_().filter(function(item) { return item.id === challenge.metadata.accountId && constantTimeEquals_(item.usernameHash, usernameHash); })[0];
  if (!row || row.status === 'locked') {
    recordLoginFailure_(usernameHash);
    throw apiError_('INVALID_LOGIN', 'Tên đăng nhập hoặc mật khẩu không đúng.');
  }
  const expected = sha256Base64_(String(row.passwordHash || '') + '.' + nonce + '.' + usernameHash);
  if (!constantTimeEquals_(expected, proof)) {
    recordLoginFailure_(usernameHash);
    throw apiError_('INVALID_LOGIN', 'Tên đăng nhập hoặc mật khẩu không đúng.');
  }
  clearLoginFailures_(usernameHash);
  const access = createSession_({accountId: row.id, role: 'user', displayName: row.displayName || row.usernameLabel || 'Người dùng', username: row.usernameLabel || '', userCode: row.userCode || ''});
  auditRequest_(body, access, 'login', 'success', 'accounts', row.id, '', getDataRevision_());
  return {success: true, sessionToken: access.sessionToken, expiresAt: access.expiresAt, profile: publicAccessProfile_(access), revision: getDataRevision_(), requestId: safeText_(body.requestId, 120)};
}

function handleAdminChallenge_(body) {
  assertLoginAllowed_('admin');
  const row = getSecurityRecord_();
  if (!row) throw apiError_('ADMIN_NOT_INITIALIZED', 'Chưa có mật khẩu quản trị trên Google Sheets. Hãy dùng mật khẩu kết nối để đồng bộ khởi tạo v9 trước.');
  const nonce = createChallenge_('admin', 'admin', {});
  return {success: true, nonce: nonce, passwordSalt: String(row.passwordSalt || ''), passwordIterations: Number(row.passwordIterations || row.iterations || WOS_DEFAULT_PASSWORD_ITERATIONS), requestId: safeText_(body.requestId, 120)};
}

function handleAdminLogin_(body) {
  const nonce = safeText_(body.nonce, 300);
  const proof = safeText_(body.proof, 300);
  assertLoginAllowed_('admin');
  consumeChallenge_(nonce, 'admin', 'admin');
  const row = getSecurityRecord_();
  if (!row) throw apiError_('ADMIN_NOT_INITIALIZED', 'Chưa có mật khẩu quản trị.');
  const expected = sha256Base64_(String(row.passwordVerifier || '') + '.' + nonce + '.admin');
  if (!constantTimeEquals_(expected, proof)) {
    recordLoginFailure_('admin');
    throw apiError_('INVALID_ADMIN_LOGIN', 'Mật khẩu quản trị không đúng.');
  }
  clearLoginFailures_('admin');
  const access = createSession_({accountId: 'admin', role: 'admin', displayName: 'Quản trị viên', username: 'Administrator', userCode: 'ADMIN'});
  auditRequest_(body, access, 'adminLogin', 'success', 'security', row.id, '', getDataRevision_());
  return {success: true, sessionToken: access.sessionToken, expiresAt: access.expiresAt, profile: publicAccessProfile_(access), revision: getDataRevision_(), requestId: safeText_(body.requestId, 120)};
}

function createSession_(profile) {
  ensureSessionSecret_();
  const token = randomToken_(64);
  const expiresAt = new Date(Date.now() + WOS_SESSION_TTL_SECONDS * 1000).toISOString();
  const session = {accountId: profile.accountId, role: profile.role, displayName: profile.displayName, username: profile.username, userCode: profile.userCode, expiresAt: expiresAt};
  CacheService.getScriptCache().put(cacheKey_('wos_sess_', token), JSON.stringify(session), WOS_SESSION_TTL_SECONDS);
  return Object.assign({sessionToken: token}, session);
}

function validateSessionToken_(token) {
  const value = String(token || '');
  if (!value) return null;
  const raw = CacheService.getScriptCache().get(cacheKey_('wos_sess_', value));
  if (!raw) return null;
  const session = JSON.parse(raw);
  if (Date.parse(session.expiresAt) <= Date.now()) return null;
  if (session.role === 'user') {
    const row = getAccountRows_().filter(function(item) { return item.id === session.accountId; })[0];
    if (!row || row.status === 'locked') return null;
    session.displayName = row.displayName || row.usernameLabel || session.displayName;
    session.username = row.usernameLabel || session.username;
    session.userCode = row.userCode || session.userCode;
  }
  return Object.assign({sessionToken: value}, session);
}

function handleLogout_(body) {
  const token = String(body.sessionToken || '');
  if (token) CacheService.getScriptCache().remove(cacheKey_('wos_sess_', token));
  return {success: true, requestId: safeText_(body.requestId, 120)};
}

function resolveAccess_(body, options) {
  const session = validateSessionToken_(body.sessionToken);
  if (session) return session;
  const accountCount = getAccountRows_().length;
  if (options && options.allowBootstrap) {
    if (hasWeddingOSPassword_()) {
      verifyWeddingOSPassword_(body.password);
      return {accountId: 'bootstrap-admin', role: 'admin', displayName: 'Quản trị khôi phục', username: 'Bootstrap', userCode: 'BOOTSTRAP', sessionToken: '', expiresAt: ''};
    }
    if (accountCount === 0) return {accountId: 'bootstrap-admin', role: 'admin', displayName: 'Quản trị khởi tạo', username: 'Bootstrap', userCode: 'BOOTSTRAP', sessionToken: '', expiresAt: ''};
  }
  throw apiError_('AUTH_REQUIRED', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
}

function requireAdmin_(access) {
  if (!access || access.role !== 'admin') throw apiError_('FORBIDDEN', 'Chỉ tài khoản quản trị được phép thực hiện thao tác này.');
}

function publicAccessProfile_(access) {
  return {id: access.accountId, userCode: access.userCode || '', displayName: access.displayName || '', username: access.username || '', status: 'active', kind: access.role === 'admin' ? 'admin' : 'account', role: access.role};
}

function ensureSchemaForAccess_(body, access) {
  if (!body.schema) {
    const state = getSchemaState_();
    if (!state.schema) throw apiError_('SCHEMA_MISSING', 'Google Sheets chưa có schema. Hãy đồng bộ khởi tạo bằng tài khoản quản trị.');
    return state;
  }
  const clean = validateSchemaManifest_(body.schema);
  const incomingHash = sha256Hex_(JSON.stringify(clean));
  const state = getSchemaState_();
  if (state.schema && state.hash === incomingHash && schemaStructureComplete_(getWeddingOSSpreadsheet_(), clean)) return {schema: clean, hash: incomingHash, version: clean.schemaVersion, changes: []};
  requireAdmin_(access);
  verifySchemaAdminPassword_(body.schemaPassword, body.password);
  return ensureWorkbookSchema_(clean, body.forceSchema === true);
}

function assertSnapshotAllowed_(snapshot, schema, access) {
  requireAdmin_(access);
  Object.keys(snapshot).forEach(function(collection) {
    if (!schema.modules[collection]) throw apiError_('UNKNOWN_COLLECTION', 'Collection chưa đăng ký: ' + collection);
  });
}

function assertChangesAllowed_(changes, schema, access) {
  changes.forEach(function(change) {
    const collection = validateCollectionName_(change.collection, schema);
    const moduleSpec = schema.modules[collection];
    if (access.role === 'admin') return;
    if (moduleSpec.adminOnly || moduleSpec.sensitive) throw apiError_('FORBIDDEN_COLLECTION', 'Tài khoản hiện tại không được phép thay đổi ' + collection + '.');
    if (moduleSpec.ownerScoped) {
      if (change.op === 'delete') {
        const expectedId = 'preference-' + String(access.accountId).replace(/[^A-Za-z0-9_-]/g, '-');
        if (change.id !== expectedId) throw apiError_('FORBIDDEN_RECORD', 'Không được phép xóa tùy chọn của tài khoản khác.');
      } else if (!change.record || String(change.record.accountId || '') !== String(access.accountId)) {
        throw apiError_('FORBIDDEN_RECORD', 'Không được phép thay đổi dữ liệu của tài khoản khác.');
      }
    }
  });
}

function loadSnapshotForAccess_(schema, access) {
  const snapshot = loadSnapshot_(schema);
  if (!schema || access.role === 'admin') return snapshot;
  Object.keys(schema.modules).forEach(function(collection) {
    const moduleSpec = schema.modules[collection];
    if (moduleSpec.sensitive || collection === 'accounts' || collection === 'security') delete snapshot[collection];
    else if (moduleSpec.ownerScoped && Array.isArray(snapshot[collection])) snapshot[collection] = snapshot[collection].filter(function(row) { return String(row.accountId || '') === String(access.accountId); });
  });
  return snapshot;
}

function handlePasswordChangeChallenge_(body, access) {
  if (!access || access.role !== 'user') throw apiError_('FORBIDDEN', 'Chỉ tài khoản người dùng được đổi mật khẩu theo luồng này.');
  const row = getAccountRows_().filter(function(item) { return item.id === access.accountId; })[0];
  if (!row || row.status === 'locked') throw apiError_('ACCOUNT_UNAVAILABLE', 'Tài khoản không còn hoạt động.');
  const nonce = createChallenge_('passwordChange', access.accountId, {});
  return {success: true, nonce: nonce, usernameHash: String(row.usernameHash || ''), passwordSalt: String(row.passwordSalt || ''), passwordIterations: Number(row.passwordIterations || row.iterations || WOS_DEFAULT_PASSWORD_ITERATIONS), requestId: safeText_(body.requestId, 120)};
}

function handleOwnPasswordChange_(body, access) {
  if (!access || access.role !== 'user') throw apiError_('FORBIDDEN', 'Chỉ tài khoản người dùng được đổi mật khẩu theo luồng này.');
  const nonce = safeText_(body.nonce, 300);
  consumeChallenge_(nonce, 'passwordChange', access.accountId);
  const state = getSchemaState_();
  const rows = readCollection_('accounts', state.schema);
  const row = rows.filter(function(item) { return item.id === access.accountId; })[0];
  if (!row || row.status === 'locked') throw apiError_('ACCOUNT_UNAVAILABLE', 'Tài khoản không còn hoạt động.');
  const currentExpected = sha256Base64_(String(row.passwordHash || '') + '.' + nonce + '.' + row.usernameHash);
  if (!constantTimeEquals_(currentExpected, safeText_(body.currentProof, 300))) throw apiError_('INVALID_PASSWORD', 'Mật khẩu hiện tại không đúng.');
  const newHash = safeText_(body.newPasswordHash, 300);
  const newSalt = safeText_(body.newPasswordSalt, 300);
  const newIterations = Number(body.newPasswordIterations || WOS_DEFAULT_PASSWORD_ITERATIONS);
  if (!newHash || !newSalt || !Number.isInteger(newIterations) || newIterations < 50000 || newIterations > 1000000) throw apiError_('INVALID_NEW_PASSWORD', 'Thông tin mật khẩu mới không hợp lệ.');
  row.passwordHash = newHash;
  row.passwordSalt = newSalt;
  row.passwordIterations = newIterations;
  row.passwordAlgorithm = 'PBKDF2-SHA256-256';
  row.updatedAt = new Date().toISOString();
  const index = rows.findIndex(function(item) { return item.id === row.id; });
  rows[index] = validateRecord_(row, state.schema.modules.accounts);
  writeCollection_('accounts', rows, state.schema);
  const revision = incrementDataRevision_();
  return {success: true, revision: revision, requestId: safeText_(body.requestId, 120)};
}

function protectSensitiveSheet_(sheet, moduleSpec) {
  try { sheet.hideSheet(); } catch (_) {}
  try {
    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function(protection) {
      if (String(protection.getDescription() || '').indexOf('WeddingOS v9') === 0) protection.remove();
    });
    const protection = sheet.protect().setDescription('WeddingOS v9 · ' + moduleSpec.collection + ' · dữ liệu nhạy cảm');
    protection.setWarningOnly(false);
    try { protection.removeEditors(protection.getEditors()); } catch (_) {}
    try { if (protection.canDomainEdit()) protection.setDomainEdit(false); } catch (_) {}
  } catch (_) {}
}

function ensureAuditSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(WOS_LOG_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(WOS_LOG_SHEET);
  const headers = ['timestamp','requestId','actorId','role','action','status','collection','recordId','operation','detail','revision','clientVersion'];
  ensureSheetSize_(sheet, 2, headers.length);
  sheet.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#111827').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  try { sheet.hideSheet(); } catch (_) {}
  try {
    const existing = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).filter(function(p){return String(p.getDescription()||'').indexOf('WeddingOS v9 audit')===0;});
    if (!existing.length) {
      const protection = sheet.protect().setDescription('WeddingOS v9 audit log');
      protection.setWarningOnly(false);
      try { protection.removeEditors(protection.getEditors()); } catch (_) {}
      try { if (protection.canDomainEdit()) protection.setDomainEdit(false); } catch (_) {}
    }
  } catch (_) {}
  return sheet;
}

function auditRequest_(body, access, action, status, collection, recordId, detail, revision) {
  const spreadsheet = getWeddingOSSpreadsheet_();
  const sheet = ensureAuditSheet_(spreadsheet);
  sheet.appendRow([
    new Date().toISOString(), safeText_(body && body.requestId,120), safeText_(access && access.accountId || 'anonymous',120), safeText_(access && access.role || '',30),
    safeText_(action,60), safeText_(status,20), safeText_(collection,50), safeText_(recordId,120), safeText_(detail,200),
    status === 'error' ? safeText_(detail,500) : '', Number(revision || 0), safeText_(body && body.clientVersion,30)
  ]);
}

function installWeddingOSDailyNotificationTrigger() {
  removeWeddingOSDailyNotificationTrigger();
  ScriptApp.newTrigger('refreshWeddingOSNotifications').timeBased().everyDays(1).atHour(7).create();
  return 'Đã cài trigger tạo cảnh báo WeddingOS hằng ngày lúc khoảng 07:00.';
}

function removeWeddingOSDailyNotificationTrigger() {
  ScriptApp.getProjectTriggers().filter(function(trigger) { return trigger.getHandlerFunction() === 'refreshWeddingOSNotifications'; }).forEach(function(trigger) { ScriptApp.deleteTrigger(trigger); });
  return 'Đã xóa trigger cảnh báo WeddingOS.';
}

function refreshWeddingOSNotifications() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const state = getSchemaState_();
    if (!state.schema || !state.schema.modules.notifications) return 'Schema chưa có module notifications.';
    const snapshot = loadSnapshot_(state.schema);
    const timezone = getWeddingOSSpreadsheet_().getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    const today = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');
    const existing = {};
    (snapshot.notifications || []).forEach(function(row) { existing[row.id] = row; });
    const items = [];
    function add(id, type, tone, title, message, collection, recordId, eventDate) {
      const previous = existing[id] || {};
      items.push({id:id,accountId:'all',type:type,tone:tone,title:title,message:message,collection:collection||'',recordId:recordId||'',eventDate:eventDate||today,readAt:previous.readAt||'',createdAt:previous.createdAt||new Date().toISOString(),signature:id,updatedAt:new Date().toISOString()});
    }
    const settings = {};
    (snapshot.settings || []).forEach(function(row){settings[row.key]=row.value;});
    const settingsDates = {registrationDate:'Đăng ký kết hôn',engagementDate:'Lễ ăn hỏi',pickupDate:'Rước dâu',groomPartyDate:'Tiệc nhà trai',bridePartyDate:'Tiệc nhà gái'};
    Object.keys(settingsDates).forEach(function(key){if(settings[key]===today)add('settings-'+key+'-'+today,'date','date',settingsDates[key]+' diễn ra hôm nay','Ngày '+today+' là mốc '+settingsDates[key].toLowerCase()+'.','settings','',today);});
    const dateFields = {checklist:['dueDate'],timeline:['eventDate'],budget:['dueDate'],vendors:['decisionDue']};
    Object.keys(dateFields).forEach(function(collection){(snapshot[collection]||[]).forEach(function(row){dateFields[collection].forEach(function(field){if(row[field]===today && ['Hoàn thành','Hủy','Loại'].indexOf(String(row.status||''))===-1)add(collection+'-'+row.id+'-'+field+'-'+today,'date','date','Có nội dung đến hạn hôm nay',String(row.task||row.event||row.category||row.name||'Bản ghi')+' · '+field+': '+today,collection,row.id,today);});});});
    (snapshot.budget||[]).forEach(function(row){const budgeted=Number(row.budgeted||0);if(budgeted<=0)return;const used=Number(row.actual||0)+Number(row.payable||0);const remaining=budgeted-used;const ratio=remaining/budgeted;if(remaining<0)add('budget-over-'+row.id,'budget','danger',String(row.category||'Hạng mục')+' đã vượt ngân sách','Vượt '+Math.abs(remaining)+' VND trên ngân sách '+budgeted+' VND.','budget',row.id,today);else if(ratio<0.1)add('budget-low-'+row.id,'budget','warning',String(row.category||'Hạng mục')+' sắp hết ngân sách','Chỉ còn '+Math.max(0,Math.round(ratio*100))+'% ngân sách.','budget',row.id,today);});
    writeCollection_('notifications', items.map(function(row){return validateRecord_(row,state.schema.modules.notifications);}), state.schema);
    const revision=incrementDataRevision_();
    auditRequest_({requestId:'trigger-'+Utilities.getUuid(),clientVersion:'server-v9'}, {accountId:'system',role:'system'}, 'refreshNotifications','success','notifications','',String(items.length),revision);
    return 'Đã tạo '+items.length+' cảnh báo. Revision '+revision+'.';
  } finally { try { lock.releaseLock(); } catch (_) {} }
}

function safeText_(value, maxLength) {
  return String(value === null || value === undefined ? '' : value).slice(0, maxLength);
}

function uniqueStrings_(values, maxLength) {
  const seen = {};
  const result = [];
  values.forEach(function(value) {
    const text = safeText_(value, maxLength).trim();
    if (!text || seen[text]) return;
    seen[text] = true;
    result.push(text);
  });
  return result;
}

function clampInteger_(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function sha256Hex_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8)
    .map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); })
    .join('');
}

function constantTimeEquals_(a, b) {
  const left = String(a || '');
  const right = String(b || '');
  let diff = left.length ^ right.length;
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i += 1) {
    diff |= (left.charCodeAt(i % Math.max(left.length, 1)) || 0) ^
            (right.charCodeAt(i % Math.max(right.length, 1)) || 0);
  }
  return diff === 0;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeErrorMessage_(error) {
  const message = error && error.message ? String(error.message) : 'Unknown error.';
  return message.slice(0, 500);
}
