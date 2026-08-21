/*
PROJECT DEPENDENCIES:
- File này được index.html nạp ngay trước </body> bằng: <script src="script.js"></script>
- JavaScript phụ thuộc trực tiếp vào cấu trúc, class và ID trong index.html.
- Toàn bộ thiết kế và CSS nằm trong style.css.
- Thư viện Lucide vẫn được index.html nạp từ CDN trước script.js.
- Khi phân tích hoặc chỉnh sửa, cần có đủ index.html, style.css và script.js; nếu thiếu file nào, hãy yêu cầu bổ sung trước khi xử lý.
*/

    (() => {
      try {
        const saved = localStorage.getItem('wedding-ui-theme');
        const dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      } catch (_) {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      }
    })();
  
const storage = {
  get(key, fallback='') { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch (_) { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, String(value)); return true; } catch (_) { return false; } },
  remove(key) { try { localStorage.removeItem(key); return true; } catch (_) { return false; } }
};

const secrets = {
  get(key, fallback='') {
    try {
      const current = sessionStorage.getItem(key);
      if (current !== null) return current;
      const legacy = localStorage.getItem(key);
      if (legacy !== null) {
        sessionStorage.setItem(key, legacy);
        localStorage.removeItem(key);
        return legacy;
      }
      return fallback;
    } catch (_) { return fallback; }
  },
  set(key, value) {
    try {
      if (value) sessionStorage.setItem(key, String(value)); else sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      return true;
    } catch (_) { return false; }
  },
  remove(key) {
    try { sessionStorage.removeItem(key); localStorage.removeItem(key); return true; } catch (_) { return false; }
  }
};


// Connection credentials are intentionally persistent on the current device.
// They are never added to shared URLs or exported JSON backups.
const connectionSecrets = {
  get(key, fallback='') {
    try {
      const persistent = localStorage.getItem(key);
      if (persistent !== null) return persistent;
      const legacySession = sessionStorage.getItem(key);
      if (legacySession !== null) {
        localStorage.setItem(key, legacySession);
        sessionStorage.removeItem(key);
        return legacySession;
      }
      return fallback;
    } catch (_) { return fallback; }
  },
  set(key, value) {
    try {
      if (value) localStorage.setItem(key, String(value)); else localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      return true;
    } catch (_) { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); sessionStorage.removeItem(key); return true; } catch (_) { return false; }
  }
};

const INITIAL_DATA = {
  checklist:[], timeline:[], budget:[], guests:[], vendors:[], references:[],
  attachments:[], settings:[], security:[], accounts:[], preferences:[], notifications:[], lookup_items:[]
};

const CONFIG = {
  storageKey: 'wedding-os-preview-v4-cache',
  legacyStorageKey: 'wedding-os-preview-v3',
  pendingKey: 'wedding-os-pending-changes-v1',
  endpointKey: 'wedding-os-google-sheets-endpoint',
  passwordKey: 'wedding-os-google-sheets-password',
  schemaPasswordKey: 'wedding-os-google-sheets-schema-password',
  endpointUrlParam: 'wos_endpoint',
  schemaVersion: 13,
  syncProtocolVersion: 2,
  deviceIdKey: 'wedding-os-device-id-v2',
  conflictKey: 'wedding-os-sync-conflicts-v2',
  migrationReportKey: 'wedding-os-v10-migration-report',
  schemaEndpointKey: 'wedding-os-schema-endpoint-v1',
  schemaSignatureKey: 'wedding-os-schema-signature-v1',
  remoteSchemaHashKey: 'wedding-os-remote-schema-hash-v1',
  fullSyncEndpointKey: 'wedding-os-full-sync-endpoint-v1',
  lastFullSyncAtKey: 'wedding-os-last-full-sync-at-v1',
  filterPresetsKey: 'wedding-os-filter-presets-v1',
  themeKey: 'wedding-ui-theme',
  accentKey: 'wedding-accent-theme',
  accountSessionKey: 'wedding-os-current-account-v1',
  accountProfileKey: 'wedding-os-current-account-profile-v1',

  accountServerSessionKey: 'wedding-os-server-account-session-v1',
  adminServerSessionKey: 'wedding-os-server-admin-session-v1',
  remoteRevisionKey: 'wedding-os-remote-revision-v1',
  remoteStatusKey: 'wedding-os-remote-status-v1',
  sensitiveSessionKey: 'wedding-os-sensitive-session-v1',
  sensitivePendingKey: 'wedding-os-sensitive-pending-v1',
  rememberLoginKey: 'wedding-os-remember-login-v1',
  rememberedAuthKey: 'wedding-os-remembered-auth-v1',
  userCachePrefix: 'wedding-os-user-cache-v1:',
  userPendingPrefix: 'wedding-os-user-pending-v1:',

  networkTimeouts: Object.freeze({
    default: 90000,
    status: 20000,
    auth: 20000,
    load: 180000,
    schema: 240000,
    delta: 240000,
    full: 330000,
    attachment: 240000
  }),
  autoSyncIntervalMs: 15 * 1000,
  mutationSyncDelayMs: 750,
  attachmentMaxFiles: 5,
  attachmentMaxBytes: 10 * 1024 * 1024,

  pageSize: 20,
  lookupPageSize: 5,
  nav: [
    {id:'dashboard', label:'Tổng quan', icon:'layout-dashboard', tone:'blue', description:'Sức khỏe kế hoạch'},
    {id:'checklist', label:'Công việc', icon:'list-checks', tone:'emerald', description:'Quản lý công việc'},
    {id:'timeline', label:'Timeline', icon:'calendar-clock', tone:'indigo', description:'Lịch trình sự kiện'},
    {id:'budget', label:'Ngân sách', icon:'wallet-cards', tone:'amber', description:'Theo dõi dòng tiền'},
    {id:'guests', label:'Khách mời', icon:'users-round', tone:'violet', description:'Xác nhận và xếp bàn'},
    {id:'vendors', label:'Nhà cung cấp', icon:'store', tone:'orange', description:'Báo giá và hợp đồng'},
    {id:'references', label:'Tham khảo', icon:'book-open-check', tone:'rose', description:'Nguồn ý tưởng và đánh giá'},
    {id:'guide', label:'Hướng dẫn', icon:'book-open-text', tone:'indigo', description:'Logic liên kết & công thức'},
    {id:'settings', label:'Thiết lập', icon:'settings-2', tone:'cyan', description:'Thông tin và danh mục'}
  ],
  schemas: {
    checklist: {
      title:'Công việc', singular:'công việc', icon:'list-checks',
      search:['task','group','anchorEvent','owner','location','budgetCategory'],
      filterFields:['group','anchorEvent','location','owner','priority','status','budgetCategory'],
      statusField:'status', filterOptions:['Tất cả','Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],
      columns:['task','group','anchorEvent','owner','budgetCategory','priority','status','dueDate'],
      fields:[
        ['task','Nội dung công việc','textarea',{backendLabel:'Công việc chi tiết',required:true}],
        ['group','Nhóm việc','select',{lookup:'checklistGroups',required:true}],
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',backendLabel:'Sự kiện neo',required:true}],
        // LEGACY DORMANT: phase/phase_id and milestone/milestone_id are intentionally kept in Google Sheets for rollback, but hidden from WeddingOS v12 UI.
        ['offsetDays','Số ngày chênh lệch','number',{backendLabel:'Offset ngày',editorHidden:true}], ['startDate','Ngày bắt đầu','date'], ['dueDate','Hạn hoàn thành','date'],
        ['location','Địa điểm','text'], ['owner','Người phụ trách','select',{lookup:'owners'}],
        ['priority','Mức độ ưu tiên','select',{values:['Cao','Trung bình','Thấp'],backendLabel:'Ưu tiên'}],
        ['status','Trạng thái','select',{values:['Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],required:true}],
        ['budgetCategory','Hạng mục ngân sách','select',{dynamic:'budgetCategories',allowBlank:true}],
        ['budgetEstimate','Ngân sách dự kiến','currency',{readOnly:true}], ['committedCost','Chi phí tạm tính','currency',{readOnly:true}],
        ['actualCost','Thực chi','currency',{readOnly:true}], ['payableCost','Còn phải thanh toán','currency',{readOnly:true}],
        ['notes','Kết quả & ghi chú','textarea',{backendLabel:'Ghi chú / kết quả'}]
      ],
      sections:[
        {id:'general',title:'Thông tin chung',icon:'tags',fields:['task','group','anchorEvent'],rows:[['task'],['group','anchorEvent']]},
        {id:'execution',title:'Thời gian & thực hiện',icon:'calendar-range',fields:['startDate','dueDate','location','owner'],rows:[['startDate','dueDate'],['location','owner']]},
        {id:'status',title:'Trạng thái',icon:'circle-check-big',fields:['priority','status']},
        {id:'finance',title:'Tài chính',icon:'wallet-cards',fields:['budgetCategory','budgetEstimate','committedCost','actualCost','payableCost'],rows:[['budgetCategory'],['budgetEstimate','committedCost'],['actualCost','payableCost']]},
        {id:'result',title:'Kết quả & tài liệu',icon:'file-check-2',fields:['notes']}
      ],
      reportFields:['status','budgetCategory','actualCost','payableCost','notes']
    },
    timeline: {
      title:'Timeline sự kiện', singular:'mốc lịch trình', icon:'calendar-clock',
      search:['event','anchorEvent','group','description','location','owner','vendor'],
      filterFields:['eventDate','anchorEvent','group','location','owner','vendor','status'],
      statusField:'status', filterOptions:['Tất cả','Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],
      columns:['eventDate','anchorEvent','event','startTime','endTime','group','description','location','owner','vendor','status'],
      fields:[
        ['event','Tên sự kiện / hoạt động','text',{backendLabel:'Sự kiện',required:true}],
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',required:true}], ['group','Nhóm việc','select',{lookup:'checklistGroups',required:true}], ['eventDate','Ngày sự kiện','date',{required:true}], ['status','Trạng thái','select',{values:['Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],required:true}],
        ['previousStatus','Trạng thái trước khi hoàn thành','text',{editorHidden:true,hidden:true}],
        ['startTime','Giờ bắt đầu','time'], ['durationMinutes','Thời lượng','number',{backendLabel:'Thời lượng (phút)',helpText:'Tự động tính từ Giờ bắt đầu và Giờ kết thúc.',readOnly:true}],
        ['endTime','Giờ kết thúc','time'], ['description','Nội dung / chương trình chi tiết','textarea',{backendLabel:'Chương trình chi tiết'}],
        ['location','Địa điểm','text'], ['owner','Người phụ trách','select',{lookup:'owners'}],
        ['vendor','Nhà cung cấp','select',{dynamic:'vendors',allowBlank:true}],
        ['notes','Kết quả & ghi chú','textarea',{backendLabel:'Ghi chú / kết quả'}]
      ],
      sections:[
        {id:'event',title:'Thông tin sự kiện',icon:'calendar-days',fields:['event','anchorEvent','group','eventDate','status'],rows:[['event'],['anchorEvent','group'],['eventDate','status']]},
        {id:'time',title:'Thời gian',icon:'clock-3',fields:['startTime','endTime','durationMinutes'],rows:[['startTime','endTime','durationMinutes']]},
        {id:'content',title:'Nội dung',icon:'align-left',fields:['description']},
        {id:'coordination',title:'Điều phối',icon:'map-pinned',fields:['location','owner','vendor'],rows:[['location'],['owner','vendor']]},
        {id:'result',title:'Kết quả & tài liệu',icon:'file-check-2',fields:['notes']}
      ],
      reportFields:['status','owner','vendor','notes']
    },
    budget: {
      title:'Ngân sách', singular:'hạng mục ngân sách', icon:'wallet-cards',
      search:['category','anchorEvent','serviceGroup','notes'], filterFields:['anchorEvent','serviceGroup','category'], statusField:null, filterOptions:['Tất cả'],
      columns:['category','anchorEvent','serviceGroup','budgeted','committed','actual','payable','remaining'],
      fields:[
        ['category','Hạng mục chi phí','text',{backendLabel:'Hạng mục',required:true}],
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',required:true}], ['serviceGroup','Nhóm dịch vụ','select',{lookup:'vendorCategories',required:true}],
        ['budgeted','Ngân sách dự kiến','currency',{backendLabel:'Ngân sách đề xuất',required:true}],
        ['committed','Chi phí tạm tính','currency',{readOnly:true,backendLabel:'Chi phí tạm tính'}],
        ['actual','Thực chi','currency'], ['payable','Còn phải thanh toán','currency',{readOnly:true,backendLabel:'Cần thanh toán'}],
        ['remaining','Còn lại','currency',{readOnly:true,editorHidden:true,sortable:true}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'item',title:'Hạng mục',icon:'tags',fields:['category','anchorEvent','serviceGroup'],rows:[['category'],['anchorEvent','serviceGroup']]},
        {id:'budget',title:'Ngân sách',icon:'wallet-cards',fields:['budgeted','committed','actual','payable'],rows:[['budgeted','committed'],['actual','payable']]},
        {id:'notes',title:'Ghi chú & tài liệu',icon:'file-text',fields:['notes']}
      ],
      reportFields:[]
    },
    guests: {
      title:'Khách mời', singular:'khách mời', icon:'users-round',
      search:['name','side','group','phone','tableNo'], filterFields:['side','group','events','invitationType','sent','rsvp','vegetarian','transport','room','tableNo'], statusField:'rsvp',
      filterOptions:['Tất cả','Chưa phản hồi','Đồng ý','Từ chối','Chưa chắc'],
      columns:['name','side','group','phone','sent','rsvp','partySize','tableNo','transport','room'],
      fields:[
        ['name','Tên khách mời','text',{backendLabel:'Họ tên',required:true}], ['side','Bên mời','select',{lookup:'guestSides'}],
        ['group','Nhóm khách','select',{lookup:'guestGroups'}],
        ['phone','Số điện thoại','tel'], ['events','Sự kiện tham dự','select',{lookup:'anchorEvents',required:true}],
        ['invitationType','Hình thức mời','select',{lookup:'invitationTypes',backendLabel:'Hình thức thiệp'}],
        ['sent','Trạng thái gửi lời mời','select',{values:['Chưa','Đã gửi'],backendLabel:'Đã gửi thiệp'}], ['sentDate','Ngày gửi lời mời','date',{backendLabel:'Ngày gửi'}],
        ['rsvp','Phản hồi tham dự (RSVP)','select',{values:['Chưa phản hồi','Đồng ý','Từ chối','Chưa chắc'],backendLabel:'Xác nhận tham gia',required:true}],
        ['partySize','Số người tham dự','number',{backendLabel:'Số người đi'}], ['tableNo','Số / tên bàn','text',{backendLabel:'Bàn'}],
        ['vegetarian','Yêu cầu món chay','select',{values:['Không','Có'],backendLabel:'Món chay'}], ['transport','Nhu cầu xe đưa đón','select',{values:['Không','Có'],backendLabel:'Cần xe'}],
        ['room','Nhu cầu lưu trú','select',{values:['Không','Có'],backendLabel:'Cần phòng'}], ['giftValue','Giá trị quà / tiền mừng','currency',{backendLabel:'Tiền mừng / quà'}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'guest',title:'Thông tin khách',icon:'user-round',fields:['name','side','group','phone']},
        {id:'invitation',title:'Lời mời',icon:'mail',fields:['events','invitationType','sent','sentDate']},
        {id:'rsvp',title:'RSVP & sắp xếp',icon:'users-round',fields:['rsvp','partySize','tableNo'],rows:[['rsvp','partySize','tableNo']]},
        {id:'needs',title:'Nhu cầu đặc biệt',icon:'concierge-bell',fields:['vegetarian','transport','room'],rows:[['vegetarian','transport','room']]},
        {id:'gift',title:'Quà & ghi chú',icon:'gift',fields:['giftValue','notes'],rows:[['giftValue'],['notes']]}
      ],
      reportFields:['sent','sentDate','rsvp','partySize','notes']
    },
    vendors: {
      title:'Nhà cung cấp', singular:'nhà cung cấp', icon:'store',
      search:['anchorEvent','category','serviceGroup','name','location','contact','status'], filterFields:['anchorEvent','category','serviceGroup','location','status'], statusField:'status',
      filterOptions:['Tất cả','Đang khảo sát','Đã nhận báo giá','Đã chọn','Đã cọc','Hoàn tất','Loại'],
      columns:['name','anchorEvent','category','serviceGroup','contractValue','payable','score','status','decisionDue'],
      fields:[
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',required:true}], ['category','Nhóm dịch vụ','select',{lookup:'vendorCategories',required:true}],
        ['serviceGroup','Dịch vụ/hạng mục cung cấp','select',{lookup:'checklistGroups',required:true}],
        ['name','Tên nhà cung cấp','text',{required:true}], ['location','Khu vực / địa điểm','text',{backendLabel:'Địa điểm'}], ['contact','Thông tin liên hệ','text',{backendLabel:'Liên hệ'}],
        ['quote','Giá / báo giá','currency',{backendLabel:'Báo giá'}],
        ['score','Điểm đánh giá','number',{backendLabel:'Điểm /10',helpText:'Chọn điểm từ 1 đến 10.',selectValues:[1,2,3,4,5,6,7,8,9,10]}], ['status','Trạng thái','select',{values:['Đang khảo sát','Đã nhận báo giá','Đã chọn','Đã cọc','Hoàn tất','Loại'],required:true}],
        ['decisionDue','Hạn chốt nhà cung cấp','date',{backendLabel:'Hạn quyết định'}],
        ['contractValue','Giá trị hợp đồng/dịch vụ','currency'], ['deposit','Tiền cọc','currency'], ['paid','Đã thanh toán','currency'], ['payable','Còn phải thanh toán','currency',{readOnly:true}], ['paymentTerms','Điều khoản thanh toán','textarea'],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'general',title:'Thông tin chung',icon:'tags',fields:['anchorEvent','category','serviceGroup'],rows:[['anchorEvent'],['category','serviceGroup']]},
        {id:'vendor',title:'Thông tin nhà cung cấp',icon:'store',fields:['name','location','contact','quote'],rows:[['name'],['location','contact'],['quote']]},
        {id:'decision',title:'Đánh giá & quyết định',icon:'badge-check',fields:['score','status','decisionDue'],rows:[['score','status','decisionDue']]},
        {id:'contract',title:'Thanh toán & hợp đồng',icon:'file-signature',fields:['contractValue','deposit','paid','payable','paymentTerms'],rows:[['contractValue','deposit'],['paid','payable'],['paymentTerms']]},
        {id:'notes',title:'Ghi chú & tài liệu',icon:'file-text',fields:['notes']}
      ],
      reportFields:['status','contractValue','deposit','paid','payable','paymentTerms','notes']
    },
    references: {
      title:'Tham khảo', singular:'nguồn tham khảo', icon:'book-open-check',
      search:['group','source','event','sourceUrl','notes'], filterFields:['group','source','event','interestLevel','priorityLevel','rating'], statusField:null,
      filterOptions:['Tất cả'],
      columns:['group','event','sourceUrl','interestLevel','priorityLevel','source','rating','notes'],
      fields:[
        ['event','Sự kiện liên quan','select',{lookup:'anchorEvents',backendLabel:'Sự kiện',required:true}],
        ['group','Nhóm công việc','select',{lookup:'checklistGroups',backendLabel:'Nhóm việc',required:true}],
        ['sourceUrl','Đường dẫn tham khảo','url',{backendLabel:'Link nguồn tham khảo'}],
        ['interestLevel','Mức độ quan tâm','select',{lookup:'interestLevels',required:true}],
        ['priorityLevel','Mức độ ưu tiên','select',{lookup:'referencePriorities'}],
        ['source','Nguồn / nền tảng','select',{lookup:'referenceSources',backendLabel:'Nguồn thông tin'}],
        ['rating','Điểm đánh giá','rating',{backendLabel:'Đánh giá'}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'classification',title:'Phân loại',icon:'tags',fields:['event','group'],rows:[['event','group']]},
        {id:'source',title:'Nguồn tham khảo',icon:'link-2',fields:['sourceUrl','source'],rows:[['sourceUrl','source']]},
        {id:'rating',title:'Đánh giá',icon:'star',fields:['interestLevel','priorityLevel','rating'],rows:[['interestLevel','priorityLevel'],['rating']]},
        {id:'notes',title:'Ghi chú & tài liệu',icon:'file-text',fields:['notes']}
      ],
      reportFields:['rating','notes']
    }
  },
  lookupLabels: {
    checklistPhases:'Giai đoạn kế hoạch', checklistMilestones:'Mốc thời gian', checklistGroups:'Nhóm việc',
    anchorEvents:'Sự kiện liên quan', owners:'Người phụ trách', guestSides:'Bên mời', guestGroups:'Nhóm khách',
    invitationTypes:'Hình thức mời', vendorCategories:'Nhóm dịch vụ nhà cung cấp',
    referenceSources:'Nguồn / nền tảng tham khảo', interestLevels:'Mức độ quan tâm', referencePriorities:'Mức độ ưu tiên tham khảo'
  }
};

const ACCENT_THEMES = {
  pink:{label:'Hồng', swatch:'#c94c68', vars:{50:'#fdf2f4',200:'#f6d0d8',300:'#eea9b7',400:'#df748a',500:'#c94c68',600:'#aa304d',700:'#8e263f',800:'#772238',900:'#651f34'}},
  blue:{label:'Xanh biển', swatch:'#2563eb', vars:{50:'#eff6ff',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},
  green:{label:'Xanh lá', swatch:'#059669', vars:{50:'#ecfdf5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b'}}
};

// Legacy V10 migration is intentionally dormant for a brand-new workbook.
// Set this flag to true only when an existing pre-V10 workbook must be converted.
const FEATURE_FLAGS = Object.freeze({legacyV10Migration:false});

// One-time client cleanup for the historical preview fixture. This removes only known
// seeded records that were never queued by the user; real pending edits and server-backed
// records are preserved. New builds start from an empty business dataset.
const LOCAL_SAMPLE_CLEANUP_KEY='wedding-os-local-sample-cleanup-20260817-v1';
const LEGACY_SAMPLE_LIMITS=Object.freeze({checklist:155,timeline:38,budget:13,vendors:51});
const LEGACY_SAMPLE_SETTINGS=Object.freeze([{"id":"setting-brideName","key":"brideName","value":"","notes":"Nhập tên cô dâu"},{"id":"setting-groomName","key":"groomName","value":"","notes":"Nhập tên chú rể"},{"id":"setting-registrationDate","key":"registrationDate","value":"","notes":"Nhập khi đã chốt"},{"id":"setting-engagementDate","key":"engagementDate","value":"","notes":"Tổ chức tại TP.HCM"},{"id":"setting-pickupDate","key":"pickupDate","value":"","notes":"TP.HCM → Lộc Ninh, Bình Phước"},{"id":"setting-groomPartyDate","key":"groomPartyDate","value":"","notes":"Tiệc trưa tại Lộc Ninh"},{"id":"setting-bridePartyDate","key":"bridePartyDate","value":"","notes":"Tiệc tối tại TP.HCM"},{"id":"setting-totalBudget","key":"totalBudget","value":400000000,"notes":"Đã gồm quỹ dự phòng"},{"id":"setting-reserveBudget","key":"reserveBudget","value":40000000,"notes":"10% ngân sách tổng"},{"id":"setting-operatingBudget","key":"operatingBudget","value":360000000,"notes":"Mức trần ký hợp đồng"},{"id":"setting-groomGuests","key":"groomGuests","value":150,"notes":"Điều chỉnh sau khi lập danh sách"},{"id":"setting-brideGuests","key":"brideGuests","value":150,"notes":"Điều chỉnh sau khi lập danh sách"},{"id":"setting-guestsPerTable","key":"guestsPerTable","value":10,"notes":"Dùng để ước tính số bàn"},{"id":"setting-style","key":"style","value":"Sang trọng – tối giản – lãng mạn","notes":"Đỏ burgundy, champagne, vàng đồng"},{"id":"setting-finalDecisionMaker","key":"finalDecisionMaker","value":"Cô dâu","notes":"Các thay đổi chi phí >2 triệu cần duyệt"}]);
function isLegacySampleRecordId(collection,id){
  const prefix=collection==='vendors'?'vendor':collection,limit=LEGACY_SAMPLE_LIMITS[collection],match=String(id||'').match(new RegExp('^'+prefix+'-(\\d{3})$'));
  if(!match||!limit)return false;const number=Number(match[1]);return number>=1&&number<=limit;
}
function exactLegacySampleSetting(row){
  return LEGACY_SAMPLE_SETTINGS.some(sample=>sample.id===row?.id&&sample.key===row?.key&&JSON.stringify(sample.value)===JSON.stringify(row?.value)&&String(sample.notes||'')===String(row?.notes||''));
}
function cleanupLegacySampleLocalStorageOnce(){
  try{
    if(localStorage.getItem(LOCAL_SAMPLE_CLEANUP_KEY)==='1')return;
    const readChanges=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch(_){return[];}};
    const removeLegacyBusinessSampleChanges=changes=>(changes||[]).filter(change=>!isLegacySampleRecordId(String(change?.collection||''),change?.id));
    const cleanPendingKey=key=>{const filtered=removeLegacyBusinessSampleChanges(readChanges(key));localStorage.setItem(key,JSON.stringify(filtered));return filtered;};
    const cleanPayload=(payload,pending=[])=>{
      if(!payload||typeof payload!=='object'||Array.isArray(payload))return payload;
      const protectedKeys=new Set((pending||[]).map(change=>`${change?.collection||''}:${change?.id||''}`));
      Object.keys(LEGACY_SAMPLE_LIMITS).forEach(collection=>{if(Array.isArray(payload[collection]))payload[collection]=payload[collection].filter(row=>!isLegacySampleRecordId(collection,row?.id));});
      if(Array.isArray(payload.settings))payload.settings=payload.settings.filter(row=>!exactLegacySampleSetting(row)||protectedKeys.has(`settings:${row?.id||''}`));
      if(Array.isArray(payload.lookup_items)){
        payload.lookup_items=payload.lookup_items.filter(row=>Number(row?._rowVersion||0)>0||Boolean(row?._updatedAt)||Boolean(row?._updatedBy)||protectedKeys.has(`lookup_items:${row?.id||''}`));
        if(!payload.lookup_items.length){delete payload.lookup_items;delete payload.lookups;}
      }
      return payload;
    };
    const globalPending=cleanPendingKey(CONFIG.pendingKey);
    [CONFIG.storageKey,CONFIG.legacyStorageKey].forEach(key=>{const raw=localStorage.getItem(key);if(!raw)return;try{const payload=cleanPayload(JSON.parse(raw),globalPending);localStorage.setItem(key,JSON.stringify(payload));}catch(_){}});
    for(let index=0;index<localStorage.length;index+=1){
      const key=localStorage.key(index);if(!key||!key.startsWith(CONFIG.userCachePrefix))continue;
      try{const cache=JSON.parse(localStorage.getItem(key)||'null');if(!cache?.data)continue;const accountId=String(cache.accountId||decodeURIComponent(key.slice(CONFIG.userCachePrefix.length))),pending=cleanPendingKey(`${CONFIG.userPendingPrefix}${encodeURIComponent(accountId)}`);cache.data=cleanPayload(cache.data,pending);localStorage.setItem(key,JSON.stringify(cache));}catch(_){}
    }
    localStorage.setItem(LOCAL_SAMPLE_CLEANUP_KEY,'1');
  }catch(error){console.warn('Không thể dọn dữ liệu mẫu cục bộ cũ',error);}
}
cleanupLegacySampleLocalStorageOnce();

const LOOKUP_REFERENCE_FIELDS = Object.freeze({
  // phase_id / milestone_id remain legacy columns only. WeddingOS v12 no longer exposes or validates them in active UI.
  checklist:{group_id:{lookupKey:'checklistGroups',legacyKey:'group'},anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'},owner_id:{lookupKey:'owners',legacyKey:'owner'}},
  timeline:{anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'},group_id:{lookupKey:'checklistGroups',legacyKey:'group'},owner_id:{lookupKey:'owners',legacyKey:'owner'}},
  guests:{side_id:{lookupKey:'guestSides',legacyKey:'side'},group_id:{lookupKey:'guestGroups',legacyKey:'group'},anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'events'},invitation_type_id:{lookupKey:'invitationTypes',legacyKey:'invitationType'}},
  budget:{anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'},service_group_id:{lookupKey:'vendorCategories',legacyKey:'serviceGroup'}},
  vendors:{anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'},category_id:{lookupKey:'vendorCategories',legacyKey:'category'},service_group_id:{lookupKey:'checklistGroups',legacyKey:'serviceGroup'}},
  references:{group_id:{lookupKey:'checklistGroups',legacyKey:'group'},anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'event'},source_id:{lookupKey:'referenceSources',legacyKey:'source'},interest_level_id:{lookupKey:'interestLevels',legacyKey:'interestLevel'},priority_level_id:{lookupKey:'referencePriorities',legacyKey:'priorityLevel'}}
});
const ENTITY_REFERENCE_FIELDS = Object.freeze({
  checklist:{budget_item_id:{collection:'budget',legacyKey:'budgetCategory',labelKey:'category'}},
  timeline:{vendor_id:{collection:'vendors',legacyKey:'vendor',labelKey:'name'}}
});
const TECHNICAL_RECORD_FIELDS = new Set(['_rowVersion','_updatedAt','_updatedBy']);

const UI = {
  tab:'dashboard', editMode:false, loading:false, search:'', filter:'Tất cả', visibleCount:CONFIG.pageSize,
  secondaryFilter:null, advancedFilters:{}, dateFilters:{}, filterDraft:null, settingsDraft:null, filterPanelOpen:false, lookupPages:{}, editing:null, editingLookup:null, deleting:null, mobileActionsOpen:false,
  groupByEvent:{}, sortCollection:null, sortDraft:null, listSorts:{}, columnCollection:null, columnDraft:[], conflicts:loadSyncConflicts(), activeConflictIndex:0,
  hydrationState:'idle', hydrationHasCache:false, hydrationError:'', hydrationRunId:0, mutationLocked:false, serverRevisionHint:0,
  syncing:false, syncMode:'', autoSyncTimer:null, autoSyncNextAt:'', autoSyncLastAttemptAt:'', autoSyncLastError:'', mutationSyncTimer:null, mutationSyncDueAt:'', lastSyncAt:storage.get('wedding-last-sync-at',''), pendingChanges:loadPendingChanges('admin')
};

let DATA = loadData();

function uniqueValues(rows,key) {
  return [...new Set((rows || []).map(row => String(row?.[key] ?? '').trim()).filter(Boolean))];
}


function moduleCollectionNames() { return Object.keys(CONFIG.schemas || {}); }
function recordCollectionNames() { return [...moduleCollectionNames(),'attachments','settings','security','accounts','preferences','notifications']; }
function syncCollectionNames() { return [...recordCollectionNames(),'lookup_items']; }




function deviceId(){let value=storage.get(CONFIG.deviceIdKey,'');if(!value){value=uid('device');storage.set(CONFIG.deviceIdKey,value);}return value;}
function normalizeLookupText(value){return String(value??'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('vi');}
function lookupItemsAll(){return Array.isArray(DATA?.lookup_items)?DATA.lookup_items:[];}
function lookupItemsForKey(key,{activeOnly=true}={}){return lookupItemsAll().filter(item=>item.lookup_key===key&&(!activeOnly||item.active!==false)).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)||String(a.value||'').localeCompare(String(b.value||''),'vi'));}
function lookupItemById(id){return lookupItemsAll().find(item=>item.id===id)||null;}
function lookupItemByValue(key,value){const normalized=normalizeLookupText(value);return lookupItemsAll().find(item=>item.lookup_key===key&&normalizeLookupText(item.value)===normalized)||null;}
function rebuildLookupCompatibility(data=DATA){
  data.lookups={};
  const labels=CONFIG.lookupLabels||{};
  Object.keys(labels).forEach(key=>{data.lookups[key]=[];});
  (data.lookup_items||[]).filter(item=>item&&item.active!==false&&item.lookup_key&&item.value).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)).forEach(item=>{(data.lookups[item.lookup_key]||(data.lookups[item.lookup_key]=[])).push(String(item.value));});
  Object.keys(data.lookups).forEach(key=>{data.lookups[key]=[...new Set(data.lookups[key])];});
  return data.lookups;
}
function createLookupItem(key,value,sortOrder=0){return {id:uid('lk'),lookup_key:key,value:String(value||'').trim(),sort_order:Number(sortOrder||0),active:true,_rowVersion:0,_updatedAt:'',_updatedBy:''};}
function ensureLookupItemsFromLegacy(data,legacyLookups={}){
  if(!Array.isArray(data.lookup_items))data.lookup_items=[];
  const existing=new Map(data.lookup_items.map(item=>[`${item.lookup_key}\u0000${normalizeLookupText(item.value)}`,item]));
  Object.entries(legacyLookups||{}).forEach(([key,values])=>{(Array.isArray(values)?values:[]).forEach((value,index)=>{const k=`${key}\u0000${normalizeLookupText(value)}`;if(!existing.has(k)){const item=createLookupItem(key,value,(index+1)*10);data.lookup_items.push(item);existing.set(k,item);}});});
}
function resolveLookupLabel(id,fallback=''){return lookupItemById(id)?.value||fallback||'';}
function resolveEntityLabel(collection,id,labelKey='name',fallback=''){return (DATA?.[collection]||[]).find(row=>row.id===id)?.[labelKey]||fallback||'';}
function canonicalizeRecordReferences(collection,record,data=DATA){
  const lookupMap=LOOKUP_REFERENCE_FIELDS[collection]||{},items=Array.isArray(data?.lookup_items)?data.lookup_items:[];
  Object.entries(lookupMap).forEach(([idKey,meta])=>{
    const label=String(record[meta.legacyKey]??'').trim();if(!label){record[idKey]='';return;}
    const current=items.find(entry=>entry.id===record[idKey]);
    if(current&&current.lookup_key===meta.lookupKey&&normalizeLookupText(current.value)===normalizeLookupText(label))return;
    const matches=items.filter(entry=>entry.lookup_key===meta.lookupKey&&entry.active!==false&&normalizeLookupText(entry.value)===normalizeLookupText(label));
    record[idKey]=matches.length===1?matches[0].id:'';
  });
  const entityMap=ENTITY_REFERENCE_FIELDS[collection]||{};
  Object.entries(entityMap).forEach(([idKey,meta])=>{
    const targets=data?.[meta.collection]||[];
    if(meta.multiple){
      const labels=Array.isArray(record[meta.legacyKey])?record[meta.legacyKey]:[];
      const currentIds=Array.isArray(record[idKey])?record[idKey]:[],ids=[];let valid=true;
      labels.forEach((label,index)=>{const current=targets.find(row=>row.id===currentIds[index]);if(current&&normalizeLookupText(current[meta.labelKey])===normalizeLookupText(label)){ids.push(current.id);return;}const matches=targets.filter(row=>normalizeLookupText(row[meta.labelKey])===normalizeLookupText(label));if(matches.length===1)ids.push(matches[0].id);else valid=false;});
      record[idKey]=valid?ids:[];
    }else{
      const label=String(record[meta.legacyKey]??'').trim();if(!label){record[idKey]='';return;}
      const current=targets.find(row=>row.id===record[idKey]);if(current&&normalizeLookupText(current[meta.labelKey])===normalizeLookupText(label))return;
      const matches=targets.filter(row=>normalizeLookupText(row[meta.labelKey])===normalizeLookupText(label));record[idKey]=matches.length===1?matches[0].id:'';
    }
  });
  return record;
}
function canonicalReferenceIssues(collection,record,data=DATA){
  const issues=[];
  Object.entries(LOOKUP_REFERENCE_FIELDS[collection]||{}).forEach(([idKey,meta])=>{const label=String(record[meta.legacyKey]??'').trim();if(label&&!record[idKey])issues.push(meta.legacyKey);});
  Object.entries(ENTITY_REFERENCE_FIELDS[collection]||{}).forEach(([idKey,meta])=>{if(meta.multiple){const labels=Array.isArray(record[meta.legacyKey])?record[meta.legacyKey]:[],ids=Array.isArray(record[idKey])?record[idKey]:[];if(labels.length!==ids.length)issues.push(meta.legacyKey);}else{const label=String(record[meta.legacyKey]??'').trim();if(label&&!record[idKey])issues.push(meta.legacyKey);}});
  return [...new Set(issues)];
}

function hydrateReferenceLabels(data=DATA){
  Object.entries(LOOKUP_REFERENCE_FIELDS).forEach(([collection,map])=>(data[collection]||[]).forEach(record=>{Object.entries(map).forEach(([idKey,meta])=>{if(record[idKey]){const item=(data.lookup_items||[]).find(entry=>entry.id===record[idKey]);if(item)record[meta.legacyKey]=item.value;}});}));
  Object.entries(ENTITY_REFERENCE_FIELDS).forEach(([collection,map])=>(data[collection]||[]).forEach(record=>{Object.entries(map).forEach(([idKey,meta])=>{if(meta.multiple){if(Array.isArray(record[idKey])&&record[idKey].length)record[meta.legacyKey]=record[idKey].map(id=>(data[meta.collection]||[]).find(row=>row.id===id)?.[meta.labelKey]).filter(Boolean);}else if(record[idKey]){const target=(data[meta.collection]||[]).find(row=>row.id===record[idKey]);if(target)record[meta.legacyKey]=target[meta.labelKey]||'';}});}));
  return data;
}
function referenceCountForLookupItem(item){let count=0;Object.entries(LOOKUP_REFERENCE_FIELDS).forEach(([collection,map])=>Object.entries(map).forEach(([idKey,meta])=>{if(meta.lookupKey!==item.lookup_key)return;(DATA[collection]||[]).forEach(row=>{if(row[idKey]===item.id)count++;});}));return count;}

function canonicalReferenceForLegacy(collection,legacyKey){for(const [idKey,meta] of Object.entries(LOOKUP_REFERENCE_FIELDS[collection]||{}))if(meta.legacyKey===legacyKey)return {idKey,...meta,type:'lookup'};for(const [idKey,meta] of Object.entries(ENTITY_REFERENCE_FIELDS[collection]||{}))if(meta.legacyKey===legacyKey)return {idKey,...meta,type:'entity'};return null;}
function canonicalReferenceMeta(collection,idKey){const lookup=LOOKUP_REFERENCE_FIELDS[collection]?.[idKey];if(lookup)return {...lookup,idKey,type:'lookup'};const entity=ENTITY_REFERENCE_FIELDS[collection]?.[idKey];if(entity)return {...entity,idKey,type:'entity'};return null;}

function manifestFieldType(key,configuredType='',sampleValue=undefined) {
  if(configuredType) return configuredType;
  if(key==='updatedAt') return 'datetime';
  if(key==='id') return 'text';
  if(/(?:Date|date)$/.test(key)) return 'date';
  if(/(?:Time|time)$/.test(key)) return 'time';
  if(/(?:Url|URL|url)$/.test(key)) return 'url';
  if(/phone|tel/i.test(key)) return 'tel';
  if(/notes|description|includes|terms/i.test(key)) return 'textarea';
  if(/rating/i.test(key)) return 'rating';
  if(/budget|cost|quote|deposit|paid|payable|actual|remaining|variance|giftValue|committed/i.test(key)) return 'currency';
  if(/count|size|days|minutes|score|number|offset/i.test(key)) return 'number';
  if(Array.isArray(sampleValue)) return 'multiselect';
  if(sampleValue&&typeof sampleValue==='object') return 'json';
  if(typeof sampleValue==='number') return 'number';
  if(typeof sampleValue==='boolean') return 'boolean';
  return 'text';
}

function manifestFieldLabel(key,configuredLabel='') {
  if(configuredLabel) return configuredLabel;
  const known={id:'ID',updatedAt:'Cập nhật lúc',paid:'Đã thanh toán',variance:'Chênh lệch',remaining:'Còn lại'};
  if(known[key])return known[key];
  return String(key).replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/_/g,' ').replace(/^./,char=>char.toUpperCase());
}

function manifestFieldWidth(type,key) {
  if(type==='textarea'||['task','description','notes','includes','paymentTerms','address'].includes(key))return 320;
  if(type==='url')return 240;
  if(type==='currency')return 160;
  if(type==='date'||type==='datetime')return 140;
  if(type==='time')return 100;
  if(type==='number'||type==='rating')return 120;
  return 170;
}

function observedFieldSample(collection,key) {
  const rows=[...(Array.isArray(INITIAL_DATA?.[collection])?INITIAL_DATA[collection]:[]),...(Array.isArray(DATA?.[collection])?DATA[collection]:[])];
  const row=rows.find(item=>item&&item[key]!==undefined&&item[key]!==null&&item[key]!=='');
  return row?.[key];
}

function manifestFieldsForModule(collection,schema) {
  const ordered=[];
  const configured=new Map((schema.fields||[]).map(field=>[field[0],field]));
  const add=key=>{if(key&&!ordered.includes(key))ordered.push(key);};
  add('id');
  (schema.fields||[]).forEach(field=>add(field[0]));
  [...(INITIAL_DATA?.[collection]||[]),...(DATA?.[collection]||[])].forEach(row=>Object.keys(row||{}).forEach(add));
  add('updatedAt');
  Object.keys(LOOKUP_REFERENCE_FIELDS[collection]||{}).forEach(add);
  Object.keys(ENTITY_REFERENCE_FIELDS[collection]||{}).forEach(add);
  add('_rowVersion');add('_updatedAt');add('_updatedBy');
  return ordered.filter(key=>/^[A-Za-z_][A-Za-z0-9_]{0,79}$/.test(key)).map(key=>{
    const definition=configured.get(key),canonicalLookup=LOOKUP_REFERENCE_FIELDS[collection]?.[key],canonicalEntity=ENTITY_REFERENCE_FIELDS[collection]?.[key];
    let type=manifestFieldType(key,definition?.[2],observedFieldSample(collection,key)),options=definition?.[3];
    const legacyCanonical=canonicalReferenceForLegacy(collection,key);
    // Dynamic Master Data labels are compatibility/display fields only. Validation is performed against the canonical *_id field,
    // so schema options are never frozen to an old lookup_items snapshot (prevents INVALID_OPTION after Master Data changes).
    if(legacyCanonical?.type==='lookup')type='text';
    if(canonicalLookup||canonicalEntity)type=canonicalEntity?.multiple?'multiselect':'text';
    if(key==='_rowVersion')type='number';if(key==='_updatedAt')type='datetime';if(key==='_updatedBy')type='text';
    const technical=TECHNICAL_RECORD_FIELDS.has(key)||Boolean(canonicalLookup||canonicalEntity);
    const legacyDefinition=canonicalLookup?configured.get(canonicalLookup.legacyKey):canonicalEntity?configured.get(canonicalEntity.legacyKey):null;
    const businessRequired=Boolean(options?.required||legacyDefinition?.[3]?.required);
    const required=key==='id'||businessRequired;
    const field={key,label:canonicalLookup?`${manifestFieldLabel(canonicalLookup.legacyKey)} ID`:canonicalEntity?`${manifestFieldLabel(canonicalEntity.legacyKey)} ID`:manifestFieldLabel(key,options?.backendLabel||definition?.[1]),type,required,hidden:key==='id'||key==='updatedAt'||technical||Boolean(options?.hidden),allowBlank:!required,width:manifestFieldWidth(type,key)};
    const values=getFieldOptions(options);
    if((type==='select'||type==='multiselect')&&values.length)field.options=[...new Set(values.map(value=>String(value)).filter(Boolean))].slice(0,500);
    if(options?.renameFrom)field.renameFrom=options.renameFrom;
    if(type==='currency')field.numberFormat='#,##0 "₫"';
    if(type==='date')field.helpText='Định dạng YYYY-MM-DD';
    if(type==='time')field.helpText='Định dạng HH:mm';
    return field;
  });
}

function buildSchemaManifest() {
  const modules={};
  moduleCollectionNames().forEach(collection=>{
    const schema=CONFIG.schemas[collection];
    modules[collection]={collection,sheetName:collection,title:schema.title||collection,dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:false,fields:manifestFieldsForModule(collection,schema)};
  });
  modules.attachments={collection:'attachments',sheetName:'attachments',title:'Tệp đính kèm',dataShape:'records',sensitive:false,adminOnly:true,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'collection',label:'Phân hệ',type:'text',required:true,hidden:false,allowBlank:false,width:130},
    {key:'recordId',label:'ID bản ghi',type:'text',required:true,hidden:false,allowBlank:false,width:180},
    {key:'context',label:'Ngữ cảnh',type:'select',options:['record','report'],required:true,hidden:false,allowBlank:false,width:110},
    {key:'fileId',label:'Google Drive File ID',type:'text',required:true,hidden:false,allowBlank:false,width:220},
    {key:'fileName',label:'Tên tệp',type:'text',required:true,hidden:false,allowBlank:false,width:280},
    {key:'mimeType',label:'MIME type',type:'text',required:false,hidden:false,allowBlank:true,width:180},
    {key:'sizeBytes',label:'Dung lượng (bytes)',type:'number',required:false,hidden:false,allowBlank:true,width:150},
    {key:'driveUrl',label:'Link xem Google Drive',type:'url',required:true,hidden:false,allowBlank:false,width:300},
    {key:'uploadedBy',label:'Người tải lên',type:'text',required:false,hidden:false,allowBlank:true,width:170},
    {key:'uploadedAt',label:'Tải lên lúc',type:'datetime',required:true,hidden:false,allowBlank:false,width:170},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:160}
  ]};
  modules.settings={collection:'settings',sheetName:'settings',title:'Thiết lập',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:120},
    {key:'key',label:'Khóa thiết lập',type:'text',required:true,hidden:false,allowBlank:false,width:190},
    {key:'value',label:'Giá trị',type:'json',required:false,hidden:false,allowBlank:true,width:220},
    {key:'notes',label:'Ghi chú',type:'textarea',required:false,hidden:false,allowBlank:true,width:260},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
  modules.security={collection:'security',sheetName:'security',title:'Bảo mật quản trị',dataShape:'records',sensitive:true,adminOnly:true,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:140},
    {key:'kind',label:'Loại cấu hình',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'passwordVerifier',label:'Mã xác thực một chiều',type:'textarea',required:true,hidden:true,allowBlank:false,width:360},
    {key:'passwordSalt',label:'Salt',type:'text',required:true,hidden:true,allowBlank:false,width:220},
    {key:'passwordIterations',label:'Số vòng xác thực PBKDF2',type:'number',required:true,hidden:true,allowBlank:false,width:150},
    {key:'passwordAlgorithm',label:'Thuật toán xác thực',type:'text',required:true,hidden:true,allowBlank:false,width:210},
    {key:'iterations',label:'Số vòng cũ',type:'number',required:false,hidden:true,allowBlank:true,width:120},
    {key:'algorithm',label:'Thuật toán cũ',type:'text',required:false,hidden:true,allowBlank:true,width:180},
    {key:'forceChange',label:'Bắt buộc đổi mật khẩu',type:'boolean',required:false,hidden:true,allowBlank:true,width:150},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
  modules.accounts={collection:'accounts',sheetName:'accounts',title:'Tài khoản người dùng bảo mật',dataShape:'records',sensitive:true,adminOnly:true,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:140},
    {key:'userCode',label:'Mã người dùng',type:'text',required:false,hidden:true,allowBlank:true,width:150},
    {key:'displayName',label:'Tên người dùng',type:'text',required:false,hidden:true,allowBlank:true,width:190},
    {key:'usernameLabel',label:'Tên đăng nhập',type:'text',required:false,hidden:true,allowBlank:true,width:170},
    {key:'usernameHash',label:'Mã định danh đăng nhập',type:'textarea',required:true,hidden:true,allowBlank:false,width:300},
    {key:'passwordHash',label:'Mã xác thực mật khẩu',type:'textarea',required:true,hidden:true,allowBlank:false,width:300},
    {key:'passwordSalt',label:'Salt mật khẩu',type:'text',required:true,hidden:true,allowBlank:false,width:220},
    {key:'passwordIterations',label:'Số vòng xác thực PBKDF2',type:'number',required:true,hidden:true,allowBlank:false,width:150},
    {key:'passwordAlgorithm',label:'Thuật toán xác thực',type:'text',required:true,hidden:true,allowBlank:false,width:210},
    {key:'status',label:'Trạng thái',type:'select',options:['active','locked'],required:true,hidden:true,allowBlank:false,width:110},
    {key:'cipherText',label:'Dữ liệu hồ sơ đã mã hóa',type:'textarea',required:true,hidden:true,allowBlank:false,width:420},
    {key:'iv',label:'IV AES-GCM',type:'text',required:true,hidden:true,allowBlank:false,width:190},
    {key:'salt',label:'Salt mã hóa',type:'text',required:true,hidden:true,allowBlank:false,width:190},
    {key:'encryptionIterations',label:'Số vòng mã hóa PBKDF2',type:'number',required:true,hidden:true,allowBlank:false,width:150},
    {key:'encryptionAlgorithm',label:'Thuật toán mã hóa',type:'text',required:true,hidden:true,allowBlank:false,width:230},
    {key:'iterations',label:'Số vòng cũ',type:'number',required:false,hidden:true,allowBlank:true,width:120},
    {key:'algorithm',label:'Thuật toán cũ',type:'text',required:false,hidden:true,allowBlank:true,width:180},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
  modules.preferences={collection:'preferences',sheetName:'preferences',title:'Tùy chọn giao diện theo tài khoản',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:true,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:160},
    {key:'accountId',label:'Mã tài khoản',type:'text',required:true,hidden:false,allowBlank:false,width:180},
    {key:'theme',label:'Chế độ sáng tối',type:'text',required:false,hidden:false,allowBlank:true,width:130},
    {key:'accent',label:'Màu giao diện',type:'text',required:false,hidden:false,allowBlank:true,width:130},
    {key:'columns',label:'Cấu hình cột hiển thị',type:'json',required:false,hidden:false,allowBlank:true,width:420},
    {key:'sorts',label:'Cấu hình sắp xếp danh sách',type:'json',required:false,hidden:false,allowBlank:true,width:300},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
  modules.notifications={collection:'notifications',sheetName:'notifications',title:'Thông báo hệ thống',dataShape:'records',sensitive:false,adminOnly:true,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'accountId',label:'Tài khoản nhận',type:'text',required:true,hidden:false,allowBlank:false,width:150},
    {key:'type',label:'Loại',type:'text',required:true,hidden:false,allowBlank:false,width:110},
    {key:'tone',label:'Mức cảnh báo',type:'text',required:true,hidden:false,allowBlank:false,width:120},
    {key:'title',label:'Tiêu đề',type:'text',required:true,hidden:false,allowBlank:false,width:260},
    {key:'message',label:'Nội dung',type:'textarea',required:true,hidden:false,allowBlank:false,width:420},
    {key:'collection',label:'Phân hệ',type:'text',required:false,hidden:false,allowBlank:true,width:120},
    {key:'recordId',label:'ID bản ghi',type:'text',required:false,hidden:true,allowBlank:true,width:160},
    {key:'eventDate',label:'Ngày cảnh báo',type:'date',required:true,hidden:false,allowBlank:false,width:130},
    {key:'readAt',label:'Đã đọc lúc',type:'datetime',required:false,hidden:false,allowBlank:true,width:150},
    {key:'signature',label:'Chữ ký chống trùng',type:'text',required:true,hidden:true,allowBlank:false,width:240},
    {key:'createdAt',label:'Tạo lúc',type:'datetime',required:true,hidden:false,allowBlank:false,width:160},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
  modules.lookup_items={collection:'lookup_items',sheetName:'lookup_items',title:'Danh mục dùng chung',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:false,fields:[
    {key:'id',label:'Lookup ID',type:'text',required:true,hidden:true,allowBlank:false,width:170},
    {key:'lookup_key',label:'Khóa danh mục',type:'text',required:true,hidden:false,allowBlank:false,width:190},
    {key:'value',label:'Giá trị hiển thị',type:'text',required:true,hidden:false,allowBlank:false,width:260},
    {key:'sort_order',label:'Thứ tự',type:'number',required:false,hidden:false,allowBlank:true,width:100},
    {key:'active',label:'Đang sử dụng',type:'boolean',required:true,hidden:false,allowBlank:false,width:110},
    {key:'_rowVersion',label:'Row version',type:'number',required:false,hidden:true,allowBlank:true,width:100},
    {key:'_updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:160},
    {key:'_updatedBy',label:'Cập nhật bởi',type:'text',required:false,hidden:true,allowBlank:true,width:160}
  ]};
  ['settings','security','accounts','preferences'].forEach(collection=>{const module=modules[collection];if(!module)return;[[' _rowVersion','Row version','number',100],['_updatedAt','Cập nhật kỹ thuật','datetime',160],['_updatedBy','Cập nhật bởi','text',160]].forEach(def=>{const key=def[0].trim();if(!module.fields.some(field=>field.key===key))module.fields.push({key,label:def[1],type:def[2],required:false,hidden:true,allowBlank:true,width:def[3]});});});
  return {appId:'WeddingOS',schemaVersion:CONFIG.schemaVersion,modules};
}

function schemaManifestSignature(manifest=buildSchemaManifest()) {
  const text=JSON.stringify(manifest); let hash=2166136261;
  for(let index=0;index<text.length;index+=1){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(16).padStart(8,'0');
}

function needsSchemaSync(endpoint=configuredEndpoint()) {
  if(!endpoint)return false;
  return storage.get(CONFIG.schemaEndpointKey,'')!==endpoint||storage.get(CONFIG.schemaSignatureKey,'')!==schemaManifestSignature();
}

function recordSchemaSync(endpoint,result,manifest=buildSchemaManifest()) {
  storage.set(CONFIG.schemaEndpointKey,endpoint);
  storage.set(CONFIG.schemaSignatureKey,schemaManifestSignature(manifest));
  if(result?.schema?.hash)storage.set(CONFIG.remoteSchemaHashKey,result.schema.hash);
}

function remoteSchemaStatus(endpoint=configuredEndpoint()) {
  if(!endpoint)return 'Chưa kết nối';
  return needsSchemaSync(endpoint)?`Chờ cập nhật · v${CONFIG.schemaVersion}`:`Đã đồng bộ · v${CONFIG.schemaVersion}`;
}

function ensureSetting(data,key,value,notes='') {
  const item = (data.settings || []).find(row => row.key === key);
  if (!item) data.settings.push({id:`setting-${key}`,key,value,notes});
}

const ACTIVE_VENDOR_FINANCIAL_STATUSES=Object.freeze(['Đã chọn','Đã cọc','Hoàn tất']);
function vendorFinancialValues(record={}){
  const contractValue=Math.max(0,Number(record.contractValue||0));
  const deposit=Math.max(0,Number(record.deposit||0));
  const paid=Math.max(0,Number(record.paid||0));
  return {contractValue,deposit,paid,payable:Math.max(0,contractValue-deposit-paid)};
}
function applyVendorFinancialValues(record={}){
  const values=vendorFinancialValues(record);Object.assign(record,values);return record;
}
function vendorsForBudgetItem(budgetRow,data=DATA){
  if(!budgetRow)return [];
  const activeStatuses=new Set(ACTIVE_VENDOR_FINANCIAL_STATUSES);
  const eventId=String(budgetRow.anchor_event_id||''),serviceId=String(budgetRow.service_group_id||'');
  return (data.vendors||[]).filter(vendor=>activeStatuses.has(String(vendor.status||''))&&String(vendor.anchor_event_id||'')===eventId&&String(vendor.category_id||'')===serviceId);
}
function recomputeDerivedFinancials(data=DATA){
  (data.vendors||[]).forEach(vendor=>applyVendorFinancialValues(vendor));
  (data.budget||[]).forEach(row=>{
    const vendors=vendorsForBudgetItem(row,data);
    row.committed=vendors.reduce((sum,vendor)=>sum+vendorFinancialValues(vendor).contractValue,0);
    row.actual=vendors.length?vendors.reduce((sum,vendor)=>{const values=vendorFinancialValues(vendor);return sum+values.deposit+values.paid;},0):Math.max(0,Number(row.actual||0));row.budgeted=Math.max(0,Number(row.budgeted||0));
    row.payable=Math.max(0,row.committed-row.actual);
    row.remaining=row.budgeted-row.committed;
    row.variance=row.budgeted-row.actual;
  });
  (data.checklist||[]).forEach(row=>{
    const budget=(data.budget||[]).find(item=>String(item.id)===String(row.budget_item_id||''));
    row.budgetEstimate=budget?Number(budget.budgeted||0):0;
    row.committedCost=budget?Number(budget.committed||0):0;
    row.actualCost=budget?Number(budget.actual||0):0;
    row.payableCost=budget?Number(budget.payable||0):0;
    row.variance=row.budgetEstimate-row.actualCost;
  });
  const setting=(key)=> (data.settings||[]).find(row=>row.key===key);
  const reserve=Math.max(0,Number(setting('reserveBudget')?.value||0)),operating=Math.max(0,Number(setting('operatingBudget')?.value||0)),total=reserve+operating;
  let totalRow=setting('totalBudget');
  if(totalRow)totalRow.value=total;else (data.settings||(data.settings=[])).push({id:'setting-totalBudget',key:'totalBudget',value:total,notes:'Tự động = Quỹ dự phòng + Ngân sách vận hành'});
  return data;
}
function totalPlannedBudget(data=DATA,excludeId=''){return (data.budget||[]).filter(row=>String(row.id)!==String(excludeId||'')).reduce((sum,row)=>sum+Number(row.budgeted||0),0);}
function budgetLimitState(nextBudgeted,editingId=''){
  const total=Number(getSettings().totalBudget||0),planned=totalPlannedBudget(DATA,editingId)+Number(nextBudgeted||0);
  return {total,planned,over:Math.max(0,planned-total),exceeded:total>=0&&planned>total};
}
function showBudgetLimitDialog(state){
  const dialog=document.getElementById('budgetLimitDialog'),message=document.getElementById('budgetLimitMessage'),summary=document.getElementById('budgetLimitSummary');if(!dialog)return;
  if(message)message.textContent='Tổng ngân sách dự kiến của các hạng mục không được vượt Ngân sách tổng. Hãy giảm chi phí hạng mục hoặc tăng Ngân sách vận hành / Quỹ dự phòng.';
  if(summary)summary.innerHTML=`<div class="flex justify-between gap-4"><span>Ngân sách tổng</span><strong>${money(state.total)}</strong></div><div class="flex justify-between gap-4"><span>Sau điều chỉnh</span><strong>${money(state.planned)}</strong></div><div class="flex justify-between gap-4 text-rose-700 dark:text-rose-300"><span>Vượt</span><strong>${money(state.over)}</strong></div>`;
  if(!dialog.open)dialog.showModal();refreshIcons();
}

function migrateData(input) {
  const canonicalLookupPayload=Boolean(input&&typeof input==='object'&&Object.prototype.hasOwnProperty.call(input,'lookup_items'));
  const data = input && typeof input === 'object' ? structuredClone(input) : structuredClone(INITIAL_DATA);
  recordCollectionNames().forEach(key => { if (!Array.isArray(data[key])) data[key] = []; });
  if(!Array.isArray(data.lookup_items))data.lookup_items=[];
  normalizeDateFieldsInData(data);
  recordCollectionNames().forEach(key => data[key].forEach(row => { if(!/^[A-Za-z0-9_-]{1,120}$/.test(String(row?.id||''))) row.id=uid(key); }));
  ensureSetting(data,'accentTheme',storage.get(CONFIG.accentKey,'pink'),'Màu giao diện');
  ensureSetting(data,'googleSheetsEndpoint',storage.get(CONFIG.endpointKey,''),'Google Apps Script Web App URL');
  ensureSetting(data,'guestsPerTable',10,'Dùng để ước tính số bàn');
  ensureSetting(data,'dashboardDescription','Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.','Mô tả hiển thị tại tab Tổng quan');
  data.lookups = data.lookups && typeof data.lookups === 'object' ? data.lookups : {};
  if(data.lookup_items.length)rebuildLookupCompatibility(data);
  const defaults = {
    checklistPhases: uniqueValues(data.checklist,'phase').length ? uniqueValues(data.checklist,'phase') : ['TRƯỚC','TRONG','SAU'],
    checklistMilestones: uniqueValues(data.checklist,'milestone'),
    checklistGroups: uniqueValues(data.checklist,'group'),
    anchorEvents: uniqueValues(data.checklist,'anchorEvent').length ? uniqueValues(data.checklist,'anchorEvent') : ['Đăng ký kết hôn','Ăn hỏi','Rước dâu','Tiệc nhà trai','Tiệc nhà gái'],
    owners: [...new Set([...uniqueValues(data.checklist,'owner'),...uniqueValues(data.timeline,'owner')])],
    guestSides:['Nhà trai','Nhà gái','Cô dâu & chú rể'],
    guestGroups:['Gia đình','Họ hàng','Bạn bè','Đồng nghiệp','Khách VIP','Trẻ em'],
    invitationTypes:['Thiệp giấy','Thiệp điện tử','Cả hai'],
    vendorCategories:uniqueValues(data.vendors,'category'),
    referenceSources:['Website','Facebook','Instagram','TikTok','YouTube','Zalo','Người quen','Khác'],
    interestLevels:['Rất quan tâm','Quan tâm','Tham khảo','Không quan tâm'],
    referencePriorities:['Cao','Trung bình','Thấp']
  };
  if(!canonicalLookupPayload){
    // WeddingOS v12: Giai đoạn kế hoạch / Mốc thời gian are dormant legacy master data.
    // Preserve existing legacy values when present, but DO NOT seed them into a brand-new workbook.
    // To re-enable later, remove these keys from DORMANT_LOOKUP_KEYS and restore the Checklist fields/UI mapping.
    const DORMANT_LOOKUP_KEYS=new Set(['checklistPhases','checklistMilestones']);
    Object.entries(defaults).forEach(([key,values]) => {
      if(DORMANT_LOOKUP_KEYS.has(key))return;
      if (!Array.isArray(data.lookups[key]) || !data.lookups[key].length) data.lookups[key] = values;
      data.lookups[key] = [...new Set(data.lookups[key].map(value => String(value).trim()).filter(Boolean))];
    });
    data.lookups.referenceSources=[...new Set([...(data.lookups.referenceSources||[]),...defaults.referenceSources])];
    ensureLookupItemsFromLegacy(data,data.lookups);
  }
  rebuildLookupCompatibility(data);
  data.checklist.forEach(row => {
    if (!('budgetCategory' in row)) row.budgetCategory = '';
    if (!('payableCost' in row)) row.payableCost = 0;
  });
  const settingMap={};(data.settings||[]).forEach(row=>settingMap[row.key]=row.value);
  const timelineDateMap={'Đăng ký kết hôn':settingMap.registrationDate,'Lễ ăn hỏi':settingMap.engagementDate,'Ăn hỏi':settingMap.engagementDate,'Rước dâu':settingMap.pickupDate,'Tiệc nhà trai':settingMap.groomPartyDate,'Tiệc nhà gái':settingMap.bridePartyDate};
  data.timeline.forEach(row => {
    if (!('eventDate' in row)||!row.eventDate) row.eventDate = timelineDateMap[row.event]||'';
    row.startTime=normalizeTime24(row.startTime);row.endTime=normalizeTime24(row.endTime);
    row.durationMinutes=durationMinutesBetween(row.startTime,row.endTime);
  });
  data.security.forEach(row=>{row.passwordIterations=Number(row.passwordIterations||row.iterations||120000);row.passwordAlgorithm=row.passwordAlgorithm||row.algorithm||'PBKDF2-SHA256-256';});
  data.accounts.forEach(row=>{row.passwordIterations=Number(row.passwordIterations||row.iterations||120000);row.passwordAlgorithm=row.passwordAlgorithm||'PBKDF2-SHA256-256';row.encryptionIterations=Number(row.encryptionIterations||row.iterations||120000);row.encryptionAlgorithm=row.encryptionAlgorithm||row.algorithm||'AES-GCM-256 / PBKDF2-SHA256';});

  data.preferences.forEach(row => {
    if(typeof row.columns==='string'){try{row.columns=JSON.parse(row.columns)||{};}catch(_){row.columns={};}}
    if(!row.columns||typeof row.columns!=='object'||Array.isArray(row.columns))row.columns={};
    if(typeof row.sorts==='string'){try{row.sorts=JSON.parse(row.sorts)||{};}catch(_){row.sorts={};}}
    if(!row.sorts||typeof row.sorts!=='object'||Array.isArray(row.sorts))row.sorts={};
  });
  data.references.forEach(row => { row.rating = Math.min(5,Math.max(0,Number(row.rating || 0))); });
  data.vendors.forEach(row=>{
    if(row.status==='Vào shortlist')row.status='Đã nhận báo giá';
    row.contractValue=Number(row.contractValue||0);row.deposit=Number(row.deposit||0);row.paid=Number(row.paid||0);
    row.payable=Math.max(0,row.contractValue-row.deposit-row.paid);
  });
  data.budget.forEach(row => {
    row.budgeted=Number(row.budgeted||0);row.actual=Number(row.actual||0);
    row.committed=Number(row.committed||0);row.payable=Math.max(0,Number(row.committed||0)-row.actual);
    row.remaining=Number(row.budgeted||0)-Number(row.committed||0);row.variance=Number(row.budgeted||0)-row.actual;
  });
  recordCollectionNames().forEach(collection=>(data[collection]||[]).forEach(record=>{if(!Number.isFinite(Number(record._rowVersion)))record._rowVersion=0;if(CONFIG.schemas[collection])canonicalizeRecordReferences(collection,record,data);}));
  (data.lookup_items||[]).forEach(item=>{if(!Number.isFinite(Number(item._rowVersion)))item._rowVersion=0;});
  rebuildLookupCompatibility(data);hydrateReferenceLabels(data);recomputeDerivedFinancials(data);
  return data;
}

function loadData(){try{const raw=storage.get(CONFIG.storageKey,storage.get(CONFIG.legacyStorageKey,'null')),local=JSON.parse(raw),base=local&&typeof local==='object'?local:INITIAL_DATA,sensitive=parseStoredJson(secrets.get(CONFIG.sensitiveSessionKey,''),{});if(Array.isArray(sensitive.accounts))base.accounts=sensitive.accounts;if(Array.isArray(sensitive.security))base.security=sensitive.security;return migrateData(base);}catch(error){console.warn('Không đọc được cache WeddingOS',error);return migrateData(INITIAL_DATA);}}

function userCacheKey(accountId){return `${CONFIG.userCachePrefix}${encodeURIComponent(String(accountId||''))}`;}
function userPendingKey(accountId){return `${CONFIG.userPendingPrefix}${encodeURIComponent(String(accountId||''))}`;}
function isRemoteAccountPrincipal(){return Boolean(configuredEndpoint()&&AUTH?.currentUserId&&currentUserProfile()?.kind==='account');}
function readUserCache(accountId){
  if(!accountId)return null;
  try{const record=parseStoredJson(storage.get(userCacheKey(accountId),''),null);if(!record||record.version!==1||String(record.accountId||'')!==String(accountId)||!record.data)return null;return record;}catch(_){return null;}
}
function activateUserCache(accountId){
  const record=readUserCache(accountId);
  UI.pendingChanges=loadPendingChanges(accountId);
  if(!record){DATA=migrateData({});setRemoteRevision(0);UI.hydrationHasCache=false;return false;}
  DATA=migrateData(record.data);setRemoteRevision(record.revision||0);UI.hydrationHasCache=true;return true;
}
function saveData(){
  const persistent=structuredClone(DATA),endpoint=String((persistent.settings||[]).find(row=>row.key==='googleSheetsEndpoint')?.value||storage.get(CONFIG.endpointKey,'')).trim();
  if(endpoint){persistent.accounts=[];persistent.security=[];}
  if(isRemoteAccountPrincipal()){
    storage.set(userCacheKey(AUTH.currentUserId),JSON.stringify({version:1,accountId:AUTH.currentUserId,revision:remoteRevision(),savedAt:new Date().toISOString(),data:persistent}));
    return;
  }
  if(endpoint){secrets.set(CONFIG.sensitiveSessionKey,JSON.stringify({accounts:DATA.accounts||[],security:DATA.security||[]}));}
  storage.set(CONFIG.storageKey,JSON.stringify(persistent));
}
function loadPendingChanges(accountId='admin'){try{if(accountId&&accountId!=='admin'&&accountId!=='guest'){const regular=JSON.parse(storage.get(userPendingKey(accountId),'[]'));return Array.isArray(regular)?regular:[];}const regular=JSON.parse(storage.get(CONFIG.pendingKey,'[]')),sensitive=JSON.parse(secrets.get(CONFIG.sensitivePendingKey,'[]'));return[...(Array.isArray(regular)?regular:[]),...(Array.isArray(sensitive)?sensitive:[])];}catch(_){return[];}}
function savePendingChanges(){const accountId=AUTH?.currentUserId||'';if(accountId&&currentUserProfile()?.kind==='account'){const safe=UI.pendingChanges.filter(change=>!['security','accounts'].includes(change.collection));storage.set(userPendingKey(accountId),JSON.stringify(safe));updatePendingIndicators();return;}const sensitiveNames=new Set(['security','accounts']),regular=UI.pendingChanges.filter(change=>!sensitiveNames.has(change.collection)),sensitive=UI.pendingChanges.filter(change=>sensitiveNames.has(change.collection));storage.set(CONFIG.pendingKey,JSON.stringify(regular));secrets.set(CONFIG.sensitivePendingKey,JSON.stringify(sensitive));updatePendingIndicators();}

function loadSyncConflicts(){try{const value=JSON.parse(storage.get(CONFIG.conflictKey,'[]'));return Array.isArray(value)?value:[];}catch(_){return[];}}
function saveSyncConflicts(){storage.set(CONFIG.conflictKey,JSON.stringify(UI.conflicts||[]));updatePendingIndicators();}
function syncComparable(value){return JSON.stringify(value===undefined?null:value);}
function changedFieldPatch(collection,before={},after={}){
  const changedFields={},baseValues={};
  const keys=new Set([...Object.keys(before||{}),...Object.keys(after||{})]);
  keys.forEach(key=>{if(key==='id'||TECHNICAL_RECORD_FIELDS.has(key)||canonicalReferenceForLegacy(collection,key))return;if(syncComparable(before?.[key])!==syncComparable(after?.[key])){changedFields[key]=structuredClone(after?.[key]??'');baseValues[key]=structuredClone(before?.[key]??'');}});
  return {changedFields,baseValues};
}
function syncRecordPayload(collection,record={}){
  const clean={};
  Object.keys(record||{}).forEach(key=>{
    if(key==='id'||TECHNICAL_RECORD_FIELDS.has(key)||canonicalReferenceForLegacy(collection,key))return;
    clean[key]=structuredClone(record[key]??'');
  });
  return clean;
}
function cancelMutationSync(){
  if(UI.mutationSyncTimer){clearTimeout(UI.mutationSyncTimer);UI.mutationSyncTimer=null;}
  UI.mutationSyncDueAt='';
}
function canRunMutationSync(){
  return Boolean(configuredEndpoint()&&activeServerToken(false)&&!document.body.classList.contains('auth-locked')&&UI.hydrationState!=='loading'&&!UI.mutationLocked);
}
function scheduleMutationSync(delay=CONFIG.mutationSyncDelayMs){
  cancelMutationSync();
  if(!UI.pendingChanges.length||!canRunMutationSync())return;
  const waitMs=Math.max(250,Number(delay||CONFIG.mutationSyncDelayMs));
  UI.mutationSyncDueAt=new Date(Date.now()+waitMs).toISOString();
  UI.mutationSyncTimer=setTimeout(async()=>{
    UI.mutationSyncTimer=null;UI.mutationSyncDueAt='';
    if(!UI.pendingChanges.length||!canRunMutationSync())return;
    if(UI.syncing){scheduleMutationSync(500);return;}
    // One immediate attempt only; on network/server failure the 15-second heartbeat is the fallback.
    await syncPreview({automatic:true,reason:'mutation'});
  },waitMs);
}
function queueChange(change) {
  const key = `${change.collection}:${change.id}`;
  const index = UI.pendingChanges.findIndex(item => `${item.collection}:${item.id}` === key);
  const normalized = {...change,protocolVersion:2,changeId:change.changeId||uid('change'),deviceId:deviceId(),changedAt:new Date().toISOString()};
  if(index>=0){
    const existing=UI.pendingChanges[index];
    if(normalized.op==='delete'){
      normalized.baseVersion=Number(existing.baseVersion??normalized.baseVersion??0);normalized.baseValues=existing.baseValues||{};
    }else if(existing.op==='upsert'&&(normalized.op==='upsert'||normalized.op==='patch')){
      const patch=normalized.op==='upsert'?(normalized.record||{}):(normalized.changedFields||{});
      normalized.op='upsert';normalized.changeId=existing.changeId;normalized.baseVersion=Number(existing.baseVersion||0);
      normalized.record={...(existing.record||{}),...structuredClone(patch)};delete normalized.changedFields;delete normalized.baseValues;
    }else if(existing.op==='patch'&&normalized.op==='patch'){
      normalized.changeId=existing.changeId;normalized.baseVersion=Number(existing.baseVersion||0);
      normalized.baseValues={...(normalized.baseValues||{}),...(existing.baseValues||{})};
      normalized.changedFields={...(existing.changedFields||{}),...(normalized.changedFields||{})};
    }else if(existing.op==='patch'&&normalized.op==='upsert'){
      normalized.changeId=existing.changeId;normalized.baseVersion=Number(existing.baseVersion||normalized.baseVersion||0);
    }
    UI.pendingChanges[index]=normalized;
  }else UI.pendingChanges.push(normalized);
  savePendingChanges();
  scheduleMutationSync();
}
function queuePatch(collection,before,after){const patch=changedFieldPatch(collection,before||{},after||{});if(!Object.keys(patch.changedFields).length)return;queueChange({op:'patch',collection,id:after.id,baseVersion:Number(before?._rowVersion||0),changedFields:patch.changedFields,baseValues:patch.baseValues});}
function queueUpsert(collection,record,before=null){
  const serverVersion=Number(before?._rowVersion??record?._rowVersion??0);
  if(before&&serverVersion>0){queuePatch(collection,before,record);return;}
  queueChange({op:'upsert',collection,id:record.id,baseVersion:Math.max(0,serverVersion),record:{id:record.id,...syncRecordPayload(collection,record)},baseValues:{}});
}
function queueDelete(collection,id,before=null){const existing=UI.pendingChanges.find(item=>item.collection===collection&&item.id===id);queueChange({op:'delete',collection,id,baseVersion:Number(existing?.baseVersion??before?._rowVersion??0),baseValues:existing?.baseValues||{}});}

function updatePendingIndicators(){
  const count=UI.pendingChanges.length,conflictCount=(UI.conflicts||[]).length;document.querySelectorAll('[data-pending-count]').forEach(node=>node.textContent=(count+conflictCount)?String(count+conflictCount):'');const syncButton=document.getElementById('syncButton');
  if(syncButton&&!syncButton.disabled)syncButton.title=needsInitialFullSync()?`Cần đồng bộ toàn bộ dữ liệu lần đầu (${count} thay đổi cục bộ)`:needsSchemaSync()?'Cấu trúc Google Sheets cần được cập nhật':(conflictCount?`${conflictCount} xung đột cần xử lý`:(count?`${count} thay đổi đang chờ đồng bộ`:'Không có thay đổi đang chờ'));
  setManualSyncControlsDisabled(UI.syncing);
}

function uid(prefix='row') { return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(16).slice(2)}`; }
function esc(value='') { return String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char])); }
function encoded(value=''){ return encodeURIComponent(String(value??'')); }
function money(value) { return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(Number(value||0)); }
function compactMoney(value) { return new Intl.NumberFormat('vi-VN',{notation:'compact',maximumFractionDigits:1}).format(Number(value||0))+' ₫'; }
function mobileMoneyMB(value){const number=Number(value||0),abs=Math.abs(number);if(abs>=1_000_000_000)return `${new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(number/1_000_000_000)}B`;if(abs>=1_000_000)return `${new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1}).format(number/1_000_000)}M`;return new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0}).format(number);}
function normalizeDateOnly(value) {
  if(value===null||value===undefined||value==='')return '';
  if(value instanceof Date&&!Number.isNaN(value.getTime())){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value);
    const map=Object.fromEntries(parts.filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }
  const text=String(value).trim();
  let match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if(match)return `${match[1]}-${match[2]}-${match[3]}`;
  match=/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/.exec(text);
  if(match)return `${match[3]}-${match[2]}-${match[1]}`;
  const parsed=new Date(text);
  if(!Number.isNaN(parsed.getTime())){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(parsed);
    const map=Object.fromEntries(parts.filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }
  const isoPrefix=/^(\d{4}-\d{2}-\d{2})T/.exec(text);
  return isoPrefix?isoPrefix[1]:text;
}
function formatDate(value) {
  const normalized=normalizeDateOnly(value);
  if(!normalized)return 'Chưa chốt';
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);
  return match?`${match[3]}/${match[2]}/${match[1]}`:normalized;
}
function normalizeTime24(value){
  const text=String(value??'').trim();if(!text)return '';
  const match=/^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text);if(!match)return '';
  const hour=Number(match[1]),minute=Number(match[2]);if(hour<0||hour>23||minute<0||minute>59)return '';
  return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
}
function formatTime24(value){return normalizeTime24(value)||'—';}
function timeToMinutes24(value){const normalized=normalizeTime24(value);if(!normalized)return null;const [hour,minute]=normalized.split(':').map(Number);return hour*60+minute;}
function durationMinutesBetween(startTime,endTime){
  const start=timeToMinutes24(startTime),end=timeToMinutes24(endTime);if(start===null||end===null)return 0;
  if(start===end)return 0;return end>start?end-start:(1440-start)+end;
}
function formatDurationMinutes(value){const total=Math.max(0,Number(value||0));const hours=Math.floor(total/60),minutes=total%60;if(!hours)return `${minutes} phút`;return minutes?`${hours} giờ ${minutes} phút`:`${hours} giờ`;}
function formatDateTime(value) { const date=new Date(value); return Number.isNaN(date.getTime())?String(value||'—'):new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,hourCycle:'h23'}).format(date); }
function normalizeDateFieldsInData(data){
  Object.entries(CONFIG.schemas||{}).forEach(([collection,schema])=>{
    const dateKeys=(schema.fields||[]).filter(field=>field[2]==='date').map(field=>field[0]);
    (data?.[collection]||[]).forEach(row=>dateKeys.forEach(key=>{if(row&&row[key]!==undefined&&row[key]!==null&&row[key]!=='')row[key]=normalizeDateOnly(row[key]);}));
  });
  const settingDateKeys=new Set(['registrationDate','engagementDate','pickupDate','groomPartyDate','bridePartyDate']);
  (data?.settings||[]).forEach(row=>{if(settingDateKeys.has(row?.key)&&row.value)row.value=normalizeDateOnly(row.value);});
  return data;
}
function formatNumberInputValue(value){
  if(value===null||value===undefined||value==='')return '';
  const number=typeof value==='number'?value:parseFormattedNumber(value);
  return Number.isFinite(number)?new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0}).format(number):'';
}
function parseFormattedNumber(value){
  const text=String(value??'').trim();if(!text)return 0;
  const negative=text.startsWith('-'),digits=text.replace(/\D/g,'');
  if(!digits)return 0;const number=Number(digits);return negative?-number:number;
}
function formatNumberInputElement(input,{forceZero=false}={}){
  if(!input)return;const raw=String(input.value??''),trimmed=raw.trim();
  if(trimmed==='')return;if(trimmed==='-'){if(forceZero)input.value='0';return;}
  const selection=Number.isInteger(input.selectionStart)?input.selectionStart:raw.length,digitsRight=raw.slice(selection).replace(/\D/g,'').length,negative=trimmed.startsWith('-'),digits=trimmed.replace(/\D/g,'');
  if(!digits){input.value=forceZero?'0':(negative?'-':'');return;}
  const formatted=formatNumberInputValue((negative?'-':'')+digits);input.value=formatted;
  if(document.activeElement===input&&typeof input.setSelectionRange==='function'){let position=formatted.length,remaining=digitsRight;while(position>0&&remaining>0){position-=1;if(/\d/.test(formatted[position]))remaining-=1;}try{input.setSelectionRange(position,position);}catch(_){}}
}
function bindNumberInputs(root=document){
  root.querySelectorAll?.('[data-number-input]').forEach(input=>{
    if(input.dataset.numberBound==='1'){formatNumberInputElement(input);return;}input.dataset.numberBound='1';input.autocomplete='off';
    input.addEventListener('input',()=>formatNumberInputElement(input));
    input.addEventListener('change',()=>formatNumberInputElement(input,{forceZero:true}));
    input.addEventListener('blur',()=>formatNumberInputElement(input,{forceZero:true}));
    input.addEventListener('paste',()=>requestAnimationFrame(()=>formatNumberInputElement(input)));
    formatNumberInputElement(input);
  });
}

function plural(value,text){ return `${new Intl.NumberFormat('vi-VN').format(value)} ${text}`; }
function getSettings(){ const map={}; (DATA.settings||[]).forEach(item=>map[item.key]=item.value); map.totalBudget=Number(map.reserveBudget||0)+Number(map.operatingBudget||0); return map; }
function isDark(){ return document.documentElement.classList.contains('dark'); }
function icon(name,classes='size-4'){ return `<i data-lucide="${name}" class="${classes}"></i>`; }
function refreshIcons(){ if(window.lucide?.createIcons) window.lucide.createIcons(); }
function wait(ms){ return new Promise(resolve=>setTimeout(resolve,ms)); }
function safeExternalUrl(value){ try{ const url=new URL(String(value||'').trim()); return ['https:','http:'].includes(url.protocol)?url.toString():''; }catch(_){ return ''; } }
function normalizeAppsScriptEndpoint(value){
  const raw=String(value||'').trim(); if(!raw)return '';
  let url; try{url=new URL(raw);}catch(_){throw new Error('URL Google Apps Script không hợp lệ.');}
  if(url.protocol!=='https:')throw new Error('Google Apps Script URL phải sử dụng HTTPS.');
  if(url.hostname.toLowerCase()!=='script.google.com')throw new Error('Chỉ chấp nhận URL triển khai từ script.google.com.');
  if(!/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname))throw new Error('URL phải là Web App đã triển khai và kết thúc bằng /exec.');
  url.hash=''; return url.toString();
}
function embeddedEndpoint(){
  const value=document.querySelector('meta[name="wedding-sync-endpoint"]')?.content||'';
  try{return normalizeAppsScriptEndpoint(value);}catch(_){return '';}
}
function endpointFromLocation(){
  try{
    const url=new URL(window.location.href),hashParams=new URLSearchParams(url.hash.replace(/^#/,''));
    const value=url.searchParams.get(CONFIG.endpointUrlParam)||hashParams.get(CONFIG.endpointUrlParam)||'';
    return value?normalizeAppsScriptEndpoint(value):'';
  }catch(_){return '';}
}
function connectionShareUrl(endpoint=configuredEndpoint()){
  const normalized=endpoint?normalizeAppsScriptEndpoint(endpoint):'';
  const url=new URL(window.location.href),hashParams=new URLSearchParams(url.hash.replace(/^#/,''));
  url.searchParams.delete(CONFIG.endpointUrlParam);
  if(normalized)hashParams.set(CONFIG.endpointUrlParam,normalized);else hashParams.delete(CONFIG.endpointUrlParam);
  const hash=hashParams.toString();url.hash=hash?`#${hash}`:'';
  return url.toString();
}
function persistEndpointBootstrap(endpoint){
  const normalized=endpoint?normalizeAppsScriptEndpoint(endpoint):'';
  if(normalized)storage.set(CONFIG.endpointKey,normalized);else storage.remove(CONFIG.endpointKey);
  try{history.replaceState(null,'',connectionShareUrl(normalized));}catch(_){}
  return normalized;
}
function importEndpointBootstrap(){
  const endpoint=endpointFromLocation()||embeddedEndpoint();
  if(!endpoint)return '';
  let item=(DATA.settings||[]).find(row=>row.key==='googleSheetsEndpoint');
  if(item)item.value=endpoint;else{item={id:'setting-googleSheetsEndpoint',key:'googleSheetsEndpoint',value:endpoint,notes:'Google Apps Script Web App URL'};(DATA.settings||(DATA.settings=[])).push(item);}
  item.updatedAt=item.updatedAt||new Date().toISOString();storage.set(CONFIG.endpointKey,endpoint);saveData();return endpoint;
}
function configuredEndpoint(){
  const fixed=embeddedEndpoint();
  const value=fixed||endpointFromLocation()||getSettings().googleSheetsEndpoint||storage.get(CONFIG.endpointKey,'');
  try{return normalizeAppsScriptEndpoint(value);}catch(_){return '';}
}
function needsInitialFullSync(endpoint=configuredEndpoint()){ return Boolean(endpoint)&&storage.get(CONFIG.fullSyncEndpointKey,'')!==endpoint; }
async function fetchWithTimeout(url,options={},timeoutMs=CONFIG.networkTimeouts.default){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{...options,signal:controller.signal});}
  catch(error){
    if(error?.name==='AbortError')throw remoteError(`Máy chủ Google Sheets chưa phản hồi sau ${Math.ceil(timeoutMs/1000)} giây. Yêu cầu có thể vẫn đang được xử lý trên máy chủ.`, 'REQUEST_TIMEOUT');
    if(error instanceof TypeError)throw remoteError('Không thể kết nối tới Google Apps Script. Hãy kiểm tra Internet, quyền triển khai Web App và thử lại.', 'NETWORK_ERROR');
    throw error;
  }
  finally{clearTimeout(timer);}
}
async function readJsonResponse(response,maxChars=10_000_000){
  const text=await response.text(); if(text.length>maxChars)throw new Error('Phản hồi từ máy chủ vượt giới hạn an toàn.');
  if(!text)return {};
  try{return JSON.parse(text);}catch(_){return {raw:text};}
}
function validateRemoteData(remote){
  if(!remote||typeof remote!=='object'||Array.isArray(remote))throw new Error('Dữ liệu Google Sheets không đúng định dạng.');
  const manifest=buildSchemaManifest();
  Object.entries(manifest.modules).forEach(([key,module])=>{
    const value=remote[key];
    if(module.dataShape==='lookupMap'){
      if(value!==undefined&&(!value||typeof value!=='object'||Array.isArray(value)))throw new Error(`Bộ dữ liệu ${key} không hợp lệ.`);
      if(value&&Object.keys(value).length>50000)throw new Error(`Bộ dữ liệu ${key} vượt giới hạn 50.000 bản ghi.`);
    }else{
      if(value!==undefined&&!Array.isArray(value))throw new Error(`Bộ dữ liệu ${key} không hợp lệ.`);
      if((value?.length||0)>50000)throw new Error(`Bộ dữ liệu ${key} vượt giới hạn 50.000 bản ghi.`);
    }
  });
  return remote;
}

function applyAccentTheme(themeKey) {
  const selected = ACCENT_THEMES[themeKey] || ACCENT_THEMES.pink;
  Object.entries(selected.vars).forEach(([tone,value]) => document.documentElement.style.setProperty(`--color-brand-${tone}`,value));
  storage.set(CONFIG.accentKey,themeKey);
}

function statusBadge(value) {
  const configs={
    'Hoàn thành':['emerald','circle-check-big'],'Đang làm':['blue','loader-circle'],'Chờ xác nhận':['amber','clock-3'],
    'Chưa bắt đầu':['slate','circle-dashed'],'Tạm hoãn':['orange','pause-circle'],'Hủy':['rose','circle-x'],
    'Đồng ý':['emerald','circle-check-big'],'Từ chối':['rose','circle-x'],'Chưa chắc':['amber','circle-help'],'Chưa phản hồi':['slate','circle-dashed'],
    'Đã gửi':['emerald','send'],'Chưa':['slate','mail'],
    'Đã chọn':['emerald','badge-check'],'Đã cọc':['blue','landmark'],'Hoàn tất':['emerald','circle-check-big'],
    'Đang khảo sát':['slate','search'],'Đã nhận báo giá':['indigo','file-text'],'Vào shortlist':['amber','star'],'Loại':['rose','circle-x']
  };
  const [tone,badgeIcon]=configs[value]||['slate','circle'];
  const toneClasses={
    emerald:'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300',
    blue:'bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-500/10 dark:text-blue-300',
    amber:'bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300',
    orange:'bg-orange-50 text-orange-700 ring-orange-600/15 dark:bg-orange-500/10 dark:text-orange-300',
    rose:'bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300',
    indigo:'bg-indigo-50 text-indigo-700 ring-indigo-600/15 dark:bg-indigo-500/10 dark:text-indigo-300',
    slate:'bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300'
  }[tone];
  return `<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses}">${icon(badgeIcon,'size-3.5')}${esc(value||'Chưa cập nhật')}</span>`;
}

function priorityBadge(value){ const cls=value==='Cao'?'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300':value==='Trung bình'?'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300':'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'; return `<span class="rounded-full px-2 py-1 text-xs font-semibold ${cls}">${esc(value||'—')}</span>`; }
function fieldLabel(schema,key){ if(key===ACTION_COLUMN_KEY)return 'Tác vụ'; return schema.fields.find(field=>field[0]===key)?.[1] || ({remaining:'Còn lại'}[key]||key); }
function fieldType(schema,key){return schema.fields.find(field=>field[0]===key)?.[2]||'text';}
function isLongTextColumn(schema,key){return fieldType(schema,key)==='textarea'||['task','description','notes','includes','paymentTerms','address'].includes(key);}
function dataColumnClass(schema,key){const type=fieldType(schema,key);if(key===ACTION_COLUMN_KEY)return 'data-col data-col--actions';if(['number','currency','rating'].includes(type)||['budgeted','committed','actual','variance','paid','payable','remaining','quote','deposit','giftValue','budgetEstimate','actualCost','payableCost','partySize','tableNo'].includes(key))return 'data-col data-col--number';if(type==='date'||type==='time'||type==='datetime'||key.toLowerCase().includes('date')||key.toLowerCase().includes('due'))return 'data-col data-col--date';if(isLongTextColumn(schema,key))return 'data-col data-col--long';return 'data-col data-col--text';}
function primaryTitleKey(schema,columns){return columns.find(key=>key!==ACTION_COLUMN_KEY)||schema.columns[0];}

function displayValue(schema,key,value) {
  const type=schema.fields.find(field=>field[0]===key)?.[2]||'text';
  if(key===schema.statusField||key==='status'||key==='rsvp'||key==='sent') return statusBadge(value);
  if(key==='priority') return priorityBadge(value);
  if(type==='rating'||key==='rating'){ const score=Math.min(5,Math.max(0,Number(value||0))); return `<span class="rating-stars" aria-label="${score} trên 5 sao" title="${score}/5">${'★'.repeat(score)}<span class="rating-stars__empty">${'★'.repeat(5-score)}</span></span>`; }
  if(key==='durationMinutes') return `<span class="whitespace-nowrap tabular">${esc(formatDurationMinutes(value))}</span>`;
  if(type==='currency'||['budgeted','committed','actual','variance','paid','payable','remaining','quote','deposit','giftValue','budgetEstimate','actualCost','payableCost'].includes(key)) return `<span class="tabular whitespace-nowrap font-medium">${money(value)}</span>`;
  if(type==='date'||key.toLowerCase().includes('date')||key.toLowerCase().includes('due')) return `<span class="whitespace-nowrap">${esc(formatDate(value))}</span>`;
  if(type==='time') return `<span class="whitespace-nowrap tabular">${esc(formatTime24(value))}</span>`;
  if(type==='url'&&value){ const safe=safeExternalUrl(value); return safe?`<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline dark:text-brand-300">Mở liên kết ${icon('external-link','size-3.5')}</a>`:`<span class="text-rose-600 dark:text-rose-300">Liên kết không hợp lệ</span>`; }
  if(Array.isArray(value)) return esc(value.join(', ')||'—');
  if(typeof value==='number') return `<span class="tabular">${new Intl.NumberFormat('vi-VN').format(value)}</span>`;
  return esc(value||'—');
}

function collectionRows(collection){
  const rows=DATA[collection]||[];
  if(collection==='guests') return rows.filter(row=>row.name||row.phone||row.events||row.tableNo||Number(row.partySize||0)>0);
  if(collection==='vendors') return rows.filter(row=>row.name||row.contact||Number(row.quote||0)>0||Number(row.deposit||0)>0||!['','Đang khảo sát'].includes(row.status||''));
  return rows;
}

function renderNavigation() {
  const desktop=document.getElementById('desktopNav');
  desktop.innerHTML=`<p class="px-3 pb-2 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Danh sách tính năng</p>${CONFIG.nav.map(item=>`<button type="button" data-nav="${item.id}" class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-500 ${UI.tab===item.id?'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950':'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}"><span class="nav-feature-icon nav-feature-icon--${item.tone||'slate'} ${UI.tab===item.id?'nav-feature-icon--active':''}">${icon(item.icon,'size-[18px]')}</span><span class="min-w-0 flex-1"><span class="block truncate text-sm font-semibold">${item.label}</span><span class="block truncate text-xs ${UI.tab===item.id?'text-slate-300 dark:text-slate-600':'text-slate-400'}">${item.description}</span></span>${UI.tab===item.id?icon('chevron-right','size-4 opacity-70'):''}</button>`).join('')}`;
  const mobile=document.getElementById('mobileNav');
  mobile.innerHTML=`<button type="button" data-nav="dashboard" class="mobile-core-nav ${UI.tab==='dashboard'?'is-active':''}">${icon('layout-dashboard','size-5')}<span>Tổng quan</span></button><button id="mobileCreateButton" type="button" class="mobile-core-nav">${icon('plus-circle','size-5')}<span>Tạo mới</span></button><button id="mobileSyncButton" type="button" class="mobile-core-nav">${icon('refresh-cw','size-5')}<span>Đồng bộ</span></button><button id="mobileAccountButton" type="button" class="mobile-core-nav">${icon('user-round','size-5')}<span>Tài khoản</span></button>`;
  document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.nav)));
  document.getElementById('mobileCreateButton')?.addEventListener('click',handleMobileCreate);
  document.getElementById('mobileSyncButton')?.addEventListener('click',()=>{if(!UI.syncing)syncPreview();});
  document.getElementById('mobileAccountButton')?.addEventListener('click',openProfileDialog);
  updateCoupleWidget();
}
function closeMobileActions(){
  const sheet=document.getElementById('mobileActions');
  UI.mobileActionsOpen=false;
  if(sheet)sheet.classList.add('hidden');
}
function openMobileActions(){
  const sheet=document.getElementById('mobileActions');
  if(!sheet)return;
  UI.mobileActionsOpen=true;
  sheet.classList.remove('hidden');
}
function handleMobileCreate(){
  if(UI.mutationLocked){toast('Dữ liệu đang được kiểm tra phiên bản mới nhất. Vui lòng chờ một chút.','info');return;}
  if(CONFIG.schemas[UI.tab]&&UI.tab!=='settings'){closeMobileActions();openEditor(UI.tab);return;}
  const sheet=document.getElementById('mobileActions');if(!sheet)return;
  if(UI.mobileActionsOpen){closeMobileActions();return;}
  const targets=CONFIG.nav.filter(item=>CONFIG.schemas[item.id]&&item.id!=='settings');
  sheet.innerHTML=`<div class="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">Tạo mới tính năng</div>${targets.map(item=>`<button type="button" data-mobile-create="${item.id}" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"><span class="nav-feature-icon nav-feature-icon--${item.tone||'slate'}">${icon(item.icon,'size-4')}</span><span class="min-w-0 flex-1">${item.label}</span>${icon('chevron-right','size-4 text-slate-300')}</button>`).join('')}`;
  openMobileActions();
  sheet.querySelectorAll('[data-mobile-create]').forEach(button=>button.addEventListener('click',()=>{closeMobileActions();openEditor(button.dataset.mobileCreate);}));
  refreshIcons();
}

function updateCoupleWidget(){ const settings=getSettings(); const label=(settings.groomName||'Tên chú rể')+' × '+(settings.brideName||'Tên cô dâu'); const node=document.getElementById('coupleWidgetName'); if(node) node.textContent=label; }

const SECURITY_POLICY={defaultPassword:'admin@123',passwordIterations:120000,encryptionIterations:120000,minPasswordLength:6};
const AUTH={settingsUnlocked:false,masterPassword:'',pendingTab:null,passwordChangeForced:false,accounts:[],editingAccountId:null,passwordAccountId:null,currentUserId:secrets.get(CONFIG.accountSessionKey,''),adminBypass:false,adminAuthenticated:false,bootstrapMode:false,currentProfile:null,serverRequiresLogin:false,remoteStatus:null};

function lockAuthenticatedShell(){stopAutoSync();document.body.classList.add('auth-locked');document.getElementById('mainContent')?.replaceChildren();document.getElementById('desktopNav')?.replaceChildren();document.getElementById('mobileNav')?.replaceChildren();}
function unlockAuthenticatedShell(){document.body.classList.remove('auth-locked');}
function clearRememberedLogin(){storage.remove(CONFIG.rememberLoginKey);storage.remove(CONFIG.rememberedAuthKey);}
function rememberedLoginRecord(){
  if(storage.get(CONFIG.rememberLoginKey,'')!=='1')return null;
  const record=parseStoredJson(storage.get(CONFIG.rememberedAuthKey,''),null);
  if(!record||record.version!==2||String(record.endpoint||'')!==configuredEndpoint()||!record.accountId||!record.rememberToken){clearRememberedLogin();return null;}
  if(record.rememberExpiresAt&&Date.parse(record.rememberExpiresAt)<=Date.now()){clearRememberedLogin();return null;}
  return record;
}
function saveRememberedLogin(remember,payload={}){
  if(!remember){clearRememberedLogin();return;}
  const token=String(payload.rememberToken||'');
  if(!token){clearRememberedLogin();return;}
  const record={version:2,endpoint:configuredEndpoint(),accountId:String(payload.accountId||AUTH.currentUserId||''),profile:payload.profile||currentUserProfile(),rememberToken:token,rememberExpiresAt:String(payload.rememberExpiresAt||''),savedAt:new Date().toISOString()};
  storage.set(CONFIG.rememberLoginKey,'1');storage.set(CONFIG.rememberedAuthKey,JSON.stringify(record));
}
function restoreRememberedLogin(){
  const record=rememberedLoginRecord();if(!record)return false;
  AUTH.currentUserId=String(record.accountId);AUTH.currentProfile=record.profile||null;
  secrets.set(CONFIG.accountSessionKey,AUTH.currentUserId);if(record.profile)secrets.set(CONFIG.accountProfileKey,JSON.stringify(record.profile));
  return true;
}
async function resumeRememberedServerSession(){
  const record=rememberedLoginRecord();if(!record||!configuredEndpoint())return false;
  const resumed=await postAppsScript({action:'resumeRememberedSession',rememberToken:record.rememberToken},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth,trackRevision:false});
  AUTH.currentUserId=resumed.profile?.id||record.accountId;AUTH.currentProfile=resumed.profile||record.profile||null;secrets.set(CONFIG.accountSessionKey,AUTH.currentUserId);secrets.set(CONFIG.accountServerSessionKey,resumed.sessionToken);if(resumed.profile)setSessionProfile(resumed.profile);UI.serverRevisionHint=Number(resumed.revision||0);return true;
}
function renderAuthenticatedWorkspace(){unlockAuthenticatedShell();applyCurrentPreferences();renderNavigation();renderHeader();renderPage();updatePendingIndicators();updateNotificationBadge();refreshIcons();if(!UI.mutationLocked&&UI.hydrationState!=='loading')startAutoSync();if(UI.conflicts?.length)setTimeout(openNextSyncConflict,120);}


function parseStoredJson(value,fallback=null){try{return JSON.parse(String(value||''))||fallback;}catch(_){return fallback;}}
function currentPrincipalId(){if(AUTH.currentUserId)return AUTH.currentUserId;if(AUTH.adminAuthenticated||AUTH.adminBypass||!(DATA.accounts||[]).length)return'admin';return'guest';}
function preferenceRecordId(accountId=currentPrincipalId()){return`preference-${String(accountId).replace(/[^A-Za-z0-9_-]/g,'-')}`;}
function getCurrentPreference(){const accountId=currentPrincipalId();return(DATA.preferences||[]).find(row=>row.accountId===accountId||row.id===preferenceRecordId(accountId))||null;}
function updateCurrentPreference(patch={}){const accountId=currentPrincipalId(),id=preferenceRecordId(accountId),current=getCurrentPreference(),existing=current||{id,accountId,theme:'',accent:'',columns:{},sorts:{}},before=current?structuredClone(current):null;const record={...existing,...patch,id,accountId,columns:{...(existing.columns||{}),...(patch.columns||{})},sorts:{...(existing.sorts||{}),...(patch.sorts||{})},updatedAt:new Date().toISOString()};const index=(DATA.preferences||[]).findIndex(row=>row.id===id||row.accountId===accountId);if(index>=0)DATA.preferences[index]=record;else(DATA.preferences||(DATA.preferences=[])).push(record);queueUpsert('preferences',record,before);saveData();return record;}
function currentUserProfile(){if(AUTH.currentProfile)return AUTH.currentProfile;const cached=parseStoredJson(secrets.get(CONFIG.accountProfileKey,''));if(cached&&cached.id===AUTH.currentUserId){AUTH.currentProfile=cached;return cached;}if(AUTH.currentUserId){const decoded=AUTH.accounts.find(item=>item.id===AUTH.currentUserId),row=(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId);const profile={id:AUTH.currentUserId,userCode:decoded?.userCode||row?.userCode||'',displayName:decoded?.displayName||row?.displayName||row?.usernameLabel||'Người dùng',username:decoded?.username||row?.usernameLabel||'',status:row?.status||decoded?.status||'active',kind:'account'};AUTH.currentProfile=profile;return profile;}return{id:'admin',userCode:'ADMIN',displayName:'Quản trị viên',username:'Administrator',status:'active',kind:'admin'};}
function setSessionProfile(profile){AUTH.currentProfile=profile||null;if(profile)secrets.set(CONFIG.accountProfileKey,JSON.stringify(profile));else secrets.remove(CONFIG.accountProfileKey);}
function isAdministrator(){return AUTH.settingsUnlocked&&AUTH.adminAuthenticated;}
function applyCurrentPreferences(){const pref=getCurrentPreference(),fallbackAccent=getSettings().accentTheme||storage.get(CONFIG.accentKey,'pink'),fallbackTheme=storage.get(CONFIG.themeKey,'');const dark=(pref?.theme||fallbackTheme)==='dark'||(!(pref?.theme||fallbackTheme)&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';applyAccentTheme(pref?.accent||fallbackAccent);}
function setUserTheme(dark){const enabled=Boolean(dark);document.documentElement.classList.toggle('dark',enabled);document.documentElement.style.colorScheme=enabled?'dark':'light';storage.set(CONFIG.themeKey,enabled?'dark':'light');updateCurrentPreference({theme:enabled?'dark':'light'});renderHeader();if(UI.tab==='settings')renderPage();renderProfileDialogContent();}
const ACTION_COLUMN_KEY='__actions';
function getVisibleColumns(collection){
  const schema=CONFIG.schemas[collection],configured=getCurrentPreference()?.columns?.[collection],available=new Set([...schema.columns,...schema.fields.map(field=>field[0]),ACTION_COLUMN_KEY]);
  if(configured&&typeof configured==='object'&&!Array.isArray(configured)){const order=Array.isArray(configured.order)?configured.order.filter(key=>available.has(key)):[],visible=new Set(Array.isArray(configured.visible)?configured.visible.filter(key=>available.has(key)):[]);const ordered=order.filter(key=>visible.has(key));for(const key of visible)if(!ordered.includes(key))ordered.push(key);return ordered.length?ordered:[...schema.columns,ACTION_COLUMN_KEY];}
  const legacy=Array.isArray(configured)?configured.filter(key=>available.has(key)&&key!==ACTION_COLUMN_KEY):[];return legacy.length?[...legacy,ACTION_COLUMN_KEY]:[...schema.columns,ACTION_COLUMN_KEY];
}
function allColumnKeys(collection){const schema=CONFIG.schemas[collection];return[...new Set([...schema.columns,...schema.fields.map(field=>field[0])])].filter(key=>key!=='id'&&key!=='updatedAt').concat(ACTION_COLUMN_KEY);}

function bytesToBase64(bytes){let binary='';const view=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);view.forEach(byte=>binary+=String.fromCharCode(byte));return btoa(binary);}
function base64ToBytes(value){const binary=atob(String(value||''));return Uint8Array.from(binary,char=>char.charCodeAt(0));}
async function importPasswordKey(password){if(!globalThis.crypto?.subtle)throw new Error('Trình duyệt hiện tại chưa hỗ trợ mã hóa Web Crypto. Hãy mở WeddingOS bằng HTTPS hoặc trình duyệt hiện đại hỗ trợ file cục bộ an toàn.');return crypto.subtle.importKey('raw',new TextEncoder().encode(String(password)),{name:'PBKDF2'},false,['deriveBits','deriveKey']);}
async function passwordVerifier(password,saltBase64,iterations=SECURITY_POLICY.passwordIterations){const key=await importPasswordKey(password),bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:base64ToBytes(saltBase64),iterations:Number(iterations||SECURITY_POLICY.passwordIterations)},key,256);return bytesToBase64(bits);}
async function sha256Base64(value){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(value)));return bytesToBase64(digest);}
async function encryptJson(value,password){const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),keyMaterial=await importPasswordKey(password),key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:SECURITY_POLICY.encryptionIterations},keyMaterial,{name:'AES-GCM',length:256},false,['encrypt']),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(value)));return{cipherText:bytesToBase64(cipher),iv:bytesToBase64(iv),salt:bytesToBase64(salt),encryptionIterations:SECURITY_POLICY.encryptionIterations,encryptionAlgorithm:'AES-GCM-256 / PBKDF2-SHA256'};}
async function decryptJson(record,password){const keyMaterial=await importPasswordKey(password),key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:base64ToBytes(record.salt),iterations:Number(record.encryptionIterations||record.iterations||SECURITY_POLICY.encryptionIterations)},keyMaterial,{name:'AES-GCM',length:256},false,['decrypt']),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:base64ToBytes(record.iv)},key,base64ToBytes(record.cipherText));return JSON.parse(new TextDecoder().decode(plain));}
function securityAccessRecord(){return(DATA.security||[]).find(row=>row.id==='security-settings-access'||row.kind==='settingsAccess');}
function bootstrapPending(){return Boolean(AUTH.remoteStatus?.bootstrapRequired||(!configuredEndpoint()&& !securityAccessRecord()));}
async function verifySettingsPassword(password){const record=securityAccessRecord();if(!record)return false;const verifier=await passwordVerifier(password,record.passwordSalt,record.passwordIterations||record.iterations);return verifier===record.passwordVerifier;}
async function verifyBootstrapPassword(password){if(!configuredEndpoint())return false;await postAppsScript({action:'load',password},{authMode:'none',trackRevision:false,retries:0,timeoutMs:CONFIG.networkTimeouts.auth});return true;}
function updateLoginDialogState(){const hint=document.getElementById('loginContextHint'),button=document.getElementById('adminAccessFromLogin');if(hint)hint.textContent=AUTH.remoteStatus?.bootstrapRequired?'Hệ thống chưa hoàn tất khởi tạo. Chọn “Khởi tạo quản trị” để tạo mật khẩu admin đầu tiên, hoặc đăng nhập nếu tài khoản đã được cấp.':'Sử dụng tài khoản đã được cấp trong phần Thiết lập.';if(button)button.textContent=AUTH.remoteStatus?.bootstrapRequired?'Khởi tạo quản trị':'Quản trị tài khoản';}
function updateSettingsAccessDialogState(){const bootstrap=bootstrapPending()&&!securityAccessRecord(),title=document.getElementById('settingsAccessTitle'),desc=document.getElementById('settingsAccessDescription'),label=document.getElementById('settingsAccessPasswordLabel'),scope=document.getElementById('settingsAccessScopeNote'),forgot=document.getElementById('forgotAdminPassword');if(title)title.textContent=bootstrap?'Xác thực khởi tạo':'Nhập mật khẩu Thiết lập';if(desc)desc.textContent=bootstrap?'Nhập Bootstrap Secret đã cấu hình trong Google Apps Script để bắt đầu khởi tạo tài khoản quản trị đầu tiên.':'Chỉ cần mật khẩu quản trị để mở Đồng bộ dữ liệu và Quản lý/cấp tài khoản.';if(label)label.textContent=bootstrap?'Bootstrap Secret':'Mật khẩu quản trị';if(scope)scope.innerHTML=bootstrap?'<strong>Khởi tạo lần đầu:</strong> xác thực này chỉ mở luồng tạo mật khẩu quản trị đầu tiên và đồng bộ cấu trúc hệ thống.':'<strong>Phạm vi quản trị:</strong> các thiết lập chung vẫn dùng được với tài khoản thường; xác thực này chỉ mở các chức năng quản trị nhạy cảm.';if(forgot)forgot.classList.toggle('hidden',bootstrap);}
async function createSecurityAccessRecord(password){const salt=crypto.getRandomValues(new Uint8Array(16)),passwordSalt=bytesToBase64(salt),passwordVerifierValue=await passwordVerifier(password,passwordSalt,SECURITY_POLICY.passwordIterations);return{id:'security-settings-access',kind:'settingsAccess',passwordVerifier:passwordVerifierValue,passwordSalt,passwordIterations:SECURITY_POLICY.passwordIterations,passwordAlgorithm:'PBKDF2-SHA256-256',forceChange:false,updatedAt:new Date().toISOString()};}
async function loadAccountCache(password){const decoded=[];let metadataChanged=false;for(const row of(DATA.accounts||[])){try{const profile=await decryptJson(row,password),account={...profile,id:row.id,status:row.status||profile.status||'active',usernameHash:row.usernameHash,passwordHash:row.passwordHash,passwordSalt:row.passwordSalt,createdAt:profile.createdAt||row.updatedAt,updatedAt:row.updatedAt};decoded.push(account);if(row.displayName!==profile.displayName||row.userCode!==profile.userCode||row.usernameLabel!==profile.username){row.displayName=profile.displayName;row.userCode=profile.userCode;row.usernameLabel=profile.username;row.updatedAt=new Date().toISOString();queueUpsert('accounts',row);metadataChanged=true;}}catch(error){console.warn('Không giải mã được tài khoản',row.id,error);throw new Error('Không thể giải mã hồ sơ tài khoản bằng mật khẩu quản trị hiện tại.');}}AUTH.accounts=decoded;if(metadataChanged)saveData();return decoded;}
async function secureAccountRow(account,password){const encrypted=await encryptJson({userCode:account.userCode,displayName:account.displayName,username:account.username,createdAt:account.createdAt||new Date().toISOString()},password);return{id:account.id,userCode:account.userCode,displayName:account.displayName,usernameLabel:account.username,usernameHash:account.usernameHash,passwordHash:account.passwordHash,passwordSalt:account.passwordSalt,passwordIterations:Number(account.passwordIterations||SECURITY_POLICY.passwordIterations),passwordAlgorithm:account.passwordAlgorithm||'PBKDF2-SHA256-256',status:account.status||'active',...encrypted,updatedAt:new Date().toISOString()};}
function showInlineError(id,message=''){const node=document.getElementById(id);if(!node)return;node.textContent=message;node.classList.toggle('hidden',!message);}
function openSettingsAccessDialog(){AUTH.pendingTab='settings';const form=document.getElementById('settingsAccessForm');form?.reset();showInlineError('settingsAccessError','');updateSettingsAccessDialogState();const dialog=document.getElementById('settingsAccessDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>document.getElementById('settingsAccessPassword')?.focus(),50);}

function adminRecoveryDeploymentError(error,status=null){
  const code=String(error?.code||'');
  const version=String(status?.bridgeVersion||AUTH.remoteStatus?.bridgeVersion||'không xác định');
  if(code==='UNSUPPORTED_ACTION'||status?.adminRecoveryEnabled!==true){
    return `Google Apps Script tại URL hiện tại đang chạy bản cũ (${version}) và chưa hỗ trợ khôi phục admin. Trong Apps Script, chọn Deploy → Manage deployments → Edit → Version: New version → Deploy. Nếu bạn tạo deployment mới, hãy cập nhật đúng URL /exec trong WeddingOS.`;
  }
  if(code==='EMAIL_SEND_FAILED'&&/permission|authorization|quyền|authorize/i.test(String(error?.message||''))){
    return 'Apps Script chưa được cấp quyền gửi email. Hãy chạy hàm authorizeWeddingOSAdminRecovery() trong Apps Script, cấp quyền, rồi deploy lại New version.';
  }
  return error?.message||'Không thể gửi mã khôi phục.';
}
async function ensureAdminRecoveryBackend(){
  const status=await getServerStatus();
  if(!status||status.adminRecoveryEnabled!==true){
    const error=remoteError(adminRecoveryDeploymentError({code:'UNSUPPORTED_ACTION'},status),'UNSUPPORTED_ACTION');
    error.status=status;throw error;
  }
  return status;
}
async function sendAdminPasswordResetCode(reopen=false){
  const endpoint=configuredEndpoint();
  if(!endpoint){showInlineError('settingsAccessError','Chưa cấu hình Google Apps Script URL nên không thể gửi mã khôi phục.');return;}
  const buttonId=reopen?'resendAdminResetCode':'forgotAdminPassword';
  setButtonLoading(buttonId,true,'Đang gửi');
  showInlineError(reopen?'adminResetError':'settingsAccessError','');
  let status=null;
  try{
    status=await ensureAdminRecoveryBackend();
    const result=await postAppsScript({action:'requestAdminPasswordReset'},{authMode:'none',trackRevision:false});
    document.getElementById('adminPasswordResetForm').reset();
    document.getElementById('adminResetDescription').textContent=`Mã gồm 8 chữ số đã được gửi đến ${result.emailMasked||status.adminRecoveryEmailMasked||'email khôi phục'}. Mã có hiệu lực trong ${Math.round(Number(result.expiresInSeconds||600)/60)} phút.`;
    if(!reopen)document.getElementById('settingsAccessDialog').close();
    const dialog=document.getElementById('adminPasswordResetDialog');if(!dialog.open)dialog.showModal();
    toast(reopen?'Đã gửi một mã khôi phục mới.':'Đã gửi mã khôi phục quản trị qua email.','success');
    refreshIcons();setTimeout(()=>document.getElementById('adminResetCode')?.focus(),50);
  }catch(error){
    showInlineError(reopen?'adminResetError':'settingsAccessError',adminRecoveryDeploymentError(error,error.status||status));
  }finally{setButtonLoading(buttonId,false);}
}
function cancelAdminPasswordReset(){document.getElementById('adminPasswordResetDialog').close();openSettingsAccessDialog();}
async function submitAdminPasswordReset(event){event.preventDefault();const code=document.getElementById('adminResetCode').value.replace(/\D/g,''),newPassword=document.getElementById('adminResetNewPassword').value,confirmPassword=document.getElementById('adminResetConfirmPassword').value;showInlineError('adminResetError','');
  if(code.length!==8){showInlineError('adminResetError','Mã khôi phục phải gồm đúng 8 chữ số.');return;}
  if(newPassword.length<SECURITY_POLICY.minPasswordLength){showInlineError('adminResetError',`Mật khẩu mới phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}
  if(newPassword===SECURITY_POLICY.defaultPassword){showInlineError('adminResetError','Không được sử dụng lại mật khẩu mặc định.');return;}
  if(newPassword!==confirmPassword){showInlineError('adminResetError','Hai lần nhập mật khẩu mới chưa khớp.');return;}
  setButtonLoading('confirmAdminPasswordReset',true,'Đang đặt lại');
  try{
    const securityRecord=await createSecurityAccessRecord(newPassword),result=await postAppsScript({action:'confirmAdminPasswordReset',resetCode:code,securityRecord},{authMode:'none'});
    clearRememberedLogin();UI.pendingChanges=UI.pendingChanges.filter(change=>!['accounts','security'].includes(change.collection));savePendingChanges();
    AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.accounts=[];AUTH.adminAuthenticated=true;AUTH.settingsUnlocked=true;AUTH.masterPassword=newPassword;AUTH.adminBypass=false;
    secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.set(CONFIG.adminServerSessionKey,result.sessionToken);setSessionProfile(result.profile);setRemoteRevision(result.revision||0);
    await loadRemoteSnapshot(true,result.sessionToken);AUTH.accounts=[];document.getElementById('adminPasswordResetDialog').close();unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;
    toast(`Đã đặt lại mật khẩu quản trị.${Number(result.accountsCleared||0)?` ${result.accountsCleared} tài khoản cũ đã được xóa và cần tạo lại.`:''}`,'success');
  }catch(error){showInlineError('adminResetError',adminRecoveryDeploymentError(error));}
  finally{setButtonLoading('confirmAdminPasswordReset',false);}
}

function remoteRevision(){return Math.max(0,Number(storage.get(CONFIG.remoteRevisionKey,'0')||0));}
function setRemoteRevision(value){const revision=Math.max(0,Number(value||0));storage.set(CONFIG.remoteRevisionKey,String(revision));return revision;}
function serverAccountToken(){return secrets.get(CONFIG.accountServerSessionKey,'');}
function serverAdminToken(){return secrets.get(CONFIG.adminServerSessionKey,'');}
function activeServerToken(admin=false){return admin?serverAdminToken():(serverAccountToken()||serverAdminToken());}
function proofForVerifier(verifier,nonce,subject){return sha256Base64(`${verifier}.${nonce}.${subject}`);}
function remoteError(message,code='REMOTE_ERROR'){const error=new Error(message);error.code=code;return error;}
async function getServerStatus(){const endpoint=configuredEndpoint();if(!endpoint)return null;const result=await postAppsScript({action:'getStatus'},{authMode:'none',trackRevision:false});AUTH.remoteStatus=result;AUTH.serverRequiresLogin=Boolean(result.requiresAccountLogin);storage.set(CONFIG.remoteStatusKey,JSON.stringify({checkedAt:new Date().toISOString(),...result}));updateLoginDialogState();updateSettingsAccessDialogState();return result;}
function applyRemoteSnapshotResult(result,admin=false,{render=true}={}){
  const remote=validateRemoteData(result.data||{});
  DATA=admin?migrateData(remote):migrateData({...remote,accounts:[],security:[]});
  if(result.profile)setSessionProfile({...result.profile,id:result.profile.id||AUTH.currentUserId});
  setRemoteRevision(result.revision||0);saveData();applyCurrentPreferences();
  if(render){renderNavigation();renderHeader();renderPage();}
  return result;
}

async function loadRemoteSnapshot(admin=false,explicitToken=''){const result=await postAppsScript({action:'load',...(explicitToken?{sessionToken:explicitToken}:{})},{admin,authMode:explicitToken?'none':'auto'});return applyRemoteSnapshotResult(result,admin,{render:true});}
function overlayPendingChangesOnData(data,pending=UI.pendingChanges){
  (pending||[]).forEach(change=>{const collection=change.collection;if(!Array.isArray(data?.[collection]))return;const index=data[collection].findIndex(row=>row.id===change.id);if(change.op==='delete'){if(index>=0)data[collection].splice(index,1);return;}const row=index>=0?data[collection][index]:{id:change.id};Object.assign(row,structuredClone(change.changedFields||change.record||{}));if(index<0)data[collection].unshift(row);});
  rebuildLookupCompatibility(data);hydrateReferenceLabels(data);return data;
}
async function refreshRemoteSnapshotPreservingPending(admin=false){
  const result=await postAppsScript({action:'load'},{admin,authMode:'auto'}),remote=validateRemoteData(result.data||{});let next=admin?migrateData(remote):migrateData({...remote,accounts:[],security:[]});next=overlayPendingChangesOnData(next,UI.pendingChanges);DATA=next;if(result.profile)setSessionProfile({...result.profile,id:result.profile.id||AUTH.currentUserId});setRemoteRevision(result.revision||0);saveData();applyCurrentPreferences();return result;
}
function renderHydrationBanner(){
  if(UI.hydrationState==='loading'&&UI.hydrationHasCache)return `<div class="hydration-banner hydration-banner--loading" role="status"><span>${icon('refresh-cw','size-4 animate-spin')}</span><span><strong>Đang kiểm tra dữ liệu mới nhất.</strong> Bạn có thể xem dữ liệu đã lưu; thao tác thay đổi tạm khóa cho đến khi kiểm tra revision hoàn tất.</span></div>`;
  if(UI.hydrationState==='error'&&UI.hydrationHasCache)return `<div class="hydration-banner hydration-banner--error" role="alert"><span>${icon('cloud-off','size-4')}</span><span class="min-w-0 flex-1"><strong>Chưa thể cập nhật dữ liệu mới nhất.</strong> Bạn đang xem cache của đúng tài khoản này; thao tác thay đổi vẫn tạm khóa.</span><button id="retryHydrationButton" type="button" class="hydration-retry">Thử lại</button></div>`;
  return '';
}
function renderHydrationErrorState(){return `<section class="hydration-error-state"><span class="hydration-error-icon">${icon('cloud-off','size-6')}</span><h3>Không thể tải dữ liệu</h3><p>Tài khoản đã đăng nhập thành công, nhưng hiện chưa thể tải dữ liệu từ Google Sheets.</p><button id="retryHydrationButton" type="button" class="hydration-retry hydration-retry--primary">${icon('refresh-cw','size-4')}Thử tải lại</button></section>`;}
function updateHydrationUi(){
  const status=document.getElementById('dataHydrationStatus'),progress=document.getElementById('topProgress');if(!status||!progress)return;
  const loading=UI.hydrationState==='loading',error=UI.hydrationState==='error';status.className='hydration-status';
  if(loading){status.classList.add('hydration-status--loading');status.innerHTML=`${icon('refresh-cw','size-3.5 animate-spin')}<span>Đang cập nhật dữ liệu</span>`;}
  else if(error){status.classList.add('hydration-status--error');status.innerHTML=`${icon('triangle-alert','size-3.5')}<span>Chưa cập nhật được dữ liệu</span>`;}
  else if(UI.hydrationState==='ready'){status.classList.add('hydration-status--ready');status.innerHTML=`${icon('check-circle-2','size-3.5')}<span>Đã cập nhật</span>`;}
  else{status.classList.add('hidden');status.replaceChildren();}
  progress.classList.toggle('top-progress--indeterminate',loading);progress.classList.toggle('opacity-0',!loading);progress.classList.toggle('opacity-100',loading);if(!loading)progress.style.width='0';
}
async function initialHydrateAfterLogin(force=false){
  if(!configuredEndpoint()||!AUTH.currentUserId||!serverAccountToken())return;const accountId=AUTH.currentUserId,runId=++UI.hydrationRunId;if(force){UI.hydrationState='loading';UI.hydrationError='';UI.mutationLocked=true;UI.loading=!UI.hydrationHasCache;renderHeader();renderPage();}
  try{const result=await postAppsScript({action:'load'},{admin:false,authMode:'auto'});if(runId!==UI.hydrationRunId||AUTH.currentUserId!==accountId)return;applyRemoteSnapshotResult(result,false,{render:false});UI.hydrationState='ready';UI.hydrationHasCache=true;UI.hydrationError='';UI.mutationLocked=false;UI.loading=false;saveData();renderNavigation();renderHeader();renderPage();startAutoSync();}
  catch(error){if(runId!==UI.hydrationRunId||AUTH.currentUserId!==accountId)return;if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';UI.hydrationState='idle';UI.mutationLocked=false;enforceLoginGate();return;}console.warn('Initial hydration failed',error);UI.hydrationState='error';UI.hydrationError=error.message||'Không thể tải dữ liệu.';UI.mutationLocked=true;UI.loading=false;renderHeader();renderPage();}
}
async function logoutServerToken(token,rememberToken=''){if(!configuredEndpoint())return;try{await postAppsScript({action:'logout',sessionToken:token||'',rememberToken:rememberToken||''},{authMode:'none'});}catch(_){} }
async function submitSettingsAccess(event){
  event.preventDefault();const password=document.getElementById('settingsAccessPassword').value;showInlineError('settingsAccessError','');
  try{
    const endpoint=configuredEndpoint(),accountProfileBefore=AUTH.currentUserId?currentUserProfile():null;AUTH.bootstrapMode=false;
    if(endpoint){
      try{
        const challenge=await postAppsScript({action:'adminChallenge'},{authMode:'none'}),verifier=await passwordVerifier(password,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,'admin');
        const login=await postAppsScript({action:'adminLogin',nonce:challenge.nonce,proof,includeData:true},{authMode:'none'});secrets.set(CONFIG.adminServerSessionKey,login.sessionToken);setRemoteRevision(login.revision||remoteRevision());
        if(login.data)applyRemoteSnapshotResult(login,true,{render:false});else await loadRemoteSnapshot(true);if(accountProfileBefore)setSessionProfile(accountProfileBefore);
      }catch(error){
        if(error.code!=='ADMIN_NOT_INITIALIZED')throw error;
        await verifyBootstrapPassword(password);
        connectionSecrets.set(CONFIG.passwordKey,password);
        AUTH.bootstrapMode=true;
      }
    }else if(!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng.');return;}
    if(!AUTH.bootstrapMode&&securityAccessRecord()&&!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng với dữ liệu đã mã hóa.');return;}
    AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;AUTH.masterPassword=AUTH.bootstrapMode?'':password;if(!AUTH.bootstrapMode)await loadAccountCache(password);document.getElementById('settingsAccessDialog').close();if(AUTH.bootstrapMode||!securityAccessRecord()){openSettingsPasswordDialog(true);return;}unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;startAutoSync();
  }catch(error){showInlineError('settingsAccessError',error.message||'Không thể xác thực mật khẩu.');}
}
async function ensureAdminServerSession(){
  if(serverAdminToken()||!configuredEndpoint()||!AUTH.settingsUnlocked||!AUTH.masterPassword)return serverAdminToken();
  const challenge=await postAppsScript({action:'adminChallenge'},{authMode:'none'}),verifier=await passwordVerifier(AUTH.masterPassword,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,'admin');
  const login=await postAppsScript({action:'adminLogin',nonce:challenge.nonce,proof},{authMode:'none'});secrets.set(CONFIG.adminServerSessionKey,login.sessionToken);setRemoteRevision(login.revision||remoteRevision());return login.sessionToken;
}

function cancelSettingsAccess(){AUTH.pendingTab=null;AUTH.bootstrapMode=false;document.getElementById('settingsAccessDialog').close();if(AUTH.adminBypass){AUTH.adminBypass=false;enforceLoginGate();}}
function openSettingsPasswordDialog(force=false){AUTH.passwordChangeForced=Boolean(force);const bootstrap=Boolean(force&&(!securityAccessRecord()||AUTH.bootstrapMode));const form=document.getElementById('settingsPasswordForm');form?.reset();showInlineError('settingsPasswordError','');document.getElementById('settingsPasswordTitle').textContent=bootstrap?'Tạo mật khẩu quản trị':'Đổi mật khẩu quản trị';document.getElementById('settingsPasswordDescription').textContent=bootstrap?'Bạn đang khởi tạo WeddingOS lần đầu. Hãy đặt mật khẩu quản trị đầu tiên trước khi tiếp tục.':'Nhập mật khẩu hiện tại và đặt mật khẩu quản trị mới.';document.getElementById('cancelSettingsPassword').classList.toggle('hidden',force);const currentWrap=document.getElementById('settingsCurrentPasswordWrap'),currentInput=document.getElementById('settingsCurrentPassword'),currentLabel=document.getElementById('settingsCurrentPasswordLabel');currentWrap?.classList.toggle('hidden',bootstrap);if(currentInput)currentInput.required=!bootstrap;if(currentLabel)currentLabel.textContent=bootstrap?'Bootstrap Secret':'Mật khẩu hiện tại';const dialog=document.getElementById('settingsPasswordDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>bootstrap?document.getElementById('settingsNewPassword')?.focus():document.getElementById('settingsCurrentPassword')?.focus(),50);}
async function submitSettingsPassword(event){
  event.preventDefault();
  const current=document.getElementById('settingsCurrentPassword').value,newPassword=document.getElementById('settingsNewPassword').value,confirmPassword=document.getElementById('settingsConfirmPassword').value;
  showInlineError('settingsPasswordError','');
  const bootstrapCreate=Boolean(AUTH.bootstrapMode||!securityAccessRecord());
  if(!bootstrapCreate&&!await verifySettingsPassword(current)){showInlineError('settingsPasswordError','Mật khẩu hiện tại không đúng.');return;}
  if(newPassword.length<SECURITY_POLICY.minPasswordLength){showInlineError('settingsPasswordError',`Mật khẩu mới phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}
  if(newPassword!==confirmPassword){showInlineError('settingsPasswordError','Hai lần nhập mật khẩu mới chưa khớp.');return;}
  const previous={security:structuredClone(DATA.security||[]),accounts:structuredClone(DATA.accounts||[]),pending:structuredClone(UI.pendingChanges||[]),conflicts:structuredClone(UI.conflicts||[]),masterPassword:AUTH.masterPassword};
  try{
    if(bootstrapCreate){
      if(!configuredEndpoint())throw new Error('Chưa cấu hình Google Sheets Apps Script URL để khởi tạo quản trị.');
      const securityRecord=await createSecurityAccessRecord(newPassword),manifest=buildSchemaManifest();
      const initialData={settings:structuredClone(DATA.settings||[]),lookup_items:structuredClone(DATA.lookup_items||[])};
      // Bootstrap is server-first: security is persisted atomically before the UI is unlocked.
      // This avoids queuing a sensitive local change that could later be sent under a normal account session.
      const result=await postAppsScript({action:'initializeAdmin',schema:manifest,securityRecord,initialData},{authMode:'none',admin:false,timeoutMs:CONFIG.networkTimeouts.schema,retries:0});
      if(!result?.sessionToken)throw new Error('Máy chủ chưa cấp phiên quản trị sau khi khởi tạo.');
      secrets.set(CONFIG.adminServerSessionKey,result.sessionToken);recordSchemaSync(configuredEndpoint(),result,manifest);setRemoteRevision(result.revision||remoteRevision());
      UI.pendingChanges=UI.pendingChanges.filter(change=>!['security','accounts'].includes(change.collection));
      UI.conflicts=UI.conflicts.filter(conflict=>!['security','accounts'].includes(conflict.collection));savePendingChanges();saveSyncConflicts();
      AUTH.masterPassword=newPassword;AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;AUTH.bootstrapMode=false;AUTH.passwordChangeForced=false;
      connectionSecrets.remove(CONFIG.passwordKey);await getServerStatus();await loadRemoteSnapshot(true);
      document.getElementById('settingsPasswordDialog').close();unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;startAutoSync();
      toast(`Đã khởi tạo quản trị và lưu bảo mật trực tiếp lên Google Sheets${result.seededSystemRecords?` · ${result.seededSystemRecords} cấu hình hệ thống đã được khởi tạo`:''}.`,'success');
      return;
    }

    if(!AUTH.accounts.length&&(DATA.accounts||[]).length)await loadAccountCache(current);
    await ensureAdminServerSession();
    const nextRows=[];for(const account of AUTH.accounts)nextRows.push(await secureAccountRow(account,newPassword));
    const securityRecord=await createSecurityAccessRecord(newPassword);DATA.security=[...(DATA.security||[]).filter(row=>row.id!==securityRecord.id),securityRecord];DATA.accounts=nextRows;
    queueUpsert('security',securityRecord);nextRows.forEach(row=>queueUpsert('accounts',row));saveData();
    const sensitiveChangeIds=new Set(UI.pendingChanges.filter(change=>['security','accounts'].includes(change.collection)).map(change=>String(change.changeId||'')));
    const synced=configuredEndpoint()?await syncPreview({automatic:true}):true;
    const rejected=UI.conflicts.find(conflict=>sensitiveChangeIds.has(String(conflict.changeId||'')));
    if(!synced||rejected)throw new Error(rejected?.message||'Máy chủ chưa xác nhận thay đổi mật khẩu quản trị.');
    AUTH.masterPassword=newPassword;AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;saveData();document.getElementById('settingsPasswordDialog').close();
    toast('Đã cập nhật mật khẩu quản trị và xác nhận lưu trên Google Sheets.','success');if(UI.tab==='settings')renderPage();
  }catch(error){
    DATA.security=previous.security;DATA.accounts=previous.accounts;UI.pendingChanges=previous.pending;UI.conflicts=previous.conflicts;AUTH.masterPassword=previous.masterPassword;savePendingChanges();saveSyncConflicts();saveData();
    showInlineError('settingsPasswordError',error.message||'Không thể đổi mật khẩu quản trị.');
  }
}
function cancelSettingsPassword(){if(AUTH.passwordChangeForced)return;document.getElementById('settingsPasswordDialog').close();}

function normalizeUsername(value){return String(value||'').trim().toLowerCase();}
function openAccountEditor(id=''){if(!AUTH.settingsUnlocked)return;AUTH.editingAccountId=id||null;const account=id?AUTH.accounts.find(item=>item.id===id):null;document.getElementById('accountDialogTitle').textContent=account?'Sửa thông tin tài khoản':'Tạo tài khoản mới';document.getElementById('accountUserCode').value=account?.userCode||'';document.getElementById('accountDisplayName').value=account?.displayName||'';document.getElementById('accountUsername').value=account?.username||'';document.getElementById('accountInitialPassword').value='';document.getElementById('accountInitialPasswordWrap').classList.toggle('hidden',Boolean(account));document.getElementById('accountInitialPassword').required=!account;showInlineError('accountFormError','');document.getElementById('accountDialog').showModal();refreshIcons();setTimeout(()=>document.getElementById('accountUserCode')?.focus(),50);}
async function saveAccount(event){event.preventDefault();if(!AUTH.settingsUnlocked||!AUTH.masterPassword)return;const userCode=document.getElementById('accountUserCode').value.trim(),displayName=document.getElementById('accountDisplayName').value.trim(),username=document.getElementById('accountUsername').value.trim(),normalized=normalizeUsername(username),initialPassword=document.getElementById('accountInitialPassword').value;showInlineError('accountFormError','');const existing=AUTH.editingAccountId?AUTH.accounts.find(item=>item.id===AUTH.editingAccountId):null;if(!userCode||!displayName||!normalized){showInlineError('accountFormError','Vui lòng nhập đầy đủ Mã người dùng, Tên người dùng và Tên đăng nhập.');return;}if(AUTH.accounts.some(item=>item.id!==existing?.id&&item.userCode.toLowerCase()===userCode.toLowerCase())){showInlineError('accountFormError','Mã người dùng đã tồn tại.');return;}if(AUTH.accounts.some(item=>item.id!==existing?.id&&normalizeUsername(item.username)===normalized)){showInlineError('accountFormError','Tên đăng nhập đã tồn tại.');return;}if(!existing&&initialPassword.length<SECURITY_POLICY.minPasswordLength){showInlineError('accountFormError',`Mật khẩu ban đầu phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}try{const account=existing?{...existing,userCode,displayName,username}:{id:uid('account'),userCode,displayName,username,status:'active',createdAt:new Date().toISOString()};account.usernameHash=await sha256Base64(normalized);if(!existing){account.passwordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));account.passwordHash=await passwordVerifier(initialPassword,account.passwordSalt,SECURITY_POLICY.passwordIterations);account.passwordIterations=SECURITY_POLICY.passwordIterations;account.passwordAlgorithm='PBKDF2-SHA256-256';}const secureRow=await secureAccountRow(account,AUTH.masterPassword),rowIndex=(DATA.accounts||[]).findIndex(row=>row.id===account.id);if(rowIndex>=0)DATA.accounts[rowIndex]=secureRow;else DATA.accounts.push(secureRow);const cacheIndex=AUTH.accounts.findIndex(item=>item.id===account.id);if(cacheIndex>=0)AUTH.accounts[cacheIndex]=account;else AUTH.accounts.unshift(account);queueUpsert('accounts',secureRow);saveData();document.getElementById('accountDialog').close();toast(existing?'Đã cập nhật thông tin tài khoản.':'Đã tạo tài khoản mới.','success');renderPage();}catch(error){showInlineError('accountFormError',error.message||'Không thể lưu tài khoản.');}}
async function toggleAccountLock(id){const account=AUTH.accounts.find(item=>item.id===id);if(!account)return;if(AUTH.currentUserId===id&&account.status!=='locked'){toast('Không thể khóa tài khoản đang đăng nhập.','error');return;}account.status=account.status==='locked'?'active':'locked';const row=await secureAccountRow(account,AUTH.masterPassword),index=DATA.accounts.findIndex(item=>item.id===id);if(index>=0)DATA.accounts[index]=row;queueUpsert('accounts',row);saveData();toast(account.status==='locked'?'Đã khóa tài khoản.':'Đã mở khóa tài khoản.','success');renderPage();}
function openAccountPassword(id){const account=AUTH.accounts.find(item=>item.id===id);if(!account)return;AUTH.passwordAccountId=id;document.getElementById('accountPasswordForm').reset();document.getElementById('accountPasswordAccount').textContent=`Tài khoản: ${account.displayName} (${account.username})`;showInlineError('accountPasswordError','');document.getElementById('accountPasswordDialog').showModal();refreshIcons();setTimeout(()=>document.getElementById('accountNewPassword')?.focus(),50);}
async function saveAccountPassword(event){event.preventDefault();const password=document.getElementById('accountNewPassword').value,confirmPassword=document.getElementById('accountConfirmPassword').value,account=AUTH.accounts.find(item=>item.id===AUTH.passwordAccountId);showInlineError('accountPasswordError','');if(!account)return;if(password.length<SECURITY_POLICY.minPasswordLength){showInlineError('accountPasswordError',`Mật khẩu phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}if(password!==confirmPassword){showInlineError('accountPasswordError','Hai lần nhập mật khẩu chưa khớp.');return;}account.passwordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));account.passwordHash=await passwordVerifier(password,account.passwordSalt,SECURITY_POLICY.passwordIterations);account.passwordIterations=SECURITY_POLICY.passwordIterations;account.passwordAlgorithm='PBKDF2-SHA256-256';const row=await secureAccountRow(account,AUTH.masterPassword),index=DATA.accounts.findIndex(item=>item.id===account.id);if(index>=0)DATA.accounts[index]=row;queueUpsert('accounts',row);saveData();document.getElementById('accountPasswordDialog').close();toast('Đã đặt lại mật khẩu tài khoản.','success');renderPage();}
function renderAdminLockedSettingsCard(title,description,iconName='shield-keyhole'){
  return `<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="admin-locked-card"><span class="admin-locked-card__icon">${icon(iconName,'size-5')}</span><div class="admin-locked-card__copy"><h3 class="font-bold tracking-tight">${esc(title)}</h3><p class="admin-locked-card__description">${esc(description)}</p></div><button type="button" data-settings-admin-unlock="1" class="admin-locked-card__action">${icon('unlock-keyhole','size-4')}Nhập mật khẩu quản trị</button></div></section>`;
}
function renderAccountManagement(){if(!isAdministrator())return renderAdminLockedSettingsCard('Quản lý và cấp tài khoản','Khu vực này cần mật khẩu quản trị để tạo, sửa, khóa/mở khóa hoặc đổi mật khẩu tài khoản.','users-round');const accounts=AUTH.accounts||[];return`<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 class="font-bold tracking-tight">Quản lý và cấp tài khoản</h3><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Hồ sơ được mã hóa trước khi đồng bộ; mật khẩu chỉ lưu dưới dạng mã xác thực một chiều.</p></div><div class="flex flex-wrap gap-2"><button id="changeSettingsPasswordButton" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('shield-keyhole','size-4')}Đổi mật khẩu quản trị</button><button id="addAccountButton" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-xs font-semibold text-white transition hover:bg-brand-800">${icon('user-plus','size-4')}Tạo tài khoản</button></div></div>${accounts.length?`<div class="account-table-wrap border-t border-slate-200 dark:border-slate-800"><table class="account-table"><thead><tr><th>Mã người dùng</th><th>Tên người dùng</th><th>Tên đăng nhập</th><th>Trạng thái</th><th>Tác vụ</th></tr></thead><tbody>${accounts.map(account=>`<tr><td class="font-semibold">${esc(account.userCode)}</td><td>${esc(account.displayName)}</td><td>${esc(account.username)}</td><td>${account.status==='locked'?'<span class="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Đã khóa</span>':'<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Đang hoạt động</span>'}</td><td><div class="flex flex-wrap gap-1.5"><button type="button" data-account-edit="${esc(account.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold dark:border-slate-700">Sửa</button><button type="button" data-account-password="${esc(account.id)}" class="rounded-lg border border-blue-200 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900 dark:text-blue-300">Mật khẩu</button><button type="button" data-account-lock="${esc(account.id)}" class="rounded-lg border ${account.status==='locked'?'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300':'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300'} px-2.5 py-1.5 text-[11px] font-semibold">${account.status==='locked'?'Mở khóa':'Khóa'}</button></div></td></tr>`).join('')}</tbody></table></div>`:`<div class="border-t border-slate-200 px-6 py-10 text-center dark:border-slate-800"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon('users-round','size-5')}</span><p class="mt-3 text-sm font-semibold">Chưa có tài khoản nào</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Tạo tài khoản đầu tiên để bật cơ chế đăng nhập WeddingOS.</p></div>`}</section>`;}

async function submitAccountLogin(event){
  event.preventDefault();const username=normalizeUsername(document.getElementById('loginUsername').value),password=document.getElementById('loginPassword').value,remember=Boolean(document.getElementById('loginRememberMe')?.checked);showInlineError('loginError','');setButtonLoading('accountLoginSubmitButton',true,'Đang xác thực');
  try{
    const usernameHash=await sha256Base64(username),endpoint=configuredEndpoint();let loginMeta={};
    if(endpoint){
      const challenge=await postAppsScript({action:'loginChallenge',usernameHash},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth}),verifier=await passwordVerifier(password,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,usernameHash);
      const login=await postAppsScript({action:'login',usernameHash,nonce:challenge.nonce,proof,includeData:false,remember},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth,trackRevision:false});
      AUTH.currentUserId=login.profile?.id||'';AUTH.adminAuthenticated=false;AUTH.adminBypass=false;secrets.set(CONFIG.accountSessionKey,AUTH.currentUserId);secrets.set(CONFIG.accountServerSessionKey,login.sessionToken);setSessionProfile(login.profile);UI.serverRevisionHint=Number(login.revision||0);
      const hasCache=activateUserCache(AUTH.currentUserId);loginMeta={accountId:AUTH.currentUserId,profile:login.profile,rememberToken:login.rememberToken||'',rememberExpiresAt:login.rememberExpiresAt||''};
      UI.hydrationState='loading';UI.hydrationHasCache=hasCache;UI.hydrationError='';UI.mutationLocked=true;UI.loading=!hasCache;
    }else{
      const row=(DATA.accounts||[]).find(item=>item.usernameHash===usernameHash);if(!row||row.status==='locked'){showInlineError('loginError','Tên đăng nhập hoặc mật khẩu không đúng.');return;}
      const verifier=await passwordVerifier(password,row.passwordSalt,row.passwordIterations||row.iterations);if(verifier!==row.passwordHash){showInlineError('loginError','Tên đăng nhập hoặc mật khẩu không đúng.');return;}
      AUTH.currentUserId=row.id;AUTH.adminAuthenticated=false;AUTH.adminBypass=false;secrets.set(CONFIG.accountSessionKey,row.id);const profile={id:row.id,userCode:row.userCode||'',displayName:row.displayName||row.usernameLabel||username,username:row.usernameLabel||username,status:row.status||'active',kind:'account'};setSessionProfile(profile);loginMeta={accountId:row.id,profile,rememberToken:'',rememberExpiresAt:''};UI.hydrationState='ready';UI.hydrationHasCache=true;UI.hydrationError='';UI.mutationLocked=false;UI.loading=false;
    }
    saveRememberedLogin(remember,loginMeta);document.getElementById('loginPassword').value='';document.getElementById('accountLoginDialog').close();renderAuthenticatedWorkspace();toast(`Đã đăng nhập bằng tài khoản ${currentUserProfile().displayName}.`,'success');
    if(endpoint)initialHydrateAfterLogin();
  }catch(error){clearRememberedLogin();showInlineError('loginError',error.message||'Không thể đăng nhập.');}
  finally{setButtonLoading('accountLoginSubmitButton',false);}
}

function enforceLoginGate(){
  const endpoint=configuredEndpoint(),adminReady=Boolean(AUTH.adminAuthenticated&&AUTH.settingsUnlocked),serverReady=Boolean(endpoint&&AUTH.currentUserId&&serverAccountToken()),localRow=!endpoint?(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId&&item.status!=='locked'):null;
  if(adminReady||serverReady||localRow){renderAuthenticatedWorkspace();return true;}
  lockAuthenticatedShell();AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=false;AUTH.settingsUnlocked=false;AUTH.masterPassword='';secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);
  const form=document.getElementById('accountLoginForm');form?.reset();if(storage.get(CONFIG.rememberLoginKey,'')==='1')document.getElementById('loginRememberMe').checked=true;showInlineError('loginError','');const dialog=document.getElementById('accountLoginDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>document.getElementById('loginUsername')?.focus(),50);return false;
}
function openAdminFromLogin(){document.getElementById('accountLoginDialog').close();AUTH.adminBypass=true;AUTH.pendingTab='settings';lockAuthenticatedShell();openSettingsAccessDialog();}

function renderProfileDialogContent(){const dialog=document.getElementById('profileDialog');if(!dialog)return;const profile=currentUserProfile(),pref=getCurrentPreference(),accent=pref?.accent||getSettings().accentTheme||'pink';document.getElementById('profileDialogName').textContent=profile.displayName||'Người dùng';document.getElementById('profileDialogStatus').textContent=`${profile.username||profile.userCode||'Quản trị hệ thống'} · ${profile.status==='locked'?'Đã khóa':'Đang hoạt động'}`;document.getElementById('profileDialogBody').innerHTML=`<div class="grid grid-cols-2 gap-3"><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Tên người dùng</p><p class="mt-1 truncate text-sm font-semibold">${esc(profile.displayName||'—')}</p></div><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Trạng thái</p><p class="mt-1 inline-flex items-center gap-2 text-sm font-semibold"><span class="size-2 rounded-full ${profile.status==='locked'?'bg-rose-500':'bg-emerald-500'}"></span>${profile.status==='locked'?'Đã khóa':'Đang hoạt động'}</p></div></div><div class="mt-4"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Màu giao diện của tài khoản</p><div class="mt-2 grid grid-cols-3 gap-2">${Object.entries(ACCENT_THEMES).map(([key,theme])=>`<button type="button" data-profile-accent="${key}" class="appearance-choice ${accent===key?'is-active':''}"><span class="size-4 shrink-0 rounded-full" style="background:${theme.swatch}"></span><span class="truncate">${theme.label}</span></button>`).join('')}</div></div><div class="mt-4 space-y-2"><button id="profileThemeToggle" type="button" class="profile-action"><span class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800">${icon(isDark()?'moon-star':'sun','size-4')}</span><span><span class="block text-sm font-semibold">Dark mode</span><span class="block text-[10px] text-slate-500 dark:text-slate-400">${isDark()?'Đang bật':'Đang tắt'}</span></span></span><span class="relative h-5 w-9 rounded-full ${isDark()?'bg-brand-600':'bg-slate-300 dark:bg-slate-700'}"><span class="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${isDark()?'left-[18px]':'left-0.5'}"></span></span></button><button id="profileChangePassword" type="button" class="profile-action"><span class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">${icon('key-round','size-4')}</span><span class="text-sm font-semibold">Đổi mật khẩu</span></span>${icon('chevron-right','size-4 text-slate-300')}</button>${(profile.kind==='account'||Boolean(serverAccountToken()))?`<button id="profileLogout" type="button" class="profile-action text-rose-700 dark:text-rose-300"><span class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-rose-50 dark:bg-rose-500/10">${icon('log-out','size-4')}</span><span class="text-sm font-semibold">Đăng xuất</span></span>${icon('chevron-right','size-4')}</button>`:''}</div>`;document.querySelectorAll('[data-profile-accent]').forEach(button=>button.addEventListener('click',()=>setAccent(button.dataset.profileAccent)));document.getElementById('profileThemeToggle')?.addEventListener('click',()=>setUserTheme(!isDark()));document.getElementById('profileChangePassword')?.addEventListener('click',()=>{dialog.close();if(profile.kind==='admin')openSettingsPasswordDialog(false);else openSelfPasswordDialog();});document.getElementById('profileLogout')?.addEventListener('click',logoutCurrentUser);refreshIcons();}
function openProfileDialog(){renderProfileDialogContent();const dialog=document.getElementById('profileDialog');if(!dialog.open)dialog.showModal();}
function openSelfPasswordDialog(){document.getElementById('selfPasswordForm').reset();showInlineError('selfPasswordError','');document.getElementById('selfPasswordDialog').showModal();refreshIcons();setTimeout(()=>document.getElementById('selfCurrentPassword')?.focus(),50);}
async function submitSelfPassword(event){event.preventDefault();const current=document.getElementById('selfCurrentPassword').value,next=document.getElementById('selfNewPassword').value,confirmPassword=document.getElementById('selfConfirmPassword').value;showInlineError('selfPasswordError','');try{
  if(next.length<SECURITY_POLICY.minPasswordLength){showInlineError('selfPasswordError',`Mật khẩu mới phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}if(next!==confirmPassword){showInlineError('selfPasswordError','Hai lần nhập mật khẩu mới chưa khớp.');return;}
  if(configuredEndpoint()){
    const challenge=await postAppsScript({action:'changePasswordChallenge'}),rowSubject=challenge.usernameHash||'';
    const currentVerifier=await passwordVerifier(current,challenge.passwordSalt,challenge.passwordIterations),currentProof=await proofForVerifier(currentVerifier,challenge.nonce,rowSubject);
    const newPasswordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16))),newPasswordHash=await passwordVerifier(next,newPasswordSalt,SECURITY_POLICY.passwordIterations);
    const result=await postAppsScript({action:'changeOwnPassword',nonce:challenge.nonce,currentProof,newPasswordSalt,newPasswordHash,newPasswordIterations:SECURITY_POLICY.passwordIterations});setRemoteRevision(result.revision||remoteRevision());
  }else{
    const row=(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId);if(!row)throw new Error('Không xác định được tài khoản đang đăng nhập.');const verifier=await passwordVerifier(current,row.passwordSalt,row.passwordIterations||row.iterations);if(verifier!==row.passwordHash)throw new Error('Mật khẩu hiện tại không đúng.');row.passwordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));row.passwordHash=await passwordVerifier(next,row.passwordSalt);row.passwordIterations=SECURITY_POLICY.passwordIterations;row.passwordAlgorithm='PBKDF2-SHA256-256';row.updatedAt=new Date().toISOString();queueUpsert('accounts',row);saveData();
  }
  clearRememberedLogin();document.getElementById('selfPasswordDialog').close();toast('Đã đổi mật khẩu tài khoản. Các phiên ghi nhớ trước đó đã bị vô hiệu hóa.','success');
}catch(error){showInlineError('selfPasswordError',error.message||'Không thể đổi mật khẩu.');}}
function logoutCurrentUser(){clearSettingsDraft();document.getElementById('profileDialog')?.close();const token=serverAccountToken(),rememberToken=rememberedLoginRecord()?.rememberToken||'';logoutServerToken(token,rememberToken);clearRememberedLogin();UI.hydrationRunId+=1;UI.hydrationState='idle';UI.hydrationHasCache=false;UI.hydrationError='';UI.mutationLocked=false;UI.loading=false;lockAuthenticatedShell();AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=false;AUTH.adminBypass=false;AUTH.settingsUnlocked=false;AUTH.bootstrapMode=false;AUTH.masterPassword='';AUTH.accounts=[];secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);toast('Đã đăng xuất khỏi WeddingOS.','info');enforceLoginGate();}

function localISODate(date=new Date()){const offset=date.getTimezoneOffset()*60000;return new Date(date.getTime()-offset).toISOString().slice(0,10);}
function notificationRecordTitle(collection,record){const primary={checklist:'task',timeline:'event',budget:'category',guests:'name',vendors:'name',references:'event'}[collection];return String(record?.[primary]||CONFIG.schemas[collection]?.title||'Bản ghi');}
function formatDateTokensInText(value=''){return String(value??'').replace(/\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?\b/g,token=>formatDate(token));}
function currentNotifications(){const today=localISODate(),items=[],settings=getSettings(),settingDates={registrationDate:'Đăng ký kết hôn',engagementDate:'Lễ ăn hỏi',pickupDate:'Rước dâu',groomPartyDate:'Tiệc nhà trai',bridePartyDate:'Tiệc nhà gái'};Object.entries(settingDates).forEach(([field,label])=>{if(settings[field]===today)items.push({id:`settings-${field}-${today}`,type:'date',tone:'date',title:`${label} diễn ra hôm nay`,message:`Ngày ${formatDate(today)} là mốc ${label.toLowerCase()} trong kế hoạch cưới.`,collection:'settings',field,value:today});});const dateFields={checklist:['dueDate'],timeline:['eventDate'],vendors:['decisionDue']};Object.entries(dateFields).forEach(([collection,fields])=>(DATA[collection]||[]).forEach(record=>fields.forEach(field=>{if(record[field]===today&&!['Hoàn thành','Hủy','Loại'].includes(record.status))items.push({id:`${collection}-${record.id}-${field}-${today}`,type:'date',tone:'date',title:`${fieldLabel(CONFIG.schemas[collection],field)} đến hạn hôm nay`,message:`${notificationRecordTitle(collection,record)} · ${formatDate(today)}`,collection,recordId:record.id,field,value:today});})));(DATA.budget||[]).forEach(record=>{const budgeted=Number(record.budgeted||0);if(budgeted<=0)return;const used=Number(record.actual||0)+Number(record.payable||0),remaining=budgeted-used,ratio=remaining/budgeted;if(remaining<0)items.push({id:`budget-over-${record.id}`,type:'budget',tone:'danger',title:`${record.category} đã vượt ngân sách`,message:`Vượt ${money(Math.abs(remaining))}. Tổng thực chi và cần thanh toán là ${money(used)} trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id});else if(ratio<.1)items.push({id:`budget-low-${record.id}`,type:'budget',tone:'warning',title:`${record.category} sắp hết ngân sách`,message:`Chỉ còn ${money(remaining)} (${Math.max(0,Math.round(ratio*100))}%) trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id});});(DATA.notifications||[]).filter(row=>!row.accountId||row.accountId==='all'||row.accountId===currentPrincipalId()).forEach(row=>items.push({id:row.id,type:row.type,tone:row.tone,title:row.title,message:row.message,collection:row.collection,recordId:row.recordId,value:row.eventDate,readAt:row.readAt}));const unique=new Map();items.forEach(item=>unique.set(item.id,item));const order={danger:0,warning:1,date:2};return[...unique.values()].sort((a,b)=>(order[a.tone]??9)-(order[b.tone]??9));}
function updateNotificationBadge(){const count=currentNotifications().length,node=document.getElementById('notificationCount'),button=document.getElementById('notificationButton');if(node){node.textContent=count>99?'99+':String(count);node.classList.toggle('hidden',count===0);}if(button)button.title=count?`${count} thông báo cần chú ý`:'Không có thông báo mới';}
function openNotificationCenter(){const items=currentNotifications(),list=document.getElementById('notificationList');document.getElementById('notificationSummary').textContent=items.length?`${items.length} nội dung cần chú ý theo dữ liệu hiện tại.`:'Không có hạn mục đến hạn hoặc cảnh báo ngân sách.';list.innerHTML=items.length?items.map(item=>`<button type="button" data-notification-id="${esc(item.id)}" class="notification-item"><span class="notification-dot notification-dot--${item.tone}"></span><span class="min-w-0 flex-1"><span class="block text-sm font-semibold leading-5">${esc(item.title)}</span><span class="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">${esc(formatDateTokensInText(item.message))}</span></span>${icon('chevron-right','mt-1 size-4 shrink-0 text-slate-300')}</button>`).join(''):`<div class="px-6 py-12 text-center"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">${icon('bell-off','size-5')}</span><p class="mt-3 text-sm font-semibold">Chưa có cảnh báo</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Hệ thống sẽ tự động kiểm tra lại khi dữ liệu thay đổi.</p></div>`;list.querySelectorAll('[data-notification-id]').forEach(button=>button.addEventListener('click',()=>openNotificationDetail(button.dataset.notificationId)));document.getElementById('notificationDialog').showModal();refreshIcons();}
function openNotificationDetail(id){const item=currentNotifications().find(notification=>notification.id===id);if(!item)return;document.getElementById('notificationDialog').close();document.getElementById('notificationDetailType').textContent=item.type==='budget'?'Cảnh báo ngân sách':'Nhắc việc theo thời gian';document.getElementById('notificationDetailTitle').textContent=item.title;const iconWrap=document.getElementById('notificationDetailIcon');iconWrap.className=`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone==='danger'?'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300':item.tone==='warning'?'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300':'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'}`;iconWrap.innerHTML=icon(item.tone==='danger'?'triangle-alert':item.tone==='warning'?'badge-alert':'calendar-check','size-5');let details=`<div class="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/60 dark:text-slate-200">${esc(formatDateTokensInText(item.message))}</div>`;if(item.recordId&&CONFIG.schemas[item.collection]){const schema=CONFIG.schemas[item.collection],record=(DATA[item.collection]||[]).find(row=>row.id===item.recordId);if(record)details+=`<dl class="mt-4 grid gap-3 sm:grid-cols-2">${schema.fields.slice(0,8).map(([key,label])=>`<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(label)}</dt><dd class="mt-1 text-sm">${displayValue(schema,key,record[key])}</dd></div>`).join('')}</dl>`;}document.getElementById('notificationDetailContent').innerHTML=details;document.getElementById('notificationDetailActions').innerHTML=item.recordId?`<button id="openNotificationRecord" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white">${icon('arrow-up-right','size-4')}Mở bản ghi</button>`:'';document.getElementById('openNotificationRecord')?.addEventListener('click',()=>{document.getElementById('notificationDetailDialog').close();navigate(item.collection);setTimeout(()=>openDetails(item.collection,item.recordId),180);});document.getElementById('notificationDetailDialog').showModal();refreshIcons();}

function completeNavigation(tab){closeMobileActions();const leavingSettings=UI.tab==='settings'&&tab!=='settings';if(leavingSettings){clearSettingsDraft();const adminToken=serverAdminToken();logoutServerToken(adminToken);secrets.remove(CONFIG.adminServerSessionKey);AUTH.settingsUnlocked=false;AUTH.adminAuthenticated=false;AUTH.masterPassword='';AUTH.accounts=[];AUTH.adminBypass=false;if(configuredEndpoint()){DATA.accounts=[];DATA.security=[];secrets.remove(CONFIG.sensitiveSessionKey);saveData();}}UI.tab=tab;UI.search='';UI.filter='Tất cả';UI.secondaryFilter=null;UI.advancedFilters={};UI.dateFilters={};UI.filterDraft=null;UI.filterPanelOpen=false;UI.visibleCount=CONFIG.pageSize;closeSidebar();setLoading(true);renderNavigation();renderHeader();setTimeout(()=>{setLoading(false);renderPage();if(tab!=='settings')enforceLoginGate();},120);}

function navigate(tab){completeNavigation(tab);}

function renderHeader(){
  const item=CONFIG.nav.find(item=>item.id===UI.tab)||CONFIG.nav[0];
  document.getElementById('pageTitle').textContent=item.label; document.getElementById('breadcrumb').textContent=item.label;
  document.getElementById('editModePill')?.classList.toggle('hidden',!UI.editMode);
  const editButton=document.getElementById('editButton');
  if(editButton){
    editButton.innerHTML=`${icon(UI.editMode?'check':'square-pen','size-4')}<span>${UI.editMode?'Xong':'Chỉnh sửa'}</span>`;
    editButton.classList.toggle('border-amber-300',UI.editMode); editButton.classList.toggle('bg-amber-50',UI.editMode);
  }
  updateThemeIcon(); updatePendingIndicators(); updateNotificationBadge(); updateHydrationUi(); refreshIcons();
}

function setLoading(active){ UI.loading=active; const bar=document.getElementById('topProgress'); bar.classList.toggle('opacity-0',!active); bar.classList.toggle('w-2/3',active); if(!active){bar.classList.remove('w-2/3');bar.classList.add('w-full');setTimeout(()=>bar.classList.remove('w-full'),350);} ['editButton','saveButton','syncButton'].forEach(id=>document.getElementById(id)?.toggleAttribute('disabled',active)); }
function renderGuide(){
  const relationCards=[
    ['Danh mục dùng chung','Là nguồn chuẩn cho Sự kiện liên quan, Nhóm công việc, Nhóm dịch vụ và các lựa chọn dùng chung. Mọi liên kết lưu bằng ID để đổi tên/sắp xếp không làm mất quan hệ.','database'],
    ['Nhà cung cấp → Ngân sách','Nhà cung cấp cùng Sự kiện + Nhóm dịch vụ và trạng thái Đã chọn/Đã cọc/Hoàn tất sẽ tự cộng Giá trị hợp đồng vào Chi phí tạm tính; Tiền cọc + Đã thanh toán được cộng vào Thực chi.','git-merge'],
    ['Ngân sách → Công việc','Công việc chọn Hạng mục ngân sách sẽ tự hiển thị Ngân sách dự kiến, Chi phí tạm tính, Thực chi và Còn phải thanh toán từ hạng mục đó.','wallet-cards'],
    ['Tham khảo → Nhà cung cấp','Gợi ý tự động dựa trên Nhóm công việc giống Dịch vụ/hạng mục cung cấp, ưu tiên Quan tâm/Rất quan tâm và sắp theo Điểm đánh giá.','sparkles'],
    ['Gộp theo sự kiện','Công việc, Timeline, Ngân sách, Khách mời và Nhà cung cấp có thể gộp theo cùng Sự kiện liên quan. Khách mời chỉ đưa RSVP Đồng ý vào chế độ gộp.','layers-3']
  ];
  const required=[['Công việc','Nội dung công việc · Nhóm việc · Sự kiện liên quan · Trạng thái'],['Timeline','Tên hoạt động · Sự kiện liên quan · Nhóm việc · Ngày sự kiện · Trạng thái'],['Ngân sách','Hạng mục chi phí · Sự kiện liên quan · Nhóm dịch vụ · Ngân sách dự kiến'],['Khách mời','Tên khách · Sự kiện tham dự · RSVP'],['Nhà cung cấp','Sự kiện liên quan · Nhóm dịch vụ · Dịch vụ/hạng mục cung cấp · Tên NCC · Trạng thái'],['Tham khảo','Sự kiện liên quan · Nhóm công việc · Mức độ quan tâm']];
  return `<section class="guide-hero"><div><p class="text-xs font-bold uppercase tracking-[.14em] text-brand-600 dark:text-brand-300">Hướng dẫn hệ thống</p><h3 class="mt-1 text-xl font-bold">WeddingOS liên kết dữ liệu như thế nào?</h3><p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">Các tính năng dùng cùng Master Data và canonical ID. Hãy tạo Danh mục dùng chung trước, sau đó nhập dữ liệu theo thứ tự Tham khảo/Nhà cung cấp → Ngân sách → Công việc để các số liệu tự động liên kết chính xác.</p></div></section><div class="guide-grid">${relationCards.map(([title,desc,ico])=>`<article class="guide-card"><span class="guide-card__icon">${icon(ico,'size-5')}</span><div><h4>${esc(title)}</h4><p>${esc(desc)}</p></div></article>`).join('')}</div><section class="guide-section"><div class="guide-section__heading"><h4>Trường bắt buộc để đảm bảo liên kết & tính toán</h4><p>Lookup luôn để trống khi tạo mới; người dùng cần chủ động chọn đúng giá trị trước khi lưu.</p></div><div class="guide-required-list">${required.map(([name,fields])=>`<div><strong>${esc(name)}</strong><span>${esc(fields)}</span></div>`).join('')}</div></section><section class="guide-section"><div class="guide-section__heading"><h4>Công thức tài chính</h4></div><div class="guide-formulas"><p><strong>Ngân sách tổng</strong> = Quỹ dự phòng + Ngân sách vận hành.</p><p><strong>Chi phí tạm tính</strong> = tổng Giá trị hợp đồng/dịch vụ của Nhà cung cấp liên quan.</p><p><strong>Thực chi</strong> = tổng (Tiền cọc + Đã thanh toán) nếu có Nhà cung cấp liên quan; nếu chưa có thì được nhập thủ công.</p><p><strong>Còn phải thanh toán</strong> = max(0, Chi phí tạm tính − Thực chi).</p></div></section>`;
}

function renderPage(){const container=document.getElementById('mainContent');let content;if(UI.hydrationState==='error'&&!UI.hydrationHasCache)content=renderHydrationErrorState();else content=UI.loading?renderSkeleton():UI.tab==='dashboard'?renderDashboard():UI.tab==='guide'?renderGuide():UI.tab==='settings'?renderSettings():renderCollection(UI.tab);container.innerHTML=`${renderHydrationBanner()}${content}`;bindPageEvents();bindDatePickerUX(container);document.getElementById('retryHydrationButton')?.addEventListener('click',()=>initialHydrateAfterLogin(true));bindNumberInputs(container);updateCoupleWidget();updateNotificationBadge();updatePendingIndicators();updateHydrationUi();refreshIcons();}
function renderSkeleton(){ return `<div class="space-y-5 animate-pulse-soft"><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${Array.from({length:4},()=>`<div class="h-36 rounded-2xl bg-slate-200/70 dark:bg-slate-800"></div>`).join('')}</div><div class="grid gap-5 xl:grid-cols-3"><div class="h-[430px] rounded-2xl bg-slate-200/70 dark:bg-slate-800 xl:col-span-2"></div><div class="h-[430px] rounded-2xl bg-slate-200/70 dark:bg-slate-800"></div></div></div>`; }

function daysUntil(value){ const normalized=normalizeDateOnly(value);if(!normalized)return null; const now=new Date(); now.setHours(0,0,0,0); const date=new Date(`${normalized}T00:00:00`); if(Number.isNaN(date.getTime()))return null; return Math.ceil((date-now)/86400000); }
function countdownCard(label,value,iconName){
  const days=daysUntil(value),horizon=365;
  const progress=days===null?0:days<=0?100:Math.max(4,Math.min(100,Math.round((1-Math.min(days,horizon)/horizon)*100)));
  const brightness=days===null?.75:days<=0?1.25:.78+(progress/100)*.47;
  const glow=days===null?'8%':`${Math.round(12+progress*.36)}%`;
  const color=days===null?'#94a3b8':days<=30?'#e11d48':days<=90?'#f59e0b':days<=180?'#3b82f6':'var(--color-brand-500)';
  const main=days===null?'Chưa chốt':days>0?`${days} ngày`:days===0?'Hôm nay':`Đã qua ${Math.abs(days)} ngày`;
  const deadline=value?`Tới hạn: ${formatDate(value)}`:'Tới hạn: Chưa xác định';
  const status=days===null?'Cần cập nhật ngày':days>0?`Còn ${days} ngày để chuẩn bị`:days===0?'Sự kiện diễn ra hôm nay':`Sự kiện đã kết thúc`;
  return `<article class="event-progress-card rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" style="--event-progress:${progress}%;--event-brightness:${brightness};--event-glow:${glow};--event-color:${color}"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="text-xs font-semibold text-slate-500 dark:text-slate-400">${esc(label)}</p><p class="mt-2 text-lg font-bold tabular leading-tight">${esc(main)}</p></div><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">${icon(iconName,'size-4')}</span></div><div class="mt-4 event-progress-track" aria-label="Mức độ cận ngày ${progress}%"><div class="event-progress-fill"></div></div><div class="mt-3 space-y-1"><p class="text-xs font-semibold text-slate-700 dark:text-slate-200">${esc(deadline)}</p><p class="text-[11px] leading-4 text-slate-500 dark:text-slate-400">${esc(status)}</p></div></article>`;
}

function openDashboardTextEditor(){if(!isAdministrator()){toast('Chỉ tài khoản quản trị được sửa nội dung này.','error');return;}const settings=getSettings();document.getElementById('dashboardDescriptionInput').value=settings.dashboardDescription||'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.';document.getElementById('dashboardTextDialog').showModal();refreshIcons();}
function saveDashboardText(event){event.preventDefault();if(!isAdministrator()){toast('Bạn không có quyền chỉnh sửa nội dung này.','error');return;}const value=document.getElementById('dashboardDescriptionInput').value.trim();if(!value)return;let item=(DATA.settings||[]).find(row=>row.key==='dashboardDescription'),before=item?structuredClone(item):null;if(item){item.value=value;item.updatedAt=new Date().toISOString();}else{item={id:'setting-dashboardDescription',key:'dashboardDescription',value,notes:'Mô tả hiển thị tại tab Tổng quan',updatedAt:new Date().toISOString()};DATA.settings.push(item);}queueUpsert('settings',item,before);saveData();document.getElementById('dashboardTextDialog').close();renderPage();toast('Đã cập nhật nội dung giới thiệu tại Tổng quan.','success');}

function renderDashboard(){
  const checklist=DATA.checklist||[],budget=DATA.budget||[],guests=DATA.guests||[],vendors=DATA.vendors||[],settings=getSettings();
  const done=checklist.filter(row=>row.status==='Hoàn thành').length,inProgress=checklist.filter(row=>row.status==='Đang làm').length,waiting=checklist.filter(row=>row.status==='Chờ xác nhận').length;
  const completion=checklist.length?Math.round(done/checklist.length*100):0;
  const budgeted=budget.reduce((s,r)=>s+Number(r.budgeted||0),0),committed=budget.reduce((s,r)=>s+Number(r.committed||0),0),actual=budget.reduce((s,r)=>s+Number(r.actual||0),0),payable=budget.reduce((s,r)=>s+Number(r.payable||0),0);
  const attending=guests.filter(row=>row.rsvp==='Đồng ý').reduce((s,r)=>s+Number(r.partySize||1),0),rsvpCount=guests.filter(row=>row.name&&row.rsvp!=='Chưa phản hồi').length,namedGuests=guests.filter(row=>row.name).length;
  const selectedVendors=vendors.filter(row=>['Đã chọn','Đã cọc','Hoàn tất'].includes(row.status)).length,upcoming=checklist.filter(row=>row.status!=='Hoàn thành').slice(0,5);
  return `<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="relative isolate overflow-hidden px-5 py-6 sm:px-7 sm:py-8"><div class="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-brand-200/45 blur-3xl dark:bg-brand-900/25"></div><div class="absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-900/20"></div><div class="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"><div class="max-w-2xl"><div class="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">${icon('sparkles','size-3.5')} Wedding planning workspace</div><h3 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">${esc((settings.groomName||'Chú rể')+' × '+(settings.brideName||'Cô dâu'))}</h3><div class="mt-2 flex max-w-2xl items-start gap-2"><p class="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">${esc(settings.dashboardDescription||'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.')}</p>${isAdministrator()?`<button id="editDashboardDescription" type="button" aria-label="Chỉnh sửa nội dung giới thiệu" class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-brand-700 dark:hover:bg-slate-800 dark:hover:text-brand-300">${icon('pencil','size-3.5')}</button>`:''}</div><div class="mt-5 flex flex-wrap gap-2">${dateChip('Ăn hỏi',settings.engagementDate,'heart-handshake')}${dateChip('Rước dâu',settings.pickupDate,'car-front')}${dateChip('Tiệc nhà trai',settings.groomPartyDate,'sun')}${dateChip('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</div></div><div class="grid min-w-[260px] grid-cols-2 gap-3 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/45"><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Tiến độ</p><p class="mt-1 text-2xl font-bold tabular">${completion}%</p></div><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Ngân sách</p><p class="mt-1 text-2xl font-bold tabular">${compactMoney(Number(settings.totalBudget||0))}</p></div><div class="col-span-2"><div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div class="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-700" style="width:${completion}%"></div></div></div></div></div></div></section>
  <section class="countdown-grid event-progress-grid">${countdownCard('Đăng ký kết hôn',settings.registrationDate,'file-signature')}${countdownCard('Lễ ăn hỏi',settings.engagementDate,'heart-handshake')}${countdownCard('Rước dâu',settings.pickupDate,'car-front')}${countdownCard('Tiệc nhà trai',settings.groomPartyDate,'sun')}${countdownCard('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</section>
  <section class="dashboard-metric-grid">${metricCard('Tiến độ tổng thể',`${completion}%`,`${done}/${checklist.length} công việc hoàn thành`,'circle-check-big','emerald',`${completion}%`)}${metricCard('Đang xử lý',inProgress,`${waiting} việc chờ xác nhận`,'loader-circle','blue')}${metricCard('Dòng tiền',compactMoney(actual),`Cần thanh toán ${compactMoney(payable)}`,'chart-no-axes-combined',Number(settings.operatingBudget||0)>0&&actual>Number(settings.operatingBudget||0)?'rose':'violet')}${metricCard('Khách xác nhận',attending,`${rsvpCount}/${namedGuests||0} lời phản hồi`,'users-round','amber')}</section>
  <section class="mt-5 grid gap-5 xl:grid-cols-3"><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">${panelHeader('Việc cần ưu tiên','Theo dõi những đầu việc chưa hoàn thành','arrow-up-right','Mở Công việc',"navigate('checklist')")}<div class="divide-y divide-slate-100 dark:divide-slate-800">${upcoming.length?upcoming.map((row,index)=>`<button type="button" onclick="openDetails('checklist',decodeURIComponent('${encoded(row.id)}'))" class="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/55 sm:px-6"><span class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-brand-500/10 dark:group-hover:text-brand-300">${String(index+1).padStart(2,'0')}</span><span class="min-w-0 flex-1"><span class="block font-semibold leading-6">${esc(row.task)}</span><span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1">${icon('user-round','size-3.5')}${esc(row.owner||'Chưa giao')}</span><span class="inline-flex items-center gap-1">${icon('map-pin','size-3.5')}${esc(row.location||'Chưa chốt')}</span></span></span><span class="hidden shrink-0 sm:block">${statusBadge(row.status)}</span>${icon('chevron-right','mt-2 size-4 shrink-0 text-slate-300')}</button>`).join(''):emptyStateInline('Chưa có công việc','Thêm công việc mới để bắt đầu theo dõi tiến độ.')}</div></div><div class="space-y-5"><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Ngân sách','Tỷ lệ sử dụng kế hoạch','wallet-cards')}<div class="space-y-5 px-5 pb-6 sm:px-6">${budgetProgress('Chi phí tạm tính',committed,budgeted,'bg-indigo-500')}${budgetProgress('Thực chi',actual,budgeted,'bg-brand-600')}<div class="grid grid-cols-2 gap-3 pt-1"><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Còn lại</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(Math.max(budgeted-committed,0))}</p></div><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Dự phòng</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(Number(settings.reserveBudget||0))}</p></div></div></div></div><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Tình trạng dữ liệu','Google Sheets là nguồn dữ liệu chính','activity')}<div class="space-y-3 px-5 pb-6 sm:px-6">${healthRow('Thay đổi chờ đồng bộ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Nhà cung cấp đã chọn',`${selectedVendors} đơn vị`,selectedVendors?'blue':'slate')}${healthRow('Lần đồng bộ cuối',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa đồng bộ',UI.lastSyncAt?'emerald':'amber')}</div></div></div></section>`;
}

function dateChip(label,value,iconName){ return `<span class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900/70">${icon(iconName,'size-3.5 text-brand-600 dark:text-brand-400')}<span class="font-semibold">${label}</span><span class="text-slate-500 dark:text-slate-400">${formatDate(value)}</span></span>`; }
function metricCard(label,value,description,iconName,tone,progress=''){ const tones={emerald:'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',blue:'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',violet:'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',amber:'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',rose:'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'}; return `<article class="dashboard-metric-card group rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"><div class="flex items-start justify-between gap-4"><div><p class="text-sm font-medium text-slate-500 dark:text-slate-400">${label}</p><p class="mt-2 text-2xl font-bold tracking-tight tabular sm:text-3xl">${value}</p></div><span class="grid size-11 place-items-center rounded-2xl ${tones[tone]}">${icon(iconName,'size-5')}</span></div><p class="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">${description}</p>${progress?`<div class="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-emerald-500" style="width:${progress}"></div></div>`:''}</article>`; }
function panelHeader(title,subtitle,actionIcon,actionLabel='',action=''){ return `<div class="flex items-start justify-between gap-4 px-5 py-5 sm:px-6"><div><h3 class="font-bold tracking-tight">${title}</h3><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${subtitle}</p></div>${actionLabel?`<button type="button" onclick="${action}" class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-brand-300 dark:hover:bg-brand-500/10">${actionLabel}${icon(actionIcon,'size-3.5')}</button>`:`<span class="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">${icon(actionIcon,'size-4')}</span>`}</div>`; }
function budgetProgress(label,value,total,cls){ const percentage=total?Math.min(Math.round(value/total*100),100):0; return `<div><div class="flex items-center justify-between gap-4 text-sm"><span class="font-medium">${label}</span><span class="tabular text-slate-500 dark:text-slate-400">${percentage}%</span></div><div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full ${cls}" style="width:${percentage}%"></div></div><p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">${compactMoney(value)} / ${compactMoney(total)}</p></div>`; }
function healthRow(label,value,tone){ const dot={emerald:'bg-emerald-500',blue:'bg-blue-500',amber:'bg-amber-500',slate:'bg-slate-400'}[tone]; return `<div class="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3.5 py-3 dark:bg-slate-950/60"><span class="inline-flex items-center gap-2 text-sm font-medium"><span class="size-2 rounded-full ${dot}"></span>${label}</span><span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${value}</span></div>`; }

function renderWidgetRow(cards,variant){
  const items=(cards||[]).filter(Boolean);
  if(!items.length)return '';
  return `<section class="widget-grid widget-grid--single-row widget-grid--${variant}" style="--widget-count:${items.length}">${items.join('')}</section>`;
}
function collectionWidgets(collection){
  const rows=collectionRows(collection);
  if(['checklist','timeline'].includes(collection)){
    const cards=CONFIG.schemas[collection].filterOptions.slice(1).map((status,index)=>statCard(status,rows.filter(r=>r.status===status).length,'clipboard-check',['slate','blue','amber','emerald','orange','rose'][index],`setCollectionFilter('${collection}',decodeURIComponent('${encoded(status)}'))`,UI.filter===status));
    return renderWidgetRow(cards,'status');
  }
  if(collection==='budget'){
    const totals={budgeted:rows.reduce((s,r)=>s+Number(r.budgeted||0),0),payable:rows.reduce((s,r)=>s+Number(r.payable||0),0),actual:rows.reduce((s,r)=>s+Number(r.actual||0),0),remaining:rows.reduce((s,r)=>s+Number(r.remaining||0),0)};
    return renderWidgetRow([
      statCard('Ngân sách dự kiến',money(totals.budgeted),'wallet-cards','blue',"setMetricFilter('budgeted')",UI.secondaryFilter?.type==='metric'&&UI.secondaryFilter.value==='budgeted',mobileMoneyMB(totals.budgeted)),
      statCard('Còn phải thanh toán',money(totals.payable),'receipt-text','amber',"setMetricFilter('payable')",UI.secondaryFilter?.value==='payable',mobileMoneyMB(totals.payable)),
      statCard('Thực chi',money(totals.actual),'badge-dollar-sign','rose',"setMetricFilter('actual')",UI.secondaryFilter?.value==='actual',mobileMoneyMB(totals.actual)),
      statCard('Còn lại',money(totals.remaining),'piggy-bank','emerald',"setMetricFilter('remaining')",UI.secondaryFilter?.value==='remaining',mobileMoneyMB(totals.remaining))
    ],'budget');
  }
  if(collection==='vendors'){
    const statuses=CONFIG.schemas.vendors.filterOptions.slice(1),tones=['slate','blue','emerald','amber','emerald','rose'];
    return renderWidgetRow(statuses.map((status,index)=>statCard(status,rows.filter(row=>row.status===status).length,'store',tones[index]||'slate',`setCollectionFilter('vendors',decodeURIComponent('${encoded(status)}'))`,UI.filter===status)),'status');
  }
  if(collection==='guests'){
    const sent=rows.filter(r=>r.sent==='Đã gửi').length,confirmed=rows.filter(r=>r.rsvp==='Đồng ý').length,sides=DATA.lookups.guestSides||[];
    const cards=[
      statCard('Đã gửi thiệp',sent,'send','blue',"setGuestFilter('sent','Đã gửi')",UI.secondaryFilter?.field==='sent'),
      statCard('Xác nhận tham gia',confirmed,'circle-check-big','emerald',"setGuestFilter('rsvp','Đồng ý')",UI.secondaryFilter?.field==='rsvp'),
      ...sides.slice(0,3).map((side,index)=>statCard(side,rows.filter(r=>r.side===side).length,'users-round',['amber','rose','slate'][index],`setGuestFilter('side',decodeURIComponent('${encoded(side)}'))`,UI.secondaryFilter?.field==='side'&&UI.secondaryFilter?.value===side))
    ];
    return renderWidgetRow(cards,'guests');
  }
  return '';
}

function statCard(label,value,iconName,tone,action,active=false,mobileValue=''){ const tones={emerald:'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',blue:'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',amber:'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',orange:'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',rose:'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',slate:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'},valueHtml=mobileValue?`<span class="widget-value-desktop">${value}</span><span class="widget-value-mobile">${esc(mobileValue)}</span>`:value; return `<button type="button" onclick="${action}" class="widget-stat-card rounded-2xl border ${active?'border-brand-500 ring-1 ring-brand-600/10':'border-slate-200 dark:border-slate-800'} bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:bg-slate-900 dark:hover:border-slate-700" aria-label="${esc(label)}: ${esc(value)}" title="${esc(label)}: ${esc(value)}"><div class="widget-stat-card__head"><div class="widget-stat-card__copy"><p class="widget-stat-card__label text-xs font-semibold text-slate-500 dark:text-slate-400">${label}</p><p class="widget-stat-card__value text-lg font-bold tabular sm:text-xl">${valueHtml}</p></div><span class="widget-stat-card__icon grid size-8 place-items-center rounded-xl ${tones[tone]||tones.slate}">${icon(iconName,'size-3.5')}</span></div></button>`; }

function activeAdvancedFilterCount(){ return Object.values(UI.advancedFilters||{}).reduce((sum,values)=>sum+(Array.isArray(values)?values.length:0),0); }
function activeCollectionFilterCount(){
  let count=UI.search.trim()?1:0;
  count+=Object.values(UI.advancedFilters||{}).filter(values=>Array.isArray(values)&&values.length).length;
  count+=Object.values(UI.dateFilters||{}).filter(range=>range&&(range.from||range.to)).length;
  if(UI.filter!=='Tất cả')count+=1;
  if(UI.secondaryFilter)count+=1;
  return count;
}

function hasActiveAdvancedFilters(){ return activeCollectionFilterCount()>0; }

function filterFieldValues(collection,key){
  const schema=CONFIG.schemas[collection],field=schema.fields.find(item=>item[0]===key),options=getFieldOptions(field?.[3]);
  const values=[];
  (options||[]).forEach(value=>values.push(value));
  collectionRows(collection).forEach(row=>{ const current=row[key]; if(Array.isArray(current)) current.forEach(value=>values.push(value)); else values.push(current); });
  return [...new Set(values.map(value=>String(value??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
}
function filterDateFields(collection){ return (CONFIG.schemas[collection]?.fields||[]).filter(field=>field[2]==='date'); }
function draftSelectedValues(field){ return Array.isArray(UI.filterDraft?.advancedFilters?.[field])?UI.filterDraft.advancedFilters[field]:[]; }
function filterSelectionSummary(field){ const values=draftSelectedValues(field); if(!values.length)return 'Chọn nhiều'; if(values.length<=2)return values.join(', '); return `${values.length} giá trị đã chọn`; }
function renderFilterDialogBody(collection){
  const schema=CONFIG.schemas[collection],dateFields=filterDateFields(collection),fields=(schema.filterFields||[]).filter(key=>filterFieldValues(collection,key).length);
  const dateHtml=dateFields.length?`<section class="filter-form-section"><div><p class="text-sm font-bold">Khoảng ngày</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Có thể nhập một hoặc cả hai mốc ngày; các điều kiện được kết hợp đồng thời.</p></div>${dateFields.map(([key,label])=>{const range=UI.filterDraft?.dateFilters?.[key]||{};return `<div><div class="filter-form-label"><span>${esc(label)}</span><span class="filter-form-operator">trong khoảng</span></div><div class="filter-date-grid"><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Từ ngày</span><input type="date" lang="vi-VN" data-filter-date-field="${esc(key)}" data-date-bound="from" value="${esc(normalizeDateOnly(range.from||''))}" class="filter-control" /></label><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Đến ngày</span><input type="date" lang="vi-VN" data-filter-date-field="${esc(key)}" data-date-bound="to" value="${esc(normalizeDateOnly(range.to||''))}" class="filter-control" /></label></div></div>`;}).join('')}</section>`:'';
  const fieldHtml=fields.length?`<section class="filter-form-section"><div><p class="text-sm font-bold">Điều kiện dữ liệu</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Chọn nhiều giá trị trong một trường. Giữa các trường áp dụng điều kiện AND.</p></div>${fields.map(key=>{const values=filterFieldValues(collection,key),selected=draftSelectedValues(key);return `<div class="filter-multiselect"><div class="filter-form-label"><span>${esc(fieldLabel(schema,key))}</span><span class="filter-form-operator">thuộc</span></div><button type="button" data-filter-dropdown="${esc(key)}" aria-expanded="false" class="filter-multiselect-button"><span data-filter-summary="${esc(key)}" class="min-w-0 flex-1 truncate ${selected.length?'font-semibold text-slate-800 dark:text-slate-100':'text-slate-400'}">${esc(filterSelectionSummary(key))}</span>${icon('chevron-down','size-4 shrink-0 text-slate-400')}</button><div data-filter-menu="${esc(key)}" class="filter-multiselect-menu hidden"><div class="border-b border-slate-200 p-2 dark:border-slate-700"><input type="search" data-filter-option-search="${esc(key)}" placeholder="Tìm trong ${esc(fieldLabel(schema,key).toLowerCase())}" class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950" /></div><div class="filter-option-list app-scrollbar">${values.map(value=>`<label class="filter-option-row" data-filter-option-row data-option-text="${esc(String(value).toLowerCase())}"><input type="checkbox" data-filter-draft-field="${esc(key)}" value="${esc(value)}" ${selected.includes(value)?'checked':''} class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" /><span class="min-w-0 flex-1 truncate" title="${esc(value)}">${esc(value)}</span></label>`).join('')}</div></div></div>`;}).join('')}</section>`:'';
  document.getElementById('filterDialogBody').innerHTML=`<section><div class="filter-form-label"><span>Từ khóa</span></div><input id="filterKeywordInput" type="search" value="${esc(UI.filterDraft?.search||'')}" placeholder="Nhập nội dung cần tìm" class="filter-control" /></section>${dateHtml}${fieldHtml}`;
  bindFilterDialogControls(); refreshIcons();
}
function bindFilterDialogControls(){
  document.getElementById('filterKeywordInput')?.addEventListener('input',event=>{UI.filterDraft.search=event.target.value;});
  document.querySelectorAll('[data-filter-date-field]').forEach(input=>input.addEventListener('change',event=>{ const key=event.target.dataset.filterDateField,bound=event.target.dataset.dateBound; UI.filterDraft.dateFilters[key]=UI.filterDraft.dateFilters[key]||{}; UI.filterDraft.dateFilters[key][bound]=event.target.value; if(!UI.filterDraft.dateFilters[key].from&&!UI.filterDraft.dateFilters[key].to)delete UI.filterDraft.dateFilters[key]; }));
  document.querySelectorAll('[data-filter-dropdown]').forEach(button=>button.addEventListener('click',event=>{ const key=event.currentTarget.dataset.filterDropdown,menu=document.querySelector(`[data-filter-menu="${CSS.escape(key)}"]`),opening=menu?.classList.contains('hidden'); document.querySelectorAll('[data-filter-menu]').forEach(node=>node.classList.add('hidden')); document.querySelectorAll('[data-filter-dropdown]').forEach(node=>node.setAttribute('aria-expanded','false')); if(opening){menu?.classList.remove('hidden');event.currentTarget.setAttribute('aria-expanded','true');menu?.querySelector('input[type="search"]')?.focus();} }));
  document.querySelectorAll('[data-filter-option-search]').forEach(input=>input.addEventListener('input',event=>{ const menu=event.target.closest('[data-filter-menu]'),query=event.target.value.trim().toLowerCase(); menu?.querySelectorAll('[data-filter-option-row]').forEach(row=>row.classList.toggle('hidden',Boolean(query)&&!row.dataset.optionText.includes(query))); }));
  document.querySelectorAll('[data-filter-draft-field]').forEach(input=>input.addEventListener('change',event=>{ const field=event.target.dataset.filterDraftField,selected=new Set(draftSelectedValues(field)); event.target.checked?selected.add(event.target.value):selected.delete(event.target.value); if(selected.size)UI.filterDraft.advancedFilters[field]=[...selected];else delete UI.filterDraft.advancedFilters[field]; const summary=document.querySelector(`[data-filter-summary="${CSS.escape(field)}"]`); if(summary){summary.textContent=filterSelectionSummary(field);summary.classList.toggle('text-slate-400',!selected.size);summary.classList.toggle('font-semibold',Boolean(selected.size));} }));
}
function openFilterDialog(){
  const schema=CONFIG.schemas[UI.tab]; if(!schema)return;
  const advanced=structuredClone(UI.advancedFilters||{});
  if(UI.filter!=='Tất cả'&&schema.statusField){ const selected=new Set(advanced[schema.statusField]||[]); selected.add(UI.filter); advanced[schema.statusField]=[...selected]; }
  UI.filterDraft={search:UI.search,advancedFilters:advanced,dateFilters:structuredClone(UI.dateFilters||{})};
  document.getElementById('filterDialogTitle').textContent=`Tìm kiếm ${schema.title}`;
  renderFilterDialogBody(UI.tab); const dialog=document.getElementById('filterDialog');dialog.showModal();bindDatePickerUX(dialog); setTimeout(()=>document.getElementById('filterKeywordInput')?.focus(),50);
}
function resetFilterDraft(){ UI.filterDraft={search:'',advancedFilters:{},dateFilters:{}}; renderFilterDialogBody(UI.tab); }
function applyFilterDialog(event){ event.preventDefault(); if(!UI.filterDraft)return; UI.search=String(UI.filterDraft.search||''); UI.advancedFilters=structuredClone(UI.filterDraft.advancedFilters||{}); UI.dateFilters=structuredClone(UI.filterDraft.dateFilters||{}); UI.filter='Tất cả'; UI.secondaryFilter=null; UI.visibleCount=CONFIG.pageSize; document.getElementById('filterDialog').close(); UI.filterDraft=null; renderPage(); }
function clearCollectionFilters(){ UI.search='';UI.filter='Tất cả';UI.secondaryFilter=null;UI.advancedFilters={};UI.dateFilters={};UI.filterDraft=null;UI.visibleCount=CONFIG.pageSize;renderPage(); }
function renderFilterChips(collection){
  const schema=CONFIG.schemas[collection],chips=[];
  if(UI.search.trim())chips.push(`Từ khóa: ${UI.search.trim()}`);
  if(UI.filter!=='Tất cả')chips.push(`${fieldLabel(schema,schema.statusField)}: ${UI.filter}`);
  Object.entries(UI.advancedFilters||{}).forEach(([field,values])=>{if(values?.length)chips.push(`${fieldLabel(schema,field)}: ${values.length===1?values[0]:values.length+' giá trị'}`);});
  Object.entries(UI.dateFilters||{}).forEach(([field,range])=>{if(range?.from||range?.to)chips.push(`${fieldLabel(schema,field)}: ${range.from?formatDate(range.from):'…'} → ${range.to?formatDate(range.to):'…'}`);});
  if(UI.secondaryFilter)chips.push('Bộ lọc nhanh từ widget');
  return chips.map(text=>`<span class="filter-chip" title="${esc(text)}">${icon('filter','size-3 shrink-0')}<span class="truncate">${esc(text)}</span></span>`).join('');
}

function openColumnSettings(){const collection=UI.tab;if(!CONFIG.schemas[collection])return;UI.columnCollection=collection;const visible=getVisibleColumns(collection),all=allColumnKeys(collection),pref=getCurrentPreference()?.columns?.[collection],savedOrder=pref&&typeof pref==='object'&&!Array.isArray(pref)&&Array.isArray(pref.order)?pref.order.filter(key=>all.includes(key)):[],ordered=[...savedOrder,...visible.filter(key=>!savedOrder.includes(key)),...all.filter(key=>!savedOrder.includes(key)&&!visible.includes(key))];UI.columnDraft=ordered.map(key=>({key,visible:visible.includes(key)}));document.getElementById('columnSettingsTitle').textContent=`Cột hiển thị · ${CONFIG.schemas[collection].title}`;renderColumnSettingsDraft();document.getElementById('columnSettingsDialog').showModal();refreshIcons();}
function renderColumnSettingsDraft(){const list=document.getElementById('columnSettingsList'),schema=CONFIG.schemas[UI.columnCollection];if(!list||!schema)return;list.innerHTML=UI.columnDraft.map((item,index)=>`<div class="column-option-row ${item.key===ACTION_COLUMN_KEY?'column-option-row--actions':''}"><label class="column-option-row__main"><input type="checkbox" data-column-visible="${index}" ${item.visible?'checked':''} class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"><span class="column-option-row__copy"><span class="column-option-row__label">${esc(fieldLabel(schema,item.key))}</span><span class="column-option-row__code">${esc(item.key===ACTION_COLUMN_KEY?'Cột thao tác':item.key)}</span></span></label><div class="column-option-row__actions"><button type="button" data-column-up="${index}" ${index===0?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa ${esc(fieldLabel(schema,item.key))} lên">${icon('chevron-up','size-4')}</button><button type="button" data-column-down="${index}" ${index===UI.columnDraft.length-1?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa ${esc(fieldLabel(schema,item.key))} xuống">${icon('chevron-down','size-4')}</button></div></div>`).join('');list.querySelectorAll('[data-column-visible]').forEach(input=>input.addEventListener('change',()=>{UI.columnDraft[Number(input.dataset.columnVisible)].visible=input.checked;}));list.querySelectorAll('[data-column-up]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnUp),-1)));list.querySelectorAll('[data-column-down]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnDown),1)));refreshIcons();}
function moveColumnDraft(index,delta){const next=index+delta;if(next<0||next>=UI.columnDraft.length)return;[UI.columnDraft[index],UI.columnDraft[next]]=[UI.columnDraft[next],UI.columnDraft[index]];renderColumnSettingsDraft();}
function resetColumnSettings(){const defaults=[...CONFIG.schemas[UI.columnCollection].columns,ACTION_COLUMN_KEY],all=allColumnKeys(UI.columnCollection);UI.columnDraft=[...defaults,...all.filter(key=>!defaults.includes(key))].map(key=>({key,visible:defaults.includes(key)}));renderColumnSettingsDraft();}
function saveColumnSettings(event){event.preventDefault();const selected=UI.columnDraft.filter(item=>item.visible).map(item=>item.key);if(!selected.some(key=>key!==ACTION_COLUMN_KEY)){toast('Cần chọn ít nhất một cột dữ liệu để làm tiêu đề bản ghi.','error');return;}const pref=getCurrentPreference(),columns={...(pref?.columns||{}),[UI.columnCollection]:{order:UI.columnDraft.map(item=>item.key),visible:selected}};updateCurrentPreference({columns});document.getElementById('columnSettingsDialog').close();renderPage();toast('Đã lưu thứ tự và cột hiển thị, bao gồm cột Tác vụ.','success');}
function sortableFields(collection){
  const schema=CONFIG.schemas[collection];if(!schema)return [];
  return (schema.fields||[]).filter(field=>!field?.[3]?.editorHidden||field?.[3]?.sortable===true).map(field=>({key:field[0],label:field[1],type:field[2]}));
}
function currentListSort(collection){const saved=getCurrentPreference()?.sorts?.[collection];if(saved&&sortableFields(collection).some(field=>field.key===saved.field))return {field:saved.field,direction:saved.direction==='desc'?'desc':'asc'};return null;}
function applyListSort(collection,rows){const sort=currentListSort(collection);if(!sort)return rows;const schema=CONFIG.schemas[collection],type=fieldType(schema,sort.field),factor=sort.direction==='desc'?-1:1;return [...rows].sort((a,b)=>{
  const av=a?.[sort.field],bv=b?.[sort.field];let cmp=0;
  if(['number','currency','rating'].includes(type))cmp=Number(av||0)-Number(bv||0);
  else if(type==='date')cmp=String(normalizeDateOnly(av)||'9999-12-31').localeCompare(String(normalizeDateOnly(bv)||'9999-12-31'));
  else if(type==='time')cmp=String(normalizeTime24(av)||'99:99').localeCompare(String(normalizeTime24(bv)||'99:99'));
  else cmp=String(av??'').localeCompare(String(bv??''),'vi',{numeric:true,sensitivity:'base'});
  return cmp*factor;
});}
function openSortDialog(){const collection=UI.tab,schema=CONFIG.schemas[collection];if(!schema)return;UI.sortCollection=collection;const fields=sortableFields(collection),current=currentListSort(collection)||{field:fields[0]?.key||'',direction:'asc'};document.getElementById('sortDialogTitle').textContent=`Sắp xếp · ${schema.title}`;document.getElementById('sortField').innerHTML=fields.map(field=>`<option value="${esc(field.key)}" ${field.key===current.field?'selected':''}>${esc(field.label)}</option>`).join('');document.getElementById('sortDirectionAsc').checked=current.direction!=='desc';document.getElementById('sortDirectionDesc').checked=current.direction==='desc';const dialog=document.getElementById('sortDialog');if(!dialog.open)dialog.showModal();refreshIcons();}
function saveListSort(event){event.preventDefault();const collection=UI.sortCollection;if(!collection)return;const field=document.getElementById('sortField').value,direction=document.querySelector('input[name="sortDirection"]:checked')?.value||'asc';if(!sortableFields(collection).some(item=>item.key===field))return;updateCurrentPreference({sorts:{[collection]:{field,direction}}});document.getElementById('sortDialog').close();UI.visibleCount=CONFIG.pageSize;renderPage();toast('Đã lưu cách sắp xếp danh sách.','success');}
function resetListSort(){const collection=UI.sortCollection;if(!collection)return;updateCurrentPreference({sorts:{[collection]:null}});document.getElementById('sortDialog').close();UI.visibleCount=CONFIG.pageSize;renderPage();toast('Đã trả sắp xếp về mặc định.','success');}
function eventGroupSupported(collection){return ['checklist','timeline','budget','guests','vendors'].includes(collection);}
function isGroupByEvent(collection){return Boolean(UI.groupByEvent?.[collection]);}
function toggleEventGroup(){const collection=UI.tab;if(!eventGroupSupported(collection))return;UI.groupByEvent={...(UI.groupByEvent||{}),[collection]:!isGroupByEvent(collection)};UI.visibleCount=CONFIG.pageSize;renderPage();}

function filteredRows(collection){
  const schema=CONFIG.schemas[collection]; let rows=[...collectionRows(collection)]; const query=UI.search.trim().toLowerCase();
  if(query) rows=rows.filter(row=>schema.search.some(key=>String(Array.isArray(row[key])?row[key].join(' '):(row[key]??'')).toLowerCase().includes(query)));
  if(UI.filter!=='Tất cả'&&schema.statusField) rows=rows.filter(row=>row[schema.statusField]===UI.filter);
  if(UI.secondaryFilter){ const f=UI.secondaryFilter; if(f.type==='metric') rows=rows.filter(row=>Number(row[f.value]||0)>0); else rows=rows.filter(row=>row[f.field]===f.value); }
  Object.entries(UI.advancedFilters||{}).forEach(([field,selected])=>{ if(!Array.isArray(selected)||!selected.length)return; rows=rows.filter(row=>{ const current=Array.isArray(row[field])?row[field].map(String):[String(row[field]??'')]; return selected.some(value=>current.includes(String(value))); }); });
  Object.entries(UI.dateFilters||{}).forEach(([field,range])=>{ if(!range||(!range.from&&!range.to))return; rows=rows.filter(row=>{ const current=String(row[field]||'').slice(0,10); if(!current)return false; if(range.from&&current<range.from)return false; if(range.to&&current>range.to)return false; return true; }); });
  if(collection==='guests'&&isGroupByEvent(collection))rows=rows.filter(row=>String(row.rsvp||'')==='Đồng ý');
  const customSort=currentListSort(collection);
  if(customSort)rows=applyListSort(collection,rows);
  else if(collection==='timeline')rows.sort((a,b)=>{const ad=String(a.eventDate||'9999-12-31'),bd=String(b.eventDate||'9999-12-31');if(ad!==bd)return ad.localeCompare(bd);return String(a.startTime||'').localeCompare(String(b.startTime||''));});
  return rows;
}

function eventGroupKey(collection,row){return String(row.anchor_event_id||'');}
function eventGroupLabel(collection,row){
  const id=eventGroupKey(collection,row);if(id)return resolveLookupLabel(id,'Chưa gán sự kiện');
  const legacy=collection==='guests'?row.events:row.anchorEvent;return String(legacy||'Chưa gán sự kiện');
}
function eventGroupOrder(id,label){const item=(DATA.lookup_items||[]).find(entry=>String(entry.id)===String(id));return item?Number(item.sort_order||0):Number.MAX_SAFE_INTEGER;}
function renderEventGrouped(collection,schema,filtered,visibleColumns){
  const groups=new Map();filtered.forEach(row=>{const id=eventGroupKey(collection,row),label=eventGroupLabel(collection,row),key=id||`legacy:${label}`;if(!groups.has(key))groups.set(key,{id,label,rows:[]});groups.get(key).rows.push(row);});
  if(!groups.size)return emptyState('Không tìm thấy dữ liệu','Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.','search-x',true);
  const ordered=[...groups.values()].sort((a,b)=>eventGroupOrder(a.id,a.label)-eventGroupOrder(b.id,b.label)||String(a.label).localeCompare(String(b.label),'vi'));
  return `<div class="timeline-group-list">${ordered.map(group=>{const partyTotal=collection==='guests'?group.rows.reduce((sum,row)=>sum+Math.max(1,Number(row.partySize||1)),0):0;const subtitle=collection==='guests'?`${group.rows.length} khách · ${partyTotal} người tham dự`:`${group.rows.length} bản ghi · hiển thị toàn bộ dữ liệu của nhóm`;return `<section class="timeline-group"><div class="timeline-group__header"><div class="min-w-0"><p class="truncate text-sm font-bold">${esc(group.label)}</p><p class="mt-0.5 text-[10px] text-slate-400">${esc(subtitle)}</p></div><span class="timeline-group__count">${group.rows.length}</span></div><div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(schema,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(schema,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${group.rows.map(row=>renderTableRow(collection,schema,row,visibleColumns)).join('')}</tbody></table></div><div class="grid gap-3 p-3 md:hidden">${group.rows.map(row=>renderMobileCard(collection,schema,row,visibleColumns)).join('')}</div></section>`;}).join('')}</div>`;
}
function renderCollection(collection){
  recomputeDerivedFinancials();
  const schema=CONFIG.schemas[collection],visibleColumns=getVisibleColumns(collection),all=collectionRows(collection),filtered=filteredRows(collection),grouped=eventGroupSupported(collection)&&isGroupByEvent(collection),rows=grouped?filtered:filtered.slice(0,UI.visibleCount),hasMore=!grouped&&rows.length<filtered.length,filterCount=activeCollectionFilterCount();
  const toolbarButtonClass='collection-toolbar-button',currentSort=currentListSort(collection);
  const sortButton=`<button id="openSortDialogButton" type="button" aria-label="Sắp xếp danh sách" title="Sắp xếp danh sách" class="${toolbarButtonClass} ${currentSort?'collection-toolbar-button--active':''}">${icon('arrow-up-down','size-4')}<span>${currentSort?`Sắp xếp: ${esc(fieldLabel(schema,currentSort.field))}`:'Sắp xếp'}</span></button>`;
  const groupButton=eventGroupSupported(collection)?`<button id="groupByEventButton" type="button" class="${toolbarButtonClass} ${grouped?'collection-toolbar-button--active':''}" title="Gộp theo Sự kiện liên quan">${icon('layers-3','size-4')}<span>${grouped?'Bỏ gộp':'Gộp theo sự kiện'}</span></button>`:'';
  const addDisabled=UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra phiên bản dữ liệu mới nhất"':'';
  const content=grouped?renderEventGrouped(collection,schema,filtered,visibleColumns):(rows.length?`<div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(schema,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(schema,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${rows.map(row=>renderTableRow(collection,schema,row,visibleColumns)).join('')}</tbody></table></div><div class="grid gap-3 p-3 md:hidden">${rows.map(row=>renderMobileCard(collection,schema,row,visibleColumns)).join('')}</div>`:emptyState('Không tìm thấy dữ liệu',hasActiveAdvancedFilters()?'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.':`Thêm ${schema.singular} đầu tiên để bắt đầu quản lý.`,'search-x',true));
  return `${collectionWidgets(collection)}<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="collection-panel-toolbar border-b border-slate-200 dark:border-slate-800"><div class="collection-panel-toolbar__heading"><h3>${schema.title}</h3><p>${plural(all.length,'bản ghi')} · ${plural(filtered.length,'kết quả phù hợp')}</p></div><div class="collection-panel-toolbar__actions"><button id="openFilterDialogButton" type="button" aria-label="Tìm kiếm và bộ lọc" title="Tìm kiếm và bộ lọc" class="${toolbarButtonClass} ${filterCount?'collection-toolbar-button--active':''}">${icon('search','size-4')}<span>Tìm kiếm & bộ lọc</span>${filterCount?`<span class="rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] text-white">${filterCount}</span>`:''}</button>${filterCount?`<button id="clearCollectionFiltersButton" type="button" aria-label="Xóa bộ lọc" title="Xóa bộ lọc" class="${toolbarButtonClass} collection-toolbar-button--muted">${icon('filter-x','size-4')}<span>Xóa lọc</span></button>`:''}${sortButton}${groupButton}<button id="customizeColumnsButton" type="button" aria-label="Cột hiển thị" title="Cột hiển thị" class="${toolbarButtonClass}">${icon('columns-3','size-4')}<span>Cột hiển thị</span></button><button id="addRecordButton" type="button" aria-label="Thêm ${esc(schema.singular)}" title="Thêm ${esc(schema.singular)}" ${addDisabled} class="collection-toolbar-add">${icon('plus','size-4')}<span>Thêm ${schema.singular}</span></button></div></div>${filterCount?`<div class="filter-active-strip"><span class="mr-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Đang lọc</span>${renderFilterChips(collection)}</div>`:''}${content}<div class="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p class="text-xs text-slate-500 dark:text-slate-400">${grouped?'Đang hiển thị toàn bộ':'Đang hiển thị'} <span class="font-semibold text-slate-700 dark:text-slate-200">${rows.length}</span> trong ${filtered.length} bản ghi</p>${hasMore?`<button id="loadMoreButton" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevrons-down','size-3.5')}Xem thêm 20 bản ghi</button>`:`<span class="text-xs font-semibold text-slate-400">Đã hiển thị toàn bộ</span>`}</div></section>`;
}


function mutationActionDisabled(){return UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra dữ liệu mới nhất"':'';}
function timelineCompletionControl(row,mobile=false){
  const checked=String(row.status||'')==='Hoàn thành';
  return `<label class="timeline-complete-toggle ${mobile?'timeline-complete-toggle--mobile':''}" title="${checked?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}"><input type="checkbox" data-timeline-complete="${esc(row.id)}" ${checked?'checked':''} aria-label="${checked?'Bỏ hoàn thành':'Hoàn thành'} ${esc(row.event||'mốc lịch trình')}"/><span>${icon(checked?'circle-check-big':'circle','size-4')}</span></label>`;
}
function toggleTimelineCompletion(id,checked){
  if(!ensureMutationReady())return;const row=(DATA.timeline||[]).find(item=>String(item.id)===String(id));if(!row)return;const before=structuredClone(row);
  if(checked){if(String(row.status||'')!=='Hoàn thành')row.previousStatus=String(row.status||'Chưa bắt đầu')||'Chưa bắt đầu';row.status='Hoàn thành';}
  else {row.status=String(row.previousStatus||'Chưa bắt đầu')||'Chưa bắt đầu';row.previousStatus='';}
  row.updatedAt=new Date().toISOString();queueUpsert('timeline',row,before);saveData();renderPage();toast(checked?'Đã đánh dấu Timeline hoàn thành.':`Đã khôi phục trạng thái “${row.status}”.`,'success');
}
function vendorPaymentAllowed(status){return ['Đã chọn','Đã cọc','Hoàn tất'].includes(String(status||''));}
function vendorHasPaymentData(record){return Number(record?.contractValue||0)>0||Number(record?.deposit||0)>0||Number(record?.paid||0)>0||String(record?.paymentTerms||'').trim()!=='';}
function showVendorPaymentGate(){const dialog=document.getElementById('vendorPaymentGateDialog');if(dialog&&!dialog.open)dialog.showModal();refreshIcons();}
function updateVendorPaymentGate(root=document){
  if(UI.editing?.collection!=='vendors')return;const status=root.querySelector?.('#field-status')?.value||'';const allowed=vendorPaymentAllowed(status),section=root.querySelector?.('[data-editor-section="contract"]');if(!section)return;
  section.classList.toggle('editor-section--locked',!allowed);section.setAttribute('aria-disabled',String(!allowed));
  section.querySelectorAll('input,select,textarea').forEach(input=>{if(input.id==='field-payable')return;input.disabled=!allowed;});
  let overlay=section.querySelector('.editor-section-lock-note');
  if(!allowed&&!overlay){overlay=document.createElement('button');overlay.type='button';overlay.className='editor-section-lock-note';overlay.innerHTML=`${icon('lock-keyhole','size-4')}<span>Chỉ mở khi trạng thái là Đã chọn, Đã cọc hoặc Hoàn tất</span>`;overlay.addEventListener('click',showVendorPaymentGate);section.appendChild(overlay);} else if(allowed&&overlay)overlay.remove();
}
function bindDatePickerUX(root=document){root.querySelectorAll?.('input[type="date"]').forEach(input=>{if(input.dataset.datePickerBound)return;input.dataset.datePickerBound='1';const open=()=>{try{if(typeof input.showPicker==='function'&&!input.disabled&&!input.readOnly)input.showPicker();}catch(_){}};input.addEventListener('click',open);input.addEventListener('focus',open);});}
function actionButtons(collection,row,mobile=false){ const cls=mobile?'inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 text-[10px] font-semibold dark:border-slate-700 disabled:cursor-not-allowed disabled:opacity-40':'grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-35'; const locked=mutationActionDisabled(),schema=CONFIG.schemas[collection],reportButton=(schema?.reportFields||[]).length?`<button type="button" data-report="${esc(row.id)}" ${locked} class="${cls}" aria-label="Báo cáo">${icon('clipboard-pen-line','size-4')}${mobile?'Báo cáo':''}</button>`:'';return `${reportButton}<button type="button" data-detail="${esc(row.id)}" class="${cls}" aria-label="Xem chi tiết">${icon('eye','size-4')}${mobile?'Chi tiết':''}</button><button type="button" data-edit="${esc(row.id)}" ${locked} class="${cls}" aria-label="Chỉnh sửa">${icon('pencil','size-4')}${mobile?'Sửa':''}</button><button type="button" data-delete="${esc(row.id)}" ${locked} class="${cls} ${mobile?'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300':'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'}" aria-label="Xóa">${icon('trash-2','size-4')}${mobile?'Xóa':''}</button>`; }
function titleDisplayValue(schema,key,value){return fieldType(schema,key)==='url'?esc(value||'—'):displayValue(schema,key,value);}
function renderTableRow(collection,schema,row,columns=getVisibleColumns(collection)){const titleKey=primaryTitleKey(schema,columns);return `<tr class="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/45">${columns.map(key=>{if(key===ACTION_COLUMN_KEY)return `<td class="${dataColumnClass(schema,key)} px-4 py-3 align-middle"><div class="flex items-center justify-end gap-1">${actionButtons(collection,row)}</div></td>`;const isTitle=key===titleKey,content=isTitle?titleDisplayValue(schema,key,row[key]):displayValue(schema,key,row[key]);return `<td class="${dataColumnClass(schema,key)} px-5 py-4 align-top ${isTitle?'font-semibold text-slate-900 dark:text-white':'text-slate-600 dark:text-slate-300'}"><div class="data-cell-content">${isTitle?`<div class="record-title-with-check">${collection==='timeline'?timelineCompletionControl(row):''}<button type="button" data-detail="${esc(row.id)}" class="record-title-button" aria-label="Xem chi tiết ${esc(schema.singular)}">${content}</button></div>`:content}</div></td>`;}).join('')}</tr>`;}
function renderMobileCard(collection,schema,row,columns=getVisibleColumns(collection)){
  const dataColumns=columns.filter(key=>key!==ACTION_COLUMN_KEY),titleKey=primaryTitleKey(schema,dataColumns),secondary=dataColumns.filter(key=>key!==titleKey),showActions=columns.includes(ACTION_COLUMN_KEY),lastIndex=secondary.length-1;
  const secondaryHtml=secondary.map((key,index)=>{const full=secondary.length%2===1&&index===lastIndex;return `<div class="mobile-card-field ${full?'mobile-card-field--full':''}"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(fieldLabel(schema,key))}</dt><dd class="mobile-card-value mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">${displayValue(schema,key,row[key])}</dd></div>`;}).join('');
  return `<article class="mobile-data-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[.99] dark:border-slate-800 dark:bg-slate-900"><div class="flex items-start gap-3">${collection==='timeline'?timelineCompletionControl(row,true):''}<div class="min-w-0 flex-1"><button type="button" data-detail="${esc(row.id)}" class="record-title-button text-sm font-bold leading-6">${titleDisplayValue(schema,titleKey,row[titleKey])}</button></div></div>${secondaryHtml?`<dl class="mobile-card-grid">${secondaryHtml}</dl>`:''}${showActions?`<div class="mobile-card-actions">${actionButtons(collection,row,true)}</div>`:''}</article>`;
}
function emptyState(title,description,emptyIcon='inbox',withAction=false){ return `<div class="px-5 py-16 text-center"><div class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon(emptyIcon,'size-6')}</div><h4 class="mt-4 font-bold">${title}</h4><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">${description}</p>${withAction?`<button type="button" id="clearFiltersButton" class="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('rotate-ccw','size-4')}Đặt lại bộ lọc</button>`:''}</div>`; }
function emptyStateInline(title,description){ return `<div class="px-6 py-12 text-center"><div class="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon('inbox','size-5')}</div><p class="mt-3 font-semibold">${title}</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${description}</p></div>`; }

function renderSyncSettingsCard(settings,endpoint,connectionScope,hasSchemaPassword){
  const migrationReport=FEATURE_FLAGS.legacyV10Migration?parseStoredJson(storage.get(CONFIG.migrationReportKey,''),null):null,migrationIssues=Number(migrationReport?.unresolvedCount||0),migrationState=migrationReport?(migrationIssues?`Cần kiểm tra ${migrationIssues} tham chiếu`:'Đã hoàn tất'):'Đang khóa';
  const common=`${healthRow('Thay đổi đang chờ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Xung đột cần xử lý',`${UI.conflicts.length} thay đổi`,UI.conflicts.length?'amber':'emerald')}${healthRow('Lần đồng bộ gần nhất',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa có',UI.lastSyncAt?'blue':'slate')}${healthRow('Đồng bộ tự động',autoSyncStatusLabel(),UI.syncMode==='automatic'?'amber':activeServerToken(false)?'emerald':'slate')}<button id="settingsSyncNowButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-500/10">${icon('refresh-cw','size-4')}Đồng bộ ngay</button>`;
  const adminArea=isAdministrator()?`${healthRow('Khởi tạo dữ liệu',endpoint?(needsInitialFullSync(endpoint)?'Chưa đồng bộ toàn bộ':'Đã hoàn tất'):'Chưa kết nối',endpoint&&!needsInitialFullSync(endpoint)?'emerald':'amber')}${healthRow('Cấu trúc Google Sheets',remoteSchemaStatus(endpoint),endpoint&&!needsSchemaSync(endpoint)?'emerald':'amber')}${FEATURE_FLAGS.legacyV10Migration?healthRow('Migration V10',migrationState,migrationReport?(migrationIssues?'amber':'emerald'):'slate'):''}<div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div class="flex items-start gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">${icon('link-2','size-4')}</span><div class="min-w-0 flex-1"><p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Google Sheets Apps Script URL</p><p class="mt-1 truncate text-xs font-medium" title="${esc(endpoint)}">${endpoint?esc(endpoint):'Chưa cấu hình'}</p><p class="mt-1 text-[10px] text-slate-400">Mật khẩu kết nối: ${connectionScope==='bootstrap-only'?'Chỉ dùng khi khởi tạo':'Không sử dụng'} · Schema: ${hasSchemaPassword?'Mật khẩu riêng':'Theo phiên quản trị'}</p></div></div><button id="openConnectionDialog" type="button" class="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-brand-700 dark:bg-white dark:text-slate-950 dark:hover:bg-brand-300">${icon('key-round','size-3.5')}Cập nhật kết nối</button></div><button id="schemaSyncButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center gap-3 rounded-2xl border border-indigo-200 px-4 py-3 text-left text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10">${icon('table-properties','size-4')}Cập nhật cấu trúc Google Sheets</button>${FEATURE_FLAGS.legacyV10Migration&&migrationReport?`<button id="openMigrationReportButton" type="button" class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('clipboard-list','size-4')}Xem báo cáo Migration V10</button>`:''}<button id="fullSyncButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center gap-3 rounded-2xl border border-brand-200 px-4 py-3 text-left text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-900 dark:text-brand-300 dark:hover:bg-brand-500/10">${icon('cloud-upload','size-4')}Đồng bộ toàn bộ dữ liệu hiện có</button><button id="exportButton" type="button" class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('download','size-4 text-slate-500')}Xuất dữ liệu JSON</button><button id="resetButton" type="button" class="flex w-full items-center gap-3 rounded-2xl border border-rose-200 px-4 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">${icon('rotate-ccw','size-4')}Đặt lại dữ liệu cục bộ</button>`:`<div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-500/10"><div class="flex gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">${icon('lock-keyhole','size-4')}</span><div><p class="text-sm font-bold">Quản trị kết nối</p><p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Cấu hình Apps Script, cập nhật cấu trúc và đồng bộ toàn bộ chỉ dành cho quản trị viên.</p><button type="button" data-settings-admin-unlock="1" class="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-amber-300 px-3 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:text-amber-200">${icon('key-round','size-3.5')}Mở quyền quản trị</button></div></div></div>`;
  return `<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Đồng bộ dữ liệu','Đồng bộ thường dùng cho mọi tài khoản; quản trị cấu trúc được bảo vệ','database')}<div class="space-y-3 px-5 pb-6 sm:px-6">${common}${adminArea}</div></section>`;
}

function renderSettings(){
  const savedSettings=getSettings(),settings={...savedSettings,...(UI.settingsDraft||{})};settings.totalBudget=Number(settings.reserveBudget||0)+Number(settings.operatingBudget||0);const accent=getCurrentPreference()?.accent||settings.accentTheme||'pink',endpoint=String(settings.googleSheetsEndpoint||storage.get(CONFIG.endpointKey,'')).trim(),connectionScope=AUTH.remoteStatus?.connectionPasswordScope||'bootstrap-only',hasSchemaPassword=Boolean(connectionSecrets.get(CONFIG.schemaPasswordKey,''));
  return `<div class="space-y-5"><div class="grid gap-5 xl:grid-cols-3"><section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">${panelHeader('Thông tin kế hoạch','Các ngày chính, ngân sách và quy mô khách mời','settings-2')}<form id="settingsForm" class="grid gap-5 px-5 pb-6 sm:grid-cols-2 sm:px-6">${settingInput('brideName','Tên cô dâu',settings.brideName,'text','Nhập tên cô dâu')}${settingInput('groomName','Tên chú rể',settings.groomName,'text','Nhập tên chú rể')}${settingInput('registrationDate','Ngày đăng ký kết hôn',settings.registrationDate,'date')}${settingInput('engagementDate','Ngày lễ ăn hỏi',settings.engagementDate,'date')}${settingInput('pickupDate','Ngày rước dâu',settings.pickupDate,'date')}${settingInput('groomPartyDate','Ngày tiệc nhà trai',settings.groomPartyDate,'date')}${settingInput('bridePartyDate','Ngày tiệc nhà gái',settings.bridePartyDate,'date')}${settingInput('totalBudget','Ngân sách tổng',settings.totalBudget,'number','',true)}${settingInput('reserveBudget','Quỹ dự phòng',settings.reserveBudget,'number')}${settingInput('operatingBudget','Ngân sách vận hành',settings.operatingBudget,'number')}${settingInput('groomGuests','Khách dự kiến nhà trai',settings.groomGuests,'number')}${settingInput('brideGuests','Khách dự kiến nhà gái',settings.brideGuests,'number')}<div class="sm:col-span-2">${settingInput('style','Phong cách',settings.style,'text','Sang trọng – tối giản – lãng mạn')}</div><div class="sm:col-span-2">${settingTextarea('dashboardDescription','Nội dung giới thiệu tại Tổng quan',settings.dashboardDescription,'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.')}</div><div class="sm:col-span-2 flex justify-end"><button type="submit" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500">${icon('save','size-4')}Lưu thiết lập</button></div></form></section><div class="space-y-5"><section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="flex items-center justify-between gap-3 px-4 py-4"><div><h3 class="text-sm font-bold tracking-tight">Màu giao diện</h3><p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Lựa chọn màu chủ đạo</p></div><span class="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">${icon('palette','size-4')}</span></div><div class="settings-appearance-grid grid grid-cols-3 gap-2 px-4 pb-3">${Object.entries(ACCENT_THEMES).map(([key,theme])=>`<button type="button" data-accent="${key}" class="appearance-choice ${accent===key?'is-active':''}"><span class="size-4 shrink-0 rounded-full" style="background:${theme.swatch}"></span><span class="truncate leading-none">${theme.label}</span></button>`).join('')}</div><div class="mx-4 mt-1 pb-4 pt-2"><button id="settingsThemeButton" type="button" class="settings-theme-toggle flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800"><span class="flex items-center gap-3"><span class="grid size-8 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">${icon(isDark()?'moon-star':'sun','size-3.5')}</span><span class="leading-none"><span class="block text-xs font-semibold leading-4">Dark mode</span><span class="block text-[10px] leading-4 text-slate-500 dark:text-slate-400">${isDark()?'Đang bật':'Đang tắt'}</span></span></span><span class="relative h-5 w-9 rounded-full transition ${isDark()?'bg-brand-600':'bg-slate-300 dark:bg-slate-700'}"><span class="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${isDark()?'left-[18px]':'left-0.5'}"></span></span></button></div></section>${renderSyncSettingsCard(settings,endpoint,connectionScope,hasSchemaPassword)}</div></div>
  ${renderAccountManagement()}
  <section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Danh mục dùng chung','Kéo tay nắm hoặc dùng nút lên/xuống để sắp xếp lựa chọn','list-plus')}<div class="grid gap-4 px-5 pb-6 sm:grid-cols-2 xl:grid-cols-3 sm:px-6">${Object.entries(CONFIG.lookupLabels).filter(([key])=>!['checklistPhases','checklistMilestones'].includes(key)).map(([key,label])=>lookupManager(key,label)).join('')}</div></section>
  <section class="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-500/10"><div class="flex gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">${icon('info','size-4')}</span><div><p class="text-sm font-bold text-blue-900 dark:text-blue-100">Google Sheets là nguồn lưu trữ chính</p><p class="mt-1 text-xs leading-5 text-blue-800/75 dark:text-blue-200/70">Thông tin kế hoạch, giao diện, danh mục và đồng bộ dữ liệu thông thường có thể được sử dụng bởi tài khoản đã đăng nhập. Chỉ quản trị kết nối/schema, đồng bộ toàn bộ và quản lý tài khoản yêu cầu quyền quản trị.</p></div></div></section></div>`;
}

function settingInput(key,label,value,type='text',placeholder='',readOnly=false){
  const numeric=type==='number';
  return `<label class="block"><span class="mb-2 block text-sm font-semibold">${label}</span><input name="${key}" type="${numeric?'text':type}" ${numeric?'inputmode="numeric" data-number-input="1" autocomplete="off"':type==='date'?'lang="vi-VN"':''} ${readOnly?'readonly aria-readonly="true" tabindex="-1"':''} value="${esc(numeric?formatNumberInputValue(value):type==='date'?normalizeDateOnly(value):value??'')}" placeholder="${esc(placeholder)}" class="h-11 w-full rounded-xl border border-slate-200 ${readOnly?'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300':'bg-white dark:bg-slate-950'} px-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:hover:border-slate-600" /></label>`;
}
function settingTextarea(key,label,value,placeholder=''){
  return `<label class="block"><span class="mb-2 block text-sm font-semibold">${esc(label)}</span><textarea name="${esc(key)}" rows="4" maxlength="320" required placeholder="${esc(placeholder)}" class="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600">${esc(value??'')}</textarea><span class="mt-1 block text-[10px] text-slate-400">Tối đa 320 ký tự; nội dung này hiển thị tại tab Tổng quan.</span></label>`;
}

function lookupManager(key,label){
  const items=lookupItemsForKey(key,{activeOnly:false}),pageSize=CONFIG.lookupPageSize,totalPages=Math.max(1,Math.ceil(items.length/pageSize)),page=Math.min(Math.max(1,Number(UI.lookupPages[key]||1)),totalPages),start=(page-1)*pageSize,visible=items.slice(start,start+pageSize); UI.lookupPages[key]=page;
  return `<div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><div class="flex items-start justify-between gap-2"><div><p class="text-sm font-bold">${label}</p><p class="mt-1 text-[10px] text-slate-400">${items.filter(item=>item.active!==false).length} đang dùng · ${items.length} tổng</p></div><span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">${page}/${totalPages}</span></div><div class="mt-3 min-h-[12.25rem] space-y-2">${visible.map((item,index)=>{const actualIndex=start+index,refs=referenceCountForLookupItem(item);return `<div data-lookup-row="${key}" data-index="${actualIndex}" class="lookup-sort-row flex items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2 ${item.active===false?'opacity-55':''} dark:bg-slate-950/60"><button type="button" draggable="true" data-lookup-drag="${key}" data-index="${actualIndex}" class="lookup-drag-handle grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800 dark:hover:text-slate-200" title="Kéo để sắp xếp" aria-label="Kéo để sắp xếp ${esc(item.value)}">${icon('grip-vertical','size-3.5')}</button><span class="min-w-0 flex-1"><span class="block truncate text-xs font-medium" title="${esc(item.value)}">${esc(item.value)}</span><span class="lookup-reference-count mt-0.5 block text-[9px] text-slate-400">${item.active===false?'Ngưng sử dụng':`${refs} tham chiếu`}</span></span><span class="lookup-order-actions inline-flex shrink-0 items-center gap-0.5"><button type="button" data-lookup-move="${key}" data-index="${actualIndex}" data-direction="-1" ${actualIndex<=0?'disabled':''} class="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25 dark:hover:bg-slate-800 dark:hover:text-slate-200" title="Đưa lên" aria-label="Đưa ${esc(item.value)} lên">${icon('chevron-up','size-3.5')}</button><button type="button" data-lookup-move="${key}" data-index="${actualIndex}" data-direction="1" ${actualIndex>=items.length-1?'disabled':''} class="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25 dark:hover:bg-slate-800 dark:hover:text-slate-200" title="Đưa xuống" aria-label="Đưa ${esc(item.value)} xuống">${icon('chevron-down','size-3.5')}</button></span><button type="button" data-lookup-edit="${key}" data-index="${actualIndex}" class="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-brand-700 dark:hover:bg-slate-800" title="Chỉnh sửa">${icon('pencil','size-3.5')}</button>${item.active===false?`<button type="button" data-lookup-toggle="${key}" data-index="${actualIndex}" class="grid size-7 shrink-0 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" title="Kích hoạt lại">${icon('rotate-ccw','size-3.5')}</button>${refs?'':`<button type="button" data-lookup-delete="${key}" data-index="${actualIndex}" class="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10" title="Xóa vĩnh viễn">${icon('x','size-3.5')}</button>`}`:`<button type="button" data-lookup-delete="${key}" data-index="${actualIndex}" class="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10" title="${refs?'Ngưng sử dụng':'Xóa'}">${icon(refs?'circle-off':'x','size-3.5')}</button>`}</div>`;}).join('')||'<div class="grid min-h-[10rem] place-items-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-800">Chưa có lựa chọn</div>'}</div><div class="mt-3 flex items-center justify-between gap-2"><button type="button" data-lookup-page="${key}" data-page="${page-1}" ${page<=1?'disabled':''} class="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevron-left','size-3.5')}</button><span class="text-[10px] font-medium text-slate-400">${items.length?`${start+1}–${Math.min(start+pageSize,items.length)} / ${items.length}`:'0 / 0'}</span><button type="button" data-lookup-page="${key}" data-page="${page+1}" ${page>=totalPages?'disabled':''} class="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevron-right','size-3.5')}</button></div><div class="mt-3 flex gap-2"><input data-lookup-input="${key}" placeholder="Thêm lựa chọn" class="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"/><button type="button" data-lookup-add="${key}" class="grid size-9 place-items-center rounded-xl bg-brand-700 text-white hover:bg-brand-800">${icon('plus','size-4')}</button></div></div>`;
}

function getFieldOptions(options){
  if(Array.isArray(options)) return options;
  if(Array.isArray(options?.values)) return options.values;
  if(options?.lookup) return DATA.lookups?.[options.lookup]||[];
  if(options?.dynamic==='budgetCategories') return (DATA.budget||[]).map(row=>row.category).filter(Boolean);
  if(options?.dynamic==='vendors') return (DATA.vendors||[]).filter(row=>row.name).map(row=>row.name);
  return [];
}

function detectReferenceSourceFromUrl(value){
  const raw=String(value||'').trim();if(!raw)return '';
  try{
    const normalized=/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)?raw:`https://${raw}`;
    const host=new URL(normalized).hostname.toLowerCase().replace(/^www\./,'');
    if(!host)return '';
    if(host==='facebook.com'||host.endsWith('.facebook.com')||host==='fb.com'||host.endsWith('.fb.com'))return 'Facebook';
    if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'Instagram';
    if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return 'TikTok';
    if(host==='youtube.com'||host.endsWith('.youtube.com')||host==='youtu.be')return 'YouTube';
    if(host==='zalo.me'||host.endsWith('.zalo.me')||host==='zaloapp.com'||host.endsWith('.zaloapp.com'))return 'Zalo';
    return 'Website';
  }catch(_){return '';}
}
function bindReferenceSourceDetection(root,collection){
  if(collection!=='references'||!root)return;
  const urlInput=root.querySelector('#field-sourceUrl'),sourceSelect=root.querySelector('#field-source');if(!urlInput||!sourceSelect)return;
  const apply=()=>{const detected=detectReferenceSourceFromUrl(urlInput.value);if(!detected)return;if([...sourceSelect.options].some(option=>option.value===detected))sourceSelect.value=detected;};
  urlInput.addEventListener('input',apply);urlInput.addEventListener('change',apply);urlInput.addEventListener('blur',apply);apply();
}
function attachmentContextForMode(mode){return mode==='report'?'report':'record';}
function recordAttachments(collection,recordId){return (DATA.attachments||[]).filter(item=>item.collection===collection&&item.recordId===recordId).sort((a,b)=>String(b.uploadedAt||'').localeCompare(String(a.uploadedAt||'')));}
function formatAttachmentSize(bytes){const value=Number(bytes||0);if(!value)return '0 KB';if(value<1024)return `${value} B`;if(value<1024*1024)return `${(value/1024).toFixed(value<10240?1:0)} KB`;return `${(value/(1024*1024)).toFixed(value<10*1024*1024?1:0)} MB`;}
function attachmentFileIcon(item){const mime=String(item?.mimeType||item?.file?.type||'').toLowerCase(),name=String(item?.fileName||item?.file?.name||'').toLowerCase();if(mime.startsWith('image/'))return 'image';if(mime.includes('pdf')||name.endsWith('.pdf'))return 'file-text';if(mime.includes('spreadsheet')||mime.includes('excel')||/\.(xlsx?|csv)$/.test(name))return 'sheet';if(mime.includes('presentation')||mime.includes('powerpoint')||/\.(pptx?)$/.test(name))return 'presentation';if(mime.includes('word')||/\.(docx?)$/.test(name))return 'file-type-2';if(name.endsWith('.zip'))return 'file-archive';return 'file';}
function attachmentContextLabel(context){return context==='report'?'Báo cáo':'Bản ghi';}
function attachmentExtension(name){const match=String(name||'').toLowerCase().match(/(\.[a-z0-9]{1,8})$/);return match?match[1]:'';}
function validateAttachmentFile(file){
  if(!file)return 'Tệp không hợp lệ.';
  if(Number(file.size||0)>CONFIG.attachmentMaxBytes)return `Tệp ${file.name} vượt giới hạn 10 MB.`;
  const blocked=new Set(['.exe','.bat','.cmd','.com','.msi','.scr','.ps1','.vbs','.sh','.js','.jar']);
  if(blocked.has(attachmentExtension(file.name)))return `Định dạng ${attachmentExtension(file.name)} không được phép tải lên.`;
  return '';
}
function pendingAttachmentRows(){return Array.isArray(UI.editing?.pendingFiles)?UI.editing.pendingFiles:[];}
function attachmentViewButton(item,compact=false){
  return `<button type="button" data-view-attachment="${esc(item.id)}" class="${compact?'attachment-action':'detail-attachment-link'}" aria-label="Xem ${esc(item.fileName)}">${compact?`${icon('external-link','size-3.5')}<span>Xem</span>`:`<span class="attachment-file-icon">${icon(attachmentFileIcon(item),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(item.fileName)}">${esc(item.fileName)}</span><span class="mt-0.5 block text-[10px] text-slate-400">${esc(formatAttachmentSize(item.sizeBytes))} · ${esc(attachmentContextLabel(item.context))}</span></span>${icon('external-link','size-4 shrink-0 text-slate-400')}`}</button>`;
}
function renderAttachmentEditorContent(collection,recordId,mode){
  const existing=recordAttachments(collection,recordId),pending=pendingAttachmentRows(),used=existing.length+pending.length,canAdd=Math.max(0,CONFIG.attachmentMaxFiles-used);
  const existingHtml=existing.map(item=>`<div class="attachment-row"><span class="attachment-file-icon">${icon(attachmentFileIcon(item),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(item.fileName)}">${esc(item.fileName)}</span><span class="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400"><span>${esc(formatAttachmentSize(item.sizeBytes))}</span><span>·</span><span>${esc(attachmentContextLabel(item.context))}</span></span></span>${attachmentViewButton(item,true)}<button type="button" data-delete-attachment="${esc(item.id)}" class="attachment-icon-action attachment-icon-action--danger" aria-label="Xóa ${esc(item.fileName)}">${icon('trash-2','size-3.5')}</button></div>`).join('');
  const pendingHtml=pending.map((entry,index)=>`<div class="attachment-row ${entry.status==='error'?'attachment-row--error':''}"><span class="attachment-file-icon">${icon(attachmentFileIcon(entry),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(entry.file.name)}">${esc(entry.file.name)}</span><span class="mt-0.5 block text-[10px] ${entry.status==='error'?'text-rose-600 dark:text-rose-300':'text-slate-400'}">${entry.status==='uploading'?'Đang tải lên Google Drive…':entry.status==='error'?esc(entry.error||'Tải lên thất bại'):esc(formatAttachmentSize(entry.file.size))+' · Chờ lưu'}</span></span>${entry.status==='uploading'?icon('loader-circle','size-4 animate-spin text-brand-600'):`<button type="button" data-remove-pending-attachment="${index}" class="attachment-icon-action" aria-label="Bỏ tệp">${icon('x','size-3.5')}</button>`}</div>`).join('');
  return `<div class="flex items-start justify-between gap-3"><div><p class="text-sm font-bold">Tệp đính kèm</p><p class="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Lưu trong Google Drive · tối đa ${CONFIG.attachmentMaxFiles} tệp/bản ghi · 10 MB/tệp.</p></div><span class="attachment-counter">${used}/${CONFIG.attachmentMaxFiles}</span></div>${existingHtml||pendingHtml?`<div class="mt-3 space-y-2">${existingHtml}${pendingHtml}</div>`:''}<label class="attachment-dropzone mt-3 ${canAdd?'':'attachment-dropzone--disabled'}"><input id="attachmentFileInput" type="file" multiple ${canAdd?'':'disabled'} class="sr-only" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip" /><span class="attachment-dropzone__icon">${icon('paperclip','size-5')}</span><span class="min-w-0"><span class="block text-xs font-semibold">${canAdd?'Chọn tệp để đính kèm':'Đã đạt giới hạn tệp'}</span><span class="mt-0.5 block text-[10px] text-slate-400">PDF, ảnh, Office, TXT, CSV hoặc ZIP</span></span></label>`;
}
function renderAttachmentEditorSection(collection,recordId,mode){
  return `<section id="attachmentEditorSection" class="attachment-editor-section">${renderAttachmentEditorContent(collection,recordId,mode)}</section>`;
}
function refreshAttachmentEditorSection(){
  const current=document.getElementById('attachmentEditorSection');if(!current||!UI.editing)return;
  const scroll=document.getElementById('editorFields'),scrollTop=scroll?.scrollTop||0;
  current.innerHTML=renderAttachmentEditorContent(UI.editing.collection,UI.editing.recordId,UI.editing.mode);
  if(scroll)requestAnimationFrame(()=>{scroll.scrollTop=Math.min(scrollTop,Math.max(0,scroll.scrollHeight-scroll.clientHeight));});
  bindAttachmentEditorControls();refreshIcons();
}

function bindAttachmentEditorControls(){
  const input=document.getElementById('attachmentFileInput');if(input)input.addEventListener('change',event=>{if(!UI.editing)return;const files=[...(event.target.files||[])],existing=recordAttachments(UI.editing.collection,UI.editing.recordId),pending=pendingAttachmentRows();let slots=Math.max(0,CONFIG.attachmentMaxFiles-existing.length-pending.length);for(const file of files){if(slots<=0){toast(`Mỗi bản ghi chỉ được tối đa ${CONFIG.attachmentMaxFiles} tệp.`,'error');break;}const error=validateAttachmentFile(file);if(error){toast(error,'error');continue;}if(pending.some(entry=>entry.file.name===file.name&&entry.file.size===file.size)){continue;}pending.push({file,status:'selected',error:''});slots--;}UI.editing.pendingFiles=pending;refreshAttachmentEditorSection();});
  document.querySelectorAll('[data-remove-pending-attachment]').forEach(button=>button.addEventListener('click',()=>{if(!UI.editing)return;UI.editing.pendingFiles.splice(Number(button.dataset.removePendingAttachment),1);refreshAttachmentEditorSection();}));
  document.querySelectorAll('[data-delete-attachment]').forEach(button=>button.addEventListener('click',()=>deleteStoredAttachment(button.dataset.deleteAttachment)));
  document.querySelectorAll('[data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment)));
}
function fileToBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error(`Không đọc được tệp ${file.name}.`));reader.onload=()=>{const value=String(reader.result||''),comma=value.indexOf(',');if(comma<0)return reject(new Error(`Không mã hóa được tệp ${file.name}.`));resolve(value.slice(comma+1));};reader.readAsDataURL(file);});}
async function uploadAttachmentFile(file,target){const base64=await fileToBase64(file);return postAppsScript({action:'uploadAttachment',collection:target.collection,recordId:target.recordId,context:target.context,file:{name:file.name,mimeType:file.type||'application/octet-stream',sizeBytes:file.size,base64}},{authMode:'auto',retries:0,timeoutMs:CONFIG.networkTimeouts.attachment||240000});}
async function openStoredAttachment(id){
  if(!id)return;
  const popup=window.open('about:blank','_blank');if(popup)try{popup.opener=null;popup.document.title='Đang mở tệp…';popup.document.body.innerHTML='<p style="font:14px system-ui;padding:24px">Đang chuẩn bị tệp từ Google Drive…</p>';}catch(_){}
  try{
    const result=await postAppsScript({action:'prepareAttachmentView',attachmentId:id},{authMode:'auto',retries:0,timeoutMs:CONFIG.networkTimeouts.attachment||240000});
    const url=String(result.previewUrl||result.driveUrl||'');if(!url)throw new Error('Không nhận được liên kết xem tệp.');
    if(popup)popup.location.replace(url);else window.open(url,'_blank','noopener,noreferrer');
  }catch(error){if(popup)try{popup.close();}catch(_){}toast(error.message||'Không thể mở tệp đính kèm.','error');}
}
async function uploadPendingAttachments(){
  if(!UI.editing||!pendingAttachmentRows().length)return {uploaded:0,failed:0};const target={collection:UI.editing.collection,recordId:UI.editing.recordId,context:attachmentContextForMode(UI.editing.mode)};let uploaded=0,failed=0;
  for(const entry of [...UI.editing.pendingFiles]){entry.status='uploading';entry.error='';refreshAttachmentEditorSection();try{const result=await uploadAttachmentFile(entry.file,target);if(result.attachment){DATA.attachments=(DATA.attachments||[]).filter(item=>item.id!==result.attachment.id);DATA.attachments.unshift(result.attachment);}UI.editing.pendingFiles=UI.editing.pendingFiles.filter(item=>item!==entry);uploaded++;saveData();}catch(error){entry.status='error';entry.error=error.message||'Không thể tải tệp.';failed++;}refreshAttachmentEditorSection();}
  return {uploaded,failed};
}
async function deleteStoredAttachment(id){
  if(!id||!ensureMutationReady())return;const item=(DATA.attachments||[]).find(row=>row.id===id);if(!item)return;if(!confirm(`Đưa tệp “${item.fileName}” vào Thùng rác Google Drive?`))return;
  try{const result=await postAppsScript({action:'deleteAttachment',attachmentId:id},{authMode:'auto',retries:0,timeoutMs:CONFIG.networkTimeouts.attachment||240000});DATA.attachments=(DATA.attachments||[]).filter(row=>row.id!==id);saveData();refreshAttachmentEditorSection();toast('Đã xóa tệp đính kèm.','success');if(result.revision!==undefined)setRemoteRevision(result.revision);}catch(error){toast(error.message||'Không thể xóa tệp đính kèm.','error');}
}
function renderDetailAttachments(collection,recordId){const items=recordAttachments(collection,recordId);if(!items.length)return '';return `<section class="detail-attachments"><div class="flex items-center justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Tệp đính kèm</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${items.length} tệp lưu trên Google Drive</p></div>${icon('paperclip','size-4 text-slate-400')}</div><div class="mt-3 space-y-2">${items.map(item=>attachmentViewButton(item,false)).join('')}</div></section>`;}

function fieldsForMode(schema,mode){const visible=schema.fields.filter(field=>!(field[3]&&typeof field[3]==='object'&&!Array.isArray(field[3])&&field[3].editorHidden));return mode==='report'?visible.filter(field=>schema.reportFields.includes(field[0])):visible;}
function fieldDefinitionMap(schema){return new Map((schema.fields||[]).map(field=>[field[0],field]));}
function sectionedFieldsForMode(schema,mode){
  const modeFields=fieldsForMode(schema,mode),allowed=new Set(modeFields.map(field=>field[0])),definitions=fieldDefinitionMap(schema);
  const sections=(schema.sections||[]).map(section=>{
    const fieldDefs=(section.fields||[]).filter(key=>allowed.has(key)&&definitions.has(key)).map(key=>definitions.get(key));
    const rows=(section.rows||[]).map(row=>row.filter(key=>allowed.has(key)&&definitions.has(key))).filter(row=>row.length);
    return {...section,fieldDefs,rows};
  }).filter(section=>section.fieldDefs.length);
  const assigned=new Set(sections.flatMap(section=>section.fieldDefs.map(field=>field[0])));
  const extra=modeFields.filter(field=>!assigned.has(field[0]));
  if(extra.length)sections.push({id:'other',title:'Thông tin khác',icon:'list',fieldDefs:extra,rows:[]});
  return sections;
}
function editorSectionId(sectionId){return `editor-section-${String(sectionId||'other').replace(/[^a-z0-9_-]/gi,'-')}`;}
function renderEditorSection(section,record={}){
  const id=editorSectionId(section.id),definitions=new Map(section.fieldDefs.map(field=>[field[0],field]));
  let body='';
  if(section.rows&&section.rows.length){
    const rowKeys=new Set(section.rows.flat());
    body=`<div class="editor-form-section__rows">${section.rows.map(row=>`<div class="editor-form-row" style="--editor-row-columns:${row.length}">${row.map(key=>{const field=definitions.get(key);return field?renderEditorField(field,record?.[key]):'';}).join('')}</div>`).join('')}</div>`;
    const remaining=section.fieldDefs.filter(field=>!rowKeys.has(field[0]));
    if(remaining.length)body+=`<div class="editor-form-section__grid">${remaining.map(field=>renderEditorField(field,record?.[field[0]])).join('')}</div>`;
  }else body=`<div class="editor-form-section__grid">${section.fieldDefs.map(field=>renderEditorField(field,record?.[field[0]])).join('')}</div>`;
  if(UI.editing?.collection==='vendors'&&section.id==='general')body+=renderVendorSuggestions(record?.serviceGroup||'');
  return `<section id="${id}" data-editor-section="${esc(section.id)}" class="editor-form-section scroll-mt-20"><div class="editor-form-section__heading"><span class="editor-form-section__icon">${icon(section.icon||'list','size-4')}</span><div><h4>${esc(section.title)}</h4><p>${section.fieldDefs.length} trường thông tin</p></div></div>${body}</section>`;
}
function renderEditorSectionNav(sections){
  if(sections.length<2)return '';
  return `<nav class="editor-section-nav" aria-label="Điều hướng nhóm biểu mẫu">${sections.map((section,index)=>`<button type="button" class="editor-section-nav__item ${index===0?'is-active':''}" data-editor-section-target="${esc(section.id)}"><span class="editor-section-nav__index">${index+1}</span><span>${esc(section.title)}</span></button>`).join('')}<button type="button" class="editor-section-nav__item" data-editor-section-target="attachments"><span class="editor-section-nav__index">${sections.length+1}</span><span>Tệp đính kèm</span></button></nav>`;
}
function setActiveEditorSection(sectionId){document.querySelectorAll('[data-editor-section-target]').forEach(button=>button.classList.toggle('is-active',button.dataset.editorSectionTarget===sectionId));}
function bindEditorSectionNavigation(){
  const scroll=document.getElementById('editorFields');if(!scroll)return;
  scroll.onclick=event=>{const button=event.target.closest('[data-editor-section-target]');if(!button)return;const target=button.dataset.editorSectionTarget==='attachments'?document.getElementById('attachmentEditorSection'):document.getElementById(editorSectionId(button.dataset.editorSectionTarget));if(target){target.scrollIntoView({behavior:'smooth',block:'start'});setActiveEditorSection(button.dataset.editorSectionTarget);}};
  scroll.onscroll=()=>{const candidates=[...scroll.querySelectorAll('[data-editor-section],#attachmentEditorSection')];if(!candidates.length)return;const top=scroll.getBoundingClientRect().top+90;let active=candidates[0];for(const section of candidates){if(section.getBoundingClientRect().top<=top)active=section;else break;}setActiveEditorSection(active.id==='attachmentEditorSection'?'attachments':active.dataset.editorSection);};
}
function focusEditorFieldError(field){
  if(!field)return;const section=field.closest('[data-editor-section]');if(section){setActiveEditorSection(section.dataset.editorSection);section.scrollIntoView({behavior:'smooth',block:'start'});}setTimeout(()=>field.focus({preventScroll:true}),180);
}
function ensureMutationReady(){if(!UI.mutationLocked)return true;toast('Dữ liệu đang được kiểm tra phiên bản mới nhất. Vui lòng chờ đồng bộ ban đầu hoàn tất.','info');return false;}
function openEditor(collection,id='',mode='edit'){
  if(!ensureMutationReady())return;const schema=CONFIG.schemas[collection];if(!schema)return;const record=id?(DATA[collection]||[]).find(row=>row.id===id):null,recordId=id||uid(collection);UI.editing={collection,id,recordId,mode,pendingFiles:[]};
  document.getElementById('editorTitle').textContent=mode==='report'?`Báo cáo ${schema.singular}`:record?`Chỉnh sửa ${schema.singular}`:`Thêm ${schema.singular}`;
  document.getElementById('editorSubtitle').textContent=mode==='report'?'Cập nhật kết quả thực hiện và số liệu phát sinh. Các số liệu liên kết sẽ được đồng bộ sang Ngân sách.':record?'Các thay đổi được lưu vào hàng đợi để đồng bộ Google Sheets.':`Tạo một ${schema.singular} mới trong hệ thống.`;
  const sections=sectionedFieldsForMode(schema,mode),fields=document.getElementById('editorFields');
  fields.innerHTML=`<div class="editor-form-sections">${sections.map(section=>renderEditorSection(section,record||{})).join('')}${renderAttachmentEditorSection(collection,recordId,mode)}</div>`;
  bindNumberInputs(fields);bindTime24Controls(fields);bindDatePickerUX(fields);if(collection==='timeline')updateTimelineDurationField(fields);bindReferenceSourceDetection(fields,collection);bindEditorDerivedControls(fields);bindAttachmentEditorControls();if(collection==='vendors')updateVendorPaymentGate(fields);
  const dialog=document.getElementById('editorDialog');dialog.showModal();refreshIcons();setTimeout(()=>dialog.querySelector('input:not([type="file"]),select,textarea')?.focus(),50);
}

function openReport(collection,id){ openEditor(collection,id,'report'); }
function renderTime24Control(key,label,value=''){
  const normalized=normalizeTime24(value),parts=normalized?normalized.split(':'):['',''],hourValue=parts[0],minuteValue=parts[1];
  const hours=Array.from({length:24},(_,index)=>String(index).padStart(2,'0'));
  const minutes=Array.from({length:60},(_,index)=>String(index).padStart(2,'0'));
  return `<div class="time24-control" data-time24-control="${esc(key)}"><select data-time24-hour aria-label="${esc(label)} - giờ" class="time24-select"><option value="">Giờ</option>${hours.map(hour=>`<option value="${hour}" ${hour===hourValue?'selected':''}>${hour}</option>`).join('')}</select><span class="time24-separator" aria-hidden="true">:</span><select data-time24-minute aria-label="${esc(label)} - phút" class="time24-select"><option value="">Phút</option>${minutes.map(minute=>`<option value="${minute}" ${minute===minuteValue?'selected':''}>${minute}</option>`).join('')}</select><input name="${esc(key)}" id="field-${esc(key)}" type="hidden" value="${esc(normalized)}" /></div>`;
}
function renderEditorField([key,label,type,options],value=''){
  const baseClass='w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600';
  const required=Boolean(options?.required),requiredAttr=required?' required aria-required="true"':'',common=`name="${key}" id="field-${key}"${requiredAttr}`;let control='';const opts=getFieldOptions(options);const allowBlank=Boolean(options?.allowBlank||options?.lookup);
  if(type==='select')control=`<select ${common} class="${baseClass} h-11">${allowBlank?'<option value="">— Chưa chọn —</option>':''}${opts.map(option=>`<option value="${esc(option)}" ${String(value)===String(option)?'selected':''}>${esc(option)}</option>`).join('')}</select>`;
  else if(type==='multiselect'){const selected=Array.isArray(value)?value:[value].filter(Boolean);control=`<div class="editor-multiselect" role="group" aria-label="${esc(label)}">${opts.length?opts.map(option=>`<label class="editor-multiselect__option"><input type="checkbox" name="${key}" value="${esc(option)}" ${selected.includes(option)?'checked':''}/><span>${esc(option)}</span></label>`).join(''):'<p class="px-3 py-2 text-xs text-slate-400">Chưa có lựa chọn phù hợp.</p>'}</div><p class="mt-1 text-[10px] text-slate-400">Có thể tích chọn nhiều nhà cung cấp.</p>`;}
  else if(type==='rating'){const score=Number(value||0);control=`<div class="rating-picker">${[1,2,3,4,5].map(number=>`<label><input type="radio" name="${key}" value="${number}" ${score===number?'checked':''}/><span>${number} ★</span></label>`).join('')}</div><p class="mt-1 text-[10px] text-slate-400">Chọn mức đánh giá từ 1 đến 5 sao.</p>`;}
  else if(type==='textarea')control=`<textarea ${common} rows="4" class="${baseClass} min-h-28 py-3">${esc(value)}</textarea>`;
  else if(type==='time')control=renderTime24Control(key,label,value);
  else if((type==='number'||type==='currency')&&Array.isArray(options?.selectValues)){const selected=String(value??'');control=`<select ${common} class="${baseClass} h-11"><option value="">— Chưa chọn —</option>${options.selectValues.map(option=>`<option value="${esc(option)}" ${selected===String(option)?'selected':''}>${esc(option)}</option>`).join('')}</select>`;}
  else if((type==='number'||type==='currency')&&options?.readOnly)control=`<input ${common} class="${baseClass} h-11 tabular editor-readonly-field" type="text" inputmode="numeric" readonly aria-readonly="true" value="${esc(formatNumberInputValue(value||0))}" />`;
  else if(type==='number'||type==='currency')control=`<input ${common} class="${baseClass} h-11 tabular" type="text" inputmode="numeric" autocomplete="off" data-number-input="1" data-number-kind="${type}" value="${esc(formatNumberInputValue(value))}" />`;
  else if(type==='date')control=`<input ${common} class="${baseClass} h-11" type="date" lang="vi-VN" value="${esc(normalizeDateOnly(value))}" />`;
  else control=`<input ${common} class="${baseClass} h-11" type="${type}" value="${esc(value??'')}" />`;
  const help=options?.helpText?`<p class="mt-1 text-[10px] leading-4 text-slate-400">${esc(options.helpText)}</p>`:'';
  const wide=['textarea'].includes(type)||['task','description','notes','includes','paymentTerms','contractUrl'].includes(key);
  const wrapper=type==='multiselect'?'div':'label';
  return `<${wrapper} class="editor-form-field ${wide?'editor-form-field--wide':''}" data-editor-field="${esc(key)}"><span class="mb-2 flex items-center gap-1.5 text-sm font-semibold">${esc(label)}${required?'<span class="text-brand-600">*</span>':''}</span>${control}${help}</${wrapper}>`;
}

function bindTime24Controls(root=document){
  root.querySelectorAll?.('[data-time24-control]').forEach(control=>{
    const hour=control.querySelector('[data-time24-hour]'),minute=control.querySelector('[data-time24-minute]'),hidden=control.querySelector('input[type="hidden"]');
    const update=()=>{if(hidden)hidden.value=hour?.value&&minute?.value?`${hour.value}:${minute.value}`:'';updateTimelineDurationField(root);};
    hour?.addEventListener('change',update);minute?.addEventListener('change',update);update();
  });
}
function updateTimelineDurationField(root=document){
  const start=root.querySelector?.('#field-startTime'),end=root.querySelector?.('#field-endTime'),duration=root.querySelector?.('#field-durationMinutes');
  if(!duration)return;duration.value=String(durationMinutesBetween(start?.value||'',end?.value||''));
}

function syncChecklistBudget(next){
  const budget=(DATA.budget||[]).find(row=>String(row.id)===String(next?.budget_item_id||''));
  next.budgetEstimate=budget?Number(budget.budgeted||0):0;
  next.committedCost=budget?Number(budget.committed||0):0;
  next.actualCost=budget?Number(budget.actual||0):0;
  next.payableCost=budget?Number(budget.payable||0):0;
  return next;
}
function vendorSuggestionRows(serviceGroup){
  const target=normalizeLookupText(serviceGroup||'');if(!target)return [];
  const targetItem=lookupItemByValue('checklistGroups',serviceGroup),targetId=String(targetItem?.id||'');
  const interestIds=new Set(['Quan tâm','Rất quan tâm'].map(value=>String(lookupItemByValue('interestLevels',value)?.id||'')).filter(Boolean));
  return (DATA.references||[]).filter(row=>{
    const sameGroup=targetId?String(row.group_id||'')===targetId:normalizeLookupText(row.group)===target;
    const interestId=String(row.interest_level_id||''),interested=interestId?interestIds.has(interestId):['Quan tâm','Rất quan tâm'].includes(String(row.interestLevel||''));
    return sameGroup&&interested;
  }).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0)||String(a.sourceUrl||'').localeCompare(String(b.sourceUrl||''),'vi'));
}
function renderVendorSuggestions(serviceGroup){
  const rows=vendorSuggestionRows(serviceGroup),shown=rows.slice(0,5);
  if(!serviceGroup)return `<div id="vendorSuggestions" class="vendor-suggestions"><div class="vendor-suggestions__head"><div><p class="text-sm font-bold">Gợi ý tự động</p><p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Chọn Dịch vụ/hạng mục cung cấp để xem gợi ý từ Tham khảo.</p></div></div></div>`;
  return `<div id="vendorSuggestions" class="vendor-suggestions"><div class="vendor-suggestions__head"><div><p class="text-sm font-bold">Gợi ý tự động</p><p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">${rows.length?`${rows.length} nguồn phù hợp · ưu tiên điểm đánh giá cao`:'Chưa có nguồn Tham khảo phù hợp'}</p></div></div>${shown.length?`<div class="vendor-suggestions__list">${shown.map(row=>`<div class="vendor-suggestion-row"><div class="min-w-0"><p class="truncate text-xs font-semibold">${esc(row.group||resolveLookupLabel(String(row.group_id||''),'—'))}</p><p class="mt-0.5 truncate text-[10px] text-slate-400">${esc(row.event||resolveLookupLabel(String(row.anchor_event_id||''),'Chưa gắn sự kiện'))} · ${Number(row.rating||0)}/5</p></div><div class="min-w-0">${safeExternalUrl(row.sourceUrl)?`<a href="${esc(safeExternalUrl(row.sourceUrl))}" target="_blank" rel="noopener noreferrer" class="vendor-suggestion-link">Mở link tham khảo</a>`:`<span class="vendor-suggestion-link vendor-suggestion-link--empty">Chưa có đường dẫn</span>`}</div><button type="button" data-vendor-reference-detail="${esc(row.id)}" class="vendor-suggestion-action">${icon('eye','size-3.5')}<span>Xem chi tiết</span></button></div>`).join('')}</div>${rows.length>5?`<p class="mt-2 text-[10px] text-slate-400">Đang hiển thị 5/${rows.length} gợi ý có điểm cao nhất.</p>`:''}`:''}</div>`;
}
function refreshVendorSuggestions(){const host=document.getElementById('vendorSuggestions');if(!host)return;const service=document.getElementById('field-serviceGroup')?.value||'';const wrapper=document.createElement('div');wrapper.innerHTML=renderVendorSuggestions(service);host.replaceWith(wrapper.firstElementChild);bindVendorSuggestionActions();refreshIcons();}
function bindVendorSuggestionActions(){document.querySelectorAll('[data-vendor-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.vendorReferenceDetail)));}
function editorVendorFinancialValues(root=document){
  return vendorFinancialValues({
    contractValue:parseFormattedNumber(root.querySelector?.('#field-contractValue')?.value||0),
    deposit:parseFormattedNumber(root.querySelector?.('#field-deposit')?.value||0),
    paid:parseFormattedNumber(root.querySelector?.('#field-paid')?.value||0)
  });
}
function updateVendorFinancialFields(root=document){
  const values=editorVendorFinancialValues(root),payable=root.querySelector?.('#field-payable');
  if(payable){payable.value=formatNumberInputValue(values.payable);payable.dataset.calculatedValue=String(values.payable);}
  return values;
}
function updateEditorDerivedFields(root=document){
  if(!UI.editing)return;
  const collection=UI.editing.collection;
  if(collection==='vendors'){
    updateVendorFinancialFields(root);
    updateVendorPaymentGate(root);
  }
  if(collection==='budget'){
    const event=root.querySelector('#field-anchorEvent')?.value||'',service=root.querySelector('#field-serviceGroup')?.value||'';
    const eventItem=lookupItemByValue('anchorEvents',event),serviceItem=lookupItemByValue('vendorCategories',service);
    const linked=(DATA.vendors||[]).filter(v=>ACTIVE_VENDOR_FINANCIAL_STATUSES.includes(String(v.status||''))&&String(v.anchor_event_id||'')===String(eventItem?.id||'')&&String(v.category_id||'')===String(serviceItem?.id||''));
    const committed=linked.reduce((sum,v)=>sum+vendorFinancialValues(v).contractValue,0),derivedActual=linked.reduce((sum,v)=>{const values=vendorFinancialValues(v);return sum+values.deposit+values.paid;},0);
    const actualField=root.querySelector('#field-actual'),committedField=root.querySelector('#field-committed'),payable=root.querySelector('#field-payable');if(committedField)committedField.value=formatNumberInputValue(committed);
    let actual=parseFormattedNumber(actualField?.value||0);if(actualField){actualField.readOnly=linked.length>0;actualField.setAttribute('aria-readonly',String(linked.length>0));actualField.classList.toggle('editor-readonly-field',linked.length>0);actualField.title=linked.length?'Tự động tính từ Tiền cọc + Đã thanh toán của Nhà cung cấp liên quan.':'Chưa có Nhà cung cấp liên quan nên có thể nhập Thực chi thủ công.';if(linked.length){actual=derivedActual;actualField.value=formatNumberInputValue(derivedActual);}}
    if(payable)payable.value=formatNumberInputValue(Math.max(0,committed-actual));
  }
  if(collection==='checklist'){
    const category=root.querySelector('#field-budgetCategory')?.value||'',budget=(DATA.budget||[]).find(row=>row.category===category);[['budgetEstimate','budgeted'],['committedCost','committed'],['actualCost','actual'],['payableCost','payable']].forEach(([field,key])=>{const input=root.querySelector(`#field-${field}`);if(input)input.value=formatNumberInputValue(budget?Number(budget[key]||0):0);});
  }
}
function bindEditorDerivedControls(root=document){
  if(!UI.editing)return;
  if(root._wosDerivedControlsHandler){root.removeEventListener('input',root._wosDerivedControlsHandler);root.removeEventListener('change',root._wosDerivedControlsHandler);}
  const handler=event=>{
    const collection=UI.editing?.collection||'',target=event.target;if(!collection||!target)return;
    const relevant=collection==='vendors'?new Set(['contractValue','deposit','paid','serviceGroup','status','anchorEvent','category']):collection==='budget'?new Set(['anchorEvent','serviceGroup','actual']):collection==='checklist'?new Set(['budgetCategory']):new Set();
    const key=String(target.name||target.id?.replace(/^field-/,'')||'');if(!relevant.has(key))return;
    updateEditorDerivedFields(root);
    if(collection==='vendors'&&key==='serviceGroup'&&event.type==='change')refreshVendorSuggestions();
  };
  root._wosDerivedControlsHandler=handler;root.addEventListener('input',handler);root.addEventListener('change',handler);
  updateEditorDerivedFields(root);if(UI.editing.collection==='vendors')bindVendorSuggestionActions();
}



async function saveEditor(event){
  event.preventDefault();if(!ensureMutationReady()||!UI.editing)return;const editing=UI.editing,{collection,id,recordId,mode}=editing,schema=CONFIG.schemas[collection],form=new FormData(event.currentTarget),record=id?DATA[collection].find(row=>row.id===id):{id:recordId},previous=record?structuredClone(record):{};
  fieldsForMode(schema,mode).forEach(([key,,type])=>{let value=type==='multiselect'?form.getAll(key):(form.get(key)??'');if(type==='rating')value=Number(value||0);else if(['number','currency'].includes(type))value=parseFormattedNumber(value);record[key]=value;});
  if(collection==='vendors'&&!vendorPaymentAllowed(record.status)&&id){['contractValue','deposit','paid','payable','paymentTerms'].forEach(key=>{record[key]=previous[key]??(key==='paymentTerms'?'':0);});}
  if(collection==='references'&&record.sourceUrl){const detected=detectReferenceSourceFromUrl(record.sourceUrl);if(detected)record.source=detected;}
  if(collection==='vendors'){if(!vendorPaymentAllowed(record.status)&&vendorHasPaymentData(record)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}showVendorPaymentGate();toast('Thanh toán & hợp đồng chỉ được nhập khi Nhà cung cấp đã được chọn.','error');return;}record.score=Number(record.score||0);if(record.score&&(!Number.isInteger(record.score)||record.score<1||record.score>10)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Điểm đánh giá phải nằm trong thang từ 1 đến 10.','error');return;}record.contractValue=Number(record.contractValue||0);record.deposit=Number(record.deposit||0);record.paid=Number(record.paid||0);if([record.contractValue,record.deposit,record.paid].some(value=>value<0)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Giá trị hợp đồng, Tiền cọc và Đã thanh toán không được là số âm.','error');return;}if(record.deposit+record.paid>record.contractValue){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Tiền cọc + Đã thanh toán không được vượt Giá trị hợp đồng/dịch vụ.','error');return;}applyVendorFinancialValues(record);if(record.status==='Vào shortlist')record.status='Đã nhận báo giá';if(vendorPaymentAllowed(record.status)&&record.contractValue<=0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Khi Nhà cung cấp ở trạng thái Đã chọn/Đã cọc/Hoàn tất, Giá trị hợp đồng/dịch vụ phải lớn hơn 0.','error');return;}if(record.status==='Đã cọc'&&record.deposit<=0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Trạng thái Đã cọc yêu cầu Tiền cọc lớn hơn 0.','error');return;}}
  canonicalizeRecordReferences(collection,record);
  const requiredMissing=fieldsForMode(schema,mode).filter(([,label,,options])=>options?.required).filter(([key])=>{const value=record[key];return value===''||value===null||value===undefined||(Array.isArray(value)&&!value.length);});if(requiredMissing.length){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast(`Vui lòng nhập các trường bắt buộc: ${requiredMissing.map(field=>field[1]).join(', ')}.`,'error');focusEditorFieldError(document.getElementById(`field-${requiredMissing[0][0]}`));return;}if(collection==='guests'&&record.rsvp==='Đồng ý'&&Number(record.partySize||0)<1){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Khách RSVP Đồng ý phải có Số người tham dự ít nhất là 1.','error');return;}
  const referenceIssues=canonicalReferenceIssues(collection,record);if(referenceIssues.length){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast(`Không thể xác định duy nhất tham chiếu cho: ${referenceIssues.map(key=>fieldLabel(schema,key)).join(', ')}. Hãy kiểm tra danh mục hoặc tên bản ghi trùng.`,`error`);return;}
  if(collection==='budget'){
    record.budgeted=Number(record.budgeted||0);record.actual=Number(record.actual||0);if(record.budgeted<0||record.actual<0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Ngân sách dự kiến và Thực chi không được là số âm.','error');return;}
    const linkedVendors=vendorsForBudgetItem(record),committed=linkedVendors.reduce((sum,vendor)=>sum+Number(vendor.contractValue||0),0);if(linkedVendors.length)record.actual=linkedVendors.reduce((sum,vendor)=>sum+Number(vendor.deposit||0)+Number(vendor.paid||0),0);record.committed=committed;record.payable=Math.max(0,committed-record.actual);record.variance=record.budgeted-record.actual;record.remaining=record.budgeted-committed;
    const limit=budgetLimitState(record.budgeted,id);if(limit.exceeded){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}showBudgetLimitDialog(limit);return;}
  }
  if(collection==='checklist'){syncChecklistBudget(record);record.variance=Number(record.budgetEstimate||0)-Number(record.actualCost||0);}
  if(collection==='timeline'){record.startTime=normalizeTime24(record.startTime);record.endTime=normalizeTime24(record.endTime);record.durationMinutes=durationMinutesBetween(record.startTime,record.endTime);}
  if(!id){DATA[collection].unshift(record);UI.editing.id=record.id;}record.updatedAt=new Date().toISOString();queueUpsert(collection,record,id?previous:null);recomputeDerivedFinancials();saveData();
  const hasPending=pendingAttachmentRows().length>0;
  if(!hasPending){document.getElementById('editorDialog').close();UI.editing=null;toast(mode==='report'?'Đã cập nhật báo cáo.':id?'Đã cập nhật bản ghi.':'Đã thêm bản ghi mới.','success');renderPage();return;}
  setButtonLoading('editorSubmit',true,'Đang lưu');
  try{
    const synced=await syncPreview({automatic:true});
    if(!synced&&UI.pendingChanges.some(change=>change.collection===collection&&change.id===record.id))throw new Error('Bản ghi chưa đồng bộ được lên Google Sheets nên chưa thể tải tệp lên Drive.');
    const result=await uploadPendingAttachments();
    if(result.failed){toast(`Bản ghi đã lưu nhưng còn ${result.failed} tệp tải lên thất bại. Có thể bấm Lưu lại để thử lại.`,'error');return;}
    document.getElementById('editorDialog').close();UI.editing=null;toast(`${mode==='report'?'Đã cập nhật báo cáo':id?'Đã cập nhật bản ghi':'Đã thêm bản ghi mới'} và tải ${result.uploaded} tệp lên Google Drive.`,'success');renderPage();
  }catch(error){toast(`Bản ghi đã được lưu cục bộ nhưng tệp chưa được tải lên: ${error.message||'Không thể kết nối Google Drive.'}`,'error');}
  finally{setButtonLoading('editorSubmit',false);}
}

function addMinutes(time,minutes){ const [hours,mins]=String(time).split(':').map(Number); if(Number.isNaN(hours))return ''; const total=(hours*60+mins+minutes)%1440; return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`; }

function detailFieldPlainText(value){
  if(value===null||value===undefined)return '';
  if(Array.isArray(value))return value.map(item=>String(item??'')).join(', ');
  if(typeof value==='object'){try{return JSON.stringify(value);}catch(_){return String(value);}}
  return String(value);
}
function detailFieldLayoutMeta(key,label,type,value){
  const semantic=`${key||''} ${label||''}`.toLocaleLowerCase('vi');
  const rawText=detailFieldPlainText(value);
  const text=rawText.replace(/\s+/g,' ').trim();
  const length=Array.from(text).length;
  const longSemantic=/(description|notes?|task|program|programme|details?|includes?|paymentterms?|agenda|content|remark|comment|ghi chú|mô tả|chương trình|chi tiết|nội dung|điều khoản)/i.test(semantic);
  const mediumSemantic=/(address|location|venue|website|url|link|contact|supplier|vendor|company|email|địa chỉ|địa điểm|liên hệ|nhà cung cấp|đơn vị)/i.test(semantic);
  const compactTypes=new Set(['number','currency','date','time','datetime','boolean','rating','tel','select']);
  if(type==='textarea'||longSemantic||rawText.includes('\n')||length>90){
    return {preferred:12,allowed:[12],full:true,length};
  }
  if(type==='url'||type==='multiselect'||length>=55){
    return {preferred:6,allowed:[4,6,8,9,12],full:false,length};
  }
  if(mediumSemantic&&length>=28){
    return {preferred:6,allowed:[4,6,8,9,12],full:false,length};
  }
  if(compactTypes.has(type)&&length<40){
    return {preferred:3,allowed:[3,4,6,9,12],full:false,length};
  }
  if(mediumSemantic||length>=30){
    return {preferred:4,allowed:[4,6,8,9,12],full:false,length};
  }
  return {preferred:4,allowed:[3,4,6,9,12],full:false,length};
}
function detailSpanCost(span,meta){
  const delta=span-meta.preferred;
  return delta<0?Math.abs(delta)*2.4:delta*.8;
}
function detailBestRowSpans(items){
  let best=null;
  const walk=(index,total,spans,cost)=>{
    if(total>12)return;
    if(index===items.length){
      if(total!==12)return;
      if(!best||cost<best.cost-1e-9)best={spans:[...spans],cost};
      return;
    }
    const meta=items[index].meta;
    for(const span of meta.allowed){
      spans.push(span);
      walk(index+1,total+span,spans,cost+detailSpanCost(span,meta));
      spans.pop();
    }
  };
  walk(0,0,[],0);
  return best;
}
function detailPlanFlexibleSection(items){
  const memo=new Map();
  const solve=index=>{
    if(index>=items.length)return {cost:0,rows:[]};
    if(memo.has(index))return memo.get(index);
    let best=null;
    const maxCount=Math.min(4,items.length-index);
    for(let count=maxCount;count>=1;count--){
      const chunk=items.slice(index,index+count);
      const row=detailBestRowSpans(chunk);
      if(!row)continue;
      const tail=solve(index+count);
      const candidate={
        cost:row.cost+tail.cost+3.2,
        rows:[chunk.map((item,i)=>({...item,span:row.spans[i]})),...tail.rows]
      };
      if(!best||candidate.cost<best.cost-1e-9)best=candidate;
    }
    const result=best||{cost:9999,rows:[[{...items[index],span:12}],...solve(index+1).rows]};
    memo.set(index,result);return result;
  };
  return solve(0).rows;
}
function detailOrderedFields(collection,schema,record){
  const base=(schema.fields||[]).map(field=>({field,key:field[0],label:field[1],type:field[2],value:record[field[0]]}));
  const byKey=new Map(base.map(item=>[item.key,item]));
  const statusKey=schema.statusField&&byKey.has(schema.statusField)?schema.statusField:'';
  if(collection==='timeline'){
    const preferred=[statusKey,'event','anchorEvent','group','eventDate','startTime','durationMinutes','endTime','description','location','owner','vendor','notes'].filter(Boolean);
    const used=new Set();
    const ordered=[];
    preferred.forEach(key=>{const item=byKey.get(key);if(item&&!used.has(key)){ordered.push(item);used.add(key);}});
    base.forEach(item=>{if(!used.has(item.key))ordered.push(item);});
    return ordered;
  }
  if(collection==='vendors'){
    // Keep the same information architecture in Detail as Create/Edit:
    // General → Decision → Provider information → Payment → Notes.
    const preferred=['anchorEvent','category','serviceGroup','score','status','decisionDue','name','location','contact','quote','contractValue','deposit','paid','payable','paymentTerms','notes'];
    const used=new Set(),ordered=[];preferred.forEach(key=>{const item=byKey.get(key);if(item&&!used.has(key)){ordered.push(item);used.add(key);}});base.forEach(item=>{if(!used.has(item.key))ordered.push(item);});return ordered;
  }
  if(!statusKey)return base;
  return [byKey.get(statusKey),...base.filter(item=>item.key!==statusKey)];
}
function detailLayoutRows(collection,schema,record){
  const entries=detailOrderedFields(collection,schema,record).map(item=>({...item,meta:detailFieldLayoutMeta(item.key,item.label,item.type,item.value)}));
  const rows=[];
  let flexible=[];
  const flush=()=>{if(!flexible.length)return;rows.push(...detailPlanFlexibleSection(flexible));flexible=[];};
  const consumed=new Set();
  const timelineTimeKeys=['eventDate','startTime','durationMinutes','endTime'];
  for(let index=0;index<entries.length;index++){
    const item=entries[index];
    if(consumed.has(item.key))continue;
    if(collection==='timeline'&&item.key==='eventDate'){
      flush();
      const group=timelineTimeKeys.map(key=>entries.find(entry=>entry.key===key)).filter(Boolean);
      group.forEach(entry=>consumed.add(entry.key));
      if(group.length===4)rows.push(group.map(entry=>({...entry,span:3,logicalGroup:'timeline-time'})));
      else rows.push(...detailPlanFlexibleSection(group));
      continue;
    }
    if(item.meta.full){flush();rows.push([{...item,span:12}]);continue;}
    flexible.push(item);
  }
  flush();
  return rows;
}
function renderBudgetDetail(schema,record){
  const field=(key)=>`<div class="budget-detail-field"><dt>${esc(fieldLabel(schema,key))}</dt><dd>${displayValue(schema,key,record[key])}</dd></div>`;
  return `<div class="budget-detail-layout"><section class="budget-detail-section"><div class="budget-detail-section__title">${icon('tags','size-4')}<span>Hạng mục</span></div><dl class="budget-detail-grid budget-detail-grid--identity">${field('category')}${field('anchorEvent')}${field('serviceGroup')}</dl></section><section class="budget-detail-section"><div class="budget-detail-section__title">${icon('wallet-cards','size-4')}<span>Tài chính</span></div><dl class="budget-detail-grid">${field('budgeted')}${field('committed')}${field('actual')}${field('payable')}${field('remaining')}</dl></section>${String(record.notes||'').trim()?`<section class="budget-detail-section"><div class="budget-detail-section__title">${icon('file-text','size-4')}<span>Ghi chú</span></div><dl class="budget-detail-grid budget-detail-grid--notes">${field('notes')}</dl></section>`:''}</div>`;
}
function openDetails(collection,id){
  const schema=CONFIG.schemas[collection],record=(DATA[collection]||[]).find(row=>row.id===id); if(!record)return;
  document.getElementById('detailTitle').textContent=`Chi tiết ${schema.singular}`;
  const statusKey=schema.statusField||'';
  const rows=detailLayoutRows(collection,schema,record);
  document.getElementById('detailContent').innerHTML=`${collection==='budget'?renderBudgetDetail(schema,record):`<dl class="detail-grid">${rows.flat().map(item=>`<div class="detail-field detail-field--span-${item.span} ${item.key===statusKey?'detail-field--status':''}" data-detail-field="${esc(item.key)}" ${item.logicalGroup?`data-detail-group="${esc(item.logicalGroup)}"`:''}><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(item.label)}</dt><dd class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">${displayValue(schema,item.key,record[item.key])}</dd></div>`).join('')}</dl>`}${renderDetailAttachments(collection,id)}`;
  const actions=document.getElementById('detailActions'),locked=mutationActionDisabled(),reportButton=(schema.reportFields||[]).length?`<button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openReport('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">${icon('clipboard-pen-line','size-4')}Báo cáo</button>`:'';actions.innerHTML=`${reportButton}<button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openEditor('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">${icon('pencil','size-4')}Chỉnh sửa</button>`;
  document.getElementById('detailDialog').showModal(); document.querySelectorAll('#detailDialog [data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment))); refreshIcons();
}

function openConfirmDialog(title,description){ document.getElementById('confirmTitle').textContent=title; document.getElementById('confirmDescription').textContent=description; document.getElementById('confirmDialog').showModal(); }
function askDelete(collection,id){if(!ensureMutationReady())return;UI.deleting={type:'record',collection,id};openConfirmDialog('Xóa bản ghi này?','Thao tác sẽ xóa bản ghi khỏi bản xem trước trên thiết bị này và đưa yêu cầu xóa vào hàng đợi đồng bộ.');}
function askLookupDelete(key,index){const item=lookupItemsForKey(key,{activeOnly:false})[index];if(!item)return;const refs=referenceCountForLookupItem(item);UI.deleting={type:'lookup',key,itemId:item.id};openConfirmDialog(refs?'Ngưng sử dụng lựa chọn?':'Xóa lựa chọn dùng chung?',refs?`“${item.value}” đang được ${refs} bản ghi tham chiếu nên sẽ được chuyển sang trạng thái Ngưng sử dụng, không xóa lịch sử.`:`Lựa chọn “${item.value}” chưa được tham chiếu và sẽ được xóa khỏi danh mục.`);}
function confirmDelete(){
  if(!ensureMutationReady()||!UI.deleting)return;
  if(UI.deleting.type==='lookup'){const {key,itemId}=UI.deleting,item=lookupItemById(itemId);if(!item)return;const refs=referenceCountForLookupItem(item);if(refs){const before=structuredClone(item);item.active=false;item._updatedAt=new Date().toISOString();queueUpsert('lookup_items',item,before);toast('Đã ngưng sử dụng lựa chọn; dữ liệu lịch sử vẫn được giữ nguyên.','success');}else{DATA.lookup_items=DATA.lookup_items.filter(entry=>entry.id!==itemId);queueDelete('lookup_items',itemId,item);toast('Đã xóa lựa chọn chưa được sử dụng.','success');}rebuildLookupCompatibility();saveData();const totalPages=Math.max(1,Math.ceil(lookupItemsForKey(key,{activeOnly:false}).length/CONFIG.lookupPageSize));UI.lookupPages[key]=Math.min(UI.lookupPages[key]||1,totalPages);document.getElementById('confirmDialog').close();UI.deleting=null;renderPage();return;}
  const {collection,id}=UI.deleting,record=(DATA[collection]||[]).find(row=>row.id===id);
  if(collection==='checklist'&&record)syncChecklistBudget({...record,budget_item_id:'',actualCost:0,payableCost:0},record);
  // V10: các reference tới Budget/Vendor được Apps Script cascade trong cùng critical section
  // chỉ sau khi delete target vượt qua kiểm tra rowVersion. Frontend không queue các patch phụ
  // để tránh trạng thái nửa vời khi delete chính bị conflict.
  DATA[collection]=(DATA[collection]||[]).filter(row=>row.id!==id); DATA.attachments=(DATA.attachments||[]).filter(item=>!(item.collection===collection&&item.recordId===id)); saveData(); queueDelete(collection,id,record); document.getElementById('confirmDialog').close(); UI.deleting=null; toast('Đã xóa bản ghi trên thiết bị. Hệ thống sẽ tự đồng bộ lên Google Sheets trong nền; tệp đính kèm sẽ được dọn khỏi Google Drive sau khi server xác nhận.','success'); renderPage();
}

function captureSettingsDraft(event){
  const target=event?.target;if(!target?.name)return;
  queueMicrotask(()=>{UI.settingsDraft={...(UI.settingsDraft||{}),[target.name]:target.value};const form=document.getElementById('settingsForm');if(form&&['reserveBudget','operatingBudget'].includes(target.name)){const reserve=parseFormattedNumber(form.elements.reserveBudget?.value||0),operating=parseFormattedNumber(form.elements.operatingBudget?.value||0),total=form.elements.totalBudget;if(total)total.value=formatNumberInputValue(reserve+operating);}});
}
function clearSettingsDraft(){UI.settingsDraft=null;}
function saveSettingsForm(event){
  event.preventDefault();const form=new FormData(event.currentTarget),numericKeys=['reserveBudget','operatingBudget','groomGuests','brideGuests'];
  const nextReserve=Math.max(0,parseFormattedNumber(form.get('reserveBudget')||0)),nextOperating=Math.max(0,parseFormattedNumber(form.get('operatingBudget')||0)),nextTotal=nextReserve+nextOperating,planned=totalPlannedBudget(DATA);
  if(planned>nextTotal){showBudgetLimitDialog({total:nextTotal,planned,over:planned-nextTotal,exceeded:true});return;}
  for(const [key,value] of form.entries()){if(key==='totalBudget')continue;const normalized=numericKeys.includes(key)?Math.max(0,parseFormattedNumber(value)):(key==='dashboardDescription'?String(value).trim():value);let item=DATA.settings.find(row=>row.key===key),before=item?structuredClone(item):null;if(item)item.value=normalized;else{item={id:`setting-${key}`,key,value:normalized,notes:key==='dashboardDescription'?'Mô tả hiển thị tại tab Tổng quan':''};DATA.settings.push(item);}item.updatedAt=new Date().toISOString();queueUpsert('settings',item,before);}
  const reserve=Number((DATA.settings.find(row=>row.key==='reserveBudget')||{}).value||0),operating=Number((DATA.settings.find(row=>row.key==='operatingBudget')||{}).value||0),total=reserve+operating;let totalItem=DATA.settings.find(row=>row.key==='totalBudget'),totalBefore=totalItem?structuredClone(totalItem):null;if(totalItem)totalItem.value=total;else{totalItem={id:'setting-totalBudget',key:'totalBudget',value:total,notes:'Tự động = Quỹ dự phòng + Ngân sách vận hành'};DATA.settings.push(totalItem);}totalItem.updatedAt=new Date().toISOString();queueUpsert('settings',totalItem,totalBefore);recomputeDerivedFinancials();
  saveData();clearSettingsDraft();updateCoupleWidget();toast('Đã lưu thiết lập vào hàng đợi đồng bộ.','success');renderNavigation();renderPage();
}
async function openConnectionSettings(){
  const settings=getSettings(),endpoint=String(embeddedEndpoint()||endpointFromLocation()||settings.googleSheetsEndpoint||storage.get(CONFIG.endpointKey,''));document.getElementById('connectionEndpoint').value=endpoint;
  const passwordInput=document.getElementById('connectionPassword'),toggle=document.getElementById('toggleConnectionPassword'),hint=document.getElementById('connectionPasswordSetupHint');
  const applyState=()=>{const initialized=Boolean(AUTH.remoteStatus?.bootstrapCompleted||AUTH.remoteStatus?.adminInitialized);passwordInput.value=initialized?'':connectionSecrets.get(CONFIG.passwordKey,'');passwordInput.disabled=initialized;toggle.disabled=initialized;passwordInput.type='password';if(hint)hint.textContent=initialized?'Hệ thống đã khởi tạo. Từ thiết bị khác chỉ cần đăng nhập bằng tài khoản đã được cấp hoặc mật khẩu quản trị.':'Nhập một lần để khởi tạo; sau khi tạo admin sẽ không phải nhập lại.';return initialized;};
  const initialized=applyState();document.getElementById('connectionSchemaPassword').value=connectionSecrets.get(CONFIG.schemaPasswordKey,'');document.getElementById('connectionSchemaPassword').type='password';document.getElementById('connectionInitialSync').checked=false;const copyButton=document.getElementById('copyConnectionLink');if(copyButton)copyButton.disabled=!endpoint;const dialog=document.getElementById('connectionDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>initialized?document.getElementById('connectionSchemaPassword')?.focus():passwordInput?.focus(),50);
  if(endpoint&&!AUTH.remoteStatus){try{await getServerStatus();applyState();refreshIcons();}catch(_){} }
}

async function copyConnectionLink(){
  const raw=String(document.getElementById('connectionEndpoint')?.value||configuredEndpoint()).trim();let endpoint='';
  try{endpoint=normalizeAppsScriptEndpoint(raw);}catch(error){toast(error.message,'error');return;}
  if(!endpoint){toast('Hãy nhập URL Google Apps Script trước khi sao chép liên kết.','error');return;}
  const link=connectionShareUrl(endpoint);
  try{await navigator.clipboard.writeText(link);}catch(_){const input=document.createElement('textarea');input.value=link;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();}
  toast('Đã sao chép liên kết. Thiết bị khác sẽ tự nhận URL Google Sheets; mật khẩu và token không được đưa vào liên kết.','success');
}

async function saveConnectionSettings(event){
  event.preventDefault();const form=new FormData(event.currentTarget),rawEndpoint=String(form.get('googleSheetsEndpoint')||'').trim(),password=String(form.get('googleSheetsPassword')||''),schemaPassword=String(form.get('googleSheetsSchemaPassword')||''),initialSync=form.get('initialSync')==='yes';
  let endpoint='';try{endpoint=normalizeAppsScriptEndpoint(rawEndpoint);}catch(error){toast(error.message,'error');document.getElementById('connectionEndpoint')?.focus();return;}
  const previous=configuredEndpoint();let item=DATA.settings.find(row=>row.key==='googleSheetsEndpoint'),before=item?structuredClone(item):null;if(item)item.value=endpoint;else{item={id:'setting-googleSheetsEndpoint',key:'googleSheetsEndpoint',value:endpoint,notes:'Google Apps Script Web App URL'};DATA.settings.push(item);}item.updatedAt=new Date().toISOString();
  persistEndpointBootstrap(endpoint);if(!document.getElementById('connectionPassword')?.disabled)connectionSecrets.set(CONFIG.passwordKey,password);connectionSecrets.set(CONFIG.schemaPasswordKey,schemaPassword);
  if(previous!==endpoint){storage.remove(CONFIG.fullSyncEndpointKey);storage.remove(CONFIG.lastFullSyncAtKey);storage.remove(CONFIG.schemaEndpointKey);storage.remove(CONFIG.schemaSignatureKey);storage.remove(CONFIG.remoteSchemaHashKey);}
  queueUpsert('settings',item,before);saveData();document.getElementById('connectionDialog').close();toast('Đã cập nhật kết nối Google Sheets.','success');if(UI.tab==='settings')renderPage();
  if(endpoint&&initialSync)await syncAllDataToGoogleSheets('initial');else if(endpoint)await syncSchemaToGoogleSheets('connection');startAutoSync();
}

function toggleConnectionPassword(){ const input=document.getElementById('connectionPassword'); if(!input)return; input.type=input.type==='password'?'text':'password'; const iconNode=document.querySelector('#toggleConnectionPassword i'); if(iconNode)iconNode.setAttribute('data-lucide',input.type==='password'?'eye':'eye-off'); refreshIcons(); }

function addLookupValue(key){const input=document.querySelector(`[data-lookup-input="${key}"]`),value=input?.value.trim();if(!value)return;if(lookupItemByValue(key,value)){toast('Lựa chọn này đã tồn tại; nếu đang ngưng sử dụng hãy kích hoạt lại thay vì tạo mới.','error');return;}const items=lookupItemsForKey(key,{activeOnly:false}),lastOrder=Number(items.at(-1)?.sort_order||0),item=createLookupItem(key,value,Math.max(10,lastOrder+10));DATA.lookup_items.push(item);rebuildLookupCompatibility();UI.lookupPages[key]=Math.ceil(lookupItemsForKey(key,{activeOnly:false}).length/CONFIG.lookupPageSize);saveData();queueUpsert('lookup_items',item);renderPage();}
function editLookupValue(key,index){
  const item=lookupItemsForKey(key,{activeOnly:false})[index];if(!item)return;
  UI.editingLookup={key,itemId:item.id};
  const label=CONFIG.lookupLabels?.[key]||'Danh mục dùng chung';
  document.getElementById('lookupEditTitle').textContent=`Chỉnh sửa ${label}`;
  document.getElementById('lookupEditDescription').textContent='Cập nhật giá trị dùng chung. Các bản ghi đang tham chiếu vẫn giữ nguyên liên kết theo ID.';
  document.getElementById('lookupEditValue').value=item.value||'';
  showInlineError('lookupEditError','');
  const dialog=document.getElementById('lookupEditDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>{const input=document.getElementById('lookupEditValue');input?.focus();input?.select();},50);
}
function saveLookupEdit(event){
  event.preventDefault();const editing=UI.editingLookup;if(!editing)return;
  const item=lookupItemById(editing.itemId);if(!item){showInlineError('lookupEditError','Không tìm thấy lựa chọn cần chỉnh sửa.');return;}
  const next=String(document.getElementById('lookupEditValue').value||'').trim();
  if(!next){showInlineError('lookupEditError','Giá trị không được để trống.');return;}
  if(next.length>200){showInlineError('lookupEditError','Giá trị tối đa 200 ký tự.');return;}
  const duplicate=lookupItemByValue(editing.key,next);if(duplicate&&duplicate.id!==item.id){showInlineError('lookupEditError','Lựa chọn này đã tồn tại.');return;}
  if(next===item.value){document.getElementById('lookupEditDialog').close();UI.editingLookup=null;return;}
  const before=structuredClone(item);item.value=next;item._updatedAt=new Date().toISOString();rebuildLookupCompatibility();hydrateReferenceLabels();saveData();queueUpsert('lookup_items',item,before);document.getElementById('lookupEditDialog').close();UI.editingLookup=null;renderPage();toast('Đã cập nhật danh mục dùng chung.','success');
}
function toggleLookupActive(key,index){const item=lookupItemsForKey(key,{activeOnly:false})[index];if(!item)return;const before=structuredClone(item);item.active=item.active===false;item._updatedAt=new Date().toISOString();queueUpsert('lookup_items',item,before);rebuildLookupCompatibility();hydrateReferenceLabels();saveData();toast(item.active?'Đã kích hoạt lại lựa chọn.':'Đã ngưng sử dụng lựa chọn.','success');renderPage();}
function setLookupPage(key,page){ const totalPages=Math.max(1,Math.ceil(lookupItemsForKey(key,{activeOnly:false}).length/CONFIG.lookupPageSize)); UI.lookupPages[key]=Math.min(Math.max(1,Number(page||1)),totalPages); renderPage(); }
let lookupDragState=null;
function reorderLookupItems(key,fromIndex,toIndex,{notify=true}={}){
  const items=lookupItemsForKey(key,{activeOnly:false});
  const from=Number(fromIndex),to=Math.max(0,Math.min(items.length-1,Number(toIndex)));
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=items.length||from===to)return false;
  const beforeById=new Map(items.map(item=>[item.id,structuredClone(item)]));
  const [moved]=items.splice(from,1);items.splice(to,0,moved);
  const now=new Date().toISOString();let changed=0;
  items.forEach((item,index)=>{const nextOrder=(index+1)*10;if(Number(item.sort_order||0)===nextOrder)return;const before=beforeById.get(item.id);item.sort_order=nextOrder;item._updatedAt=now;queueUpsert('lookup_items',item,before);changed+=1;});
  if(!changed)return false;
  rebuildLookupCompatibility();hydrateReferenceLabels();saveData();
  UI.lookupPages[key]=Math.floor(to/CONFIG.lookupPageSize)+1;
  renderPage();
  if(notify)toast('Đã cập nhật thứ tự danh mục; các danh sách lựa chọn sẽ dùng cùng thứ tự này.','success');
  return true;
}
function moveLookupItem(key,index,direction){
  const from=Number(index),step=Number(direction);if(!Number.isInteger(from)||![1,-1].includes(step))return;
  reorderLookupItems(key,from,from+step);
}
function clearLookupDragUi(){document.querySelectorAll('.lookup-sort-row.is-dragging,.lookup-sort-row.is-drag-over').forEach(row=>row.classList.remove('is-dragging','is-drag-over'));}
function bindLookupSorting(){
  document.querySelectorAll('[data-lookup-move]').forEach(button=>button.addEventListener('click',()=>moveLookupItem(button.dataset.lookupMove,Number(button.dataset.index),Number(button.dataset.direction))));
  document.querySelectorAll('[data-lookup-drag]').forEach(handle=>{
    handle.addEventListener('dragstart',event=>{lookupDragState={key:handle.dataset.lookupDrag,index:Number(handle.dataset.index)};event.dataTransfer.effectAllowed='move';try{event.dataTransfer.setData('text/plain',`${lookupDragState.key}:${lookupDragState.index}`);}catch(_){}handle.closest('.lookup-sort-row')?.classList.add('is-dragging');});
    handle.addEventListener('dragend',()=>{lookupDragState=null;clearLookupDragUi();});
  });
  document.querySelectorAll('[data-lookup-row]').forEach(row=>{
    row.addEventListener('dragover',event=>{if(!lookupDragState||lookupDragState.key!==row.dataset.lookupRow)return;event.preventDefault();event.dataTransfer.dropEffect='move';document.querySelectorAll('.lookup-sort-row.is-drag-over').forEach(node=>node!==row&&node.classList.remove('is-drag-over'));row.classList.add('is-drag-over');});
    row.addEventListener('dragleave',event=>{if(!row.contains(event.relatedTarget))row.classList.remove('is-drag-over');});
    row.addEventListener('drop',event=>{if(!lookupDragState||lookupDragState.key!==row.dataset.lookupRow)return;event.preventDefault();const state=lookupDragState,target=Number(row.dataset.index);lookupDragState=null;clearLookupDragUi();reorderLookupItems(state.key,state.index,target);});
  });
}
function replaceLookupReferences(){/* V10: lookup_id là khóa chuẩn; đổi label không cập nhật hàng loạt bản ghi. */}
function deleteLookupValue(key,index){askLookupDelete(key,index);}

function setCollectionFilter(collection,status){ if(UI.tab!==collection)navigate(collection); UI.filter=UI.filter===status?'Tất cả':status; UI.secondaryFilter=null; UI.visibleCount=CONFIG.pageSize; renderPage(); }
function setMetricFilter(value){ UI.secondaryFilter=UI.secondaryFilter?.type==='metric'&&UI.secondaryFilter.value===value?null:{type:'metric',value}; UI.visibleCount=CONFIG.pageSize; renderPage(); }
function setGuestFilter(field,value){ UI.secondaryFilter=UI.secondaryFilter?.field===field&&UI.secondaryFilter.value===value?null:{type:'field',field,value}; UI.visibleCount=CONFIG.pageSize; renderPage(); }
function toggleAdvancedFilterPanel(){ UI.filterPanelOpen=!UI.filterPanelOpen; renderPage(); }
function updateAdvancedFilter(field,value,checked){ const selected=new Set(UI.advancedFilters[field]||[]); checked?selected.add(value):selected.delete(value); if(selected.size)UI.advancedFilters[field]=[...selected];else delete UI.advancedFilters[field]; UI.visibleCount=CONFIG.pageSize; renderPage(); }
function clearAdvancedFilters(){ clearCollectionFilters(); }

function bindPageEvents(){
  document.getElementById('openFilterDialogButton')?.addEventListener('click',openFilterDialog);
  document.getElementById('clearCollectionFiltersButton')?.addEventListener('click',clearCollectionFilters);
  document.getElementById('addRecordButton')?.addEventListener('click',()=>openEditor(UI.tab));
  document.getElementById('customizeColumnsButton')?.addEventListener('click',openColumnSettings);
  document.getElementById('openSortDialogButton')?.addEventListener('click',openSortDialog);
  document.getElementById('groupByEventButton')?.addEventListener('click',toggleEventGroup);
  document.getElementById('editDashboardDescription')?.addEventListener('click',openDashboardTextEditor);
  document.getElementById('loadMoreButton')?.addEventListener('click',()=>{UI.visibleCount+=CONFIG.pageSize;renderPage();});
  document.getElementById('clearFiltersButton')?.addEventListener('click',clearCollectionFilters);
  document.querySelectorAll('[data-report]').forEach(button=>button.addEventListener('click',()=>openReport(UI.tab,button.dataset.report)));
  document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>openDetails(UI.tab,button.dataset.detail)));
  document.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>openEditor(UI.tab,button.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',()=>askDelete(UI.tab,button.dataset.delete)));
  document.querySelectorAll('[data-timeline-complete]').forEach(input=>input.addEventListener('change',()=>toggleTimelineCompletion(input.dataset.timelineComplete,input.checked)));
  const settingsForm=document.getElementById('settingsForm');settingsForm?.addEventListener('submit',saveSettingsForm);settingsForm?.addEventListener('input',captureSettingsDraft);settingsForm?.addEventListener('change',captureSettingsDraft); document.getElementById('settingsThemeButton')?.addEventListener('click',toggleTheme); document.querySelectorAll('[data-settings-admin-unlock]').forEach(button=>button.addEventListener('click',openSettingsAccessDialog));
  document.getElementById('addAccountButton')?.addEventListener('click',()=>openAccountEditor()); document.getElementById('changeSettingsPasswordButton')?.addEventListener('click',()=>openSettingsPasswordDialog(false));
  document.querySelectorAll('[data-account-edit]').forEach(button=>button.addEventListener('click',()=>openAccountEditor(button.dataset.accountEdit))); document.querySelectorAll('[data-account-password]').forEach(button=>button.addEventListener('click',()=>openAccountPassword(button.dataset.accountPassword))); document.querySelectorAll('[data-account-lock]').forEach(button=>button.addEventListener('click',()=>toggleAccountLock(button.dataset.accountLock)));
  document.querySelectorAll('[data-accent]').forEach(button=>button.addEventListener('click',()=>setAccent(button.dataset.accent)));
  document.querySelectorAll('[data-lookup-add]').forEach(button=>button.addEventListener('click',()=>addLookupValue(button.dataset.lookupAdd)));
  document.querySelectorAll('[data-lookup-edit]').forEach(button=>button.addEventListener('click',()=>editLookupValue(button.dataset.lookupEdit,Number(button.dataset.index))));
  document.querySelectorAll('[data-lookup-toggle]').forEach(button=>button.addEventListener('click',()=>toggleLookupActive(button.dataset.lookupToggle,Number(button.dataset.index))));
  document.querySelectorAll('[data-lookup-delete]').forEach(button=>button.addEventListener('click',()=>deleteLookupValue(button.dataset.lookupDelete,Number(button.dataset.index))));
  document.querySelectorAll('[data-lookup-page]').forEach(button=>button.addEventListener('click',()=>setLookupPage(button.dataset.lookupPage,Number(button.dataset.page))));
  bindLookupSorting();
  document.getElementById('settingsSyncNowButton')?.addEventListener('click',()=>syncPreview());
  document.getElementById('openMigrationReportButton')?.addEventListener('click',openMigrationReport);
  document.getElementById('openConnectionDialog')?.addEventListener('click',openConnectionSettings);
  document.getElementById('schemaSyncButton')?.addEventListener('click',()=>syncSchemaToGoogleSheets('manual'));
  document.getElementById('fullSyncButton')?.addEventListener('click',()=>syncAllDataToGoogleSheets('manual'));
  document.getElementById('exportButton')?.addEventListener('click',exportData); document.getElementById('resetButton')?.addEventListener('click',resetData);
}

let renderTimer; function debounceRender(){clearTimeout(renderTimer);renderTimer=setTimeout(renderPage,130);}

function toggleEditMode(){UI.editMode=!UI.editMode;renderHeader();renderPage();toast(UI.editMode?'Đã bật chế độ chỉnh sửa.':'Đã kết thúc chế độ chỉnh sửa.','info');}
async function savePreview(){ setButtonLoading('saveButton',true,'Đang lưu'); await wait(150); saveData(); scheduleMutationSync(); setButtonLoading('saveButton',false); toast(UI.pendingChanges.length?`${UI.pendingChanges.length} thay đổi đã lưu trên thiết bị và đang chờ đồng bộ nền.`:'Dữ liệu trên thiết bị đã được lưu.','success'); }

function buildFullSyncChanges(){
  const changes=[];
  recordCollectionNames().forEach(collection=>(DATA[collection]||[]).forEach(record=>changes.push({op:'upsert',collection,id:record.id,record:structuredClone(record),changedAt:new Date().toISOString()})));
  (DATA.lookup_items||[]).forEach(record=>{const baseVersion=Number(record._rowVersion||0);changes.push(baseVersion>0?{op:'patch',collection:'lookup_items',id:record.id,baseVersion,changedFields:structuredClone(record),baseValues:{},changeId:uid('change'),deviceId:deviceId(),changedAt:new Date().toISOString()}:{op:'upsert',collection:'lookup_items',id:record.id,record:structuredClone(record),baseVersion:0,changeId:uid('change'),deviceId:deviceId(),changedAt:new Date().toISOString()});});
  return changes;
}
function buildFullSyncSnapshot(){recomputeDerivedFinancials();const snapshot={};syncCollectionNames().forEach(collection=>{snapshot[collection]=structuredClone(Array.isArray(DATA?.[collection])?DATA[collection]:[]);});return snapshot;}
function countSnapshotRecords(snapshot=DATA){
  return syncCollectionNames().reduce((total,collection)=>{
    const value=snapshot?.[collection];
    return total+(Array.isArray(value)?value.length:0);
  },0);
}
function appsScriptTimeoutFor(payload){
  const action=String(payload?.action||'');
  if(action==='getStatus'||action==='getSyncState')return CONFIG.networkTimeouts.status;
  if(action==='load')return CONFIG.networkTimeouts.load;
  if(action==='registerSchema'||action==='verifyWorkbook'||action==='migrateV10')return CONFIG.networkTimeouts.schema;
  if(action==='applyChanges')return payload?.mode==='full'?CONFIG.networkTimeouts.full:CONFIG.networkTimeouts.delta;
  if(action==='uploadAttachment'||action==='deleteAttachment'||action==='prepareAttachmentView')return CONFIG.networkTimeouts.attachment;
  if(['loginChallenge','login','adminChallenge','adminLogin','changePasswordChallenge','changeOwnPassword','requestAdminPasswordReset','confirmAdminPasswordReset'].includes(action))return CONFIG.networkTimeouts.auth;
  return CONFIG.networkTimeouts.default;
}
function retryableRequestError(error){return ['REQUEST_TIMEOUT','NETWORK_ERROR','HTTP_RETRYABLE'].includes(String(error?.code||''));}
function requestCanReplaySafely(payload){
  const action=String(payload?.action||'');
  if(['getStatus','load','loginChallenge','adminChallenge','changePasswordChallenge'].includes(action))return true;
  return Boolean(AUTH.remoteStatus?.requestReplay)&&['applyChanges','registerSchema','verifyWorkbook','migrateV10'].includes(action);
}
async function postAppsScript(payload,options={}){
  const endpoint=normalizeAppsScriptEndpoint(configuredEndpoint()),password=connectionSecrets.get(CONFIG.passwordKey,''),schemaPassword=connectionSecrets.get(CONFIG.schemaPasswordKey,''),admin=Boolean(options.admin||AUTH.settingsUnlocked),authMode=options.authMode||'auto';
  const token=authMode==='none'?'':activeServerToken(admin),action=String(payload?.action||''),hasPayloadPassword=Object.prototype.hasOwnProperty.call(payload,'password'),hasPayloadSchemaPassword=Object.prototype.hasOwnProperty.call(payload,'schemaPassword');
  const bootstrapPasswordActions=['load','initializeAdmin','registerSchema','applyChanges','verifyWorkbook','migrateV10','updateConnectionPassword','setConnectionPassword'];const attachBootstrapPassword=!token&&bootstrapPasswordActions.includes(action)&&password;
  const body={...payload,source:'WeddingOS',clientVersion:'10.9.0',sentAt:new Date().toISOString(),requestId:payload.requestId||uid('request'),...(token?{sessionToken:token}:{}),...(!hasPayloadPassword&&attachBootstrapPassword?{password}:{}),...(!hasPayloadSchemaPassword&&schemaPassword?{schemaPassword}:{})};
  const serialized=JSON.stringify(body),timeoutMs=Number(options.timeoutMs||appsScriptTimeoutFor(body)),maxRetries=Number.isInteger(options.retries)?Math.max(0,options.retries):(requestCanReplaySafely(body)?1:0);let lastError;
  for(let attempt=0;attempt<=maxRetries;attempt+=1){try{const response=await fetchWithTimeout(endpoint,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:serialized},timeoutMs);if(!response.ok)throw remoteError(`HTTP ${response.status}`,response.status>=500?'HTTP_RETRYABLE':'HTTP_ERROR');const result=await readJsonResponse(response);if(result.success===false){const error=remoteError(result.message||'Google Sheets từ chối dữ liệu',result.code||'REMOTE_ERROR');error.payload=result;throw error;}if(options.trackRevision!==false&&result.revision!==undefined)setRemoteRevision(result.revision);return result;}catch(error){lastError=error;if(attempt>=maxRetries||!retryableRequestError(error))break;await wait(1200*(attempt+1));}}
  throw lastError;
}
function migrationIssueReasonLabel(reason){return ({DUPLICATE_LOOKUP_NORMALIZED:'Danh mục cũ bị trùng sau chuẩn hóa',DUPLICATE_LOOKUP_ITEMS:'lookup_items có lựa chọn trùng',LOOKUP_AMBIGUOUS:'Danh mục không xác định duy nhất',LOOKUP_NOT_FOUND:'Không tìm thấy danh mục tương ứng',ENTITY_AMBIGUOUS:'Có nhiều bản ghi cùng tên',ENTITY_NOT_FOUND:'Không tìm thấy bản ghi tham chiếu',RECORD_COUNT_MISMATCH:'Số lượng bản ghi thay đổi bất thường'})[reason]||reason||'Cần kiểm tra';}
function openMigrationReport(){
  const report=parseStoredJson(storage.get(CONFIG.migrationReportKey,''),null);if(!report){toast('Chưa có báo cáo Migration V10 trên thiết bị này.','info');return;}
  const body=document.getElementById('migrationReportBody'),subtitle=document.getElementById('migrationReportSubtitle'),issues=Array.isArray(report.unresolved)?report.unresolved:[],backup=report.backup?.name||'Chưa ghi nhận';
  subtitle.textContent=`${report.completedAt?formatDateTime(report.completedAt):'Chưa có thời gian'} · Backup: ${backup}`;
  body.innerHTML=`<div class="migration-report-summary"><div class="migration-report-stat"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Lookup items</p><p class="mt-1 text-xl font-bold tabular">${Number(report.lookupItemCount||0)}</p></div><div class="migration-report-stat"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Thay đổi migration</p><p class="mt-1 text-xl font-bold tabular">${Number(report.changedCount||0)}</p></div><div class="migration-report-stat"><p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Cần kiểm tra</p><p class="mt-1 text-xl font-bold tabular ${issues.length?'text-amber-600':''}">${Number(report.unresolvedCount||0)}</p></div></div>${issues.length?`<div class="mt-5 space-y-2"><div><h4 class="text-sm font-bold">Tham chiếu chưa thể tự chuyển đổi</h4><p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Hệ thống cố ý không đoán khi tên danh mục hoặc thực thể bị trùng/mơ hồ. Hãy xử lý dữ liệu nguồn rồi chạy Migration V10 lại.</p></div>${issues.slice(0,200).map(item=>`<div class="migration-report-issue"><div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">${esc(migrationIssueReasonLabel(item.reason))}</span><span class="text-xs font-semibold">${esc(item.collection||'')}</span><span class="text-[10px] text-slate-400">${esc(item.recordId||'')}</span></div><p class="mt-2 text-xs"><strong>${esc(item.field||'Trường')}:</strong> ${esc(Array.isArray(item.value)?item.value.join(', '):item.value||'—')}</p></div>`).join('')}${Number(report.unresolvedCount||0)>issues.slice(0,200).length?`<p class="text-xs text-slate-500">Báo cáo còn ${Number(report.unresolvedCount||0)-issues.slice(0,200).length} mục khác.</p>`:''}</div>`:`<div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"><strong>Migration PASS.</strong> Không còn tham chiếu mơ hồ và số lượng bản ghi được bảo toàn.</div>`}`;
  document.getElementById('migrationReportDialog')?.showModal();refreshIcons();
}

async function syncSchemaToGoogleSheets(reason='manual'){
  if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');return false;}if(!isAdministrator()&&!connectionSecrets.get(CONFIG.passwordKey,'')){toast('Cần đăng nhập quản trị để cập nhật cấu trúc Google Sheets.','error');return false;}
  UI.syncing=true;UI.syncMode='manual';setManualSyncControlsDisabled(true);setButtonLoading('schemaSyncButton',true,'Đang cập nhật cấu trúc');
  try{
    const manifest=buildSchemaManifest(),result=await postAppsScript({action:'registerSchema',reason,forceSchema:reason==='manual',schema:manifest},{admin:true});recordSchemaSync(endpoint,result,manifest);const count=(result.changes||[]).length;
    // Legacy Migration V10 is intentionally disabled for new/empty workbooks. Keep the
    // implementation dormant behind FEATURE_FLAGS.legacyV10Migration for future legacy imports.
    if(FEATURE_FLAGS.legacyV10Migration){
      const migration=await postAppsScript({action:'migrateV10',schema:manifest},{admin:true,timeoutMs:CONFIG.networkTimeouts.schema,retries:0}),issues=Number(migration?.report?.unresolvedCount||0),report=migration?.report||{};storage.set(CONFIG.migrationReportKey,JSON.stringify(report));const backupName=report?.backup?.name||result?.backup?.name||'';
      toast(issues?`Migration V10 đã chạy nhưng còn ${issues} tham chiếu cần kiểm tra; hệ thống không tự đoán dữ liệu mơ hồ.`:(count?`Đã cập nhật cấu trúc Google Sheets: ${count} thay đổi và migration V10 hoàn tất${backupName?` · Backup: ${backupName}`:''}.`:`Cấu trúc Google Sheets đã đúng và migration V10 được kiểm tra${backupName?` · Backup: ${backupName}`:''}.`),issues?'error':'success');if(issues)setTimeout(openMigrationReport,80);
    }else toast(count?`Đã cập nhật cấu trúc Google Sheets: ${count} thay đổi.`:'Cấu trúc Google Sheets đã đúng.','success');
    await loadRemoteSnapshot(true);if(UI.tab==='settings')renderPage();return true;
  }catch(error){console.error('Schema sync failed',error);toast(`Không thể cập nhật cấu trúc Google Sheets: ${error.message}`,'error');return false;}
  finally{UI.syncing=false;UI.syncMode='';setButtonLoading('schemaSyncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();}
}
async function syncAllDataToGoogleSheets(reason='manual'){
  if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');return false;}UI.syncing=true;UI.syncMode='manual';setManualSyncControlsDisabled(true);setButtonLoading('syncButton',true,'Đang đồng bộ');setButtonLoading('fullSyncButton',true,'Đang đẩy dữ liệu');
  try{const status=await getServerStatus(),hasRemote=Boolean(status?.hasData),confirmReplace=hasRemote&&reason==='manual'&&confirm('Google Sheets đã có dữ liệu. Đồng bộ toàn bộ sẽ thay thế dữ liệu từ xa. Bạn có chắc chắn muốn tiếp tục?');if(hasRemote&&!confirmReplace){if(!UI.pendingChanges.length){await hydrateFromGoogleSheets(true);toast('Đã tải dữ liệu hiện có từ Google Sheets thay vì ghi đè.','info');}else toast('Google Sheets đã có dữ liệu. Hãy xử lý thay đổi cục bộ trước khi tải lại; hệ thống không tự ghi đè.','error');return false;}
    const snapshot=buildFullSyncSnapshot(),recordCount=countSnapshotRecords(snapshot),manifest=buildSchemaManifest(),result=await postAppsScript({action:'applyChanges',mode:'full',replaceRemote:true,confirmReplaceRemote:confirmReplace,baseRevision:Number(status?.revision||0),reason,schema:manifest,snapshot},{admin:true});recordSchemaSync(endpoint,result,manifest);UI.pendingChanges=[];savePendingChanges();UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);storage.set(CONFIG.fullSyncEndpointKey,endpoint);storage.set(CONFIG.lastFullSyncAtKey,UI.lastSyncAt);setRemoteRevision(result.revision||0);try{await loadRemoteSnapshot(true);}catch(error){console.warn('Không tải lại được row version sau full sync',error);}try{await ensureAdminServerSession();startAutoSync();}catch(error){console.warn('Không tạo được phiên quản trị sau khởi tạo',error);}toast(`Đã đồng bộ toàn bộ ${recordCount} bản ghi và danh mục.`,'success');if(UI.tab==='dashboard'||UI.tab==='settings')renderPage();return true;}
  catch(error){console.error('Full sync failed',error);toast(`Không thể đồng bộ toàn bộ dữ liệu: ${error.message}`,'error');return false;}
  finally{UI.syncing=false;UI.syncMode='';setButtonLoading('syncButton',false);setButtonLoading('fullSyncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();}
}

function applyServerRecord(collection,record){if(!record||!record.id)return;const rows=DATA[collection]||(DATA[collection]=[]),index=rows.findIndex(row=>row.id===record.id);if(record._deleted===true){if(index>=0)rows.splice(index,1);return;}if(index>=0)rows[index]=record;else rows.unshift(record);}
function absorbSyncV2Result(result){
  const appliedIds=new Set((result.appliedChangeIds||[]).map(String)),conflicts=Array.isArray(result.conflicts)?result.conflicts:[],conflictIds=new Set(conflicts.map(item=>String(item.changeId||''))),rejected=Array.isArray(result.rejected)?result.rejected:[],rejectedIds=new Set(rejected.map(item=>String(item.changeId||'')));
  (result.records||[]).forEach(item=>applyServerRecord(item.collection,item.record));
  const pendingById=new Map(UI.pendingChanges.map(change=>[String(change.changeId||''),change]));
  conflicts.forEach(item=>{const change=pendingById.get(String(item.changeId||''));if(change&&!UI.conflicts.some(existing=>existing.changeId===item.changeId))UI.conflicts.push({...item,change});});
  rejected.forEach(item=>{const change=pendingById.get(String(item.changeId||''));if(change&&!UI.conflicts.some(existing=>existing.changeId===item.changeId))UI.conflicts.push({...item,change,rejected:true,conflictType:item.conflictType||'rejected'});});
  UI.pendingChanges=UI.pendingChanges.filter(change=>!appliedIds.has(String(change.changeId||''))&&!conflictIds.has(String(change.changeId||''))&&!rejectedIds.has(String(change.changeId||'')));
  rebuildLookupCompatibility();hydrateReferenceLabels();savePendingChanges();saveSyncConflicts();saveData();
  if(UI.conflicts.length)setTimeout(openNextSyncConflict,0);
}
function conflictFieldLabel(conflict,field){const schema=CONFIG.schemas[conflict.collection],meta=canonicalReferenceMeta(conflict.collection,field);return meta&&schema?fieldLabel(schema,meta.legacyKey):(schema?fieldLabel(schema,field):manifestFieldLabel(field));}
function conflictValueText(conflict,field,value){if(value===null||value===undefined||value==='')return '—';const meta=canonicalReferenceMeta(conflict.collection,field);if(meta?.type==='lookup')return resolveLookupLabel(String(value),String(value));if(meta?.type==='entity'){if(meta.multiple)return (Array.isArray(value)?value:[]).map(id=>resolveEntityLabel(meta.collection,id,meta.labelKey,id)).join(', ');return resolveEntityLabel(meta.collection,String(value),meta.labelKey,String(value));}const schema=CONFIG.schemas[conflict.collection],type=schema?.fields?.find(item=>item[0]===field)?.[2];if(type==='currency')return money(value);if(type==='date')return formatDate(value);if(Array.isArray(value))return value.join(', ');return String(value);}
function openNextSyncConflict(){
  const dialog=document.getElementById('syncConflictDialog');if(!dialog||dialog.open||!UI.conflicts.length)return;UI.activeConflictIndex=0;const conflict=UI.conflicts[0],body=document.getElementById('syncConflictBody'),title=document.getElementById('syncConflictTitle'),subtitle=document.getElementById('syncConflictSubtitle'),discard=document.getElementById('discardConflictButton'),confirmButton=document.getElementById('confirmConflictButton');
  title.textContent=conflict.conflictType==='delete'?'Bản ghi đã thay đổi trước khi xóa':conflict.rejected?'Không thể áp dụng thay đổi':'Có thay đổi từ thiết bị khác';subtitle.textContent=`${CONFIG.schemas[conflict.collection]?.title||conflict.collection} · ${conflict.recordId||conflict.id||''}`;
  if(discard){discard.textContent=conflict.rejected?'Dùng dữ liệu server':'Dùng dữ liệu server';discard.classList.remove('hidden');}if(confirmButton)confirmButton.classList.toggle('hidden',Boolean(conflict.rejected));
  if(conflict.rejected){body.innerHTML=`<div class="sync-conflict-warning"><p class="text-sm font-semibold">${esc(conflict.message||'Máy chủ từ chối thay đổi này.')}</p><p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Thay đổi cục bộ chưa được ghi lên Google Sheets. Hệ thống chỉ cho phép bỏ thay đổi này và tiếp tục với dữ liệu máy chủ.</p></div>`;}
  else if(conflict.conflictType==='delete'){body.innerHTML=`<div class="sync-conflict-warning"><p class="text-sm font-semibold">Bản ghi đã được cập nhật ở thiết bị khác sau thời điểm bạn mở dữ liệu.</p><p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Chọn giữ bản mới trên server hoặc vẫn xóa phiên bản mới nhất.</p><label class="sync-conflict-choice"><input type="radio" name="deleteResolution" value="server" checked><span>Giữ bản ghi mới nhất trên server</span></label><label class="sync-conflict-choice"><input type="radio" name="deleteResolution" value="local"><span>Vẫn xóa bản ghi</span></label></div>`;}
  else{body.innerHTML=(conflict.conflicts||[]).map((item,index)=>`<section class="sync-conflict-field"><p class="text-xs font-bold uppercase tracking-wide text-slate-400">${esc(conflictFieldLabel(conflict,item.field))}</p><div class="mt-3 grid gap-2 sm:grid-cols-2"><label class="sync-conflict-choice"><input type="radio" name="conflict-${index}" value="server" checked><span><strong>Dữ liệu server</strong><small>${esc(conflictValueText(conflict,item.field,item.serverValue))}</small></span></label><label class="sync-conflict-choice"><input type="radio" name="conflict-${index}" value="local"><span><strong>Thay đổi của tôi</strong><small>${esc(conflictValueText(conflict,item.field,item.localValue))}</small></span></label></div></section>`).join('');}
  dialog.showModal();refreshIcons();
}
function discardActiveConflict(){if(!UI.conflicts.length)return;const conflict=UI.conflicts.shift();if(conflict.serverRecord)applyServerRecord(conflict.collection,conflict.serverRecord);rebuildLookupCompatibility();hydrateReferenceLabels();saveSyncConflicts();saveData();document.getElementById('syncConflictDialog')?.close();renderPage();setTimeout(openNextSyncConflict,80);}
async function resolveActiveConflict(event){
  event.preventDefault();if(!UI.conflicts.length)return;const conflict=UI.conflicts.shift(),dialog=document.getElementById('syncConflictDialog');
  if(conflict.rejected){if(conflict.serverRecord)applyServerRecord(conflict.collection,conflict.serverRecord);saveSyncConflicts();saveData();dialog.close();renderPage();setTimeout(openNextSyncConflict,80);return;}
  if(conflict.conflictType==='delete'){const resolution=new FormData(event.currentTarget).get('deleteResolution')||'server';if(conflict.serverRecord)applyServerRecord(conflict.collection,conflict.serverRecord);if(resolution==='local')queueChange({op:'delete',collection:conflict.collection,id:conflict.recordId,baseVersion:Number(conflict.serverVersion||conflict.serverRecord?._rowVersion||0),baseValues:{}});}
  else{const server=structuredClone(conflict.serverRecord||{}),next=structuredClone(server);(conflict.conflicts||[]).forEach((item,index)=>{const resolution=new FormData(event.currentTarget).get(`conflict-${index}`)||'server';if(resolution==='local')next[item.field]=structuredClone(item.localValue);});canonicalizeRecordReferences(conflict.collection,next);applyServerRecord(conflict.collection,server);queuePatch(conflict.collection,server,next);}
  rebuildLookupCompatibility();hydrateReferenceLabels();saveSyncConflicts();saveData();dialog.close();renderPage();setTimeout(()=>{if(UI.conflicts.length)openNextSyncConflict();else if(UI.pendingChanges.length)syncPreview({automatic:true});},100);
}

async function syncPreview(options={}){
  const automatic=Boolean(options&&options.automatic),knownStatus=options?.knownStatus||null;if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){if(!automatic){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');}return false;}
  UI.syncing=true;UI.syncMode=automatic?'automatic':'manual';UI.autoSyncLastAttemptAt=new Date().toISOString();setManualSyncControlsDisabled(true);setButtonLoading('syncButton',true,automatic?'Tự động đồng bộ':'Đang đồng bộ');
  try{
    const status=knownStatus||await getServerStatus();if(status.requiresAccountLogin&&!activeServerToken(false))throw remoteError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.','AUTH_REQUIRED');
    if(status.initialized===false&&!isAdministrator()&&UI.pendingChanges.length)throw remoteError('Google Sheets chưa có cấu trúc dữ liệu. Hãy đăng nhập quản trị để khởi tạo schema trước khi đồng bộ.','SCHEMA_MISSING');
    const serverRevision=Number(status.revision||0),localRevision=remoteRevision();
    if(!UI.pendingChanges.length){if(serverRevision!==localRevision){await loadRemoteSnapshot(false);UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(!automatic)toast('Đã tải thay đổi mới nhất từ Google Sheets.','success');return true;}if(!automatic&&needsSchemaSync(endpoint)&&isAdministrator()){const manifest=buildSchemaManifest(),result=await postAppsScript({action:'registerSchema',reason:'automatic',forceSchema:false,schema:manifest},{admin:true});recordSchemaSync(endpoint,result,manifest);toast('Đã kiểm tra và cập nhật cấu trúc Google Sheets.','success');}else if(!automatic)toast(UI.conflicts.length?'Không có thay đổi mới để gửi; còn xung đột cần xử lý.':'Không có thay đổi mới cần đồng bộ.','info');UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(UI.conflicts.length)openNextSyncConflict();return true;}
    const manifest=buildSchemaManifest(),deltaPayload={action:'applyChanges',mode:'delta',protocolVersion:CONFIG.syncProtocolVersion,baseRevision:localRevision,deviceId:deviceId(),changes:structuredClone(UI.pendingChanges)};
    if(isAdministrator())deltaPayload.schema=manifest;
    const result=await postAppsScript(deltaPayload,{admin:isAdministrator()});if(isAdministrator())recordSchemaSync(endpoint,result,manifest);absorbSyncV2Result(result);const conflictCount=(result.conflicts||[]).length,rejectedCount=(result.rejected||[]).length,resultRevision=Number(result.revision||serverRevision||localRevision),remoteChangedBefore=serverRevision!==localRevision,remoteChangedDuring=resultRevision>serverRevision+1;if(remoteChangedBefore||remoteChangedDuring||rejectedCount){try{await refreshRemoteSnapshotPreservingPending(isAdministrator());}catch(error){console.warn('Không tải lại được thay đổi đồng thời từ thiết bị khác',error);setRemoteRevision(resultRevision);}}else setRemoteRevision(resultRevision);UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(!automatic)toast(conflictCount||rejectedCount?`Đã đồng bộ các thay đổi an toàn; ${conflictCount+rejectedCount} thay đổi cần xử lý.`:'Đã đồng bộ dữ liệu an toàn lên Google Sheets.','success');if(UI.tab==='dashboard'||UI.tab==='settings')renderPage();UI.autoSyncLastError='';return true;
  }catch(error){
    if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';stopAutoSync();enforceLoginGate();}
    if(automatic){console.warn('Auto sync failed',error);UI.autoSyncLastError=error.message||'Không thể đồng bộ tự động.';}
    else{console.error('Delta sync failed',error);const protocolMessage=['INVALID_CHANGE_OPERATION','REVISION_CONFLICT'].includes(error.code)?'Apps Script đang dùng cơ chế đồng bộ cũ hoặc chưa được redeploy v10. Hãy cập nhật Apps Script từ gói hiện tại; thay đổi cục bộ vẫn được giữ nguyên.':`Không thể đồng bộ Google Sheets: ${error.message}`;toast(protocolMessage,'error');}
    return false;
  }finally{UI.syncing=false;UI.syncMode='';UI.autoSyncNextAt=activeServerToken(false)?new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString():'';setButtonLoading('syncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();}
}

async function hydrateFromGoogleSheets(force=false){const endpoint=configuredEndpoint();if(!endpoint)return;try{const status=await getServerStatus();if(status.requiresAccountLogin&&!activeServerToken(false)&&!connectionSecrets.get(CONFIG.passwordKey,'')){enforceLoginGate();return;}if(UI.pendingChanges.length&&!force){toast('Đang có thay đổi cục bộ chưa đồng bộ nên hệ thống chưa tải đè dữ liệu từ xa.','info');return;}await loadRemoteSnapshot(Boolean(serverAdminToken()&&AUTH.settingsUnlocked));}catch(error){if(error.code==='AUTH_REQUIRED'){secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';enforceLoginGate();return;}console.warn('Không tải được dữ liệu Google Sheets, tiếp tục dùng cache',error);toast(`Không tải được dữ liệu Google Sheets: ${error.message}`,'error');}}

function setButtonLoading(id,active,label=''){const button=document.getElementById(id);if(!button)return;button.disabled=active;if(active){button.dataset.original=button.innerHTML;button.innerHTML=`${icon('loader-circle','size-4 animate-spin')}${label}`;}else if(button.dataset.original){button.innerHTML=button.dataset.original;}refreshIcons();}
function setManualSyncControlsDisabled(active){
  const endpoint=Boolean(configuredEndpoint());
  ['syncButton','schemaSyncButton','fullSyncButton'].forEach(id=>{const button=document.getElementById(id);if(!button)return;button.disabled=active||(id!=='syncButton'&&!endpoint);button.classList.toggle('opacity-40',active);button.classList.toggle('cursor-not-allowed',active);button.setAttribute('aria-busy',active?'true':'false');});
  document.querySelectorAll('[data-mobile-action="sync"]').forEach(button=>{button.disabled=active;button.classList.toggle('opacity-40',active);button.classList.toggle('cursor-not-allowed',active);});
}
function autoSyncStatusLabel(){
  if(!configuredEndpoint())return 'Chưa kết nối';if(!activeServerToken(false))return 'Chờ đăng nhập';if(UI.hydrationState==='loading')return 'Chờ tải dữ liệu ban đầu';if(UI.syncMode==='automatic')return 'Đang đồng bộ tự động';
  if(UI.mutationSyncDueAt)return `Đang chờ đồng bộ nền · ${new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,hourCycle:'h23'}).format(new Date(UI.mutationSyncDueAt))}`;
  return UI.autoSyncNextAt?`Heartbeat 15 giây · kế tiếp ${new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,hourCycle:'h23'}).format(new Date(UI.autoSyncNextAt))}`:'Heartbeat 15 giây để kiểm tra thay đổi từ thiết bị khác';
}
async function getSyncState(){return postAppsScript({action:'getSyncState'},{authMode:'auto',trackRevision:false,retries:0,timeoutMs:CONFIG.networkTimeouts.status});}
async function autoSyncTick(){
  if(UI.syncing||UI.hydrationState==='loading'||document.body.classList.contains('auth-locked')||!activeServerToken(false))return;
  UI.autoSyncLastAttemptAt=new Date().toISOString();
  try{const state=await getSyncState(),serverRevision=Number(state.revision||0);if(UI.pendingChanges.length||serverRevision!==remoteRevision())await syncPreview({automatic:true,knownStatus:state});UI.autoSyncLastError='';}
  catch(error){if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';stopAutoSync();enforceLoginGate();return;}UI.autoSyncLastError=error.message||'Không thể kiểm tra dữ liệu mới.';console.warn('Auto sync state check failed',error);}
  finally{UI.autoSyncNextAt=activeServerToken(false)?new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString():'';updatePendingIndicators();}
}
function stopAutoSync(){if(UI.autoSyncTimer){clearInterval(UI.autoSyncTimer);UI.autoSyncTimer=null;}cancelMutationSync();UI.autoSyncNextAt='';}
function startAutoSync(){
  stopAutoSync();if(!configuredEndpoint()||!activeServerToken(false)||document.body.classList.contains('auth-locked')||UI.hydrationState==='loading')return;
  UI.autoSyncNextAt=new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString();
  UI.autoSyncTimer=setInterval(()=>{UI.autoSyncNextAt=new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString();autoSyncTick();},CONFIG.autoSyncIntervalMs);
  updatePendingIndicators();
  if(UI.pendingChanges.length)scheduleMutationSync();
}

function toggleTheme(){setUserTheme(!isDark());}
function setAccent(key){const theme=ACCENT_THEMES[key]?key:'pink';applyAccentTheme(theme);storage.set(CONFIG.accentKey,theme);updateCurrentPreference({accent:theme});renderNavigation();renderHeader();renderPage();renderProfileDialogContent();}
function updateThemeIcon(){const button=document.getElementById('profileButton'),profile=currentUserProfile();if(button)button.title=`Đang đăng nhập: ${profile.displayName||'Người dùng'}`;const dot=document.getElementById('profileStatusDot');if(dot){dot.classList.toggle('bg-rose-500',profile.status==='locked');dot.classList.toggle('bg-emerald-500',profile.status!=='locked');}}
function openSidebar(){document.getElementById('sidebar').classList.remove('-translate-x-full');document.getElementById('sidebarOverlay').classList.remove('hidden');document.body.classList.add('overflow-hidden');}
function closeSidebar(){if(window.innerWidth>=1024)return;document.getElementById('sidebar').classList.add('-translate-x-full');document.getElementById('sidebarOverlay').classList.add('hidden');document.body.classList.remove('overflow-hidden');}
function toggleMobileActions(){if(UI.mobileActionsOpen)closeMobileActions();else openMobileActions();}
function exportData(){const safeData=structuredClone(DATA);safeData.security=[];safeData.accounts=(safeData.accounts||[]).map(row=>({id:row.id,userCode:row.userCode,displayName:row.displayName,usernameLabel:row.usernameLabel,status:row.status,updatedAt:row.updatedAt}));const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),securityRedacted:true,data:safeData,pendingChanges:UI.pendingChanges.filter(change=>!['security','accounts'].includes(change.collection))},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`wedding-os-safe-backup-${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(url);toast('Đã xuất bản sao JSON đã loại bỏ hash, salt, ciphertext và khóa phiên.','success');}

function resetData(){if(!confirm('Đặt lại dữ liệu cục bộ về trạng thái trống? Các thay đổi chưa đồng bộ sẽ bị xóa.'))return;clearSettingsDraft();clearRememberedLogin();lockAuthenticatedShell();DATA=migrateData(INITIAL_DATA);UI.pendingChanges=[];AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=true;secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);secrets.remove(CONFIG.sensitiveSessionKey);secrets.remove(CONFIG.sensitivePendingKey);savePendingChanges();saveData();storage.remove(CONFIG.fullSyncEndpointKey);storage.remove(CONFIG.lastFullSyncAtKey);storage.remove(CONFIG.schemaEndpointKey);storage.remove(CONFIG.schemaSignatureKey);storage.remove(CONFIG.remoteSchemaHashKey);applyCurrentPreferences();toast('Đã đặt lại dữ liệu cục bộ về trạng thái trống. WeddingOS sẽ ưu tiên dữ liệu Google Sheets khi kết nối.','success');renderNavigation();renderPage();}

function toast(message,type='info'){const tones={success:['circle-check-big','border-emerald-200 bg-white text-slate-900 dark:border-emerald-900 dark:bg-slate-900 dark:text-white','bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'],info:['info','border-blue-200 bg-white text-slate-900 dark:border-blue-900 dark:bg-slate-900 dark:text-white','bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'],error:['circle-alert','border-rose-200 bg-white text-slate-900 dark:border-rose-900 dark:bg-slate-900 dark:text-white','bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300']};const [toastIcon,wrapper,iconClass]=tones[type]||tones.info,id=uid('toast'),node=document.createElement('div');node.id=id;node.className=`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-panel animate-slide-in ${wrapper}`;node.innerHTML=`<span class="grid size-9 shrink-0 place-items-center rounded-xl ${iconClass}">${icon(toastIcon,'size-4')}</span><div class="min-w-0 flex-1"><p class="text-sm font-semibold">${esc(message)}</p></div><button type="button" aria-label="Đóng thông báo" class="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white">${icon('x','size-3.5')}</button>`;node.querySelector('button').addEventListener('click',()=>node.remove());document.getElementById('toastRegion').appendChild(node);refreshIcons();setTimeout(()=>node.remove(),5200);}

function bindGlobalEvents(){
  document.getElementById('openSidebar').addEventListener('click',openSidebar);document.getElementById('closeSidebar').addEventListener('click',closeSidebar);document.getElementById('sidebarOverlay').addEventListener('click',closeSidebar);document.getElementById('profileButton').addEventListener('click',openProfileDialog);document.getElementById('notificationButton').addEventListener('click',openNotificationCenter);document.getElementById('settingsAccessForm').addEventListener('submit',submitSettingsAccess);document.getElementById('cancelSettingsAccess').addEventListener('click',cancelSettingsAccess);document.getElementById('forgotAdminPassword').addEventListener('click',()=>sendAdminPasswordResetCode(false));document.getElementById('adminPasswordResetForm').addEventListener('submit',submitAdminPasswordReset);document.getElementById('cancelAdminPasswordReset').addEventListener('click',cancelAdminPasswordReset);document.getElementById('resendAdminResetCode').addEventListener('click',()=>sendAdminPasswordResetCode(true));document.getElementById('settingsPasswordForm').addEventListener('submit',submitSettingsPassword);document.getElementById('cancelSettingsPassword').addEventListener('click',cancelSettingsPassword);document.getElementById('accountForm').addEventListener('submit',saveAccount);document.getElementById('accountPasswordForm').addEventListener('submit',saveAccountPassword);document.getElementById('accountLoginForm').addEventListener('submit',submitAccountLogin);document.getElementById('selfPasswordForm').addEventListener('submit',submitSelfPassword);document.getElementById('columnSettingsForm').addEventListener('submit',saveColumnSettings);document.getElementById('resetColumnSettingsButton').addEventListener('click',resetColumnSettings);document.getElementById('sortForm')?.addEventListener('submit',saveListSort);document.getElementById('resetSortButton')?.addEventListener('click',resetListSort);document.getElementById('budgetLimitOpenSettings')?.addEventListener('click',()=>{document.getElementById('budgetLimitDialog')?.close();navigate('settings');});document.getElementById('dashboardTextForm').addEventListener('submit',saveDashboardText);document.getElementById('adminAccessFromLogin').addEventListener('click',openAdminFromLogin);document.getElementById('editButton')?.addEventListener('click',toggleEditMode);document.getElementById('saveButton')?.addEventListener('click',savePreview);document.getElementById('syncButton').addEventListener('click',syncPreview);document.getElementById('editorForm').addEventListener('submit',saveEditor);document.getElementById('editorForm').addEventListener('invalid',event=>focusEditorFieldError(event.target),true);document.getElementById('confirmDeleteButton').addEventListener('click',confirmDelete);document.getElementById('connectionForm').addEventListener('submit',saveConnectionSettings);document.getElementById('toggleConnectionPassword').addEventListener('click',toggleConnectionPassword);document.getElementById('copyConnectionLink').addEventListener('click',copyConnectionLink);document.getElementById('filterForm').addEventListener('submit',applyFilterDialog);document.getElementById('resetFilterDraftButton').addEventListener('click',resetFilterDraft);document.getElementById('lookupEditForm').addEventListener('submit',saveLookupEdit);
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.closeDialog).close()));
  ['accountLoginDialog','settingsPasswordDialog','adminPasswordResetDialog'].forEach(id=>document.getElementById(id)?.addEventListener('cancel',event=>{if(id==='accountLoginDialog'||id==='adminPasswordResetDialog'||AUTH.passwordChangeForced)event.preventDefault();}));
  document.querySelectorAll('[data-mobile-action]').forEach(button=>button.addEventListener('click',()=>{toggleMobileActions();({edit:toggleEditMode,save:savePreview,sync:syncPreview})[button.dataset.mobileAction]?.();}));
  document.addEventListener('pointerdown',event=>{if(!UI.mobileActionsOpen)return;const sheet=document.getElementById('mobileActions'),trigger=document.getElementById('mobileCreateButton'),target=event.target;if(sheet?.contains(target)||trigger?.contains(target))return;closeMobileActions();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeSidebar();if(UI.mobileActionsOpen)closeMobileActions();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'){event.preventDefault();savePreview();}});
  window.addEventListener('resize',()=>{if(window.innerWidth>=1024){closeMobileActions();document.getElementById('sidebarOverlay').classList.add('hidden');document.body.classList.remove('overflow-hidden');}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&UI.autoSyncNextAt&&Date.parse(UI.autoSyncNextAt)<=Date.now()&&!UI.syncing)autoSyncTick();});
  document.getElementById('syncConflictForm')?.addEventListener('submit',resolveActiveConflict);document.getElementById('discardConflictButton')?.addEventListener('click',discardActiveConflict);
}

async function init(){
  lockAuthenticatedShell();applyCurrentPreferences();bindGlobalEvents();refreshIcons();importEndpointBootstrap();const remembered=restoreRememberedLogin();const endpoint=configuredEndpoint();
  if(endpoint){
    if(AUTH.currentUserId){
      try{
        let state=null;
        if(serverAccountToken()){try{state=await getSyncState();}catch(error){if(error.code!=='AUTH_REQUIRED')throw error;secrets.remove(CONFIG.accountServerSessionKey);}}
        if(!state&&remembered){await resumeRememberedServerSession();state=await getSyncState();}
        if(state){UI.serverRevisionHint=Number(state.revision||0);const hasCache=activateUserCache(AUTH.currentUserId);UI.hydrationState='loading';UI.hydrationHasCache=hasCache;UI.hydrationError='';UI.mutationLocked=true;UI.loading=!hasCache;renderAuthenticatedWorkspace();initialHydrateAfterLogin();return;}
      }catch(error){console.warn('Không xác minh được phiên đã ghi nhớ',error);clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';AUTH.currentProfile=null;showInlineError('loginError',error.code==='AUTH_REQUIRED'||error.code==='REMEMBER_INVALID'?'Phiên ghi nhớ không còn hợp lệ. Vui lòng đăng nhập lại.':`Không thể xác minh phiên đăng nhập: ${error.message}`);}
    }
    enforceLoginGate();getServerStatus().catch(error=>{console.warn('Không tải được trạng thái máy chủ',error);showInlineError('loginError',`Không thể kết nối Google Sheets: ${error.message}`);});return;
  }
  const row=(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId&&item.status!=='locked');if(row){UI.hydrationState='ready';UI.mutationLocked=false;renderAuthenticatedWorkspace();return;}enforceLoginGate();
}

window.navigate=navigate;window.openProfileDialog=openProfileDialog;window.openColumnSettings=openColumnSettings;window.openEditor=openEditor;window.openNotificationCenter=openNotificationCenter;window.openReport=openReport;window.openDetails=openDetails;window.setCollectionFilter=setCollectionFilter;window.setMetricFilter=setMetricFilter;window.setGuestFilter=setGuestFilter;document.addEventListener('DOMContentLoaded',init);

