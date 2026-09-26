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
  survey_candidates:[], survey_trips:[], survey_visits:[], survey_evaluations:[], record_links:[],
  attachments:[], settings:[], security:[], accounts:[], preferences:[], notifications:[], user_notifications:[], notification_receipts:[], lookup_items:[]
};

const CONFIG = {
  storageKey: 'wedding-os-preview-v4-cache',
  legacyStorageKey: 'wedding-os-preview-v3',
  pendingKey: 'wedding-os-pending-changes-v1',
  endpointKey: 'wedding-os-google-sheets-endpoint',
  passwordKey: 'wedding-os-google-sheets-password',
  schemaPasswordKey: 'wedding-os-google-sheets-schema-password',
  endpointUrlParam: 'wos_endpoint',
  schemaVersion: 22,
  syncProtocolVersion: 2,
  deviceIdKey: 'wedding-os-device-id-v2',
  conflictKey: 'wedding-os-sync-conflicts-v2',
  syncIssuePrefix: 'wedding-os-sync-issues-v1:',
  syncBatchSize: 10,
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
    auth: 45000,
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
    {id:'survey', label:'Khảo sát', icon:'map-pinned', tone:'cyan', description:'Lập lịch, đi thực tế & đánh giá'},
    {id:'guide', label:'Hướng dẫn', icon:'book-open-text', tone:'indigo', description:'Logic liên kết & công thức'},
    {id:'settings', label:'Thiết lập', icon:'settings-2', tone:'cyan', description:'Thông tin và danh mục'}
  ],
  schemas: {
    checklist: {
      title:'Công việc', singular:'công việc', icon:'list-checks',
      search:['task','group','anchorEvent','owner','location','budgetCategory'],
      filterFields:['group','anchorEvent','location','owner','priority','status','budgetCategory'],
      statusField:'status', filterOptions:['Tất cả','Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],
      columns:['task','anchorEvent','group','owner','budgetCategory','priority','status','dueDate'],
      fields:[
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',backendLabel:'Sự kiện neo',required:true}],
        ['group','Nhóm việc','select',{lookup:'checklistGroups',required:true}],
        ['task','Nội dung công việc','textarea',{backendLabel:'Công việc chi tiết',required:true}],
        ['previousStatus','Trạng thái trước khi hoàn thành','text',{editorHidden:true,hidden:true}],
        ['autoStartAppliedDate','Ngày đã tự động bắt đầu','date',{editorHidden:true,hidden:true}],
        // Persisted preference for the custom suggestion panel. Hidden from generic CRUD fields; rendered by renderChecklistSuggestionPanel().
        ['needsSuggestion','Cần gợi ý','boolean',{editorHidden:true,hidden:true}],
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
        {id:'general',title:'Thông tin chung',icon:'tags',fields:['anchorEvent','group','task'],rows:[['anchorEvent','group'],['task']]},
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
      columns:['name','anchorEvent','serviceGroup','category','contractValue','payable','score','status','decisionDue'],
      fields:[
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',required:true}],
        // LABEL-ONLY UPGRADE: serviceGroup keeps its original key/source/linking logic; only the user-facing label changes.
        ['serviceGroup','Nhóm công việc','select',{lookup:'checklistGroups',required:true}],
        // LABEL + INPUT UPGRADE: category keeps vendorCategories semantics but now accepts multiple values.
        ['category','Dịch vụ/hạng mục cung cấp','multiselect',{lookup:'vendorCategories',required:true,multiDropdown:true,helpText:'Có thể chọn một hoặc nhiều dịch vụ/hạng mục mà nhà cung cấp cung cấp.'}],
        // LEGACY COMPATIBILITY ONLY: keeps the old v13 category_id column readable during Schema v14 rollout. It is NOT a "dịch vụ chính" and must not drive UI semantics.
        ['category_id','Danh mục dịch vụ legacy','text',{editorHidden:true,hidden:true,detailHidden:true}],
        ['survey_candidate_id','Nguồn khảo sát ID','text',{editorHidden:true,hidden:true}], ['surveyCandidateName','Nguồn khảo sát','text',{editorHidden:true,hidden:true,detailHidden:true}],
        ['name','Tên nhà cung cấp','text',{required:true}], ['location','Khu vực / địa điểm','text',{backendLabel:'Địa điểm'}], ['contact','Thông tin liên hệ','text',{backendLabel:'Liên hệ'}],
        ['quote','Giá / báo giá','currency',{backendLabel:'Báo giá'}],
        ['score','Điểm đánh giá','number',{backendLabel:'Điểm /10',helpText:'Chọn điểm từ 1 đến 10.',selectValues:[1,2,3,4,5,6,7,8,9,10]}], ['status','Trạng thái','select',{values:['Đang khảo sát','Đã nhận báo giá','Đã chọn','Đã cọc','Hoàn tất','Loại'],required:true}],
        ['decisionDue','Hạn chốt nhà cung cấp','date',{backendLabel:'Hạn quyết định'}],
        ['contractValue','Giá trị hợp đồng/dịch vụ','currency'], ['deposit','Tiền cọc','currency'], ['paid','Đã thanh toán','currency'], ['payable','Còn phải thanh toán','currency',{readOnly:true}], ['paymentTerms','Điều khoản thanh toán','textarea'],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'general',title:'Thông tin chung',icon:'tags',fields:['anchorEvent','serviceGroup','category'],rows:[['anchorEvent','serviceGroup'],['category']]},
        {id:'vendor',title:'Thông tin nhà cung cấp',icon:'store',fields:['name','location','contact','quote'],rows:[['name'],['location','contact'],['quote']]},
        {id:'decision',title:'Đánh giá & quyết định',icon:'badge-check',fields:['score','status','decisionDue'],rows:[['score','status','decisionDue']]},
        {id:'contract',title:'Thanh toán & hợp đồng',icon:'file-signature',fields:['contractValue','deposit','paid','payable','paymentTerms'],rows:[['contractValue','deposit'],['paid','payable'],['paymentTerms']]},
        {id:'notes',title:'Ghi chú & tài liệu',icon:'file-text',fields:['notes']}
      ],
      reportFields:['status','contractValue','deposit','paid','payable','paymentTerms','notes']
    },
    survey_candidates: {
      title:'Địa điểm khảo sát', singular:'địa điểm khảo sát', icon:'map-pin-check',
      search:['name','anchorEvent','group','address','contact','decision','notes'], filterFields:['anchorEvent','group','decision'], statusField:null, filterOptions:['Tất cả'],
      columns:['name','anchorEvent','group','surveyState','visitCount','latestScore','latestVisitDate','decision'],
      fields:[
        ['reference_id','Nguồn Tham khảo ID','text',{editorHidden:true,hidden:true}],
        ['referenceSource','Nguồn Tham khảo','text',{editorHidden:true,hidden:true,detailHidden:true}],
        ['anchorEvent','Sự kiện liên quan','select',{lookup:'anchorEvents',required:true,editorHidden:true}],
        ['group','Nhóm công việc','select',{lookup:'checklistGroups',required:true,editorHidden:true}],
        ['name','Tên địa điểm / đơn vị','text',{required:true}],
        ['address','Địa chỉ','text'], ['mapUrl','Link bản đồ','url'], ['contact','Thông tin liên hệ','text'],
        ['decision','Quyết định','select',{values:['Chưa quyết định','Ưu tiên cao','Cần khảo sát lại','Đã chọn','Loại','Không khảo sát nữa']}],
        ['needsRevisit','Cần khảo sát lại','boolean',{editorHidden:true,hidden:true}],
        ['vendor_id','Nhà cung cấp liên kết ID','text',{editorHidden:true,hidden:true}],
        ['surveyState','Trạng thái khảo sát','text',{editorHidden:true,detailHidden:true,transient:true}],
        ['visitCount','Số lần đã đi','number',{editorHidden:true,detailHidden:true,transient:true}],
        ['latestScore','Điểm gần nhất','number',{editorHidden:true,detailHidden:true,transient:true}],
        ['latestVisitDate','Lần gần nhất','date',{editorHidden:true,detailHidden:true,transient:true}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'classification',title:'Phân loại',icon:'tags',fields:['anchorEvent','group','name'],rows:[['anchorEvent','group'],['name']]},
        {id:'location',title:'Địa điểm & liên hệ',icon:'map-pinned',fields:['address','mapUrl','contact'],rows:[['address'],['mapUrl','contact']]},
        {id:'decision',title:'Quyết định',icon:'badge-check',fields:['decision']},
        {id:'notes',title:'Ghi chú & tài liệu',icon:'file-text',fields:['notes']}
      ], reportFields:[]
    },
    survey_trips: {
      title:'Kế hoạch khảo sát', singular:'kế hoạch khảo sát', icon:'route',
      search:['name','surveyDate','startLocation','participants','status','notes'], filterFields:['surveyDate','status','participants'], statusField:'status',
      filterOptions:['Tất cả','Bản nháp','Đã lên lịch','Đang thực hiện','Chờ đánh giá','Hoàn tất','Kết thúc sớm','Hủy'],
      columns:['surveyDate','name','startTime','startLocation','participants','status'],
      fields:[
        ['name','Tên kế hoạch','text',{required:true}], ['surveyDate','Ngày khảo sát','date',{required:true}], ['startTime','Giờ bắt đầu','time'],
        ['startLocation','Điểm xuất phát','text'], ['participants','Người tham gia','multiselect',{lookup:'owners',multiDropdown:true}],
        ['status','Trạng thái','select',{values:['Bản nháp','Đã lên lịch','Đang thực hiện','Chờ đánh giá','Hoàn tất','Kết thúc sớm','Hủy'],required:true}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'plan',title:'Thông tin kế hoạch',icon:'calendar-days',fields:['name','surveyDate','startTime','status'],rows:[['name'],['surveyDate','startTime','status']]},
        {id:'people',title:'Xuất phát & người tham gia',icon:'users-round',fields:['startLocation','participants'],rows:[['startLocation'],['participants']]},
        {id:'notes',title:'Ghi chú',icon:'file-text',fields:['notes']}
      ], reportFields:[]
    },
    survey_visits: {
      title:'Lần khảo sát', singular:'lần khảo sát', icon:'map-pinned',
      search:['candidateName','tripName','scheduledTime','status','skipReason','notes'], filterFields:['status'], statusField:'status',
      filterOptions:['Tất cả','Đã lên lịch','Đang khảo sát','Đã thực hiện','Dời lịch','Không thực hiện','Hủy'],
      columns:['candidateName','tripName','sequence','scheduledTime','expectedDuration','status'],
      fields:[
        ['candidateName','Địa điểm','text',{editorHidden:true}], ['candidate_id','Địa điểm ID','text',{editorHidden:true,hidden:true,required:true}],
        ['tripName','Kế hoạch','text',{editorHidden:true}], ['trip_id','Kế hoạch ID','text',{editorHidden:true,hidden:true,required:true}],
        ['sequence','Thứ tự','number',{required:true}], ['scheduledTime','Giờ dự kiến','time'], ['expectedDuration','Thời lượng dự kiến (phút)','number'],
        ['actualArrivalTime','Giờ thực tế đến','time'], ['actualLeaveTime','Giờ rời đi','time'],
        ['status','Trạng thái','select',{values:['Đã lên lịch','Đang khảo sát','Đã thực hiện','Dời lịch','Không thực hiện','Hủy'],required:true}],
        ['skipReason','Lý do không thực hiện / dời lịch','textarea'], ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'visit',title:'Lịch khảo sát',icon:'clock-3',fields:['sequence','scheduledTime','expectedDuration','status'],rows:[['sequence','scheduledTime','expectedDuration'],['status']]},
        {id:'actual',title:'Thực tế',icon:'map-pin-check',fields:['actualArrivalTime','actualLeaveTime'],rows:[['actualArrivalTime','actualLeaveTime']]},
        {id:'notes',title:'Kết quả & ghi chú',icon:'file-text',fields:['skipReason','notes']}
      ], reportFields:[]
    },
    survey_evaluations: {
      title:'Đánh giá khảo sát', singular:'đánh giá khảo sát', icon:'clipboard-check',
      search:['candidateName','decision','evaluationNotes'], filterFields:['decision'], statusField:null,
      filterOptions:['Tất cả'], columns:['candidateName','overallScore','actualQuote','decision','completedAt'],
      fields:[
        ['visit_id','Lần khảo sát ID','text',{editorHidden:true,hidden:true,required:true}], ['candidate_id','Địa điểm ID','text',{editorHidden:true,hidden:true,required:true}],
        ['candidateName','Địa điểm','text',{editorHidden:true,detailHidden:true}],
        ['qualityScore','Chất lượng','number',{selectValues:[1,2,3,4,5,6,7,8,9,10],required:true}],
        ['serviceScore','Tư vấn / Phục vụ','number',{selectValues:[1,2,3,4,5,6,7,8,9,10],required:true}],
        ['priceScore','Giá cả','number',{selectValues:[1,2,3,4,5,6,7,8,9,10],required:true}],
        ['facilityScore','Không gian / cơ sở vật chất','number',{editorHidden:true,hidden:true}],
        ['locationScore','Vị trí / di chuyển','number',{editorHidden:true,hidden:true}],
        ['fitScore','Độ phù hợp nhu cầu','number',{editorHidden:true,hidden:true}],
        ['overallScore','Điểm TB','number',{readOnly:true,required:true}],
        ['pros','Điểm mạnh','textarea',{editorHidden:true,hidden:true}], ['cons','Điểm hạn chế','textarea',{editorHidden:true,hidden:true}],
        ['actualQuote','Báo giá thực tế','currency'],
        ['decision','Quyết định','select',{values:['Chưa quyết định','Ưu tiên cao','Cần khảo sát lại','Đã chọn','Loại'],required:true}],
        ['status','Trạng thái đánh giá','select',{values:['Nháp','Hoàn tất'],required:true,editorHidden:true,hidden:true}], ['completedAt','Hoàn tất lúc','datetime',{editorHidden:true,hidden:true}],
        ['evaluationNotes','Ghi chú đánh giá','textarea']
      ],
      sections:[
        {id:'scores',title:'Chấm điểm',icon:'star',fields:['qualityScore','serviceScore','priceScore','overallScore'],rows:[['qualityScore','serviceScore','priceScore','overallScore']]},
        {id:'decision',title:'Báo giá & quyết định',icon:'badge-check',fields:['actualQuote','decision'],rows:[['actualQuote','decision']]},
        {id:'notes',title:'Ghi chú đánh giá',icon:'file-text',fields:['evaluationNotes']}
      ], reportFields:[]
    },
    references: {
      title:'Tham khảo', singular:'nguồn tham khảo', icon:'book-open-check',
      search:['title','group','source','event','sourceUrl','notes','surveyStatus','surveyEvaluationNotes'], filterFields:['group','source','event','interestLevel','priorityLevel','rating','needsSurvey','surveyStatus'], statusField:null,
      filterOptions:['Tất cả'],
      columns:['title','group','event','sourceUrl','interestLevel','priorityLevel','source','rating','surveyStatus','surveyDetail','surveyEvaluationNotes','notes'],
      fields:[
        ['title','Tiêu đề','text',{required:true}],
        ['event','Sự kiện liên quan','select',{lookup:'anchorEvents',backendLabel:'Sự kiện',required:true}],
        ['group','Nhóm công việc','select',{lookup:'checklistGroups',backendLabel:'Nhóm việc',required:true}],
        ['needsSurvey','Lên kế hoạch đi tới xem trực tiếp','boolean',{editorHidden:true,hidden:true,sortable:true}],
        ['listHidden','Ẩn khỏi danh sách','boolean',{editorHidden:true,hidden:true,detailHidden:true}],
        ['surveyStatus','Khảo sát thực tế','text',{editorHidden:true,detailHidden:true,transient:true}],
        ['surveyDetail','Chi tiết khảo sát','text',{editorHidden:true,detailHidden:true,transient:true}],
        ['surveyEvaluationNotes','Ghi chú đánh giá khảo sát','textarea',{editorHidden:true,detailHidden:true,transient:true}],
        ['sourceUrl','Đường dẫn tham khảo','url',{backendLabel:'Link nguồn tham khảo'}],
        ['interestLevel','Mức độ quan tâm','select',{lookup:'interestLevels',required:true}],
        ['priorityLevel','Mức độ ưu tiên','select',{lookup:'referencePriorities'}],
        ['source','Nguồn / nền tảng','select',{lookup:'referenceSources',backendLabel:'Nguồn thông tin'}],
        ['rating','Điểm đánh giá','rating',{backendLabel:'Đánh giá'}],
        ['notes','Ghi chú','textarea']
      ],
      sections:[
        {id:'classification',title:'Thông tin tham khảo',icon:'tags',fields:['title','event','group'],rows:[['title'],['event','group']]},
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


const SURVEY_LIST_SCHEMA = Object.freeze({
  title:'Khảo sát', singular:'lần khảo sát', icon:'map-pinned',
  search:['tripName','candidateName','referenceTitle','anchorEvent','group','interestLevel','participants','status','decision','address'],
  filterFields:['tripStatus','status','anchorEvent','group','interestLevel','decision','participants'],
  statusField:null, filterOptions:['Tất cả'],
  columns:['visited','candidateName','referenceTitle','tripName','surveyDate','anchorEvent','group','scheduledTime','status','overallScore','decision'],
  fields:[
    ['visited','Đã đi','boolean',{sortable:true}],
    ['candidateName','Địa điểm','text',{}],
    ['referenceTitle','Tiêu đề','text',{}],
    ['tripName','Tên kế hoạch','text',{}],
    ['surveyDate','Ngày khảo sát','date',{}],
    ['participants','Người tham gia','multiselect',{}],
    ['tripStatus','Trạng thái kế hoạch','select',{values:['Bản nháp','Đã lên lịch','Đang thực hiện','Chờ đánh giá','Hoàn tất','Kết thúc sớm','Hủy']}],
    ['anchorEvent','Sự kiện liên quan','text',{}],
    ['group','Nhóm việc','text',{}],
    ['interestLevel','Mức độ quan tâm','text',{}],
    ['referenceRating','Đánh giá tham khảo','rating',{}],
    ['scheduledTime','Thời gian đến','time',{}],
    ['address','Địa chỉ','text',{}],
    ['mapUrl','Link bản đồ','url',{}],
    ['status','Trạng thái lần đi','select',{values:['Đã lên lịch','Đang khảo sát','Đã thực hiện','Dời lịch','Không thực hiện','Hủy']}],
    ['overallScore','Điểm TB','number',{}],
    ['decision','Quyết định','select',{values:['Chưa quyết định','Ưu tiên cao','Cần khảo sát lại','Đã chọn','Loại']}]
  ]
});
function getUiSchema(collection){return collection==='survey'?SURVEY_LIST_SCHEMA:CONFIG.schemas[collection];}

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
  vendors:{anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'},category_ids:{lookupKey:'vendorCategories',legacyKey:'category',multiple:true},service_group_id:{lookupKey:'checklistGroups',legacyKey:'serviceGroup'}},
  references:{group_id:{lookupKey:'checklistGroups',legacyKey:'group'},anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'event'},source_id:{lookupKey:'referenceSources',legacyKey:'source'},interest_level_id:{lookupKey:'interestLevels',legacyKey:'interestLevel'},priority_level_id:{lookupKey:'referencePriorities',legacyKey:'priorityLevel'}},
  survey_candidates:{group_id:{lookupKey:'checklistGroups',legacyKey:'group'},anchor_event_id:{lookupKey:'anchorEvents',legacyKey:'anchorEvent'}},
  survey_trips:{participant_ids:{lookupKey:'owners',legacyKey:'participants',multiple:true}}
});
const ENTITY_REFERENCE_FIELDS = Object.freeze({
  checklist:{budget_item_id:{collection:'budget',legacyKey:'budgetCategory',labelKey:'category'}},
  timeline:{vendor_id:{collection:'vendors',legacyKey:'vendor',labelKey:'name'}},
  survey_visits:{candidate_id:{collection:'survey_candidates',legacyKey:'candidateName',labelKey:'name'},trip_id:{collection:'survey_trips',legacyKey:'tripName',labelKey:'name'}},
  survey_evaluations:{candidate_id:{collection:'survey_candidates',legacyKey:'candidateName',labelKey:'name'}},
  vendors:{survey_candidate_id:{collection:'survey_candidates',legacyKey:'surveyCandidateName',labelKey:'name'}}
});
const TECHNICAL_RECORD_FIELDS = new Set(['_rowVersion','_updatedAt','_updatedBy']);
const RELATED_LINK_TARGETS = Object.freeze([
  {collection:'checklist',label:'Công việc',titleKey:'task'},
  {collection:'timeline',label:'Timeline',titleKey:'event'},
  {collection:'budget',label:'Ngân sách',titleKey:'category'},
  {collection:'guests',label:'Khách mời',titleKey:'name'},
  {collection:'vendors',label:'Nhà cung cấp',titleKey:'name'},
  {collection:'references',label:'Tham khảo',titleKey:'title'},
  {collection:'survey_trips',label:'Khảo sát',titleKey:'name'}
]);
const RELATED_LINK_TARGET_MAP = Object.freeze(Object.fromEntries(RELATED_LINK_TARGETS.map(item=>[item.collection,item])));


const UI = {
  tab:'dashboard', editMode:false, loading:false, search:'', filter:'Tất cả', visibleCount:CONFIG.pageSize,
  secondaryFilter:null, advancedFilters:{}, dateFilters:{}, filterDraft:null, settingsDraft:null, filterPanelOpen:false, lookupPages:{}, editing:null, editingLookup:null, deleting:null, mobileActionsOpen:false,
  sortCollection:null, sortDraft:null, listSorts:{}, columnCollection:null, columnDraft:[], conflicts:loadSyncConflicts(), syncIssues:loadSyncIssues('admin'), activeConflictIndex:0,
  hydrationState:'idle', hydrationHasCache:false, hydrationError:'', hydrationRunId:0, mutationLocked:false, serverRevisionHint:0, surveyMetricFilter:'', surveyPlanner:null, recordLinkPicker:null, referenceShowHidden:false,
  syncing:false, syncMode:'', autoSyncTimer:null, autoSyncNextAt:'', autoSyncLastAttemptAt:'', autoSyncLastError:'', syncFailureNotificationId:'', syncConflictNotificationId:'', mutationSyncTimer:null, mutationSyncDueAt:'', lastSyncAt:storage.get('wedding-last-sync-at',''), pendingChanges:loadPendingChanges('admin')
};

let DATA = loadData();

function uniqueValues(rows,key) {
  return [...new Set((rows || []).map(row => String(row?.[key] ?? '').trim()).filter(Boolean))];
}


function moduleCollectionNames() { return Object.keys(CONFIG.schemas || {}); }
function recordCollectionNames() { return [...moduleCollectionNames(),'record_links','attachments','settings','security','accounts','preferences','notifications','user_notifications','notification_receipts']; }
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
    if(meta.multiple){
      const labels=Array.isArray(record[meta.legacyKey])?record[meta.legacyKey]:[record[meta.legacyKey]].filter(Boolean),currentIds=Array.isArray(record[idKey])?record[idKey]:[],ids=[];let valid=true;
      labels.forEach((label,index)=>{const current=items.find(entry=>entry.id===currentIds[index]);if(current&&current.lookup_key===meta.lookupKey&&normalizeLookupText(current.value)===normalizeLookupText(label)){ids.push(current.id);return;}const matches=items.filter(entry=>entry.lookup_key===meta.lookupKey&&entry.active!==false&&normalizeLookupText(entry.value)===normalizeLookupText(label));if(matches.length===1)ids.push(matches[0].id);else valid=false;});
      record[idKey]=valid?ids:[];
      // Backward compatibility: keep the old singular canonical id populated with the first selection if present.
      if(collection==='vendors'&&idKey==='category_ids')record.category_id=ids[0]||'';
      return;
    }
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
  Object.entries(LOOKUP_REFERENCE_FIELDS[collection]||{}).forEach(([idKey,meta])=>{if(meta.multiple){const labels=Array.isArray(record[meta.legacyKey])?record[meta.legacyKey]:[record[meta.legacyKey]].filter(Boolean),ids=Array.isArray(record[idKey])?record[idKey]:[];if(labels.length!==ids.length)issues.push(meta.legacyKey);}else{const label=String(record[meta.legacyKey]??'').trim();if(label&&!record[idKey])issues.push(meta.legacyKey);}});
  Object.entries(ENTITY_REFERENCE_FIELDS[collection]||{}).forEach(([idKey,meta])=>{if(meta.multiple){const labels=Array.isArray(record[meta.legacyKey])?record[meta.legacyKey]:[],ids=Array.isArray(record[idKey])?record[idKey]:[];if(labels.length!==ids.length)issues.push(meta.legacyKey);}else{const label=String(record[meta.legacyKey]??'').trim();if(label&&!record[idKey])issues.push(meta.legacyKey);}});
  return [...new Set(issues)];
}

function hydrateReferenceLabels(data=DATA){
  Object.entries(LOOKUP_REFERENCE_FIELDS).forEach(([collection,map])=>(data[collection]||[]).forEach(record=>{Object.entries(map).forEach(([idKey,meta])=>{if(meta.multiple){const ids=Array.isArray(record[idKey])?record[idKey]:(record.category_id&&collection==='vendors'&&idKey==='category_ids'?[record.category_id]:[]);if(ids.length)record[meta.legacyKey]=ids.map(id=>(data.lookup_items||[]).find(entry=>entry.id===id)?.value).filter(Boolean);if(collection==='vendors'&&idKey==='category_ids'){record[idKey]=ids;record.category_id=ids[0]||record.category_id||'';}return;}if(record[idKey]){const item=(data.lookup_items||[]).find(entry=>entry.id===record[idKey]);if(item)record[meta.legacyKey]=item.value;}});}));
  Object.entries(ENTITY_REFERENCE_FIELDS).forEach(([collection,map])=>(data[collection]||[]).forEach(record=>{Object.entries(map).forEach(([idKey,meta])=>{if(meta.multiple){if(Array.isArray(record[idKey])&&record[idKey].length)record[meta.legacyKey]=record[idKey].map(id=>(data[meta.collection]||[]).find(row=>row.id===id)?.[meta.labelKey]).filter(Boolean);}else if(record[idKey]){const target=(data[meta.collection]||[]).find(row=>row.id===record[idKey]);if(target)record[meta.legacyKey]=target[meta.labelKey]||'';}});}));
  return data;
}
function referenceCountForLookupItem(item){let count=0;Object.entries(LOOKUP_REFERENCE_FIELDS).forEach(([collection,map])=>Object.entries(map).forEach(([idKey,meta])=>{if(meta.lookupKey!==item.lookup_key)return;(DATA[collection]||[]).forEach(row=>{if(meta.multiple?(Array.isArray(row[idKey])&&row[idKey].includes(item.id)):row[idKey]===item.id)count++;});}));return count;}

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
  (schema.fields||[]).forEach(field=>{if(!field?.[3]?.transient)add(field[0]);});
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
    if(legacyCanonical?.type==='lookup')type=legacyCanonical.multiple?'multiselect':'text';
    if(canonicalLookup||canonicalEntity)type=(canonicalLookup?.multiple||canonicalEntity?.multiple)?'multiselect':'text';
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
  modules.record_links={collection:'record_links',sheetName:'record_links',title:'Liên kết bản ghi',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'source_collection',label:'Phân hệ nguồn',type:'text',required:true,hidden:false,allowBlank:false,width:150},
    {key:'source_record_id',label:'ID bản ghi nguồn',type:'text',required:true,hidden:false,allowBlank:false,width:180},
    {key:'target_collection',label:'Phân hệ liên kết',type:'text',required:true,hidden:false,allowBlank:false,width:150},
    {key:'target_record_id',label:'ID bản ghi liên kết',type:'text',required:true,hidden:false,allowBlank:false,width:180},
    {key:'created_at',label:'Tạo lúc',type:'datetime',required:true,hidden:false,allowBlank:false,width:170},
    {key:'created_by',label:'Tạo bởi',type:'text',required:false,hidden:false,allowBlank:true,width:160},
    {key:'_rowVersion',label:'Row version',type:'number',required:false,hidden:true,allowBlank:true,width:100},
    {key:'_updatedAt',label:'Cập nhật kỹ thuật',type:'datetime',required:false,hidden:true,allowBlank:true,width:160},
    {key:'_updatedBy',label:'Cập nhật bởi',type:'text',required:false,hidden:true,allowBlank:true,width:160}
  ]};
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
    {key:'uploadedByAccountId',label:'Tài khoản tải lên',type:'text',required:false,hidden:true,allowBlank:true,width:180},
    {key:'status',label:'Trạng thái gắn bản ghi',type:'select',options:['staged','attached'],required:false,hidden:false,allowBlank:true,width:140},
    {key:'stagedAt',label:'Tải tạm lên lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:170},
    {key:'attachedAt',label:'Gắn bản ghi lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:170},
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
    {key:'groups',label:'Cấu hình gộp danh sách',type:'json',required:false,hidden:false,allowBlank:true,width:300},
    {key:'survey',label:'Tùy chọn màn hình Khảo sát',type:'json',required:false,hidden:false,allowBlank:true,width:300},
    {key:'notificationReadIds',label:'Dấu đọc thông báo',type:'json',required:false,hidden:true,allowBlank:true,width:300},
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
  modules.user_notifications={collection:'user_notifications',sheetName:'user_notifications',title:'Thông báo theo tài khoản',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:true,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'accountId',label:'Mã tài khoản',type:'text',required:true,hidden:false,allowBlank:false,width:170},
    {key:'type',label:'Loại',type:'text',required:true,hidden:false,allowBlank:false,width:120},
    {key:'tone',label:'Mức cảnh báo',type:'text',required:true,hidden:false,allowBlank:false,width:120},
    {key:'title',label:'Tiêu đề',type:'text',required:true,hidden:false,allowBlank:false,width:280},
    {key:'message',label:'Nội dung',type:'textarea',required:true,hidden:false,allowBlank:false,width:420},
    {key:'collection',label:'Phân hệ',type:'text',required:false,hidden:false,allowBlank:true,width:140},
    {key:'recordId',label:'ID bản ghi',type:'text',required:false,hidden:true,allowBlank:true,width:180},
    {key:'eventDate',label:'Ngày cảnh báo',type:'date',required:false,hidden:false,allowBlank:true,width:130},
    {key:'createdAt',label:'Tạo lúc',type:'datetime',required:true,hidden:false,allowBlank:false,width:170},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:170},
    {key:'_rowVersion',label:'Row version',type:'number',required:false,hidden:true,allowBlank:true,width:100},
    {key:'_updatedAt',label:'Cập nhật kỹ thuật',type:'datetime',required:false,hidden:true,allowBlank:true,width:160},
    {key:'_updatedBy',label:'Cập nhật bởi',type:'text',required:false,hidden:true,allowBlank:true,width:160}
  ]};
  modules.notification_receipts={collection:'notification_receipts',sheetName:'notification_receipts',title:'Xác nhận đã đọc thông báo',dataShape:'records',sensitive:false,adminOnly:false,ownerScoped:true,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:180},
    {key:'accountId',label:'Mã tài khoản',type:'text',required:true,hidden:false,allowBlank:false,width:170},
    {key:'notificationId',label:'ID thông báo',type:'text',required:true,hidden:false,allowBlank:false,width:220},
    {key:'type',label:'Loại',type:'text',required:false,hidden:false,allowBlank:true,width:120},
    {key:'tone',label:'Mức cảnh báo',type:'text',required:false,hidden:false,allowBlank:true,width:120},
    {key:'title',label:'Tiêu đề',type:'text',required:true,hidden:false,allowBlank:false,width:280},
    {key:'message',label:'Nội dung',type:'textarea',required:true,hidden:false,allowBlank:false,width:420},
    {key:'collection',label:'Phân hệ',type:'text',required:false,hidden:false,allowBlank:true,width:140},
    {key:'recordId',label:'ID bản ghi',type:'text',required:false,hidden:true,allowBlank:true,width:180},
    {key:'eventDate',label:'Ngày cảnh báo',type:'date',required:false,hidden:false,allowBlank:true,width:130},
    {key:'readAt',label:'Đã đọc lúc',type:'datetime',required:true,hidden:false,allowBlank:false,width:170},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:170},
    {key:'_rowVersion',label:'Row version',type:'number',required:false,hidden:true,allowBlank:true,width:100},
    {key:'_updatedAt',label:'Cập nhật kỹ thuật',type:'datetime',required:false,hidden:true,allowBlank:true,width:160},
    {key:'_updatedBy',label:'Cập nhật bởi',type:'text',required:false,hidden:true,allowBlank:true,width:160}
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
  return (data.vendors||[]).filter(vendor=>{const ids=Array.isArray(vendor.category_ids)&&vendor.category_ids.length?vendor.category_ids:[vendor.category_id].filter(Boolean);return activeStatuses.has(String(vendor.status||''))&&String(vendor.anchor_event_id||'')===eventId&&ids.map(String).includes(serviceId);});
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
  const budgetById=new Map();
  (data.budget||[]).forEach(item=>{const key=String(item.id);if(!budgetById.has(key))budgetById.set(key,item);});
  (data.checklist||[]).forEach(row=>{
    const budget=budgetById.get(String(row.budget_item_id||''));
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
  ensureSetting(data,'surveyModuleEnabled',true,'Bật tính năng Khảo sát thực tế');
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
  (data.preferences||[]).forEach(row=>{for(const key of ['columns','sorts','groups','survey']){if(typeof row[key]==='string'){try{row[key]=JSON.parse(row[key])||{};}catch(_){row[key]={};}}if(!row[key]||typeof row[key]!=='object'||Array.isArray(row[key]))row[key]={};}});
  (data.references||[]).forEach(row=>{if(!String(row.title||'').trim()){const linked=(data.survey_candidates||[]).find(candidate=>String(candidate.reference_id||'')===String(row.id||'')),linkedTitle=String(linked?.name||'').trim();if(linkedTitle)row.title=linkedTitle;else{const url=String(row.sourceUrl||'').replace(/^https?:\/\//,'').slice(0,50);row.title=[String(row.group||'').trim(),String(row.source||'').trim(),url].filter(Boolean).join(' · ')||`Tham khảo ${row.id||''}`;}}});
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
    if(typeof row.groups==='string'){try{row.groups=JSON.parse(row.groups)||{};}catch(_){row.groups={};}}
    if(!row.groups||typeof row.groups!=='object'||Array.isArray(row.groups))row.groups={};
    if(typeof row.survey==='string'){try{row.survey=JSON.parse(row.survey)||{};}catch(_){row.survey={};}}
    if(!row.survey||typeof row.survey!=='object'||Array.isArray(row.survey))row.survey={};
  });
  data.references.forEach(row => { row.rating = Math.min(5,Math.max(0,Number(row.rating || 0))); row.needsSurvey = row.needsSurvey===true||row.needsSurvey===1||String(row.needsSurvey||'').toLowerCase()==='true'||String(row.needsSurvey||'')==='1'; row.listHidden = row.listHidden===true||row.listHidden===1||String(row.listHidden||'').toLowerCase()==='true'||String(row.listHidden||'')==='1'; });
  data.survey_candidates.forEach(row=>{row.needsRevisit=row.needsRevisit===true||row.needsRevisit===1||String(row.needsRevisit||'').toLowerCase()==='true'||String(row.needsRevisit||'')==='1';row.decision=row.decision==='Shortlist'?'Ưu tiên cao':(row.decision||'Chưa quyết định');});
  data.survey_trips.forEach(row=>{row.status=row.status||'Bản nháp';});
  data.survey_visits.forEach(row=>{row.sequence=Math.max(1,Number(row.sequence||1));row.expectedDuration=Math.max(0,Number(row.expectedDuration||0));row.status=row.status||'Đã lên lịch';});
  data.survey_evaluations.forEach(row=>{['qualityScore','priceScore','serviceScore','facilityScore','locationScore','fitScore','overallScore'].forEach(key=>{const value=Number(row[key]);row[key]=Number.isFinite(value)&&value>=1&&value<=10?value:'';});const coreScores=['qualityScore','serviceScore','priceScore'].map(key=>Number(row[key]||0));row.overallScore=coreScores.every(value=>value>=1&&value<=10)?Math.round((coreScores.reduce((sum,value)=>sum+value,0)/3)*10)/10:'';row.actualQuote=Math.max(0,Number(row.actualQuote||0));row.status=coreScores.every(value=>value>=1&&value<=10)?'Hoàn tất':(row.status||'Nháp');row.decision=row.decision==='Shortlist'?'Ưu tiên cao':(row.decision||'Chưa quyết định');});
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
function userSyncIssueKey(accountId='admin'){return `${CONFIG.syncIssuePrefix}${encodeURIComponent(String(accountId||'admin'))}`;}
function isRemoteAccountPrincipal(){return Boolean(configuredEndpoint()&&AUTH?.currentUserId&&currentUserProfile()?.kind==='account');}
function readUserCache(accountId){
  if(!accountId)return null;
  try{const record=parseStoredJson(storage.get(userCacheKey(accountId),''),null);if(!record||record.version!==1||String(record.accountId||'')!==String(accountId)||!record.data)return null;return record;}catch(_){return null;}
}
function activateUserCache(accountId){
  const record=readUserCache(accountId);
  UI.pendingChanges=loadPendingChanges(accountId);
  UI.syncIssues=loadSyncIssues(accountId);
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

function loadSyncIssues(accountId='admin'){try{const value=JSON.parse(storage.get(userSyncIssueKey(accountId),'[]'));return Array.isArray(value)?value:[];}catch(_){return[];}}
function saveSyncIssues(){const accountId=AUTH?.currentUserId||'admin';storage.set(userSyncIssueKey(accountId),JSON.stringify(UI.syncIssues||[]));updatePendingIndicators();}
function syncIssueLabel(issue={}){return `${CONFIG.schemas[issue.collection]?.title||issue.collection||'Dữ liệu'} · ${issue.recordId||issue.id||''}`;}
function addSyncIssue(change,code,message,extra={}){if(!change)return null;const changeId=String(change.changeId||uid('change')),existing=(UI.syncIssues||[]).find(item=>String(item.changeId||'')===changeId),issue={id:existing?.id||uid('sync-issue'),changeId,collection:String(change.collection||''),recordId:String(change.id||''),code:String(code||'SYNC_REJECTED'),message:String(message||'Thay đổi cần được kiểm tra trước khi đồng bộ.'),change:structuredClone(change),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),...extra};if(existing)Object.assign(existing,issue);else(UI.syncIssues||(UI.syncIssues=[])).push(issue);saveSyncIssues();return issue;}
function removeSyncIssue(changeId){UI.syncIssues=(UI.syncIssues||[]).filter(item=>String(item.changeId||'')!==String(changeId||''));saveSyncIssues();}
function syncCollectionExists(collection){return Boolean(recordCollectionNames().includes(String(collection||''))||String(collection||'')==='lookup_items');}
function ownerScopedTechnicalCollection(collection){return ['preferences','user_notifications','notification_receipts'].includes(String(collection||''));}
function pendingChangeAccountId(change){if(!change)return'';const payload=change.op==='upsert'?(change.record||{}):(change.changedFields||{});if(payload.accountId!==undefined&&payload.accountId!==null)return String(payload.accountId||'');const row=(DATA?.[change.collection]||[]).find(item=>String(item.id)===String(change.id));return String(row?.accountId||'');}
function repairVendorCategoryIdsForChange(change){if(!change||change.collection!=='vendors'||change.op==='delete')return {repaired:false,valid:true};const local=(DATA.vendors||[]).find(row=>String(row.id)===String(change.id));if(!local)return {repaired:false,valid:true};const before=structuredClone(local),hadIds=Array.isArray(local.category_ids)&&local.category_ids.length;canonicalizeRecordReferences('vendors',local);const ids=Array.isArray(local.category_ids)?local.category_ids.filter(Boolean):[];const labels=Array.isArray(local.category)?local.category:[local.category].filter(Boolean);if(hadIds||!labels.length)return {repaired:false,valid:true};if(!ids.length){Object.assign(local,before);return {repaired:false,valid:false,message:'Không thể xác định Dịch vụ/hạng mục cung cấp từ danh mục hiện tại.'};}local.category_id=ids[0]||'';if(change.op==='upsert'){change.record={...(change.record||{}),category_ids:structuredClone(ids),category_id:local.category_id};}else{change.changedFields={...(change.changedFields||{}),category_ids:structuredClone(ids),category_id:local.category_id};change.baseValues={...(change.baseValues||{}),category_ids:Array.isArray(before.category_ids)?structuredClone(before.category_ids):[],category_id:before.category_id||''};}return {repaired:true,valid:true};}
function isStrictIsoDateOnly(value){
  const text=String(value??'').trim(),match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text);if(!match)return false;
  const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]),date=new Date(Date.UTC(year,month-1,day));
  return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day;
}
function normalizeChecklistAutoStartAppliedDate(value){
  if(value===null||value===undefined||value==='')return '';
  const text=String(value).trim(),isoPrefix=/^(\d{4}-\d{2}-\d{2})(?:T|\s)/.exec(text),candidate=isoPrefix?isoPrefix[1]:normalizeDateOnly(value);
  return isStrictIsoDateOnly(candidate)?candidate:'';
}
function repairChecklistAutoStartDateForChange(change){
  if(!change||change.collection!=='checklist'||change.op==='delete')return {repaired:false,valid:true};
  const local=(DATA.checklist||[]).find(row=>String(row.id)===String(change.id)),payload=change.op==='upsert'?(change.record||(change.record={})):(change.changedFields||(change.changedFields={}));
  let repaired=false;
  if(change.op==='patch'&&!Object.prototype.hasOwnProperty.call(payload,'autoStartAppliedDate')&&local){
    const normalizedLocal=normalizeChecklistAutoStartAppliedDate(local.autoStartAppliedDate);payload.autoStartAppliedDate=normalizedLocal;change.baseValues={...(change.baseValues||{}),autoStartAppliedDate:normalizedLocal};repaired=true;
  }
  if(Object.prototype.hasOwnProperty.call(payload,'autoStartAppliedDate')){
    const original=payload.autoStartAppliedDate,normalized=normalizeChecklistAutoStartAppliedDate(original);if(String(original??'')!==normalized){payload.autoStartAppliedDate=normalized;repaired=true;}if(local)local.autoStartAppliedDate=normalized;
  }
  if(change.op==='patch'&&change.baseValues&&Object.prototype.hasOwnProperty.call(change.baseValues,'autoStartAppliedDate')){
    const normalizedBase=normalizeChecklistAutoStartAppliedDate(change.baseValues.autoStartAppliedDate);if(String(change.baseValues.autoStartAppliedDate??'')!==normalizedBase){change.baseValues.autoStartAppliedDate=normalizedBase;repaired=true;}
  }
  return {repaired,valid:true};
}
function restoreChecklistDateSyncIssues(){let restored=0;const remaining=[];for(const issue of UI.syncIssues||[]){const repairable=issue.collection==='checklist'&&(issue.code==='INVALID_DATE'||String(issue.message||'').includes('autoStartAppliedDate'))&&issue.change;if(repairable){UI.pendingChanges.push(structuredClone(issue.change));restored++;}else remaining.push(issue);}if(restored){UI.syncIssues=remaining;saveSyncIssues();savePendingChanges();}return restored;}
function migrateRejectedConflictsToSyncIssues(){const keep=[];let moved=0,dropped=0,currentAccount=String(currentPrincipalId()),isAccount=currentUserProfile()?.kind==='account';(UI.conflicts||[]).forEach(conflict=>{if(!conflict?.rejected){if(isAccount&&conflict?.change&&ownerScopedTechnicalCollection(conflict.change.collection)){const owner=pendingChangeAccountId(conflict.change);if(owner&&owner!==currentAccount){dropped++;return;}}keep.push(conflict);return;}if(conflict.change){if(isAccount&&ownerScopedTechnicalCollection(conflict.change.collection)){const owner=pendingChangeAccountId(conflict.change);if(owner&&owner!==currentAccount){dropped++;return;}}addSyncIssue(conflict.change,conflict.code||'SYNC_REJECTED',conflict.message||'Máy chủ từ chối thay đổi.',{serverRecord:conflict.serverRecord||null});moved++;}});if(moved||dropped){UI.conflicts=keep;saveSyncConflicts();}return moved+dropped;}
function preflightPendingChanges({includeExistingIssues=false}={}){
  restoreChecklistDateSyncIssues();migrateRejectedConflictsToSyncIssues();
  const currentAccount=String(currentPrincipalId()),isAccount=currentUserProfile()?.kind==='account',next=[],quarantined=[],discarded=[],repaired=[];
  for(const raw of UI.pendingChanges||[]){const change=structuredClone(raw||{});if(!change.collection||!change.id||!syncCollectionExists(change.collection)){quarantined.push(addSyncIssue(change,'INVALID_PENDING_CHANGE','Thay đổi không còn phù hợp với schema hiện tại.'));continue;}
    if(isAccount&&ownerScopedTechnicalCollection(change.collection)){const owner=pendingChangeAccountId(change);if(owner&&owner!==currentAccount){discarded.push(change);continue;}}
    if(change.collection==='vendors'){const result=repairVendorCategoryIdsForChange(change);if(result.repaired)repaired.push(change);if(!result.valid){quarantined.push(addSyncIssue(change,'VENDOR_CATEGORY_IDS_MISSING',result.message||'Nhà cung cấp thiếu liên kết Dịch vụ/hạng mục cung cấp.'));continue;}}
    if(change.collection==='checklist'){const result=repairChecklistAutoStartDateForChange(change);if(result.repaired)repaired.push(change);}
    next.push(change);
  }
  UI.pendingChanges=next;savePendingChanges();saveData();
  return {pending:next.length,repaired:repaired.length,discarded:discarded.length,quarantined:quarantined.filter(Boolean).length};
}
function backfillLegacyVendorCategoryIdsLocal(){let count=0;for(const vendor of DATA.vendors||[]){const labels=Array.isArray(vendor.category)?vendor.category:[vendor.category].filter(Boolean),ids=Array.isArray(vendor.category_ids)?vendor.category_ids.filter(Boolean):[];if(!labels.length||ids.length)continue;const before=structuredClone(vendor);canonicalizeRecordReferences('vendors',vendor);if(Array.isArray(vendor.category_ids)&&vendor.category_ids.length){vendor.category_id=vendor.category_ids[0]||'';queueUpsert('vendors',vendor,before);count++;}else Object.assign(vendor,before);}if(count)saveData();return count;}
function isChecklistBudgetCategorySyncIssue(issue={}){return issue.collection==='checklist'&&issue.code==='INVALID_OPTION'&&String(issue.message||'').includes('budgetCategory');}
function restoreRepairableSyncIssues(){let restored=0;const remaining=[];for(const issue of UI.syncIssues||[]){const vendorRepair=issue.collection==='vendors'&&(issue.code==='REQUIRED_FIELD'||issue.code==='VENDOR_CATEGORY_IDS_MISSING'||String(issue.message||'').includes('vendors.category_ids')),checklistDateRepair=issue.collection==='checklist'&&(issue.code==='INVALID_DATE'||String(issue.message||'').includes('autoStartAppliedDate')),checklistBudgetRepair=isChecklistBudgetCategorySyncIssue(issue);if((vendorRepair||checklistDateRepair||checklistBudgetRepair)&&issue.change){UI.pendingChanges.push(structuredClone(issue.change));restored++;}else remaining.push(issue);}UI.syncIssues=remaining;saveSyncIssues();if(restored)savePendingChanges();return restored;}
async function repairSyncQueue({syncAfter=true,announce=true}={}){const restored=restoreRepairableSyncIssues(),backfilled=backfillLegacyVendorCategoryIdsLocal(),report=preflightPendingChanges();if(announce){const notes=[];if(restored)notes.push(`${restored} thay đổi được đưa lại vào hàng đợi`);if(backfilled)notes.push(`${backfilled} Nhà cung cấp legacy được bổ sung liên kết danh mục`);if(report.repaired)notes.push(`${report.repaired} thay đổi được tự sửa`);if(report.discarded)notes.push(`${report.discarded} thay đổi kỹ thuật sai tài khoản đã được loại`);if(report.quarantined)notes.push(`${report.quarantined} thay đổi chuyển sang Cần xử lý`);toast(notes.length?`Đã sửa hàng đợi: ${notes.join(' · ')}.`:'Hàng đợi đồng bộ không phát hiện lỗi có thể tự sửa.','info');}if(UI.tab==='settings')renderPage();if(syncAfter&&UI.pendingChanges.length)return syncPreview({automatic:false,skipPreflight:true});return true;}
async function retrySyncIssue(changeId){const issue=(UI.syncIssues||[]).find(item=>String(item.changeId||'')===String(changeId||''));if(!issue?.change)return;removeSyncIssue(changeId);queueChange(structuredClone(issue.change));await repairSyncQueue({syncAfter:true,announce:false});}
async function discardSyncIssue(changeId){const issue=(UI.syncIssues||[]).find(item=>String(item.changeId||'')===String(changeId||''));if(!issue)return;removeSyncIssue(changeId);try{await refreshRemoteSnapshotPreservingPending(isAdministrator());}catch(error){console.warn('Không thể tải lại dữ liệu server sau khi bỏ thay đổi',error);}if(UI.tab==='settings')renderPage();toast('Đã bỏ thay đổi lỗi và giữ dữ liệu máy chủ.','success');}
async function discardAllPendingChanges(){const total=(UI.pendingChanges||[]).length+(UI.syncIssues||[]).length+(UI.conflicts||[]).length;if(!total){toast('Không có thay đổi cục bộ cần bỏ.','info');return;}if(!confirm(`${total} thay đổi cục bộ/chưa xử lý sẽ bị bỏ. WeddingOS sẽ tải lại dữ liệu mới nhất từ Google Sheets. Dữ liệu đã đồng bộ trên server không bị xóa. Tiếp tục?`))return;cancelMutationSync();UI.pendingChanges=[];UI.syncIssues=[];UI.conflicts=[];savePendingChanges();saveSyncIssues();saveSyncConflicts();try{await loadRemoteSnapshot(isAdministrator());toast('Đã bỏ toàn bộ thay đổi chưa đồng bộ và tải lại dữ liệu máy chủ.','success');}catch(error){toast(`Đã xóa hàng đợi cục bộ nhưng chưa tải lại được dữ liệu server: ${error.message}`,'error');}if(UI.tab==='settings')renderPage();}

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
    const value=collection==='checklist'&&key==='autoStartAppliedDate'?normalizeChecklistAutoStartAppliedDate(record[key]):record[key];
    clean[key]=structuredClone(value??'');
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
  const count=UI.pendingChanges.length,conflictCount=(UI.conflicts||[]).length,issueCount=(UI.syncIssues||[]).length,total=count+conflictCount+issueCount;document.querySelectorAll('[data-pending-count]').forEach(node=>node.textContent=total?String(total):'');const syncButton=document.getElementById('syncButton');
  if(syncButton&&!syncButton.disabled)syncButton.title=needsInitialFullSync()?`Cần đồng bộ toàn bộ dữ liệu lần đầu (${count} thay đổi cục bộ)`:needsSchemaSync()?'Cấu trúc Google Sheets cần được cập nhật':(issueCount?`${issueCount} thay đổi cần xử lý`:(conflictCount?`${conflictCount} xung đột cần xử lý`:(count?`${count} thay đổi đang chờ đồng bộ`:'Không có thay đổi đang chờ')));
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
function refreshIcons(){ if(window.lucide?.createIcons) window.lucide.createIcons(); document.querySelectorAll?.('[data-tooltip]').forEach(node=>{if(!node.getAttribute('title'))node.setAttribute('title',node.dataset.tooltip||'');}); }
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
    'Đang khảo sát':['blue','map-pin-check'],'Đã nhận báo giá':['indigo','file-text'],'Vào shortlist':['amber','star'],'Loại':['rose','circle-x'],
    'Chờ xếp lịch':['amber','calendar-plus'],'Đã lên lịch':['blue','calendar-check'],'Chờ đánh giá':['orange','clipboard-pen-line'],'Chờ quyết định':['indigo','circle-help'],'Cần khảo sát lại':['amber','rotate-ccw'],'Không cần khảo sát':['slate','circle-off'],'Không khảo sát nữa':['slate','circle-off'],'Shortlist':['amber','star'],'Ưu tiên cao':['indigo','sparkles'],'Đã thực hiện':['emerald','circle-check-big'],'Dời lịch':['orange','calendar-clock'],'Không thực hiện':['slate','circle-minus'],'Bản nháp':['slate','file-pen-line'],'Đang thực hiện':['indigo','loader-circle'],'Kết thúc sớm':['orange','flag-triangle-right'],'Nháp':['slate','file-pen-line']
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
function dataColumnClass(schema,key){const type=fieldType(schema,key);if(key===ACTION_COLUMN_KEY)return 'data-col data-col--actions';if(key==='visited')return 'data-col data-col--complete';if(key==='surveyStatus')return 'data-col data-col--survey-status';if(key==='surveyDetail')return 'data-col data-col--survey-detail';if(key==='surveyEvaluationNotes')return 'data-col data-col--survey-evaluation-notes';if(['number','currency','rating'].includes(type)||['budgeted','committed','actual','variance','paid','payable','remaining','quote','deposit','giftValue','budgetEstimate','actualCost','payableCost','partySize','tableNo'].includes(key))return 'data-col data-col--number';if(type==='date'||type==='time'||type==='datetime'||key.toLowerCase().includes('date')||key.toLowerCase().includes('due'))return 'data-col data-col--date';if(isLongTextColumn(schema,key))return 'data-col data-col--long';return 'data-col data-col--text';}
function primaryTitleKey(schema,columns){return columns.find(key=>key!==ACTION_COLUMN_KEY)||schema.columns[0];}

function displayValue(schema,key,value) {
  const type=schema.fields.find(field=>field[0]===key)?.[2]||'text';
  if(key===schema.statusField||key==='status'||key==='rsvp'||key==='sent'||key==='surveyStatus'||key==='surveyState'||key==='decision') return statusBadge(value);
  if(key==='priority') return priorityBadge(value);
  if(type==='rating'||key==='rating'){ const score=Math.min(5,Math.max(0,Number(value||0))); return `<span class="rating-stars" aria-label="${score} trên 5 sao" title="${score}/5">${'★'.repeat(score)}<span class="rating-stars__empty">${'★'.repeat(5-score)}</span></span>`; }
  if(key==='durationMinutes') return `<span class="whitespace-nowrap tabular">${esc(formatDurationMinutes(value))}</span>`;
  if(key==='latestScore') return Number(value||0)?`<span class="tabular font-semibold">${Number(value).toFixed(1)}/10</span>`:'—';
  if(type==='currency'||['budgeted','committed','actual','variance','paid','payable','remaining','quote','deposit','giftValue','budgetEstimate','actualCost','payableCost'].includes(key)) return `<span class="tabular whitespace-nowrap font-medium">${money(value)}</span>`;
  if(type==='date'||key.toLowerCase().includes('date')||key.toLowerCase().includes('due')) return `<span class="whitespace-nowrap">${esc(formatDate(value))}</span>`;
  if(type==='time') return `<span class="whitespace-nowrap tabular">${esc(formatTime24(value))}</span>`;
  if(type==='url'&&value){ const safe=safeExternalUrl(value); return safe?`<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline dark:text-brand-300">Mở liên kết ${icon('external-link','size-3.5')}</a>`:`<span class="text-rose-600 dark:text-rose-300">Liên kết không hợp lệ</span>`; }
  if(Array.isArray(value)) return esc(value.join(', ')||'—');
  if(typeof value==='number') return `<span class="tabular">${new Intl.NumberFormat('vi-VN').format(value)}</span>`;
  return esc(value||'—');
}

function collectionRows(collection){
  if(collection==='survey') return surveyListRows();
  const rows=DATA[collection]||[];
  if(collection==='references') return rows.filter(row=>UI.referenceShowHidden||!boolValue(row.listHidden)).map(row=>{const summary=referenceSurveySummary(row);return {...row,surveyStatus:summary.state,surveyEvaluationNotes:String(summary.latestEvaluation?.evaluationNotes||'')};});
  if(collection==='survey_candidates') return rows.map(row=>({...row,...surveyCandidateSummary(row)}));
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
  if(UI.tab==='survey'){closeMobileActions();openSurveyCreateMenu();return;}
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
function renderAuthenticatedWorkspace(){migrateRejectedConflictsToSyncIssues();restoreRepairableSyncIssues();preflightPendingChanges();unlockAuthenticatedShell();applyCurrentPreferences();renderNavigation();renderHeader();renderPage();updatePendingIndicators();updateNotificationBadge();refreshIcons();if(!UI.mutationLocked&&UI.hydrationState!=='loading')startAutoSync();if(UI.conflicts?.length){notifySyncConflicts(UI.conflicts.length);setTimeout(openNextSyncConflict,120);}}


function parseStoredJson(value,fallback=null){try{return JSON.parse(String(value||''))||fallback;}catch(_){return fallback;}}
function currentPrincipalId(){if(AUTH.currentUserId)return AUTH.currentUserId;if(AUTH.adminAuthenticated||AUTH.adminBypass||!(DATA.accounts||[]).length)return'admin';return'guest';}
function preferenceRecordId(accountId=currentPrincipalId()){return`preference-${String(accountId).replace(/[^A-Za-z0-9_-]/g,'-')}`;}
function getCurrentPreference(){const accountId=currentPrincipalId();return(DATA.preferences||[]).find(row=>row.accountId===accountId||row.id===preferenceRecordId(accountId))||null;}
function updateCurrentPreference(patch={}){const accountId=currentPrincipalId(),id=preferenceRecordId(accountId),current=getCurrentPreference(),existing=current||{id,accountId,theme:'',accent:'',columns:{},sorts:{},groups:{},survey:{},notificationReadIds:[]},before=current?structuredClone(current):null;const record={...existing,...patch,id,accountId,columns:{...(existing.columns||{}),...(patch.columns||{})},sorts:{...(existing.sorts||{}),...(patch.sorts||{})},groups:{...(existing.groups||{}),...(patch.groups||{})},survey:{...(existing.survey||{}),...(patch.survey||{})},updatedAt:new Date().toISOString()};const index=(DATA.preferences||[]).findIndex(row=>row.id===id||row.accountId===accountId);if(index>=0)DATA.preferences[index]=record;else(DATA.preferences||(DATA.preferences=[])).push(record);queueUpsert('preferences',record,before);saveData();return record;}
function currentUserProfile(){if(AUTH.currentProfile)return AUTH.currentProfile;const cached=parseStoredJson(secrets.get(CONFIG.accountProfileKey,''));if(cached&&cached.id===AUTH.currentUserId){AUTH.currentProfile=cached;return cached;}if(AUTH.currentUserId){const decoded=AUTH.accounts.find(item=>item.id===AUTH.currentUserId),row=(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId);const profile={id:AUTH.currentUserId,userCode:decoded?.userCode||row?.userCode||'',displayName:decoded?.displayName||row?.displayName||row?.usernameLabel||'Người dùng',username:decoded?.username||row?.usernameLabel||'',status:row?.status||decoded?.status||'active',kind:'account'};AUTH.currentProfile=profile;return profile;}return{id:'admin',userCode:'ADMIN',displayName:'Quản trị viên',username:'Administrator',status:'active',kind:'admin'};}
function setSessionProfile(profile){AUTH.currentProfile=profile||null;if(profile)secrets.set(CONFIG.accountProfileKey,JSON.stringify(profile));else secrets.remove(CONFIG.accountProfileKey);}
function isAdministrator(){return AUTH.settingsUnlocked&&AUTH.adminAuthenticated;}
function applyCurrentPreferences(){const pref=getCurrentPreference(),fallbackAccent=getSettings().accentTheme||storage.get(CONFIG.accentKey,'pink'),fallbackTheme=storage.get(CONFIG.themeKey,'');const dark=(pref?.theme||fallbackTheme)==='dark'||(!(pref?.theme||fallbackTheme)&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';applyAccentTheme(pref?.accent||fallbackAccent);}
function setUserTheme(dark){const enabled=Boolean(dark);document.documentElement.classList.toggle('dark',enabled);document.documentElement.style.colorScheme=enabled?'dark':'light';storage.set(CONFIG.themeKey,enabled?'dark':'light');updateCurrentPreference({theme:enabled?'dark':'light'});renderHeader();if(UI.tab==='settings')renderPage();renderProfileDialogContent();}
const ACTION_COLUMN_KEY='__actions';
function getVisibleColumns(collection){
  const schema=getUiSchema(collection),configured=getCurrentPreference()?.columns?.[collection],available=new Set([...schema.columns,...schema.fields.map(field=>field[0]),ACTION_COLUMN_KEY]);
  if(configured&&typeof configured==='object'&&!Array.isArray(configured)){const order=Array.isArray(configured.order)?configured.order.filter(key=>available.has(key)):[],visible=new Set(Array.isArray(configured.visible)?configured.visible.filter(key=>available.has(key)):[]);if(collection==='survey'&&!order.includes('referenceTitle')&&!visible.has('referenceTitle')){const candidateIndex=order.indexOf('candidateName');order.splice(candidateIndex>=0?candidateIndex+1:0,0,'referenceTitle');visible.add('referenceTitle');}if(collection==='references'&&!order.includes('surveyDetail')&&!visible.has('surveyDetail')){const surveyIndex=order.indexOf('surveyStatus');order.splice(surveyIndex>=0?surveyIndex+1:order.length,0,'surveyDetail');visible.add('surveyDetail');}if(collection==='references'&&!order.includes('surveyEvaluationNotes')&&!visible.has('surveyEvaluationNotes')){const detailIndex=order.indexOf('surveyDetail');const surveyIndex=order.indexOf('surveyStatus');order.splice(detailIndex>=0?detailIndex+1:surveyIndex>=0?surveyIndex+1:order.length,0,'surveyEvaluationNotes');visible.add('surveyEvaluationNotes');}const ordered=order.filter(key=>visible.has(key));for(const key of visible)if(!ordered.includes(key))ordered.push(key);return ordered.length?ordered:[...schema.columns,ACTION_COLUMN_KEY];}
  const legacy=Array.isArray(configured)?configured.filter(key=>available.has(key)&&key!==ACTION_COLUMN_KEY):[];if(collection==='survey'&&legacy.length&&!legacy.includes('referenceTitle')){const candidateIndex=legacy.indexOf('candidateName');legacy.splice(candidateIndex>=0?candidateIndex+1:0,0,'referenceTitle');}if(collection==='references'&&legacy.length&&!legacy.includes('surveyDetail')){const surveyIndex=legacy.indexOf('surveyStatus');legacy.splice(surveyIndex>=0?surveyIndex+1:legacy.length,0,'surveyDetail');}if(collection==='references'&&legacy.length&&!legacy.includes('surveyEvaluationNotes')){const detailIndex=legacy.indexOf('surveyDetail');const surveyIndex=legacy.indexOf('surveyStatus');legacy.splice(detailIndex>=0?detailIndex+1:surveyIndex>=0?surveyIndex+1:legacy.length,0,'surveyEvaluationNotes');}return legacy.length?[...legacy,ACTION_COLUMN_KEY]:[...schema.columns,ACTION_COLUMN_KEY];
}
function allColumnKeys(collection){const schema=getUiSchema(collection);return[...new Set([...schema.columns,...schema.fields.map(field=>field[0])])].filter(key=>key!=='id'&&key!=='updatedAt').concat(ACTION_COLUMN_KEY);}

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
async function loadAdminSensitiveCollections(explicitToken=''){
  const result=await postAppsScript({action:'load',collections:['security','accounts'],...(explicitToken?{sessionToken:explicitToken}:{})},{admin:true,authMode:explicitToken?'none':'auto',timeoutMs:CONFIG.networkTimeouts.load,retries:1});
  const payload=result?.data&&typeof result.data==='object'?result.data:{};
  DATA.security=Array.isArray(payload.security)?payload.security:[];DATA.accounts=Array.isArray(payload.accounts)?payload.accounts:[];
  if(result.revision!==undefined)setRemoteRevision(result.revision);secrets.set(CONFIG.sensitiveSessionKey,JSON.stringify({accounts:DATA.accounts,security:DATA.security}));saveData();return result;
}
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
  event.preventDefault();const password=document.getElementById('settingsAccessPassword').value;showInlineError('settingsAccessError','');setButtonLoading('settingsAccessSubmit',true,'Đang xác thực');
  try{
    const endpoint=configuredEndpoint(),accountProfileBefore=AUTH.currentUserId?currentUserProfile():null;AUTH.bootstrapMode=false;
    if(endpoint){
      try{
        const challenge=await postAppsScript({action:'adminChallenge'},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth}),verifier=await passwordVerifier(password,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,'admin');
        const login=await postAppsScript({action:'adminLogin',nonce:challenge.nonce,proof},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth});
        secrets.set(CONFIG.adminServerSessionKey,login.sessionToken);setRemoteRevision(login.revision||remoteRevision());
        setButtonLoading('settingsAccessSubmit',true,'Đang tải dữ liệu quản trị');
        await loadAdminSensitiveCollections(login.sessionToken);
        if(accountProfileBefore)setSessionProfile(accountProfileBefore);
      }catch(error){
        if(error.code!=='ADMIN_NOT_INITIALIZED')throw error;
        await verifyBootstrapPassword(password);connectionSecrets.set(CONFIG.passwordKey,password);AUTH.bootstrapMode=true;
      }
    }else if(!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng.');return;}
    if(!AUTH.bootstrapMode&&securityAccessRecord()&&!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng với dữ liệu đã mã hóa.');return;}
    AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;AUTH.masterPassword=AUTH.bootstrapMode?'':password;if(!AUTH.bootstrapMode)await loadAccountCache(password);document.getElementById('settingsAccessDialog').close();if(AUTH.bootstrapMode||!securityAccessRecord()){openSettingsPasswordDialog(true);return;}unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;startAutoSync();toast('Đã xác thực quyền quản trị.','success');
  }catch(error){
    const message=error?.code==='REQUEST_TIMEOUT'?'Máy chủ phản hồi chậm khi xác thực quản trị. Hãy thử lại; nếu đã được cấp phiên, lần thử tiếp theo sẽ xác thực lại an toàn.':(error.message||'Không thể xác thực mật khẩu.');showInlineError('settingsAccessError',message);
  }finally{setButtonLoading('settingsAccessSubmit',false);}
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
function notificationRecordTitle(collection,record){if(collection==='references')return referenceContextLabel(record||{});const primary={checklist:'task',timeline:'event',budget:'category',guests:'name',vendors:'name',survey_trips:'name'}[collection];return String(record?.[primary]||CONFIG.schemas[collection]?.title||'Bản ghi');}
function formatDateTokensInText(value=''){return String(value??'').replace(/\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?\b/g,token=>formatDate(token));}
function notificationReceiptsForCurrentUser(){const accountId=currentPrincipalId();return (DATA.notification_receipts||[]).filter(row=>String(row.accountId||'')===String(accountId));}
function notificationReadLedger(){const ids=getCurrentPreference()?.notificationReadIds;return Array.isArray(ids)?ids.map(String).filter(Boolean):[];}
function notificationReceiptFor(notificationId){return notificationReceiptsForCurrentUser().find(row=>String(row.notificationId||'')===String(notificationId))||null;}
function rememberNotificationReadId(notificationId){const id=String(notificationId||'');if(!id)return;const activeIds=new Set(sourceNotifications().map(item=>String(item.id||''))),next=[];[id,...notificationReadLedger()].forEach(value=>{const clean=String(value||'');if(clean&&activeIds.has(clean)&&!next.includes(clean))next.push(clean);});updateCurrentPreference({notificationReadIds:next.slice(0,500)});}
function trimNotificationReadHistory(limit=20){const rows=notificationReceiptsForCurrentUser().filter(row=>row.readAt).sort((a,b)=>String(b.readAt||'').localeCompare(String(a.readAt||''))),excess=rows.slice(Math.max(0,Number(limit||20)));if(!excess.length)return;const removeIds=new Set(excess.map(row=>String(row.id)));DATA.notification_receipts=(DATA.notification_receipts||[]).filter(row=>!removeIds.has(String(row.id)));excess.forEach(row=>queueDelete('notification_receipts',row.id,row));saveData();}
function notificationReceiptId(accountId,notificationId){const input=`${String(accountId||'')}\u0000${String(notificationId||'')}`;let hash=1469598103934665603n;for(let index=0;index<input.length;index+=1){hash^=BigInt(input.charCodeAt(index));hash=BigInt.asUintN(64,hash*1099511628211n);}return `notification-read-${hash.toString(16).padStart(16,'0')}`;}
function notificationDateKey(date=new Date(),offsetDays=0){const shifted=new Date(date);shifted.setDate(shifted.getDate()+Number(offsetDays||0));return localISODate(shifted);}
function notificationDateRecordIsActive(collection,record={}){const terminal={checklist:['Hoàn thành','Hủy'],timeline:['Hoàn thành','Hủy'],vendors:['Hoàn tất','Loại'],survey_trips:['Hoàn tất','Kết thúc sớm','Hủy']};return !(terminal[collection]||[]).includes(String(record.status||''));}
function sourceNotifications(){
  const today=localISODate(),tomorrow=notificationDateKey(new Date(),1),items=[],settings=getSettings(),settingDates={registrationDate:'Đăng ký kết hôn',engagementDate:'Lễ ăn hỏi',pickupDate:'Rước dâu',groomPartyDate:'Tiệc nhà trai',bridePartyDate:'Tiệc nhà gái'};
  const reminderMeta=value=>value===today?{suffix:'',when:'hôm nay',lead:'Hôm nay'}:value===tomorrow?{suffix:'-tomorrow',when:'ngày mai',lead:'Ngày mai'}:null;
  Object.entries(settingDates).forEach(([field,label])=>{const value=String(settings[field]||''),reminder=reminderMeta(value);if(!reminder)return;items.push({id:`settings-${field}-${value}${reminder.suffix}`,type:'date',tone:'date',title:`${label} diễn ra ${reminder.when}`,message:`Ngày ${formatDate(value)} là mốc ${label.toLowerCase()} trong kế hoạch cưới.`,collection:'settings',field,value,eventDate:value,source:'derived'});});
  const dateFields={checklist:['startDate','dueDate'],timeline:['eventDate'],vendors:['decisionDue'],survey_trips:['surveyDate']};Object.entries(dateFields).forEach(([collection,fields])=>(DATA[collection]||[]).forEach(record=>{if(!notificationDateRecordIsActive(collection,record))return;fields.forEach(field=>{const value=String(record[field]||''),reminder=reminderMeta(value);if(!reminder)return;const label=fieldLabel(CONFIG.schemas[collection],field),recordTitle=notificationRecordTitle(collection,record);items.push({id:`${collection}-${record.id}-${field}-${value}${reminder.suffix}`,type:'date',tone:'date',title:`${reminder.lead}: ${recordTitle}`,message:`${label} · ${formatDate(value)}`,collection,recordId:record.id,field,value,eventDate:value,source:'derived'});});}));
  (DATA.budget||[]).forEach(record=>{const budgeted=Number(record.budgeted||0);if(budgeted<=0)return;const used=Number(record.actual||0)+Number(record.payable||0),remaining=budgeted-used,ratio=remaining/budgeted;if(remaining<0)items.push({id:`budget-over-${record.id}`,type:'budget',tone:'danger',title:`${record.category} đã vượt ngân sách`,message:`Vượt ${money(Math.abs(remaining))}. Tổng thực chi và cần thanh toán là ${money(used)} trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id,eventDate:today,source:'derived'});else if(ratio<.1)items.push({id:`budget-low-${record.id}`,type:'budget',tone:'warning',title:`${record.category} sắp hết ngân sách`,message:`Chỉ còn ${money(remaining)} (${Math.max(0,Math.round(ratio*100))}%) trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id,eventDate:today,source:'derived'});});
  (DATA.notifications||[]).filter(row=>!row.accountId||row.accountId==='all'||row.accountId===currentPrincipalId()).forEach(row=>items.push({id:row.id,type:row.type,tone:row.tone,title:row.title,message:row.message,collection:row.collection,recordId:row.recordId,value:row.eventDate,eventDate:row.eventDate,createdAt:row.createdAt,source:'system'}));
  (DATA.user_notifications||[]).filter(row=>String(row.accountId||'')===String(currentPrincipalId())).forEach(row=>items.push({id:row.id,type:row.type,tone:row.tone,title:row.title,message:row.message,collection:row.collection,recordId:row.recordId,value:row.eventDate,eventDate:row.eventDate,createdAt:row.createdAt,source:'user'}));
  const unique=new Map();items.forEach(item=>unique.set(String(item.id),item));return [...unique.values()];
}
function currentNotifications(){const readIds=new Set([...notificationReadLedger(),...notificationReceiptsForCurrentUser().map(row=>String(row.notificationId||''))]),order={danger:0,warning:1,date:2,info:3};return sourceNotifications().filter(item=>!readIds.has(String(item.id))).sort((a,b)=>(order[a.tone]??9)-(order[b.tone]??9)||String(b.createdAt||b.eventDate||'').localeCompare(String(a.createdAt||a.eventDate||'')));}
function currentReadNotifications(){return notificationReceiptsForCurrentUser().filter(row=>row.readAt).sort((a,b)=>String(b.readAt||'').localeCompare(String(a.readAt||''))).slice(0,20).map(row=>({id:row.id,notificationId:row.notificationId,type:row.type,tone:row.tone,title:row.title,message:row.message,collection:row.collection,recordId:row.recordId,eventDate:row.eventDate,readAt:row.readAt,source:'receipt',isRead:true}));}
function notificationTypeLabel(item={}){if(item.type==='budget')return'Cảnh báo ngân sách';if(item.type==='attachment')return'Lỗi tệp đính kèm';if(item.type==='sync')return'Lỗi đồng bộ';if(item.type==='survey')return'Khảo sát';return'Nhắc việc theo thời gian';}
function updateNotificationBadge(){const count=currentNotifications().length,node=document.getElementById('notificationCount'),button=document.getElementById('notificationButton');if(node){node.textContent=count>99?'99+':String(count);node.classList.toggle('hidden',count===0);}if(button)button.title=count?`${count} thông báo chưa đọc`:'Không có thông báo chưa đọc';}
function renderNotificationItems(items,isRead=false){return items.length?items.map(item=>`<button type="button" data-notification-id="${esc(item.id)}" data-notification-read="${isRead?'1':'0'}" class="notification-item ${isRead?'notification-item--read':''}"><span class="notification-dot notification-dot--${esc(item.tone||'date')}"></span><span class="min-w-0 flex-1"><span class="block text-sm font-semibold leading-5">${esc(item.title)}</span><span class="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">${esc(formatDateTokensInText(item.message))}</span>${isRead?`<span class="mt-1 block text-[10px] font-semibold text-slate-400">Đã đọc ${esc(formatDateTime(item.readAt))}</span>`:''}</span>${icon('chevron-right','mt-1 size-4 shrink-0 text-slate-300')}</button>`).join(''):`<div class="px-6 py-12 text-center"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">${icon(isRead?'history':'bell-off','size-5')}</span><p class="mt-3 text-sm font-semibold">${isRead?'Chưa có lịch sử đã đọc':'Không có thông báo chưa đọc'}</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${isRead?'Tối đa 20 thông báo đã đọc gần nhất sẽ được hiển thị tại đây.':'Thông báo quan trọng sẽ nằm ở đây cho đến khi bạn xác nhận đã đọc.'}</p></div>`;}
function openNotificationCenter(tab=UI.notificationTab||'unread'){UI.notificationTab=tab==='read'?'read':'unread';const unread=currentNotifications(),read=currentReadNotifications(),items=UI.notificationTab==='read'?read:unread,list=document.getElementById('notificationList');document.getElementById('notificationSummary').textContent=UI.notificationTab==='read'?`${read.length} thông báo đã đọc gần nhất · tối đa 20 bản ghi.`:unread.length?`${unread.length} thông báo chưa đọc cần chú ý.`:'Không có thông báo chưa đọc.';list.innerHTML=`<div class="notification-tabs" role="tablist"><button type="button" data-notification-tab="unread" class="notification-tab ${UI.notificationTab==='unread'?'is-active':''}" role="tab" aria-selected="${UI.notificationTab==='unread'}">Chưa đọc <span>${unread.length}</span></button><button type="button" data-notification-tab="read" class="notification-tab ${UI.notificationTab==='read'?'is-active':''}" role="tab" aria-selected="${UI.notificationTab==='read'}">Đã đọc <span>${read.length}</span></button></div><div class="notification-items">${renderNotificationItems(items,UI.notificationTab==='read')}</div>`;list.querySelectorAll('[data-notification-tab]').forEach(button=>button.addEventListener('click',()=>openNotificationCenter(button.dataset.notificationTab)));list.querySelectorAll('[data-notification-id]').forEach(button=>button.addEventListener('click',()=>openNotificationDetail(button.dataset.notificationId,button.dataset.notificationRead==='1')));const dialog=document.getElementById('notificationDialog');if(!dialog.open)dialog.showModal();refreshIcons();}
function notificationItemById(id,isRead=false){return isRead?currentReadNotifications().find(item=>String(item.id)===String(id)):currentNotifications().find(item=>String(item.id)===String(id));}
function createUserNotification({type='info',tone='warning',title,message,collection='',recordId='',eventDate=''}){const now=new Date().toISOString(),row={id:uid('user-notification'),accountId:currentPrincipalId(),type,tone,title:String(title||'Thông báo'),message:String(message||''),collection:String(collection||''),recordId:String(recordId||''),eventDate:eventDate||localISODate(),createdAt:now,updatedAt:now,_rowVersion:0,_updatedAt:'',_updatedBy:''};(DATA.user_notifications||(DATA.user_notifications=[])).unshift(row);queueUpsert('user_notifications',row);saveData();updateNotificationBadge();return row;}
function findOpenUserNotification(type,title){const accountId=currentPrincipalId();return (DATA.user_notifications||[]).find(row=>String(row.accountId||'')===String(accountId)&&String(row.type||'')===String(type||'')&&String(row.title||'')===String(title||''))||null;}
function notifySyncFailure(error,message=''){const technicalFailure=['user_notifications','notification_receipts'].includes(String(error?.syncCollection||error?.collection||''))||((UI.pendingChanges||[]).length>0&&(UI.pendingChanges||[]).every(change=>['user_notifications','notification_receipts'].includes(String(change.collection||''))));if(!AUTH.currentUserId||error?.code==='AUTH_REQUIRED'||UI.syncFailureNotificationId||technicalFailure)return null;const title='Đồng bộ Google Sheets thất bại',existing=findOpenUserNotification('sync',title);if(existing){UI.syncFailureNotificationId=existing.id;return existing;}const row=createUserNotification({type:'sync',tone:'danger',title,message:message||`Không thể đồng bộ dữ liệu: ${error?.message||'Lỗi không xác định'}. Các thay đổi cục bộ vẫn được giữ lại.`});UI.syncFailureNotificationId=row.id;return row;}
function notifySyncConflicts(count){const total=Math.max(1,Number(count||UI.conflicts?.length||1));if(!AUTH.currentUserId||UI.syncConflictNotificationId)return null;const title='Có xung đột đồng bộ cần xử lý',existing=findOpenUserNotification('sync',title);if(existing){UI.syncConflictNotificationId=existing.id;return existing;}const row=createUserNotification({type:'sync',tone:'warning',title,message:`Có ${total} thay đổi từ thiết bị khác cần lựa chọn phiên bản dữ liệu. Hãy mở WeddingOS và xử lý xung đột để hoàn tất đồng bộ.`});UI.syncConflictNotificationId=row.id;return row;}
function markNotificationRead(item){if(!item||item.isRead)return;const accountId=currentPrincipalId(),existing=notificationReceiptFor(item.id),now=new Date().toISOString(),row=existing||{id:notificationReceiptId(accountId,item.id),accountId,notificationId:String(item.id),_rowVersion:0,_updatedAt:'',_updatedBy:''},before=existing?structuredClone(existing):null;Object.assign(row,{accountId,notificationId:String(item.id),type:String(item.type||''),tone:String(item.tone||''),title:String(item.title||'Thông báo'),message:String(item.message||''),collection:String(item.collection||''),recordId:String(item.recordId||''),eventDate:String(item.eventDate||item.value||''),readAt:now,updatedAt:now});if(existing){const index=DATA.notification_receipts.findIndex(entry=>entry.id===existing.id);DATA.notification_receipts[index]=row;}else(DATA.notification_receipts||(DATA.notification_receipts=[])).unshift(row);queueUpsert('notification_receipts',row,before);rememberNotificationReadId(item.id);if(item.source==='user'){const source=(DATA.user_notifications||[]).find(entry=>String(entry.id)===String(item.id));if(source){DATA.user_notifications=DATA.user_notifications.filter(entry=>entry.id!==source.id);queueDelete('user_notifications',source.id,source);}}trimNotificationReadHistory(20);saveData();updateNotificationBadge();toast('Đã xác nhận thông báo đã đọc.','success');document.getElementById('notificationDetailDialog')?.close();openNotificationCenter('unread');}
function openNotificationRelatedRecord(item){document.getElementById('notificationDetailDialog')?.close();if(item.collection==='survey_trips'&&item.recordId){navigate('survey');setTimeout(()=>openSurveyTripDayView(item.recordId),180);return;}if(item.collection==='survey_visits'&&item.recordId){navigate('survey');return;}if(item.recordId&&CONFIG.schemas[item.collection]){const targetTab=['survey_candidates','survey_evaluations'].includes(item.collection)?'survey':item.collection;navigate(targetTab);setTimeout(()=>item.collection==='survey_evaluations'?openEditor('survey_evaluations',item.recordId):openDetails(item.collection,item.recordId),180);}}
function openNotificationDetail(id,isRead=false){const item=notificationItemById(id,isRead);if(!item)return;document.getElementById('notificationDialog').close();document.getElementById('notificationDetailType').textContent=notificationTypeLabel(item);document.getElementById('notificationDetailTitle').textContent=item.title;const iconWrap=document.getElementById('notificationDetailIcon');iconWrap.className=`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone==='danger'?'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300':item.tone==='warning'?'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300':'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'}`;iconWrap.innerHTML=icon(item.tone==='danger'?'triangle-alert':item.tone==='warning'?'badge-alert':'bell','size-5');let details=`<div class="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/60 dark:text-slate-200">${esc(formatDateTokensInText(item.message))}</div>`;if(item.isRead)details+=`<p class="mt-3 text-xs font-semibold text-slate-400">Đã đọc lúc ${esc(formatDateTime(item.readAt))}</p>`;if(item.recordId&&CONFIG.schemas[item.collection]){const schema=CONFIG.schemas[item.collection],record=(DATA[item.collection]||[]).find(row=>row.id===item.recordId);if(record)details+=`<dl class="mt-4 grid gap-3 sm:grid-cols-2">${schema.fields.slice(0,8).filter(([, , ,options])=>!options?.hidden).map(([key,label])=>`<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(label)}</dt><dd class="mt-1 text-sm">${displayValue(schema,key,record[key])}</dd></div>`).join('')}</dl>`;}document.getElementById('notificationDetailContent').innerHTML=details;const canOpen=Boolean(item.recordId&&(CONFIG.schemas[item.collection]||['survey_trips','survey_visits'].includes(item.collection))),failureId=item.notificationId||item.id,canRetry=item.type==='attachment'&&BACKGROUND_ATTACHMENT_FAILURES.has(String(failureId));document.getElementById('notificationDetailActions').innerHTML=`${canOpen?`<button id="openNotificationRecord" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold dark:border-slate-700">${icon('arrow-up-right','size-4')}Mở bản ghi</button>`:''}${canRetry?`<button id="retryNotificationAttachment" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 px-4 text-sm font-semibold text-amber-700 dark:border-amber-900 dark:text-amber-300">${icon('refresh-cw','size-4')}Thử lại</button>`:''}${item.isRead?'':`<button id="confirmNotificationRead" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white">${icon('check-check','size-4')}Xác nhận đã đọc</button>`}`;document.getElementById('openNotificationRecord')?.addEventListener('click',()=>openNotificationRelatedRecord(item));document.getElementById('retryNotificationAttachment')?.addEventListener('click',()=>retryBackgroundAttachmentFailure(String(failureId)));document.getElementById('confirmNotificationRead')?.addEventListener('click',()=>markNotificationRead(item));document.getElementById('notificationDetailDialog').showModal();refreshIcons();}
function completeNavigation(tab){closeMobileActions();if(tab==='references')UI.referenceShowHidden=false;const leavingSettings=UI.tab==='settings'&&tab!=='settings';if(leavingSettings){clearSettingsDraft();const adminToken=serverAdminToken();logoutServerToken(adminToken);secrets.remove(CONFIG.adminServerSessionKey);AUTH.settingsUnlocked=false;AUTH.adminAuthenticated=false;AUTH.masterPassword='';AUTH.accounts=[];AUTH.adminBypass=false;if(configuredEndpoint()){DATA.accounts=[];DATA.security=[];secrets.remove(CONFIG.sensitiveSessionKey);saveData();}}UI.tab=tab;UI.search='';UI.filter='Tất cả';UI.secondaryFilter=null;UI.advancedFilters={};UI.dateFilters={};UI.filterDraft=null;UI.filterPanelOpen=false;UI.visibleCount=CONFIG.pageSize;closeSidebar();setLoading(true);renderNavigation();renderHeader();setTimeout(()=>{setLoading(false);renderPage();if(tab!=='settings')enforceLoginGate();},120);}

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
  const modules=[
    {id:'checklist',title:'Công việc',icon:'list-checks',purpose:'Theo dõi việc cần làm, thời hạn, người phụ trách và trạng thái thực hiện.',links:[['Sự kiện liên quan','Dùng chung với Timeline, Ngân sách, Nhà cung cấp và Tham khảo để gộp/lọc theo cùng sự kiện.'],['Ngân sách','Khi chọn Hạng mục ngân sách, Công việc tự lấy Ngân sách dự kiến, Chi phí tạm tính, Thực chi và Còn phải thanh toán.'],['Tham khảo & Nhà cung cấp','Khi bật Cần gợi ý, hệ thống ưu tiên nguồn Tham khảo cùng Nhóm công việc và Nhà cung cấp cùng Nhóm công việc + Sự kiện.']],tips:['Hoàn thành công việc không làm thay đổi dữ liệu tài chính; các số tiền lấy từ Hạng mục ngân sách đã liên kết.','Ngày bắt đầu và Hạn hoàn thành được nhắc ở Trung tâm thông báo trước 1 ngày và đúng ngày.']},
    {id:'timeline',title:'Timeline',icon:'calendar-clock',purpose:'Lập lịch các hoạt động theo ngày và giờ của từng sự kiện.',links:[['Sự kiện & Nhóm công việc','Dùng cùng danh mục với Công việc để các hoạt động có cùng ngữ cảnh.'],['Nhà cung cấp','Có thể gắn Nhà cung cấp trực tiếp vào hoạt động.']],tips:['Thời lượng được tự tính từ Giờ bắt đầu đến Giờ kết thúc.','Ngày sự kiện được nhắc ở Trung tâm thông báo trước 1 ngày và đúng ngày.']},
    {id:'budget',title:'Ngân sách',icon:'wallet-cards',purpose:'Quản lý hạn mức dự kiến và số tiền đã cam kết/thanh toán theo từng hạng mục.',links:[['Nhà cung cấp','Nhà cung cấp trạng thái Đã chọn/Đã cọc/Hoàn tất, cùng Sự kiện và Dịch vụ/hạng mục cung cấp, sẽ được cộng vào hạng mục ngân sách tương ứng.'],['Công việc','Công việc có thể chọn Hạng mục ngân sách để đọc lại các số liệu tài chính.']],tips:['Chi phí tạm tính = tổng Giá trị hợp đồng; Thực chi = Tiền cọc + Đã thanh toán; Còn phải thanh toán = max(0, Chi phí tạm tính − Thực chi).']},
    {id:'guests',title:'Khách mời',icon:'users-round',purpose:'Theo dõi danh sách mời, phản hồi tham dự, số người đi, bàn và nhu cầu đặc biệt.',links:[['Sự kiện tham dự','Dùng danh mục Sự kiện liên quan để biết khách tham dự sự kiện nào.']],tips:['Khi RSVP = Đồng ý, Số người tham dự phải từ 1 trở lên.']},
    {id:'vendors',title:'Nhà cung cấp',icon:'store',purpose:'Theo dõi báo giá, đánh giá, trạng thái lựa chọn, hợp đồng và thanh toán.',links:[['Công việc','Nhóm công việc dùng để gắn Nhà cung cấp với nhóm công việc tương ứng và phục vụ gợi ý.'],['Ngân sách','Dịch vụ/hạng mục cung cấp + Sự kiện liên quan quyết định hạng mục ngân sách nhận số liệu hợp đồng.'],['Khảo sát','Khi một địa điểm khảo sát được quyết định Đã chọn, có thể tạo Nhà cung cấp từ kết quả khảo sát.']],tips:['Tiền cọc + Đã thanh toán không được vượt Giá trị hợp đồng/dịch vụ.','Hạn chốt nhà cung cấp được nhắc ở Trung tâm thông báo trước 1 ngày và đúng ngày khi bản ghi còn hiệu lực.']},
    {id:'references',title:'Tham khảo',icon:'book-open-check',purpose:'Lưu nguồn ý tưởng, mức độ quan tâm, ưu tiên và đánh giá ban đầu trước khi ra quyết định.',links:[['Công việc','Nhóm công việc + Sự kiện liên quan giúp nguồn Tham khảo xuất hiện đúng ngữ cảnh trong phần gợi ý.'],['Khảo sát','Khi Lên kế hoạch đi tới xem trực tiếp = Có, hệ thống tự tạo/cập nhật Địa điểm khảo sát liên kết với nguồn này.']],tips:['Khi chọn Không cần khảo sát, nguồn vẫn nằm trong Tham khảo nhưng không xuất hiện trong hàng chờ lập lịch khảo sát.']},
    {id:'survey',title:'Khảo sát',icon:'map-pinned',purpose:'Lập một đợt đi thực tế từ các nguồn Tham khảo, xác nhận từng nơi đã đi và lưu kết quả đánh giá.',links:[['Tham khảo → Địa điểm','Nguồn bật Lên kế hoạch đi tới xem trực tiếp được đưa tự động vào danh sách chờ. Sự kiện và Nhóm công việc kế thừa từ nguồn Tham khảo.'],['Địa điểm → Kế hoạch','Một địa điểm chỉ được có một lịch active tại một thời điểm; nếu đã có lịch khác, hệ thống chặn chọn trùng.'],['Kế hoạch → Lần đi','Mỗi địa điểm trong kế hoạch là một Lần khảo sát. Danh sách được gộp theo Tên kế hoạch để theo dõi từng nơi.'],['Đã đi → Đánh giá','Chỉ khi xác nhận Đã đi mới mở tác vụ Đánh giá. Điểm TB = trung bình Chất lượng + Tư vấn/Phục vụ + Giá cả.'],['Đánh giá → Nhà cung cấp','Nếu quyết định Đã chọn, có thể tạo Nhà cung cấp và giữ liên kết với kết quả khảo sát.']],tips:['Nếu kết thúc kế hoạch khi chưa đi hết, hệ thống giữ lịch sử và cho đưa địa điểm về chờ, chuyển sang kế hoạch khác hoặc không khảo sát nữa.','Ngày khảo sát được nhắc ở Trung tâm thông báo trước 1 ngày và đúng ngày khi kế hoạch còn hoạt động.']},
    {id:'settings',title:'Thiết lập & Danh mục dùng chung',icon:'settings-2',purpose:'Quản lý thông tin chung, màu sắc và các danh mục được tái sử dụng trong toàn hệ thống.',links:[['Danh mục dùng chung','Sự kiện, Nhóm công việc, Người phụ trách, Nhóm khách, Dịch vụ/hạng mục… được dùng lại ở các tính năng thay vì nhập tự do.'],['Tài khoản & phân quyền','Quản trị viên quản lý tài khoản, quyền xem/chỉnh sửa và các chức năng đồng bộ nhạy cảm.']],tips:['Đổi tên một lựa chọn trong Danh mục dùng chung vẫn giữ liên kết nhờ ID chuẩn của bản ghi.','Các ngày cưới chính trong Thiết lập được nhắc trước 1 ngày và đúng ngày; trigger Apps Script chỉ cần cài một lần.']}
  ];
  const workflow=`<div class="guide-flow"><span>Tham khảo</span>${icon('arrow-right','size-4')}<span>Chờ khảo sát</span>${icon('arrow-right','size-4')}<span>Kế hoạch</span>${icon('arrow-right','size-4')}<span>Đã đi</span>${icon('arrow-right','size-4')}<span>Đánh giá</span>${icon('arrow-right','size-4')}<span>Quyết định</span></div>`;
  return `<section class="guide-v12-hero"><div><p class="guide-v12-eyebrow">Hướng dẫn WeddingOS</p><h3>Bắt đầu từ tính năng bạn đang dùng</h3><p>Mỗi mục bên dưới giải thích tính năng dùng để làm gì, liên kết với đâu và hệ thống tự xử lý điều gì. Các liên kết đều dựa trên dữ liệu thật của WeddingOS hiện tại.</p></div>${workflow}</section><section class="guide-v12-quick"><div><span>1</span><p><strong>Chuẩn hóa danh mục</strong>Thiết lập Sự kiện, Nhóm công việc, Người phụ trách và các lựa chọn dùng chung.</p></div><div><span>2</span><p><strong>Nhập dữ liệu nghiệp vụ</strong>Tạo Công việc, Timeline, Ngân sách, Khách mời, Nhà cung cấp hoặc Tham khảo.</p></div><div><span>3</span><p><strong>Tận dụng liên kết</strong>Chọn đúng Sự kiện/Nhóm/Danh mục để hệ thống tự nối dữ liệu và tính toán.</p></div><div><span>4</span><p><strong>Theo dõi & quyết định</strong>Dùng thống kê, bộ lọc, Khảo sát và báo cáo để cập nhật kết quả.</p></div></section><div class="guide-v12-modules">${modules.map((module,index)=>`<details class="guide-v12-module" ${index===0?'open':''}><summary><span class="guide-v12-module__icon">${icon(module.icon,'size-5')}</span><span class="min-w-0 flex-1"><strong>${esc(module.title)}</strong><small>${esc(module.purpose)}</small></span>${icon('chevron-down','size-4 guide-v12-chevron')}</summary><div class="guide-v12-module__body"><div class="guide-v12-link-grid">${module.links.map(([name,desc])=>`<article><span>${icon('git-branch','size-4')}</span><div><strong>${esc(name)}</strong><p>${esc(desc)}</p></div></article>`).join('')}</div>${module.tips.map(tip=>`<div class="guide-v12-tip">${icon('lightbulb','size-4')}<span>${esc(tip)}</span></div>`).join('')}</div></details>`).join('')}</div>`;
}

// WeddingOS v12.3.6 / Schema v21 — Survey planning domain
const SURVEY_VISIT_ACTIVE_STATUSES=new Set(['Đã lên lịch','Đang khảo sát']);
const SURVEY_VISIT_COMPLETED_STATUS='Đã thực hiện';
function boolValue(value){return value===true||value===1||String(value||'').toLowerCase()==='true'||String(value||'')==='1';}
function localTimeHHMM(){const now=new Date();return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;}
function surveyCandidateByReferenceId(referenceId){return (DATA.survey_candidates||[]).find(row=>String(row.reference_id||'')===String(referenceId||''))||null;}
function surveyVisitsForCandidate(candidateId){return (DATA.survey_visits||[]).filter(row=>String(row.candidate_id||'')===String(candidateId||''));}
function surveyVisitsForTrip(tripId){return (DATA.survey_visits||[]).filter(row=>String(row.trip_id||'')===String(tripId||'')).sort((a,b)=>Number(a.sequence||0)-Number(b.sequence||0)||String(a.scheduledTime||'').localeCompare(String(b.scheduledTime||'')));}
function surveyEvaluationForVisit(visitId){return (DATA.survey_evaluations||[]).find(row=>String(row.visit_id||'')===String(visitId||''))||null;}
function surveyEvaluationIsComplete(evaluation){if(!evaluation)return false;const scores=['qualityScore','serviceScore','priceScore'].map(key=>Number(evaluation[key]||0));return String(evaluation.status||'')==='Hoàn tất'&&scores.every(value=>Number.isInteger(value)&&value>=1&&value<=10);}
function surveyEvaluationsForCandidate(candidateId){const ids=new Set(surveyVisitsForCandidate(candidateId).map(row=>String(row.id)));return (DATA.survey_evaluations||[]).filter(row=>ids.has(String(row.visit_id||'')));}
function surveyLatestCompletedVisit(candidateId){return surveyVisitsForCandidate(candidateId).filter(row=>String(row.status||'')===SURVEY_VISIT_COMPLETED_STATUS).sort((a,b)=>{const ad=String((DATA.survey_trips||[]).find(t=>t.id===a.trip_id)?.surveyDate||''),bd=String((DATA.survey_trips||[]).find(t=>t.id===b.trip_id)?.surveyDate||'');return bd.localeCompare(ad)||Number(b.sequence||0)-Number(a.sequence||0);})[0]||null;}
function surveyCandidateSummary(candidate={}){
  const visits=surveyVisitsForCandidate(candidate.id),active=visits.filter(v=>SURVEY_VISIT_ACTIVE_STATUSES.has(String(v.status||''))),completed=visits.filter(v=>String(v.status||'')===SURVEY_VISIT_COMPLETED_STATUS),latest=surveyLatestCompletedVisit(candidate.id),latestEval=latest?surveyEvaluationForVisit(latest.id):null,ref=candidate.reference_id?(DATA.references||[]).find(r=>String(r.id)===String(candidate.reference_id)):null;
  let state='Chờ xếp lịch';const decision=String(candidate.decision||'Chưa quyết định');
  if(decision==='Đã chọn')state='Đã chọn';else if(decision==='Loại')state='Loại';else if(decision==='Không khảo sát nữa')state='Không cần khảo sát';else if(active.some(v=>String(v.status)==='Đang khảo sát'))state='Đang khảo sát';else if(active.length)state='Đã lên lịch';else if(boolValue(candidate.needsRevisit)||decision==='Cần khảo sát lại')state='Cần khảo sát lại';else if(latest&&!surveyEvaluationIsComplete(latestEval))state='Chờ đánh giá';else if(surveyEvaluationIsComplete(latestEval)&&['','Chưa quyết định'].includes(String(latestEval.decision||'')))state='Chờ quyết định';else if(latestEval&&['Shortlist','Ưu tiên cao'].includes(String(latestEval.decision||'')))state='Ưu tiên cao';else if(completed.length)state='Đã từng khảo sát';else if(ref&&!boolValue(ref.needsSurvey))state='Không cần khảo sát';
  const trip=latest?(DATA.survey_trips||[]).find(t=>String(t.id)===String(latest.trip_id||'')):null;
  return {surveyState:state,visitCount:completed.length,latestScore:Number(latestEval?.overallScore||0),latestVisitDate:String(trip?.surveyDate||''),latestVisit:latest,latestEvaluation:latestEval};
}
function referenceSurveySummary(reference={}){const candidate=surveyCandidateByReferenceId(reference.id);if(!candidate)return{state:boolValue(reference.needsSurvey)?'Chờ xếp lịch':'Chưa yêu cầu',candidate:null,visitCount:0,latestScore:0,latestVisitDate:''};const summary=surveyCandidateSummary(candidate);return{state:summary.surveyState,candidate,...summary};}
function referenceDisplayNameLegacy(reference={}){const group=reference.group||resolveLookupLabel(reference.group_id,'Tham khảo'),source=reference.source||'Nguồn',url=String(reference.sourceUrl||'').replace(/^https?:\/\//,'').slice(0,50);return [group,source,url].filter(Boolean).join(' · ')||`Tham khảo ${reference.id||''}`;}
function referenceDisplayName(reference={}){return String(reference.title||'').trim()||referenceDisplayNameLegacy(reference);}
function referenceEventLabel(reference={}){return String(reference.event||resolveLookupLabel(String(reference.anchor_event_id||''),'')).trim()||'Chưa gắn sự kiện';}
function referenceGroupLabel(reference={}){return String(reference.group||resolveLookupLabel(String(reference.group_id||''),'')).trim()||'Chưa gắn nhóm việc';}
function referenceContextLabel(reference={}){return [referenceDisplayName(reference),referenceEventLabel(reference),referenceGroupLabel(reference)].join(' - ');}
function syncReferenceSurveyCandidate(reference,previous={}){
  let candidate=surveyCandidateByReferenceId(reference.id);if(!boolValue(reference.needsSurvey)){if(candidate&&!surveyVisitsForCandidate(candidate.id).length&&!['Đã chọn','Loại'].includes(String(candidate.decision||''))){const before=structuredClone(candidate);candidate.decision='Không khảo sát nữa';candidate.needsRevisit=false;candidate.updatedAt=new Date().toISOString();queueUpsert('survey_candidates',candidate,before);}return candidate;}
  if(candidate){const before=structuredClone(candidate);candidate.name=referenceDisplayName(reference);candidate.anchorEvent=reference.event||candidate.anchorEvent||'';candidate.anchor_event_id=reference.anchor_event_id||candidate.anchor_event_id||'';candidate.group=reference.group||candidate.group||'';candidate.group_id=reference.group_id||candidate.group_id||'';candidate.referenceSource=reference.sourceUrl||candidate.referenceSource||'';if(candidate.decision==='Không khảo sát nữa')candidate.decision='Chưa quyết định';candidate.updatedAt=new Date().toISOString();queueUpsert('survey_candidates',candidate,before);return candidate;}
  candidate={id:uid('survey-candidate'),reference_id:reference.id,referenceSource:reference.sourceUrl||'',anchorEvent:reference.event||'',anchor_event_id:reference.anchor_event_id||'',group:reference.group||'',group_id:reference.group_id||'',name:referenceDisplayName(reference),address:'',mapUrl:'',contact:'',decision:'Chưa quyết định',needsRevisit:false,vendor_id:'',notes:'',updatedAt:new Date().toISOString(),_rowVersion:0,_updatedAt:'',_updatedBy:''};DATA.survey_candidates.unshift(candidate);queueUpsert('survey_candidates',candidate);return candidate;
}
function renderReferenceSurveyPanel(record={}){
  const enabled=boolValue(record.needsSurvey),summary=record.id?referenceSurveySummary(record):null;
  return `<div class="reference-survey-panel ${enabled?'is-enabled':''}" data-reference-survey-panel>
    <div class="reference-survey-panel__copy"><span class="reference-survey-panel__icon">${icon('map-pinned','size-4')}</span><span><strong>Lên kế hoạch đi tới xem trực tiếp</strong><small>Chọn Có để đưa nguồn này vào Khảo sát. Điểm đánh giá tại Tham khảo sẽ được ẩn và kết quả thực tế được lấy từ phiếu Đánh giá khảo sát.</small></span></div>
    <div class="reference-survey-options" role="radiogroup" aria-label="Lên kế hoạch đi tới xem trực tiếp"><label><input type="radio" name="needsSurvey" value="true" ${enabled?'checked':''}><span>Có</span></label><label><input type="radio" name="needsSurvey" value="false" ${enabled?'':'checked'}><span>Không</span></label></div>
    ${summary?.candidate?`<div class="reference-survey-current"><span>${statusBadge(summary.state)}</span><span>${summary.visitCount?`Đã đi ${summary.visitCount} lần`:'Chưa có lần đi hoàn tất'}</span>${summary.latestScore?`<span>Điểm khảo sát ${summary.latestScore.toFixed(1)}/10</span>`:''}</div>`:''}
  </div>`;
}
function updateReferenceRatingVisibility(root=document){const enabled=String(root.querySelector?.('input[name="needsSurvey"]:checked')?.value||'false')==='true',field=root.querySelector?.('[data-editor-field="rating"]');if(field){field.classList.toggle('hidden',enabled);field.setAttribute('aria-hidden',String(enabled));}const section=field?.closest?.('[data-editor-section="rating"]');section?.classList.toggle('reference-rating-hidden',enabled);}
function bindReferenceSurveyPanel(root=document){root.querySelectorAll?.('input[name="needsSurvey"]').forEach(input=>input.addEventListener('change',()=>{const panel=input.closest('[data-reference-survey-panel]');panel?.classList.toggle('is-enabled',input.value==='true'&&input.checked);updateReferenceRatingVisibility(root);}));updateReferenceRatingVisibility(root);}
function activeSurveyVisitForCandidate(candidateId,excludeTripId=''){return (DATA.survey_visits||[]).find(v=>String(v.candidate_id||'')===String(candidateId)&&SURVEY_VISIT_ACTIVE_STATUSES.has(String(v.status||''))&&String(v.trip_id||'')!==String(excludeTripId||''))||null;}
function surveyTripProgress(trip){const visits=surveyVisitsForTrip(trip.id),done=visits.filter(v=>v.status===SURVEY_VISIT_COMPLETED_STATUS).length,evaluated=visits.filter(v=>surveyEvaluationIsComplete(surveyEvaluationForVisit(v.id))).length;return{visits,done,evaluated,awaitingEvaluation:Math.max(0,done-evaluated),total:visits.length,pending:visits.filter(v=>SURVEY_VISIT_ACTIVE_STATUSES.has(String(v.status||'')))};}
function reconcileSurveyTripStatus(tripId){const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(tripId||''));if(!trip||['Kết thúc sớm','Hủy'].includes(String(trip.status||'')))return trip;const prog=surveyTripProgress(trip);if(!prog.total)return trip;let next=trip.status;if(prog.done===prog.total)next=prog.evaluated===prog.total?'Hoàn tất':'Chờ đánh giá';else if(prog.done>0||prog.visits.some(v=>String(v.status||'')==='Đang khảo sát'))next='Đang thực hiện';else if(trip.status!=='Bản nháp')next='Đã lên lịch';if(next!==trip.status){const before=structuredClone(trip);trip.status=next;trip.updatedAt=new Date().toISOString();queueUpsert('survey_trips',trip,before);}return trip;}
function surveyModuleEnabled(){const item=(DATA.settings||[]).find(row=>row.key==='surveyModuleEnabled');return item?boolValue(item.value):true;}
function surveyPreference(){return getCurrentPreference()?.survey||{};}
function surveyHideCompletedPlans(){return Boolean(surveyPreference().hideCompletedPlans);}
function toggleSurveyHideCompletedPlans(){updateCurrentPreference({survey:{hideCompletedPlans:!surveyHideCompletedPlans()}});UI.visibleCount=CONFIG.pageSize;renderPage();}
function setSurveyMetricFilter(metric=''){UI.surveyMetricFilter=UI.surveyMetricFilter===metric?'':metric;UI.visibleCount=CONFIG.pageSize;renderPage();}
function surveyCandidateReference(candidate={}){return candidate.reference_id?(DATA.references||[]).find(row=>String(row.id)===String(candidate.reference_id))||null:null;}
function surveyReferenceInterest(candidate={}){const ref=surveyCandidateReference(candidate);return String(ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'')||'—');}
function surveyReferenceRating(candidate={}){return Number(surveyCandidateReference(candidate)?.rating||0);}
function surveyParticipantLabels(trip={}){if(Array.isArray(trip.participants)&&trip.participants.length)return trip.participants.filter(Boolean);return (Array.isArray(trip.participant_ids)?trip.participant_ids:[]).map(id=>lookupItemById(id)?.value).filter(Boolean);}
function surveyListRows(){
  return (DATA.survey_visits||[]).map(visit=>{
    const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(visit.trip_id))||{},candidate=(DATA.survey_candidates||[]).find(row=>String(row.id)===String(visit.candidate_id))||{},ref=surveyCandidateReference(candidate),evaluation=surveyEvaluationForVisit(visit.id);
    return {id:visit.id,visit_id:visit.id,trip_id:trip.id||visit.trip_id||'',candidate_id:candidate.id||visit.candidate_id||'',reference_id:ref?.id||candidate.reference_id||'',sequence:Number(visit.sequence||0),visited:String(visit.status||'')===SURVEY_VISIT_COMPLETED_STATUS,candidateName:candidate.name||visit.candidateName||'Địa điểm khảo sát',referenceTitle:ref?.title||referenceDisplayName(ref||{})||'—',tripName:trip.name||visit.tripName||'Kế hoạch khảo sát',surveyDate:trip.surveyDate||'',participants:surveyParticipantLabels(trip),tripStatus:trip.status||'',anchorEvent:candidate.anchorEvent||resolveLookupLabel(String(candidate.anchor_event_id||''),'—'),group:candidate.group||resolveLookupLabel(String(candidate.group_id||''),'—'),interestLevel:ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'—'),referenceRating:Number(ref?.rating||0),scheduledTime:visit.scheduledTime||'',address:candidate.address||'',mapUrl:candidate.mapUrl||'',status:visit.status||'',overallScore:Number(evaluation?.overallScore||0)||'',decision:(evaluation?.decision==='Shortlist'?'Ưu tiên cao':evaluation?.decision)||candidate.decision||'Chưa quyết định',evaluationId:evaluation?.id||'',evaluationComplete:surveyEvaluationIsComplete(evaluation),notes:visit.notes||''};
  });
}
function surveyWaitingCandidates(){return (DATA.survey_candidates||[]).filter(candidate=>{const ref=surveyCandidateReference(candidate),decision=String(candidate.decision||'Chưa quyết định');if(ref&&!boolValue(ref.needsSurvey))return false;if(['Đã chọn','Loại','Không khảo sát nữa'].includes(decision))return false;const state=surveyCandidateSummary(candidate).surveyState;return ['Chờ xếp lịch','Cần khảo sát lại'].includes(state);});}
function surveyFilteredListRows(){
  let rows=filteredRows('survey');
  if(surveyHideCompletedPlans())rows=rows.filter(row=>row.tripStatus!=='Hoàn tất');
  if(UI.surveyMetricFilter==='active')rows=rows.filter(row=>['Đã lên lịch','Đang thực hiện','Chờ đánh giá'].includes(row.tripStatus));
  else if(UI.surveyMetricFilter==='scheduled')rows=rows.filter(row=>SURVEY_VISIT_ACTIVE_STATUSES.has(String(row.status||'')));
  else if(UI.surveyMetricFilter==='review')rows=rows.filter(row=>row.visited&&!row.evaluationComplete);
  else if(UI.surveyMetricFilter==='evaluated')rows=rows.filter(row=>Boolean(row.evaluationComplete));
  if(!currentListSort('survey'))rows.sort((a,b)=>String(b.surveyDate||'').localeCompare(String(a.surveyDate||''))||String(a.tripName||'').localeCompare(String(b.tripName||''),'vi')||Number(a.sequence||0)-Number(b.sequence||0));
  return rows;
}
function surveyWaitingCandidateStatisticRows(){
  const rows=surveyWaitingCandidates().map(candidate=>{const ref=surveyCandidateReference(candidate);return{id:`waiting:${candidate.id}`,candidate_id:candidate.id,reference_id:ref?.id||candidate.reference_id||'',candidateName:candidate.name||'Địa điểm khảo sát',referenceTitle:ref?.title||referenceDisplayName(ref||{})||'—',tripName:'',surveyDate:'',participants:[],tripStatus:'',anchorEvent:candidate.anchorEvent||resolveLookupLabel(String(candidate.anchor_event_id||''),'—'),group:candidate.group||resolveLookupLabel(String(candidate.group_id||''),'—'),interestLevel:ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'—'),referenceRating:Number(ref?.rating||0),scheduledTime:'',address:candidate.address||'',mapUrl:candidate.mapUrl||'',status:'',overallScore:'',decision:candidate.decision||'Chưa quyết định'};});
  return filterRowsByCurrentCriteria('survey',rows,{includeQuickFilters:false,applySort:false});
}
function renderSurveyWidgets(){
  const rows=statisticsRows('survey'),activePlans=new Set(rows.filter(row=>['Đã lên lịch','Đang thực hiện','Chờ đánh giá'].includes(row.tripStatus)).map(row=>row.trip_id)).size,waiting=surveyWaitingCandidateStatisticRows().length,review=rows.filter(row=>row.visited&&!row.evaluationComplete).length,evaluated=rows.filter(row=>row.evaluationComplete).length;
  return renderWidgetRow([
    statCard('Kế hoạch đang hoạt động',activePlans,'route','blue',"setSurveyMetricFilter('active')",UI.surveyMetricFilter==='active'),
    statCard('Chờ xếp lịch',waiting,'calendar-plus','amber',"openSurveyTripPlanner()",false),
    statCard('Chờ đánh giá',review,'clipboard-pen-line','rose',"setSurveyMetricFilter('review')",UI.surveyMetricFilter==='review'),
    statCard('Đã đánh giá',evaluated,'badge-check','emerald',"setSurveyMetricFilter('evaluated')",UI.surveyMetricFilter==='evaluated')
  ],'status');
}
function surveyVisitCompleteControl(row,mobile=false){
  const evaluation=Boolean(row.evaluationId),checked=Boolean(row.visited),canToggle=(SURVEY_VISIT_ACTIVE_STATUSES.has(String(row.status||''))||checked)&&!evaluation&&!UI.mutationLocked;
  return `<label class="survey-visited-toggle ${mobile?'survey-visited-toggle--mobile':''}" title="${evaluation?'Đã có đánh giá nên không thể bỏ xác nhận đã đi':checked?'Bỏ xác nhận đã đi':'Xác nhận đã đi'}"><input type="checkbox" data-survey-visit-check="${esc(row.visit_id)}" ${checked?'checked':''} ${canToggle?'':'disabled'} aria-label="${checked?'Bỏ xác nhận':'Xác nhận'} đã đi ${esc(row.candidateName)}"><span>${icon(checked?'circle-check-big':'circle','size-4')}</span></label>`;
}
function surveyActionButtons(row,mobile=false){
  const cls=mobile?'survey-mobile-action':'survey-icon-action action-tooltip';
  const evaluateDisabled=row.visited?'':`disabled aria-disabled="true"`;
  const evaluateLabel=row.evaluationId?'Sửa đánh giá':'Đánh giá';
  const map=safeExternalUrl(row.mapUrl||'');
  return `<button type="button" data-survey-candidate-detail="${esc(row.candidate_id)}" class="${cls}" aria-label="Xem chi tiết" ${mobile?'':`data-tooltip="Xem chi tiết"`}>${icon('eye','size-4')}${mobile?'<span>Chi tiết</span>':''}</button><button type="button" data-survey-visit-evaluate="${esc(row.visit_id)}" ${evaluateDisabled} class="${cls}" aria-label="${evaluateLabel}" ${mobile?'':`data-tooltip="${esc(row.visited?evaluateLabel:'Cần xác nhận Đã đi trước khi đánh giá')}"`}>${icon('clipboard-pen-line','size-4')}${mobile?`<span>${esc(evaluateLabel)}</span>`:''}</button>${map?`<a href="${esc(map)}" target="_blank" rel="noopener noreferrer" class="${cls}" aria-label="Mở bản đồ" ${mobile?'':`data-tooltip="Mở bản đồ"`}>${icon('map','size-4')}${mobile?'<span>Bản đồ</span>':''}</a>`:''}`;
}
function surveyCellValue(schema,key,row){
  if(key==='visited')return surveyVisitCompleteControl(row);
  if(key==='candidateName')return `<button type="button" data-survey-candidate-detail="${esc(row.candidate_id)}" class="record-title-button font-semibold">${esc(row.candidateName)}</button>`;
  if(key==='referenceTitle')return row.reference_id?`<button type="button" data-survey-reference-detail="${esc(row.reference_id)}" class="record-title-button font-semibold">${esc(row.referenceTitle||'—')}</button>`:esc(row.referenceTitle||'—');
  if(key==='overallScore')return row.overallScore?`<span class="tabular font-semibold">${Number(row.overallScore).toFixed(1)}/10</span>`:'—';
  return displayValue(schema,key,row[key]);
}
function renderSurveyTableRows(rows,visibleColumns){const schema=SURVEY_LIST_SCHEMA;return rows.map(row=>`<tr class="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/45">${visibleColumns.map(key=>key===ACTION_COLUMN_KEY?`<td class="${dataColumnClass(schema,key)} px-4 py-3 align-middle"><div class="flex items-center justify-end gap-1">${surveyActionButtons(row)}</div></td>`:`<td class="${dataColumnClass(schema,key)} px-5 py-4 align-top text-slate-600 dark:text-slate-300"><div class="data-cell-content">${surveyCellValue(schema,key,row)}</div></td>`).join('')}</tr>`).join('');}
function renderSurveyMobileCard(row,visibleColumns){
  const schema=SURVEY_LIST_SCHEMA,dataColumns=visibleColumns.filter(key=>key!==ACTION_COLUMN_KEY&&key!=='visited'),primary=dataColumns.includes('candidateName')?'candidateName':dataColumns[0],secondary=dataColumns.filter(key=>key!==primary),showActions=visibleColumns.includes(ACTION_COLUMN_KEY);
  return `<article class="mobile-data-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div class="mobile-card-title-row">${visibleColumns.includes('visited')?surveyVisitCompleteControl(row,true):''}<div class="min-w-0 flex-1"><button type="button" data-survey-candidate-detail="${esc(row.candidate_id)}" class="record-title-button text-sm font-bold leading-6">${esc(row[primary]||row.candidateName||'Địa điểm khảo sát')}</button></div></div><dl class="mobile-card-grid">${secondary.map((key,index)=>`<div class="mobile-card-field ${(secondary.length%2===1&&index===secondary.length-1)?'mobile-card-field--full':''}"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(fieldLabel(schema,key))}</dt><dd class="mobile-card-value mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">${surveyCellValue(schema,key,row)}</dd></div>`).join('')}</dl>${showActions?`<div class="mobile-card-actions">${surveyActionButtons(row,true)}</div>`:''}</article>`;
}
function renderSurveyGroup(group,visibleColumns){
  const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(group.tripId))||{},prog=surveyTripProgress(trip),participants=surveyParticipantLabels(trip).join(', ')||'Chưa có người tham gia',canFinish=['Đã lên lịch','Đang thực hiện'].includes(String(trip.status||''));
  const actions=`<button type="button" data-survey-trip-view="${esc(group.tripId)}" class="action-tooltip" aria-label="Xem kế hoạch" data-tooltip="Xem kế hoạch">${icon('eye','size-4')}</button><button type="button" data-survey-trip-edit="${esc(group.tripId)}" ${mutationActionDisabled()} class="action-tooltip" aria-label="Sửa kế hoạch" data-tooltip="Sửa kế hoạch">${icon('pencil','size-4')}</button>${canFinish?`<button type="button" data-survey-trip-finish="${esc(group.tripId)}" ${mutationActionDisabled()} class="action-tooltip" aria-label="Kết thúc kế hoạch" data-tooltip="Kết thúc kế hoạch">${icon('flag','size-4')}</button>`:''}<button type="button" data-survey-trip-delete="${esc(group.tripId)}" ${mutationActionDisabled()} class="action-tooltip survey-delete-action" aria-label="Xóa kế hoạch" data-tooltip="Xóa kế hoạch và dữ liệu khảo sát liên quan">${icon('trash-2','size-4')}</button>`;
  return `<section class="timeline-group survey-plan-group"><div class="timeline-group__header survey-plan-group__header"><div class="survey-group-copy"><div class="survey-group-title-line"><p class="truncate text-sm font-bold">${esc(group.label||trip.name||'Kế hoạch khảo sát')}</p><span class="survey-group-status">${statusBadge(trip.status||'—')}</span></div><div class="survey-group-meta-line"><p class="survey-group-meta">${esc(formatDate(trip.surveyDate)||'Chưa có ngày')} · ${esc(participants)} · ${prog.done}/${prog.total} đã đi</p><div class="survey-group-actions">${actions}</div></div></div></div><div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(SURVEY_LIST_SCHEMA,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(SURVEY_LIST_SCHEMA,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${renderSurveyTableRows(group.rows,visibleColumns)}</tbody>${renderGroupSummaryDesktop('survey',SURVEY_LIST_SCHEMA,group.rows,visibleColumns)}</table></div><div class="grid gap-3 p-3 md:hidden">${group.rows.map(row=>renderSurveyMobileCard(row,visibleColumns)).join('')}</div>${renderGroupSummaryMobile('survey',SURVEY_LIST_SCHEMA,group.rows,visibleColumns)}</section>`;
}
function renderSurveyListContent(rows,visibleColumns){
  if(!rows.length)return emptyState('Không tìm thấy dữ liệu','Thử thay đổi bộ lọc hoặc tạo kế hoạch từ các nguồn Tham khảo đang chờ khảo sát.','map-pin-off',true);
  const grouped=Boolean(currentGroupField('survey'));if(grouped)return renderGroupedCollection('survey',SURVEY_LIST_SCHEMA,rows,visibleColumns);
  return `<div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(SURVEY_LIST_SCHEMA,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(SURVEY_LIST_SCHEMA,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${renderSurveyTableRows(rows,visibleColumns)}</tbody></table></div><div class="grid gap-3 p-3 md:hidden">${rows.map(row=>renderSurveyMobileCard(row,visibleColumns)).join('')}</div>`;
}
function renderSurveyHub(){
  if(!surveyModuleEnabled())return `<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">${emptyStateInline('Khảo sát đang tắt','Quản trị viên cần bật tính năng Khảo sát trong cấu hình hệ thống.')}</section>`;
  const all=surveyListRows(),filtered=surveyFilteredListRows(),groupKey=currentGroupField('survey'),grouped=Boolean(groupKey),configuredColumns=getVisibleColumns('survey'),visibleColumns=grouped&&groupKey==='tripName'?configuredColumns.filter(key=>key!=='tripName'):configuredColumns,rows=grouped?filtered:filtered.slice(0,UI.visibleCount),hasMore=!grouped&&rows.length<filtered.length,filterCount=activeCollectionFilterCount()+(UI.surveyMetricFilter?1:0),currentSort=currentListSort('survey'),toolbar='collection-toolbar-button',hideCompleted=surveyHideCompletedPlans();
  return `${renderSurveyWidgets()}<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="collection-panel-toolbar border-b border-slate-200 dark:border-slate-800"><div class="collection-panel-toolbar__heading"><h3>Khảo sát</h3><p>${plural(all.length,'lần khảo sát')} · ${plural(filtered.length,'kết quả phù hợp')}</p></div><div class="collection-panel-toolbar__actions"><button id="openFilterDialogButton" type="button" class="${toolbar} ${filterCount?'collection-toolbar-button--active':''}">${icon('search','size-4')}<span>Tìm kiếm & bộ lọc</span></button><button id="openSortDialogButton" type="button" class="${toolbar} ${currentSort?'collection-toolbar-button--active':''}">${icon('arrow-up-down','size-4')}<span>Sắp xếp</span></button>${renderGroupControl('survey')}<button id="surveyHideCompletedButton" type="button" class="${toolbar} ${hideCompleted?'collection-toolbar-button--active':''}" aria-pressed="${hideCompleted}">${icon(hideCompleted?'eye-off':'eye','size-4')}<span>Ẩn kế hoạch hoàn thành</span></button><button id="customizeColumnsButton" type="button" class="${toolbar}">${icon('columns-3','size-4')}<span>Cột hiển thị</span></button><button id="surveyCreateButton" type="button" ${UI.mutationLocked?'disabled aria-disabled="true"':''} class="collection-toolbar-add">${icon('plus','size-4')}<span>Thêm kế hoạch</span></button></div></div>${renderSurveyListContent(rows,visibleColumns)}<div class="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p class="text-xs text-slate-500 dark:text-slate-400">${grouped?'Đang hiển thị toàn bộ':'Đang hiển thị'} <span class="font-semibold text-slate-700 dark:text-slate-200">${rows.length}</span> trong ${filtered.length} lần khảo sát</p>${hasMore?`<button id="loadMoreButton" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevrons-down','size-3.5')}Xem thêm 20 bản ghi</button>`:`<span class="text-xs font-semibold text-slate-400">Đã hiển thị toàn bộ</span>`}</div></section>`;
}
function ensureSurveyDialog(){let dialog=document.getElementById('surveyDialog');if(dialog)return dialog;dialog=document.createElement('dialog');dialog.id='surveyDialog';dialog.className='dialog-centered survey-dialog-shell rounded-3xl border border-slate-200 bg-white p-0 shadow-panel dark:border-slate-800 dark:bg-slate-900';dialog.innerHTML=`<div class="survey-dialog-head"><div class="min-w-0"><p class="survey-eyebrow">Khảo sát</p><h3 id="surveyDialogTitle">Khảo sát</h3><p id="surveyDialogSubtitle"></p></div><button type="button" data-survey-dialog-close aria-label="Đóng">${icon('x','size-4')}</button></div><div id="surveyDialogBody" class="survey-dialog-body app-scrollbar"></div><div id="surveyDialogFooter" class="survey-dialog-footer"></div>`;document.body.appendChild(dialog);dialog.addEventListener('click',event=>{if(event.target.closest('[data-survey-dialog-close]'))dialog.close();});return dialog;}
function showSurveyDialog(title,subtitle,body,footer=''){const dialog=ensureSurveyDialog();document.getElementById('surveyDialogTitle').textContent=title;document.getElementById('surveyDialogSubtitle').textContent=subtitle||'';document.getElementById('surveyDialogBody').innerHTML=body;document.getElementById('surveyDialogFooter').innerHTML=footer;if(!dialog.open)dialog.showModal();bindDatePickerUX(dialog);bindTime24Controls(dialog);refreshIcons();return dialog;}
function openSurveyCreateMenu(){openSurveyTripPlanner();}
function surveyPlanningCandidates(tripId=''){const existingIds=new Set(surveyVisitsForTrip(tripId).map(row=>String(row.candidate_id)));return (DATA.survey_candidates||[]).filter(candidate=>{if(existingIds.has(String(candidate.id)))return true;const ref=surveyCandidateReference(candidate),decision=String(candidate.decision||'Chưa quyết định');if(ref&&!boolValue(ref.needsSurvey))return false;if(['Đã chọn','Loại','Không khảo sát nữa'].includes(decision))return false;const conflict=activeSurveyVisitForCandidate(candidate.id,tripId),state=surveyCandidateSummary(candidate).surveyState;return Boolean(conflict)||['Chờ xếp lịch','Cần khảo sát lại'].includes(state);});}
function surveyCandidateStatusText(candidate,tripId=''){const conflict=activeSurveyVisitForCandidate(candidate.id,tripId),sum=surveyCandidateSummary(candidate);if(conflict){const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(conflict.trip_id));return `Đã có lịch khác${trip?.name?` · ${trip.name}`:''}`;}if(sum.visitCount)return `Đã đi ${sum.visitCount} lần${sum.surveyState==='Cần khảo sát lại'?' · Cần khảo sát lại':''}`;return sum.surveyState||'Chờ xếp lịch';}
function renderSurveyPlannerCandidates(candidates,selected,tripId=''){
  if(!candidates.length)return '<div class="survey-planner-empty">Không có nguồn Tham khảo đang chờ khảo sát.</div>';
  return `<div class="survey-widget-table-wrap app-scrollbar"><table class="survey-widget-table"><thead><tr><th class="survey-widget-check">Chọn</th><th>Tiêu đề</th><th>Sự kiện liên quan</th><th>Nhóm việc</th><th>Mức độ quan tâm</th><th>Xem chi tiết</th><th>Mô tả trạng thái</th></tr></thead><tbody>${candidates.map(candidate=>{const ref=surveyCandidateReference(candidate),conflict=activeSurveyVisitForCandidate(candidate.id,tripId),checked=selected.has(candidate.id);return `<tr class="${conflict?'is-disabled':''}"><td class="survey-widget-check"><input type="checkbox" data-survey-planner-pick="${esc(candidate.id)}" ${checked?'checked':''} ${conflict?'disabled':''} aria-label="Chọn địa điểm khảo sát"></td><td><strong class="survey-reference-title">${esc(ref?.title||referenceDisplayName(ref||{})||candidate.name||'—')}</strong></td><td>${esc(candidate.anchorEvent||resolveLookupLabel(String(candidate.anchor_event_id||''),'—'))}</td><td>${esc(candidate.group||resolveLookupLabel(String(candidate.group_id||''),'—'))}</td><td>${esc(ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'—'))}</td><td>${ref?`<button type="button" data-survey-reference-detail="${esc(ref.id)}" class="survey-table-action">${icon('eye','size-3.5')}Xem chi tiết</button>`:'—'}</td><td><span class="survey-state-note ${conflict?'survey-state-note--blocked':''}">${esc(surveyCandidateStatusText(candidate,tripId))}</span></td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderSurveyPlannerTime(candidateId,value=''){const normalized=normalizeTime24(value),parts=normalized?normalized.split(':'):['',''];return `<div class="survey-time-control" data-survey-time-control="${esc(candidateId)}"><select data-survey-time-hour aria-label="Giờ đến"><option value="">Giờ</option>${Array.from({length:24},(_,i)=>String(i).padStart(2,'0')).map(h=>`<option value="${h}" ${h===parts[0]?'selected':''}>${h}</option>`).join('')}</select><span>:</span><select data-survey-time-minute aria-label="Phút đến"><option value="">Phút</option>${Array.from({length:60},(_,i)=>String(i).padStart(2,'0')).map(m=>`<option value="${m}" ${m===parts[1]?'selected':''}>${m}</option>`).join('')}</select><input type="hidden" data-survey-visit-time value="${esc(normalized)}"></div>`;}
function surveyPlanRow(candidate,visit,index,draft={}){const ref=surveyCandidateReference(candidate),scheduledTime=draft.scheduledTime!==undefined?draft.scheduledTime:(visit?.scheduledTime||''),address=draft.address!==undefined?draft.address:(candidate.address||''),mapUrl=draft.mapUrl!==undefined?draft.mapUrl:(candidate.mapUrl||''),title=ref?.title||referenceDisplayName(ref||{})||candidate.name||'—',safeMap=safeExternalUrl(mapUrl||'');return `<tr data-survey-plan-row="${esc(candidate.id)}"><td class="survey-itinerary-sequence" data-label="STT"><span>${index+1}</span></td><td class="survey-itinerary-title" data-label="Tiêu đề"><strong>${esc(title)}</strong></td><td class="survey-itinerary-meta" data-label="Nhóm việc">${esc(candidate.group||resolveLookupLabel(String(candidate.group_id||''),'—'))}</td><td class="survey-itinerary-meta" data-label="Mức độ quan tâm">${esc(ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'—'))}</td><td class="survey-itinerary-time" data-label="Thời gian đến">${renderSurveyPlannerTime(candidate.id,scheduledTime)}</td><td class="survey-itinerary-address" data-label="Địa chỉ"><input type="text" data-survey-candidate-address value="${esc(address)}" placeholder="Nhập địa chỉ"></td><td class="survey-itinerary-map" data-label="Link bản đồ"><div class="survey-map-field ${safeMap?'has-map':''}"><input type="url" data-survey-candidate-map value="${esc(mapUrl)}" placeholder="https://..." aria-label="Link bản đồ"><div class="survey-map-field__actions"><a data-survey-map-open href="${esc(safeMap||'#')}" target="_blank" rel="noopener noreferrer" class="survey-map-open ${safeMap?'':'hidden'}" aria-label="Mở bản đồ">${icon('map-pin','size-3.5')}<span>Mở bản đồ</span></a><button type="button" data-survey-map-edit class="survey-map-edit ${safeMap?'':'hidden'}" aria-label="Sửa link bản đồ">${icon('pencil','size-3.5')}<span>Sửa link</span></button></div></div></td><td class="survey-itinerary-actions-cell" data-label="Tác vụ"><div class="survey-itinerary-actions"><button type="button" data-survey-row-up class="action-tooltip" aria-label="Đưa lên" data-tooltip="Đưa lên">${icon('chevron-up','size-4')}</button><button type="button" data-survey-row-down class="action-tooltip" aria-label="Đưa xuống" data-tooltip="Đưa xuống">${icon('chevron-down','size-4')}</button><button type="button" data-survey-row-remove class="action-tooltip" aria-label="Bỏ khỏi kế hoạch" data-tooltip="Bỏ khỏi kế hoạch">${icon('x','size-4')}</button></div></td></tr>`;}
function renderSurveyPlannerRows(selected,existing,drafts=UI.surveyPlanner?.draftRows||{}){const rows=[...selected].map((id,index)=>{const candidate=(DATA.survey_candidates||[]).find(row=>row.id===id),visit=existing.find(row=>String(row.candidate_id)===String(id));return candidate?surveyPlanRow(candidate,visit,index,drafts[String(id)]||{}):'';}).join('');return rows||'<tr><td colspan="8"><div class="survey-planner-empty">Chọn ít nhất một nguồn ở Widget Địa điểm để xây dựng lịch trình.</div></td></tr>';}
function captureSurveyPlannerDraftRows(root=document.getElementById('surveyPlannerRows')){if(!UI.surveyPlanner||!root)return;const drafts=UI.surveyPlanner.draftRows||(UI.surveyPlanner.draftRows={});root.querySelectorAll('[data-survey-plan-row]').forEach(row=>{const id=String(row.dataset.surveyPlanRow||'');if(!id)return;drafts[id]={...(drafts[id]||{}),scheduledTime:String(row.querySelector('[data-survey-visit-time]')?.value||''),address:String(row.querySelector('[data-survey-candidate-address]')?.value||''),mapUrl:String(row.querySelector('[data-survey-candidate-map]')?.value||'')};});}
function renderSurveyPlannerAttachments(tripId){const existing=recordAttachments('survey_trips',tripId),pending=Array.isArray(UI.surveyPlanner?.pendingFiles)?UI.surveyPlanner.pendingFiles:[],used=existing.length+pending.length,canAdd=used<CONFIG.attachmentMaxFiles;return `<div id="surveyPlannerAttachments" class="survey-planner-attachments"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-bold">Tệp đính kèm</p><p class="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Tệp được tải lên Google Drive ngay khi chọn · tối đa ${CONFIG.attachmentMaxFiles} tệp · 10 MB/tệp.</p></div><span class="attachment-counter">${used}/${CONFIG.attachmentMaxFiles}</span></div>${existing.length||pending.length?`<div class="mt-3 space-y-2">${existing.map(item=>{const staged=attachmentStatus(item)==='staged';return `<div class="attachment-row ${staged?'attachment-row--staged':''}"><span class="attachment-file-icon">${icon(attachmentFileIcon(item),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold">${esc(item.fileName)}</span><span class="mt-0.5 block text-[10px] ${staged?'text-amber-600 dark:text-amber-300':'text-slate-400'}">${esc(formatAttachmentSize(item.sizeBytes))} · ${esc(attachmentStatusText(item))}</span></span>${attachmentViewButton(item,true)}<button type="button" data-survey-delete-attachment="${esc(item.id)}" class="attachment-icon-action attachment-icon-action--danger">${icon('trash-2','size-3.5')}</button></div>`;}).join('')}${pending.map((entry,index)=>`<div class="attachment-row ${entry.status==='error'?'attachment-row--error':''}"><span class="attachment-file-icon">${icon(attachmentFileIcon(entry),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold">${esc(entry.file.name)}</span><span class="mt-0.5 block text-[10px] ${entry.status==='error'?'text-rose-600':'text-slate-400'}">${entry.status==='uploading'?'Đang tải lên Google Drive…':entry.status==='error'?esc(entry.error||'Tải lên thất bại'):`${esc(formatAttachmentSize(entry.file.size))} · Chờ tải lên`}</span></span>${entry.status==='uploading'?icon('loader-circle','size-4 animate-spin text-brand-600'):`<button type="button" data-survey-remove-pending="${index}" class="attachment-icon-action">${icon('x','size-3.5')}</button>`}</div>`).join('')}</div>`:''}<input id="surveyPlannerFileInput" type="file" multiple ${canAdd?'':'disabled'} class="sr-only" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"><button type="button" data-survey-file-pick ${canAdd?'':'disabled'} class="attachment-dropzone attachment-dropzone--button mt-3 ${canAdd?'':'attachment-dropzone--disabled'}"><span class="attachment-dropzone__icon">${icon('paperclip','size-5')}</span><span><span class="block text-xs font-semibold">${canAdd?'Chọn tệp để đính kèm':'Đã đạt giới hạn tệp'}</span><span class="mt-0.5 block text-[10px] text-slate-400">PDF, ảnh, Office, TXT, CSV hoặc ZIP</span></span></button></div>`;}
function refreshSurveyPlannerAttachments(){const host=document.getElementById('surveyPlannerAttachments');if(!host||!UI.surveyPlanner)return;host.outerHTML=renderSurveyPlannerAttachments(UI.surveyPlanner.tripId);bindSurveyPlannerAttachmentControls();refreshIcons();}
function bindSurveyPlannerAttachmentControls(){const input=document.getElementById('surveyPlannerFileInput'),pick=document.querySelector('[data-survey-file-pick]');pick?.addEventListener('click',()=>input?.click());if(input)input.addEventListener('change',event=>{if(!UI.surveyPlanner)return;const planner=UI.surveyPlanner,pending=planner.pendingFiles||(planner.pendingFiles=[]),existing=recordAttachments('survey_trips',planner.tripId);let slots=Math.max(0,CONFIG.attachmentMaxFiles-existing.length-pending.length);for(const file of [...(event.target.files||[])]){if(slots<=0){toast(`Mỗi kế hoạch chỉ được tối đa ${CONFIG.attachmentMaxFiles} tệp.`,'error');break;}const error=validateAttachmentFile(file);if(error){toast(error,'error');continue;}pending.push({file,status:'selected',error:'',uploadPromise:null});slots--;}refreshSurveyPlannerAttachments();void uploadSurveyPlannerAttachments(planner.tripId,planner);});document.querySelectorAll('[data-survey-remove-pending]').forEach(button=>button.addEventListener('click',()=>{if(!UI.surveyPlanner)return;const entry=UI.surveyPlanner.pendingFiles[Number(button.dataset.surveyRemovePending)];if(entry?.status==='uploading'){toast('Tệp đang được tải lên Google Drive. Vui lòng chờ hoàn tất.','info');return;}UI.surveyPlanner.pendingFiles.splice(Number(button.dataset.surveyRemovePending),1);refreshSurveyPlannerAttachments();}));document.querySelectorAll('[data-survey-delete-attachment]').forEach(button=>button.addEventListener('click',async()=>{await deleteStoredAttachment(button.dataset.surveyDeleteAttachment);refreshSurveyPlannerAttachments();}));document.querySelectorAll('#surveyPlannerAttachments [data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment)));}
function bindSurveyPlannerMapLinks(root=document){root.querySelectorAll?.('[data-survey-plan-row]').forEach(row=>{const input=row.querySelector('[data-survey-candidate-map]'),link=row.querySelector('[data-survey-map-open]'),edit=row.querySelector('[data-survey-map-edit]'),field=row.querySelector('.survey-map-field');if(!input||!link||!field)return;const update=()=>{const safe=safeExternalUrl(input.value||'');field.classList.toggle('has-map',Boolean(safe));link.classList.toggle('hidden',!safe);edit?.classList.toggle('hidden',!safe);if(safe)link.href=safe;else link.href='#';};input.addEventListener('input',update);input.addEventListener('change',update);input.addEventListener('blur',()=>{update();if(safeExternalUrl(input.value||''))field.classList.remove('is-editing');});edit?.addEventListener('click',()=>{field.classList.add('is-editing');input.focus();input.select?.();});update();});}
function bindSurveyPlannerTimeControls(root=document){root.querySelectorAll?.('[data-survey-time-control]').forEach(control=>{const hour=control.querySelector('[data-survey-time-hour]'),minute=control.querySelector('[data-survey-time-minute]'),hidden=control.querySelector('[data-survey-visit-time]'),update=()=>{if(!hour?.value){if(hidden)hidden.value='';return;}if(minute&&!minute.value)minute.value='00';if(hidden)hidden.value=`${hour.value}:${minute?.value||'00'}`;};hour?.addEventListener('change',update);minute?.addEventListener('change',update);update();});}
function openSurveyTripPlanner(candidateIds=[],tripId=''){
  if(!ensureMutationReady())return;const trip=tripId?(DATA.survey_trips||[]).find(row=>row.id===tripId):null,plannerTripId=trip?.id||uid('survey-trip'),existing=trip?surveyVisitsForTrip(trip.id):[],selected=new Set(candidateIds.length?candidateIds:existing.map(row=>row.candidate_id)),eligible=surveyPlanningCandidates(tripId),draftRows={};existing.forEach(visit=>{const candidate=(DATA.survey_candidates||[]).find(row=>row.id===visit.candidate_id);draftRows[String(visit.candidate_id)]={scheduledTime:visit.scheduledTime||'',address:candidate?.address||'',mapUrl:candidate?.mapUrl||''};});UI.surveyPlanner={tripId:plannerTripId,pendingFiles:[],draftRows};
  const participantField=renderEditorField(['participants','Người tham gia','multiselect',{lookup:'owners',multiDropdown:true}],surveyParticipantLabels(trip||{}));
  const body=`<form id="surveyTripPlannerForm" class="survey-planner-v2"><section class="survey-form-card"><div class="survey-form-card__heading"><span>${icon('calendar-days','size-4')}</span><div><h4>Thông tin kế hoạch</h4><p>Thông tin chung cho đợt đi khảo sát.</p></div></div><div class="survey-plan-meta-grid"><label class="survey-field survey-field--full"><span>Tên kế hoạch <em>*</em></span><input name="name" required maxlength="200" value="${esc(trip?.name||'')}"></label><label class="survey-field"><span>Ngày khảo sát <em>*</em></span><input name="surveyDate" type="date" required value="${esc(normalizeDateOnly(trip?.surveyDate||''))}"></label>${participantField}</div></section><section class="survey-form-card"><div class="survey-form-card__heading"><span>${icon('map-pinned','size-4')}</span><div><h4>Địa điểm</h4><p>Các nguồn đang chờ được lấy tự động từ Tham khảo. Nguồn đã có lịch active khác vẫn hiển thị nhưng bị khóa.</p></div></div><div id="surveyPlannerCandidateWidget">${renderSurveyPlannerCandidates(eligible,selected,tripId)}</div></section><section class="survey-form-card"><div class="survey-form-card__heading"><span>${icon('route','size-4')}</span><div><h4>Sắp xếp lịch trình</h4><p>Thứ tự, thời gian đến, địa chỉ và bản đồ được lưu theo đúng nguồn khảo sát.</p></div></div><div class="survey-widget-table-wrap app-scrollbar"><table class="survey-widget-table survey-itinerary-table"><thead><tr><th>STT</th><th>Tiêu đề</th><th>Nhóm việc</th><th>Mức độ quan tâm</th><th>Thời gian đến</th><th>Địa chỉ</th><th>Link bản đồ</th><th>Tác vụ</th></tr></thead><tbody id="surveyPlannerRows">${renderSurveyPlannerRows(selected,existing,draftRows)}</tbody></table></div></section><section class="survey-form-card survey-notes-files-card"><div class="survey-form-card__heading"><span>${icon('file-text','size-4')}</span><div><h4>Ghi chú & tài liệu</h4><p>Lưu ghi chú của cả kế hoạch và các tệp liên quan.</p></div></div><div class="survey-notes-files-body"><label class="survey-field survey-field--full"><span>Ghi chú</span><textarea name="notes" rows="4">${esc(trip?.notes||'')}</textarea></label>${renderSurveyPlannerAttachments(plannerTripId)}</div></section></form>`;
  const footer=`<button type="button" data-survey-dialog-close class="survey-secondary-action">Hủy</button><button id="surveySaveTripButton" type="submit" form="surveyTripPlannerForm" class="survey-primary-action">${icon('save','size-4')}Lưu kế hoạch</button>`;const dialog=showSurveyDialog(trip?'Chỉnh sửa kế hoạch':'Tạo kế hoạch khảo sát',trip?'Các lần đã đi được giữ nguyên; chỉ các lịch chưa hoàn tất mới được cập nhật.':'Chọn nguồn đang chờ, sắp lịch trình và lưu kế hoạch.',body,footer),rows=dialog.querySelector('#surveyPlannerRows');bindEditorMultiDropdowns(dialog);bindSurveyPlannerTimeControls(dialog);bindSurveyPlannerMapLinks(dialog);bindSurveyPlannerAttachmentControls();
  const redraw=()=>{captureSurveyPlannerDraftRows(rows);rows.innerHTML=renderSurveyPlannerRows(selected,existing,UI.surveyPlanner?.draftRows||{});bindRows();bindSurveyPlannerTimeControls(rows);bindSurveyPlannerMapLinks(rows);refreshIcons();};
  const move=(button,delta)=>{captureSurveyPlannerDraftRows(rows);const id=button.closest('[data-survey-plan-row]')?.dataset.surveyPlanRow,list=[...selected],index=list.indexOf(id),target=index+delta;if(index<0||target<0||target>=list.length)return;[list[index],list[target]]=[list[target],list[index]];selected.clear();list.forEach(value=>selected.add(value));redraw();};
  const bindRows=()=>{rows.querySelectorAll('[data-survey-row-remove]').forEach(button=>button.addEventListener('click',()=>{captureSurveyPlannerDraftRows(rows);const id=button.closest('[data-survey-plan-row]').dataset.surveyPlanRow;selected.delete(id);const pick=dialog.querySelector(`[data-survey-planner-pick="${CSS.escape(id)}"]`);if(pick)pick.checked=false;redraw();}));rows.querySelectorAll('[data-survey-row-up]').forEach(button=>button.addEventListener('click',()=>move(button,-1)));rows.querySelectorAll('[data-survey-row-down]').forEach(button=>button.addEventListener('click',()=>move(button,1)));};
  dialog.querySelectorAll('[data-survey-planner-pick]').forEach(input=>input.addEventListener('change',()=>{captureSurveyPlannerDraftRows(rows);input.checked?selected.add(input.dataset.surveyPlannerPick):selected.delete(input.dataset.surveyPlannerPick);redraw();}));dialog.querySelectorAll('[data-survey-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.surveyReferenceDetail)));bindRows();dialog.querySelector('#surveyTripPlannerForm').addEventListener('submit',event=>saveSurveyTripPlanner(event,tripId,selected,existing));
}
async function uploadSurveyPlannerAttachments(tripId,planner=UI.surveyPlanner){const pending=Array.isArray(planner?.pendingFiles)?planner.pendingFiles:[];let uploaded=0,failed=0;for(const entry of [...pending]){if(entry.status==='uploading'&&entry.uploadPromise){try{await entry.uploadPromise;}catch(_){}continue;}if(!['selected','error'].includes(String(entry.status||'')))continue;entry.status='uploading';entry.error='';if(UI.surveyPlanner===planner)refreshSurveyPlannerAttachments();entry.uploadPromise=(async()=>{try{const result=await uploadAttachmentFile(entry.file,{collection:'survey_trips',recordId:tripId,context:'record'});if(result.attachment){DATA.attachments=(DATA.attachments||[]).filter(item=>item.id!==result.attachment.id);DATA.attachments.unshift(result.attachment);}if(result.revision!==undefined)setRemoteRevision(result.revision);planner.pendingFiles=planner.pendingFiles.filter(item=>item!==entry);uploaded++;saveData();if(result.attachment&&attachmentStatus(result.attachment)==='staged')toast(`Đã tải ${entry.file.name} lên Google Drive. Tệp sẽ tự gắn khi kế hoạch được đồng bộ.`,'success');}catch(error){entry.status='error';entry.error=error.message||'Không thể tải tệp.';failed++;if(planner.saved){enqueueBackgroundAttachmentUpload({collection:'survey_trips',recordId:tripId,mode:'edit',files:[entry.file],kind:'survey'});planner.pendingFiles=planner.pendingFiles.filter(item=>item!==entry);}}finally{entry.uploadPromise=null;if(UI.surveyPlanner===planner)refreshSurveyPlannerAttachments();}})();try{await entry.uploadPromise;}catch(_){}}return{uploaded,failed};}
function saveSurveyTripPlanner(event,tripId,selected,existing){
  event.preventDefault();if(!ensureMutationReady())return;captureSurveyPlannerDraftRows();const form=event.currentTarget,fd=new FormData(form),ids=[...selected];if(!ids.length){toast('Hãy chọn ít nhất một địa điểm khảo sát.','error');return;}for(const candidateId of ids){if(activeSurveyVisitForCandidate(candidateId,tripId)){toast('Một địa điểm đã có lịch khảo sát active ở kế hoạch khác. Hãy chuyển lịch thay vì tạo trùng.','error');return;}}
  const rows=[...document.querySelectorAll('#surveyPlannerRows [data-survey-plan-row]')],trip=tripId?(DATA.survey_trips||[]).find(row=>row.id===tripId):{id:UI.surveyPlanner?.tripId||uid('survey-trip'),_rowVersion:0,_updatedAt:'',_updatedBy:''},beforeTrip=tripId?structuredClone(trip):null;trip.name=String(fd.get('name')||'').trim();trip.surveyDate=String(fd.get('surveyDate')||'');const participantLabels=fd.getAll('participants').map(String).filter(Boolean);trip.participants=participantLabels;trip.participant_ids=participantLabels.map(value=>lookupItemByValue('owners',value)?.id).filter(Boolean);trip.startTime='';trip.startLocation='';trip.notes=String(fd.get('notes')||'').trim();trip.status=trip.status&&trip.status!=='Bản nháp'?trip.status:'Đã lên lịch';trip.updatedAt=new Date().toISOString();if(!tripId)DATA.survey_trips.unshift(trip);queueUpsert('survey_trips',trip,beforeTrip);
  const existingByCandidate=new Map(existing.map(visit=>[String(visit.candidate_id),visit]));rows.forEach((row,index)=>{const candidateId=row.dataset.surveyPlanRow,candidate=(DATA.survey_candidates||[]).find(item=>item.id===candidateId),old=existingByCandidate.get(candidateId),visit=old||{id:uid('survey-visit'),candidate_id:candidateId,candidateName:candidate?.name||'',trip_id:trip.id,tripName:trip.name,status:'Đã lên lịch',_rowVersion:0,_updatedAt:'',_updatedBy:''},before=old?structuredClone(old):null;if(old&&old.status===SURVEY_VISIT_COMPLETED_STATUS){existingByCandidate.delete(candidateId);return;}visit.trip_id=trip.id;visit.tripName=trip.name;visit.candidate_id=candidateId;visit.candidateName=candidate?.name||'';visit.sequence=index+1;visit.scheduledTime=normalizeTime24(row.querySelector('[data-survey-visit-time]')?.value||'');visit.expectedDuration=Math.max(0,Number(visit.expectedDuration||60));if(!visit.status||['Dời lịch','Không thực hiện','Hủy'].includes(visit.status))visit.status='Đã lên lịch';visit.updatedAt=new Date().toISOString();if(!old)DATA.survey_visits.push(visit);queueUpsert('survey_visits',visit,before);existingByCandidate.delete(candidateId);if(candidate){const beforeCandidate=structuredClone(candidate),address=String(row.querySelector('[data-survey-candidate-address]')?.value||'').trim(),mapUrl=String(row.querySelector('[data-survey-candidate-map]')?.value||'').trim();candidate.address=address;candidate.mapUrl=mapUrl;candidate.updatedAt=new Date().toISOString();if(JSON.stringify(beforeCandidate)!==JSON.stringify(candidate))queueUpsert('survey_candidates',candidate,beforeCandidate);}});
  existingByCandidate.forEach(visit=>{if(visit.status===SURVEY_VISIT_COMPLETED_STATUS)return;const before=structuredClone(visit);visit.status='Hủy';visit.skipReason='Đã bỏ khỏi kế hoạch khi chỉnh sửa.';visit.updatedAt=new Date().toISOString();queueUpsert('survey_visits',visit,before);});saveData();const planner=UI.surveyPlanner;if(planner)planner.saved=true;const attachmentEntries=Array.isArray(planner?.pendingFiles)?planner.pendingFiles:[],inFlight=attachmentEntries.some(entry=>entry.status==='uploading'),backgroundFiles=attachmentEntries.filter(entry=>entry.status!=='uploading').map(entry=>entry.file).filter(Boolean);document.getElementById('surveyDialog')?.close();UI.surveyPlanner=null;toast(`${tripId?'Đã cập nhật':'Đã tạo'} kế hoạch khảo sát.${backgroundFiles.length||inFlight?' Tệp đính kèm đang được hoàn tất trên Google Drive.':''}`,'success');renderPage();if(backgroundFiles.length)enqueueBackgroundAttachmentUpload({collection:'survey_trips',recordId:trip.id,mode:'edit',files:backgroundFiles,kind:'survey'});
}
function renderSurveyTripDetailRows(trip){const rows=surveyVisitsForTrip(trip.id).map(visit=>{const candidate=(DATA.survey_candidates||[]).find(row=>row.id===visit.candidate_id),evaluation=surveyEvaluationForVisit(visit.id),listRow=surveyListRows().find(row=>row.id===visit.id),ref=candidate?surveyCandidateReference(candidate):null,event=candidate?.anchorEvent||resolveLookupLabel(String(candidate?.anchor_event_id||''),'—'),group=candidate?.group||resolveLookupLabel(String(candidate?.group_id||''),'—'),interest=ref?.interestLevel||resolveLookupLabel(String(ref?.interest_level_id||''),'—'),url=safeExternalUrl(ref?.sourceUrl||'');const place=url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="survey-place-link"><strong>${esc(candidate?.name||visit.candidateName||'Địa điểm')}</strong><small>${esc(event)} · ${esc(group)} · ${esc(interest)}</small></a>`:`<button type="button" data-survey-candidate-detail="${esc(visit.candidate_id)}" class="survey-place-link survey-place-link--button"><strong>${esc(candidate?.name||visit.candidateName||'Địa điểm')}</strong><small>${esc(event)} · ${esc(group)} · ${esc(interest)}</small></button>`;return `<tr><td>${surveyVisitCompleteControl(listRow||{visit_id:visit.id,status:visit.status,visited:visit.status===SURVEY_VISIT_COMPLETED_STATUS,evaluationId:evaluation?.id||'',candidateName:candidate?.name||visit.candidateName||''})}</td><td>${esc(visit.sequence)}</td><td>${place}</td><td>${esc(visit.scheduledTime||'—')}</td><td>${esc(candidate?.address||'—')}</td><td><span class="survey-status-compact">${statusBadge(visit.status)}</span></td><td>${evaluation?.overallScore?`${Number(evaluation.overallScore).toFixed(1)}/10`:'—'}</td><td><div class="survey-itinerary-actions">${surveyActionButtons(listRow||{visit_id:visit.id,candidate_id:visit.candidate_id,visited:visit.status===SURVEY_VISIT_COMPLETED_STATUS,evaluationId:evaluation?.id||'',mapUrl:candidate?.mapUrl||''})}</div></td></tr>`;}).join('');return rows||'<tr><td colspan="8"><div class="survey-planner-empty">Kế hoạch chưa có địa điểm.</div></td></tr>';}
function openSurveyTripDayView(tripId){const trip=(DATA.survey_trips||[]).find(row=>row.id===tripId);if(!trip)return;const prog=surveyTripProgress(trip),participants=surveyParticipantLabels(trip).join(', ')||'—',body=`<div class="survey-trip-detail"><div class="survey-detail-grid"><div><span>Tên kế hoạch</span><strong>${esc(trip.name||'—')}</strong></div><div><span>Ngày khảo sát</span><strong>${esc(formatDate(trip.surveyDate)||'—')}</strong></div><div><span>Người tham gia</span><strong>${esc(participants)}</strong></div><div><span>Trạng thái</span><span class="survey-detail-status">${statusBadge(trip.status||'—')}</span></div></div><section class="survey-form-card"><div class="survey-form-card__heading"><span>${icon('route','size-4')}</span><div><h4>Lịch trình</h4><p>${prog.done}/${prog.total} địa điểm đã đi. Chỉ sau khi xác nhận Đã đi mới có thể đánh giá.</p></div></div><div class="survey-widget-table-wrap app-scrollbar"><table class="survey-widget-table"><thead><tr><th>Đã đi</th><th>STT</th><th>Địa điểm</th><th>Thời gian đến</th><th>Địa chỉ</th><th>Trạng thái</th><th>Điểm TB</th><th>Tác vụ</th></tr></thead><tbody>${renderSurveyTripDetailRows(trip)}</tbody></table></div></section>${trip.notes?`<section class="survey-form-card"><div class="survey-form-card__heading"><span>${icon('file-text','size-4')}</span><div><h4>Ghi chú</h4></div></div><p class="survey-detail-notes">${esc(trip.notes)}</p></section>`:''}${renderDetailAttachments('survey_trips',trip.id)}</div>`,canFinish=['Đã lên lịch','Đang thực hiện'].includes(String(trip.status||'')),footer=`<button type="button" data-survey-trip-delete="${esc(trip.id)}" class="survey-danger-action">${icon('trash-2','size-4')}Xóa kế hoạch</button><button type="button" data-survey-trip-edit="${esc(trip.id)}" class="survey-secondary-action">${icon('pencil','size-4')}Sửa kế hoạch</button>${canFinish?`<button type="button" data-survey-trip-finish="${esc(trip.id)}" class="survey-primary-action">${icon('flag','size-4')}Kết thúc đợt</button>`:''}`;showSurveyDialog(trip.name,`${formatDate(trip.surveyDate)} · ${participants}`,body,footer);bindSurveyDialogActions();}
function toggleSurveyVisitVisited(visitId,checked){const visit=(DATA.survey_visits||[]).find(row=>row.id===visitId);if(!visit||!ensureMutationReady())return;const evaluation=surveyEvaluationForVisit(visitId);if(!checked&&evaluation){toast('Không thể bỏ xác nhận Đã đi vì lần khảo sát này đã có đánh giá.','error');renderPage();return;}if(checked&&!SURVEY_VISIT_ACTIVE_STATUSES.has(String(visit.status||''))&&visit.status!==SURVEY_VISIT_COMPLETED_STATUS){toast('Chỉ có thể xác nhận Đã đi cho lịch đang hoạt động.','error');renderPage();return;}const before=structuredClone(visit);visit.status=checked?SURVEY_VISIT_COMPLETED_STATUS:'Đã lên lịch';visit.actualArrivalTime=checked?(visit.actualArrivalTime||localTimeHHMM()):'';if(!checked)visit.actualLeaveTime='';visit.updatedAt=new Date().toISOString();queueUpsert('survey_visits',visit,before);const trip=(DATA.survey_trips||[]).find(row=>row.id===visit.trip_id);if(trip)reconcileSurveyTripStatus(trip.id);saveData();toast(checked?'Đã xác nhận địa điểm đã đi. Có thể tiến hành đánh giá.':'Đã bỏ xác nhận Đã đi.','success');renderPage();}
function completeSurveyVisit(visitId){toggleSurveyVisitVisited(visitId,true);}
function openSurveyEvaluation(visitId){const visit=(DATA.survey_visits||[]).find(row=>row.id===visitId);if(!visit)return;if(String(visit.status||'')!==SURVEY_VISIT_COMPLETED_STATUS){toast('Hãy xác nhận Đã đi trước khi tiến hành đánh giá.','info');return;}const candidate=(DATA.survey_candidates||[]).find(row=>row.id===visit.candidate_id),existing=surveyEvaluationForVisit(visitId);document.getElementById('surveyDialog')?.close();document.getElementById('detailDialog')?.close();openEditor('survey_evaluations',existing?.id||'','edit',{visit_id:visit.id,candidate_id:visit.candidate_id,candidateName:candidate?.name||visit.candidateName||'',status:'Hoàn tất',decision:'Chưa quyết định'});}
function bindSurveyEvaluationEditor(root=document){const scoreKeys=['qualityScore','serviceScore','priceScore'],overall=root.querySelector('#field-overallScore');if(!overall)return;overall.readOnly=true;overall.setAttribute('aria-readonly','true');overall.classList.add('editor-readonly-field');const update=()=>{const values=scoreKeys.map(key=>Number(root.querySelector(`#field-${key}`)?.value||0));overall.value=values.every(value=>value>=1&&value<=10)?formatNumberInputValue(Math.round((values.reduce((sum,value)=>sum+value,0)/3)*10)/10):'';};scoreKeys.forEach(key=>root.querySelector(`#field-${key}`)?.addEventListener('change',update));update();}
function syncSurveyEvaluationOutcome(evaluation,previous={}){const candidate=(DATA.survey_candidates||[]).find(row=>String(row.id)===String(evaluation.candidate_id||''));if(!candidate)return;const decision=String(evaluation.decision||'Chưa quyết định')==='Shortlist'?'Ưu tiên cao':String(evaluation.decision||'Chưa quyết định');candidate.needsRevisit=decision==='Cần khảo sát lại';if(!['','Chưa quyết định'].includes(decision))candidate.decision=decision;candidate.updatedAt=new Date().toISOString();}
function surveyLatestEvaluation(candidateId){const visits=surveyVisitsForCandidate(candidateId),tripDate=id=>String((DATA.survey_trips||[]).find(row=>row.id===id)?.surveyDate||'');return (DATA.survey_evaluations||[]).filter(e=>String(e.candidate_id||'')===String(candidateId)||visits.some(v=>v.id===e.visit_id)).sort((a,b)=>{const av=visits.find(v=>v.id===a.visit_id),bv=visits.find(v=>v.id===b.visit_id);return tripDate(bv?.trip_id).localeCompare(tripDate(av?.trip_id))||String(b.completedAt||'').localeCompare(String(a.completedAt||''));})[0]||null;}
function openSurveyCandidateDetail(candidateId){document.getElementById('surveyDialog')?.close();openDetails('survey_candidates',candidateId);}
function renderSurveyHistory(candidate){const visits=[...surveyVisitsForCandidate(candidate.id)].sort((a,b)=>String((DATA.survey_trips||[]).find(t=>t.id===b.trip_id)?.surveyDate||'').localeCompare(String((DATA.survey_trips||[]).find(t=>t.id===a.trip_id)?.surveyDate||'')));if(!visits.length)return '<p class="survey-history-empty">Chưa có lịch sử khảo sát.</p>';return `<div class="survey-history-list">${visits.map(visit=>{const trip=(DATA.survey_trips||[]).find(t=>t.id===visit.trip_id),evaluation=surveyEvaluationForVisit(visit.id),decision=evaluation?.decision==='Shortlist'?'Ưu tiên cao':(evaluation?.decision||'Chưa quyết định');return `<article class="survey-history-card"><div class="survey-history-field"><span>Ngày khảo sát</span><strong>${esc(formatDate(trip?.surveyDate||'')||'—')}</strong></div><div class="survey-history-field"><span>Thời gian</span><strong>${esc(visit.scheduledTime||'—')}</strong></div><div class="survey-history-field"><span>Kế hoạch</span><strong>${esc(trip?.name||visit.tripName||'Kế hoạch')}</strong></div><div class="survey-history-field"><span>Trạng thái</span><div class="survey-status-compact">${statusBadge(visit.status||'—')}</div></div><div class="survey-history-field"><span>Điểm TB</span><strong>${evaluation?.overallScore?`${Number(evaluation.overallScore).toFixed(1)}/10`:'—'}</strong></div><div class="survey-history-field"><span>Quyết định</span><strong>${evaluation?esc(decision):'Chưa đánh giá'}</strong></div></article>`;}).join('')}</div>`;}
function detailSurveyContent(collection,record){
  if(collection==='references'){
    const sum=referenceSurveySummary(record);if(!boolValue(record.needsSurvey)&&!sum.candidate)return '';
    const evaluation=sum.latestEvaluation,visit=sum.latestVisit,canEvaluate=visit&&String(visit.status||'')===SURVEY_VISIT_COMPLETED_STATUS,hasEvaluation=surveyEvaluationIsComplete(evaluation),decision=evaluation?.decision||sum.candidate?.decision||'Chưa quyết định';
    const score=hasEvaluation?`<div class="survey-insight-score"><div class="survey-insight-score__main"><span>Điểm khảo sát gần nhất</span><strong>${Number(evaluation.overallScore||0).toFixed(1)}<small>/10</small></strong></div><div class="survey-insight-score__breakdown"><div><span>Chất lượng</span><b>${Number(evaluation.qualityScore||0)}/10</b></div><div><span>Tư vấn / Phục vụ</span><b>${Number(evaluation.serviceScore||0)}/10</b></div><div><span>Giá cả</span><b>${Number(evaluation.priceScore||0)}/10</b></div></div></div>`:`<div class="survey-insight-empty">${icon('clipboard-pen-line','size-4')}<span>${sum.state==='Chờ đánh giá'?'Địa điểm đã đi và đang chờ hoàn thành đánh giá.':'Chưa có đánh giá khảo sát hoàn tất.'}</span></div>`;
    const evaluationAction=canEvaluate?`<button type="button" data-survey-reference-evaluate="${esc(visit.id)}" class="survey-insight-action survey-insight-action--primary">${icon('clipboard-pen-line','size-3.5')} ${hasEvaluation?'Xem/Sửa đánh giá':'Đánh giá ngay'}</button>`:'';
    return `<section class="survey-insight-card"><div class="survey-insight-head"><span class="survey-insight-head__icon">${icon('map-pinned','size-4')}</span><div><p>Khảo sát thực tế</p><span>Theo dõi tiến độ đi thực tế và kết quả đánh giá liên kết với nguồn Tham khảo này.</span></div></div><div class="survey-insight-metrics"><div><span>Trạng thái</span><strong>${statusBadge(sum.state)}</strong></div><div><span>Số lần đã đi</span><strong>${Number(sum.visitCount||0)}</strong></div><div><span>Lần gần nhất</span><strong>${sum.latestVisitDate?esc(formatDate(sum.latestVisitDate)):'—'}</strong></div><div><span>Quyết định</span><strong class="survey-insight-decision">${esc(decision)}</strong></div></div>${score}<div class="survey-insight-actions">${sum.candidate?`<button type="button" data-survey-candidate-detail="${esc(sum.candidate.id)}" class="survey-insight-action">${icon('eye','size-3.5')} Xem hồ sơ khảo sát</button>`:''}${evaluationAction}</div></section>`;
  }
  if(collection==='survey_candidates'){
    const sum=surveyCandidateSummary(record),ref=surveyCandidateReference(record),evaluation=sum.latestEvaluation,hasEvaluation=surveyEvaluationIsComplete(evaluation);
    const source=ref?`<button type="button" data-survey-reference-detail="${esc(ref.id)}" class="survey-insight-source"><span>${icon('book-open-check','size-4')}</span><span><small>Tham khảo gốc</small><strong>${esc(referenceContextLabel(ref))}</strong></span>${icon('chevron-right','size-4')}</button>`:'';
    const score=hasEvaluation?`<div class="survey-insight-score survey-insight-score--compact"><div class="survey-insight-score__main"><span>Điểm gần nhất</span><strong>${Number(evaluation.overallScore||0).toFixed(1)}<small>/10</small></strong></div><div class="survey-insight-score__breakdown"><div><span>Chất lượng</span><b>${Number(evaluation.qualityScore||0)}/10</b></div><div><span>Tư vấn / Phục vụ</span><b>${Number(evaluation.serviceScore||0)}/10</b></div><div><span>Giá cả</span><b>${Number(evaluation.priceScore||0)}/10</b></div></div></div>`:'';
    return `<section class="survey-insight-card"><div class="survey-insight-head"><span class="survey-insight-head__icon">${icon('clipboard-check','size-4')}</span><div><p>Tổng hợp khảo sát</p><span>Tóm tắt lịch sử đi thực tế và kết quả gần nhất của địa điểm.</span></div></div>${source}<div class="survey-insight-metrics"><div><span>Trạng thái</span><strong>${statusBadge(sum.surveyState)}</strong></div><div><span>Số lần đã đi</span><strong>${Number(sum.visitCount||0)}</strong></div><div><span>Điểm gần nhất</span><strong>${sum.latestScore?`${Number(sum.latestScore).toFixed(1)}/10`:'—'}</strong></div><div><span>Lần gần nhất</span><strong>${sum.latestVisitDate?esc(formatDate(sum.latestVisitDate)):'—'}</strong></div></div>${score}</section>`;
  }
  return '';
}
function bindSurveyDetailActions(root=document){root.querySelectorAll?.('[data-survey-candidate-detail]').forEach(button=>button.addEventListener('click',()=>openSurveyCandidateDetail(button.dataset.surveyCandidateDetail)));root.querySelectorAll?.('[data-survey-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.surveyReferenceDetail)));root.querySelectorAll?.('[data-survey-reference-evaluate]').forEach(button=>button.addEventListener('click',()=>openSurveyEvaluation(button.dataset.surveyReferenceEvaluate)));}
function surveyCandidateDetailFooterActions(record){const sum=surveyCandidateSummary(record);if(sum.surveyState==='Đã chọn'&&!record.vendor_id)return `<button type="button" data-survey-create-vendor-footer="${esc(record.id)}" class="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:text-emerald-300">${icon('store','size-4')}Tạo Nhà cung cấp</button>`;if(record.vendor_id)return `<button type="button" data-survey-view-vendor-footer="${esc(record.vendor_id)}" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold dark:border-slate-700">${icon('store','size-4')}Xem Nhà cung cấp</button>`;return '';}
function createVendorFromSurveyCandidate(candidateId){const candidate=(DATA.survey_candidates||[]).find(c=>c.id===candidateId);if(!candidate)return;const evaluation=surveyLatestEvaluation(candidateId);document.getElementById('detailDialog')?.close();openEditor('vendors','','edit',{survey_candidate_id:candidate.id,surveyCandidateName:candidate.name,anchorEvent:candidate.anchorEvent||'',anchor_event_id:candidate.anchor_event_id||'',serviceGroup:candidate.group||'',service_group_id:candidate.group_id||'',category:[],category_ids:[],name:candidate.name||'',location:candidate.address||'',contact:candidate.contact||'',quote:Number(evaluation?.actualQuote||0),score:Math.round(Number(evaluation?.overallScore||0))||0,status:'Đang khảo sát',notes:'Tạo từ kết quả Khảo sát thực tế.'});}
function syncSurveyVendorLink(vendor){const candidate=(DATA.survey_candidates||[]).find(c=>String(c.id)===String(vendor.survey_candidate_id||''));if(!candidate)return;const before=structuredClone(candidate);candidate.vendor_id=vendor.id;candidate.updatedAt=new Date().toISOString();queueUpsert('survey_candidates',candidate,before);}
function finishSurveyTrip(tripId){const trip=(DATA.survey_trips||[]).find(t=>t.id===tripId);if(!trip)return;const prog=surveyTripProgress(trip);if(!prog.pending.length){const allDone=prog.visits.length>0&&prog.visits.every(v=>v.status===SURVEY_VISIT_COMPLETED_STATUS);if(allDone){reconcileSurveyTripStatus(trip.id);saveData();document.getElementById('surveyDialog')?.close();toast(trip.status==='Chờ đánh giá'?`Tất cả địa điểm đã đi. Còn ${surveyTripProgress(trip).awaitingEvaluation} địa điểm chờ đánh giá.`:'Đã hoàn tất đợt khảo sát.','success');renderPage();return;}const before=structuredClone(trip);trip.status='Kết thúc sớm';trip.updatedAt=new Date().toISOString();queueUpsert('survey_trips',trip,before);saveData();document.getElementById('surveyDialog')?.close();toast('Đã kết thúc sớm đợt khảo sát.','success');renderPage();return;}const otherTrips=(DATA.survey_trips||[]).filter(t=>t.id!==tripId&&!['Hoàn tất','Kết thúc sớm','Hủy'].includes(t.status));const body=`<div class="survey-finish"><div class="survey-warning">${icon('triangle-alert','size-5')}<div><strong>Còn ${prog.pending.length} địa điểm chưa thực hiện</strong><p>Chọn cách xử lý; lịch sử của lần đi hiện tại luôn được giữ lại.</p></div></div><label><input type="radio" name="surveyFinishMode" value="wait" checked><span><strong>Đưa về Chờ xếp lịch</strong><small>Lần hiện tại = Không thực hiện.</small></span></label><label><input type="radio" name="surveyFinishMode" value="transfer" ${otherTrips.length?'':'disabled'}><span><strong>Chuyển sang kế hoạch khác</strong><small>Tạo lần đi mới, lịch hiện tại = Dời lịch.</small></span></label>${otherTrips.length?`<select id="surveyFinishTargetTrip">${otherTrips.map(t=>`<option value="${esc(t.id)}">${esc(t.name)} · ${esc(formatDate(t.surveyDate))}</option>`).join('')}</select>`:''}<label><input type="radio" name="surveyFinishMode" value="cancel"><span><strong>Không khảo sát nữa</strong><small>Lịch = Hủy và địa điểm rời hàng chờ.</small></span></label></div>`;showSurveyDialog('Kết thúc đợt khảo sát','Xử lý các địa điểm chưa đi trước khi kết thúc.',body,`<button type="button" data-survey-dialog-close class="survey-secondary-action">Quay lại</button><button id="surveyConfirmFinish" type="button" class="survey-primary-action">Xác nhận kết thúc</button>`);document.getElementById('surveyConfirmFinish').addEventListener('click',()=>confirmFinishSurveyTrip(tripId));}
function confirmFinishSurveyTrip(tripId){const trip=(DATA.survey_trips||[]).find(t=>t.id===tripId);if(!trip)return;const pending=surveyTripProgress(trip).pending,mode=document.querySelector('input[name="surveyFinishMode"]:checked')?.value||'wait',target=document.getElementById('surveyFinishTargetTrip')?.value||'';pending.forEach(visit=>{const before=structuredClone(visit),candidate=(DATA.survey_candidates||[]).find(c=>c.id===visit.candidate_id);if(mode==='transfer'&&target){const otherActive=(DATA.survey_visits||[]).find(v=>v.id!==visit.id&&String(v.candidate_id||'')===String(visit.candidate_id||'')&&String(v.trip_id||'')===String(target)&&SURVEY_VISIT_ACTIVE_STATUSES.has(String(v.status||'')));if(otherActive){toast('Địa điểm đã có lịch active trong kế hoạch đích. Hãy xử lý lịch đó trước.','error');return;}visit.status='Dời lịch';visit.skipReason='Chuyển sang kế hoạch khác.';queueUpsert('survey_visits',visit,before);const targetTrip=(DATA.survey_trips||[]).find(t=>t.id===target),nextSeq=Math.max(0,...surveyVisitsForTrip(target).map(v=>Number(v.sequence||0)))+1,newVisit={...structuredClone(visit),id:uid('survey-visit'),trip_id:target,tripName:targetTrip?.name||'',sequence:nextSeq,scheduledTime:'',actualArrivalTime:'',actualLeaveTime:'',status:'Đã lên lịch',skipReason:'',_rowVersion:0,_updatedAt:'',_updatedBy:'',updatedAt:new Date().toISOString()};DATA.survey_visits.push(newVisit);queueUpsert('survey_visits',newVisit);}else if(mode==='cancel'){visit.status='Hủy';visit.skipReason='Không khảo sát nữa.';queueUpsert('survey_visits',visit,before);if(candidate){const cb=structuredClone(candidate);candidate.decision='Không khảo sát nữa';candidate.needsRevisit=false;queueUpsert('survey_candidates',candidate,cb);}}else{visit.status='Không thực hiện';visit.skipReason='Kết thúc đợt khi chưa thực hiện.';queueUpsert('survey_visits',visit,before);}});const tb=structuredClone(trip);trip.status='Kết thúc sớm';trip.updatedAt=new Date().toISOString();queueUpsert('survey_trips',trip,tb);saveData();document.getElementById('surveyDialog')?.close();toast('Đã kết thúc đợt và giữ đầy đủ lịch sử các địa điểm chưa đi.','success');renderPage();}
function bindSurveyDialogActions(){const root=document.getElementById('surveyDialog');if(!root)return;root.querySelectorAll('[data-survey-candidate-detail]').forEach(button=>button.addEventListener('click',()=>openSurveyCandidateDetail(button.dataset.surveyCandidateDetail)));root.querySelectorAll('[data-survey-visit-evaluate]').forEach(button=>button.addEventListener('click',()=>openSurveyEvaluation(button.dataset.surveyVisitEvaluate)));root.querySelectorAll('[data-survey-visit-check]').forEach(input=>input.addEventListener('change',()=>toggleSurveyVisitVisited(input.dataset.surveyVisitCheck,input.checked)));root.querySelectorAll('[data-survey-trip-edit]').forEach(button=>button.addEventListener('click',()=>{root.close();openSurveyTripPlanner([],button.dataset.surveyTripEdit);}));root.querySelectorAll('[data-survey-trip-finish]').forEach(button=>button.addEventListener('click',()=>finishSurveyTrip(button.dataset.surveyTripFinish)));root.querySelectorAll('[data-survey-trip-delete]').forEach(button=>button.addEventListener('click',()=>askDeleteSurveyTrip(button.dataset.surveyTripDelete)));root.querySelectorAll('[data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment)));}
function bindSurveyPageEvents(){document.getElementById('surveyCreateButton')?.addEventListener('click',()=>openSurveyTripPlanner());document.getElementById('surveyHideCompletedButton')?.addEventListener('click',toggleSurveyHideCompletedPlans);document.querySelectorAll('[data-survey-candidate-detail]').forEach(button=>button.addEventListener('click',()=>openSurveyCandidateDetail(button.dataset.surveyCandidateDetail)));document.querySelectorAll('[data-survey-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.surveyReferenceDetail)));document.querySelectorAll('[data-survey-visit-evaluate]').forEach(button=>button.addEventListener('click',()=>openSurveyEvaluation(button.dataset.surveyVisitEvaluate)));document.querySelectorAll('[data-survey-visit-check]').forEach(input=>input.addEventListener('change',()=>toggleSurveyVisitVisited(input.dataset.surveyVisitCheck,input.checked)));document.querySelectorAll('[data-survey-trip-view]').forEach(button=>button.addEventListener('click',()=>openSurveyTripDayView(button.dataset.surveyTripView)));document.querySelectorAll('[data-survey-trip-edit]').forEach(button=>button.addEventListener('click',()=>openSurveyTripPlanner([],button.dataset.surveyTripEdit)));document.querySelectorAll('[data-survey-trip-finish]').forEach(button=>button.addEventListener('click',()=>finishSurveyTrip(button.dataset.surveyTripFinish)));document.querySelectorAll('[data-survey-trip-delete]').forEach(button=>button.addEventListener('click',()=>askDeleteSurveyTrip(button.dataset.surveyTripDelete)));document.querySelectorAll('[data-survey-create-vendor-footer]').forEach(btn=>btn.addEventListener('click',()=>createVendorFromSurveyCandidate(btn.dataset.surveyCreateVendorFooter)));document.querySelectorAll('[data-survey-view-vendor-footer]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('detailDialog')?.close();openDetails('vendors',btn.dataset.surveyViewVendorFooter);}));}
function renderPage(){const container=document.getElementById('mainContent');let content;if(UI.hydrationState==='error'&&!UI.hydrationHasCache)content=renderHydrationErrorState();else content=UI.loading?renderSkeleton():UI.tab==='dashboard'?renderDashboard():UI.tab==='survey'?renderSurveyHub():UI.tab==='guide'?renderGuide():UI.tab==='settings'?renderSettings():renderCollection(UI.tab);container.innerHTML=`${renderHydrationBanner()}${content}`;bindPageEvents();bindDatePickerUX(container);document.getElementById('retryHydrationButton')?.addEventListener('click',()=>initialHydrateAfterLogin(true));bindNumberInputs(container);updateCoupleWidget();updateNotificationBadge();updatePendingIndicators();updateHydrationUi();refreshIcons();}
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

function dashboardPriorityTasks(){const today=localDateYYYYMMDD(),priorityRank={Cao:0,'Trung bình':1,Thấp:2};return (DATA.checklist||[]).filter(row=>['Đang làm','Chưa bắt đầu'].includes(String(row.status||''))).sort((a,b)=>{const rank=row=>row.status==='Đang làm'&&row.dueDate&&String(row.dueDate)<today?0:row.status==='Đang làm'?1:2,delta=rank(a)-rank(b);if(delta)return delta;const ad=String(a.dueDate||'9999-12-31'),bd=String(b.dueDate||'9999-12-31');if(ad!==bd)return ad.localeCompare(bd);return (priorityRank[a.priority]??9)-(priorityRank[b.priority]??9);}).slice(0,5);}
function dashboardSurveyTrips(){return (DATA.survey_trips||[]).filter(trip=>!['Hoàn tất','Kết thúc sớm','Hủy'].includes(String(trip.status||''))).sort((a,b)=>{const rank={"Đang thực hiện":0,"Chờ đánh giá":1,"Đã lên lịch":2,"Bản nháp":3};const delta=(rank[a.status]??9)-(rank[b.status]??9);return delta||String(a.surveyDate||'9999-12-31').localeCompare(String(b.surveyDate||'9999-12-31'));}).slice(0,3);}
function renderDashboardSurveyWidget(){const trips=dashboardSurveyTrips();return `<div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Kế hoạch khảo sát','Không hiển thị các kế hoạch đã kết thúc','map-pinned','Mở Khảo sát',"navigate('survey')")}<div class="dashboard-survey-list">${trips.length?trips.map(trip=>{const prog=surveyTripProgress(trip);return `<button type="button" onclick="openSurveyTripDayView(decodeURIComponent('${encoded(trip.id)}'))"><span class="dashboard-survey-date">${esc(trip.surveyDate?formatDate(trip.surveyDate):'Chưa có ngày')}</span><span class="dashboard-survey-copy"><strong>${esc(trip.name||'Kế hoạch khảo sát')}</strong><small>${prog.done}/${prog.total} đã đi${prog.awaitingEvaluation?` · ${prog.awaitingEvaluation} chờ đánh giá`:''}</small></span><span>${statusBadge(trip.status||'—')}</span></button>`;}).join(''):emptyStateInline('Chưa có kế hoạch đang mở','Tạo kế hoạch khảo sát để theo dõi tại đây.')}</div></div>`;}
function renderDashboard(){
  const checklist=DATA.checklist||[],budget=DATA.budget||[],guests=DATA.guests||[],vendors=DATA.vendors||[],settings=getSettings();
  const done=checklist.filter(row=>row.status==='Hoàn thành').length,inProgress=checklist.filter(row=>row.status==='Đang làm').length,waiting=checklist.filter(row=>row.status==='Chờ xác nhận').length;
  const completion=checklist.length?Math.round(done/checklist.length*100):0;
  const budgeted=budget.reduce((s,r)=>s+Number(r.budgeted||0),0),committed=budget.reduce((s,r)=>s+Number(r.committed||0),0),actual=budget.reduce((s,r)=>s+Number(r.actual||0),0),payable=budget.reduce((s,r)=>s+Number(r.payable||0),0);
  const attending=guests.filter(row=>row.rsvp==='Đồng ý').reduce((s,r)=>s+Number(r.partySize||1),0),rsvpCount=guests.filter(row=>row.name&&row.rsvp!=='Chưa phản hồi').length,namedGuests=guests.filter(row=>row.name).length;
  const selectedVendors=vendors.filter(row=>['Đã chọn','Đã cọc','Hoàn tất'].includes(row.status)).length,upcoming=dashboardPriorityTasks();
  return `<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="relative isolate overflow-hidden px-5 py-6 sm:px-7 sm:py-8"><div class="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-brand-200/45 blur-3xl dark:bg-brand-900/25"></div><div class="absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-900/20"></div><div class="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"><div class="max-w-2xl"><div class="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">${icon('sparkles','size-3.5')} Wedding planning workspace</div><h3 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">${esc((settings.groomName||'Chú rể')+' × '+(settings.brideName||'Cô dâu'))}</h3><div class="mt-2 flex max-w-2xl items-start gap-2"><p class="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">${esc(settings.dashboardDescription||'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.')}</p>${isAdministrator()?`<button id="editDashboardDescription" type="button" aria-label="Chỉnh sửa nội dung giới thiệu" class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-brand-700 dark:hover:bg-slate-800 dark:hover:text-brand-300">${icon('pencil','size-3.5')}</button>`:''}</div><div class="mt-5 flex flex-wrap gap-2">${dateChip('Ăn hỏi',settings.engagementDate,'heart-handshake')}${dateChip('Rước dâu',settings.pickupDate,'car-front')}${dateChip('Tiệc nhà trai',settings.groomPartyDate,'sun')}${dateChip('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</div></div><div class="grid min-w-[260px] grid-cols-2 gap-3 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/45"><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Tiến độ</p><p class="mt-1 text-2xl font-bold tabular">${completion}%</p></div><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Ngân sách</p><p class="mt-1 text-2xl font-bold tabular">${compactMoney(Number(settings.totalBudget||0))}</p></div><div class="col-span-2"><div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div class="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-700" style="width:${completion}%"></div></div></div></div></div></div></section>
  <section class="countdown-grid event-progress-grid">${countdownCard('Đăng ký kết hôn',settings.registrationDate,'file-signature')}${countdownCard('Lễ ăn hỏi',settings.engagementDate,'heart-handshake')}${countdownCard('Rước dâu',settings.pickupDate,'car-front')}${countdownCard('Tiệc nhà trai',settings.groomPartyDate,'sun')}${countdownCard('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</section>
  <section class="dashboard-metric-grid">${metricCard('Tiến độ tổng thể',`${completion}%`,`${done}/${checklist.length} công việc hoàn thành`,'circle-check-big','emerald',`${completion}%`)}${metricCard('Đang xử lý',inProgress,`${waiting} việc chờ xác nhận`,'loader-circle','blue')}${metricCard('Dòng tiền',compactMoney(actual),`Cần thanh toán ${compactMoney(payable)}`,'chart-no-axes-combined',Number(settings.operatingBudget||0)>0&&actual>Number(settings.operatingBudget||0)?'rose':'violet')}${metricCard('Khách xác nhận',attending,`${rsvpCount}/${namedGuests||0} lời phản hồi`,'users-round','amber')}</section>
  <section class="mt-5 grid gap-5 xl:grid-cols-3"><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">${panelHeader('Việc cần ưu tiên','Theo dõi những đầu việc chưa hoàn thành','arrow-up-right','Mở Công việc',"navigate('checklist')")}<div class="divide-y divide-slate-100 dark:divide-slate-800">${upcoming.length?upcoming.map((row,index)=>`<button type="button" onclick="openDetails('checklist',decodeURIComponent('${encoded(row.id)}'))" class="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/55 sm:px-6"><span class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-brand-500/10 dark:group-hover:text-brand-300">${String(index+1).padStart(2,'0')}</span><span class="min-w-0 flex-1"><span class="block font-semibold leading-6">${esc(row.task)}</span><span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1">${icon('user-round','size-3.5')}${esc(row.owner||'Chưa giao')}</span><span class="inline-flex items-center gap-1">${icon('map-pin','size-3.5')}${esc(row.location||'Chưa chốt')}</span><span class="inline-flex items-center gap-1">${icon('calendar-clock','size-3.5')}${row.dueDate?(String(row.dueDate)<localDateYYYYMMDD()?`Quá hạn ${Math.max(1,Math.floor((new Date(localDateYYYYMMDD()+'T12:00:00')-new Date(row.dueDate+'T12:00:00'))/86400000))} ngày`:`Hạn ${formatDate(row.dueDate)}`):'Chưa có hạn'}</span></span></span><span class="hidden shrink-0 sm:block">${String(row.dueDate||'')&&String(row.dueDate)<localDateYYYYMMDD()?'<span class="dashboard-overdue-badge">Quá hạn</span>':statusBadge(row.status)}</span>${icon('chevron-right','mt-2 size-4 shrink-0 text-slate-300')}</button>`).join(''):emptyStateInline('Chưa có công việc','Thêm công việc mới để bắt đầu theo dõi tiến độ.')}</div></div><div class="space-y-5">${renderDashboardSurveyWidget()}<div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Ngân sách','Tỷ lệ sử dụng kế hoạch','wallet-cards')}<div class="space-y-5 px-5 pb-6 sm:px-6">${budgetProgress('Chi phí tạm tính',committed,budgeted,'bg-indigo-500')}${budgetProgress('Thực chi',actual,budgeted,'bg-brand-600')}<div class="grid grid-cols-2 gap-3 pt-1"><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Còn lại</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(Math.max(budgeted-committed,0))}</p></div><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Dự phòng</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(Number(settings.reserveBudget||0))}</p></div></div></div></div><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Tình trạng dữ liệu','Google Sheets là nguồn dữ liệu chính','activity')}<div class="space-y-3 px-5 pb-6 sm:px-6">${healthRow('Thay đổi chờ đồng bộ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Nhà cung cấp đã chọn',`${selectedVendors} đơn vị`,selectedVendors?'blue':'slate')}${healthRow('Lần đồng bộ cuối',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa đồng bộ',UI.lastSyncAt?'emerald':'amber')}</div></div></div></section>`;
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
function budgetOverrunAmount(row={}){return Math.max(0,Number(row.actual||0)+Number(row.payable||0)-Number(row.budgeted||0));}
function collectionWidgets(collection){
  const rows=statisticsRows(collection);
  if(['checklist','timeline'].includes(collection)){
    const cards=CONFIG.schemas[collection].filterOptions.slice(1).map((status,index)=>statCard(status,rows.filter(r=>r.status===status).length,'clipboard-check',['slate','blue','amber','emerald','orange','rose'][index],`setCollectionFilter('${collection}',decodeURIComponent('${encoded(status)}'))`,UI.filter===status));
    return renderWidgetRow(cards,'status');
  }
  if(collection==='budget'){
    const totals={budgeted:rows.reduce((s,r)=>s+Number(r.budgeted||0),0),payable:rows.reduce((s,r)=>s+Number(r.payable||0),0),actual:rows.reduce((s,r)=>s+Number(r.actual||0),0),remaining:rows.reduce((s,r)=>s+Number(r.remaining||0),0),overrun:rows.reduce((s,r)=>s+budgetOverrunAmount(r),0)};
    return renderWidgetRow([
      statCard('Ngân sách dự kiến',money(totals.budgeted),'wallet-cards','blue',"setMetricFilter('budgeted')",UI.secondaryFilter?.type==='metric'&&UI.secondaryFilter.value==='budgeted',mobileMoneyMB(totals.budgeted)),
      statCard('Còn phải thanh toán',money(totals.payable),'receipt-text','amber',"setMetricFilter('payable')",UI.secondaryFilter?.value==='payable',mobileMoneyMB(totals.payable)),
      statCard('Thực chi',money(totals.actual),'badge-dollar-sign','rose',"setMetricFilter('actual')",UI.secondaryFilter?.value==='actual',mobileMoneyMB(totals.actual)),
      statCard('Còn lại',money(totals.remaining),'piggy-bank','emerald',"setMetricFilter('remaining')",UI.secondaryFilter?.value==='remaining',mobileMoneyMB(totals.remaining)),
      statCard('Vượt ngân sách',money(totals.overrun),'triangle-alert','rose',"openBudgetOverrunDetails()",false,mobileMoneyMB(totals.overrun))
    ],'budget');
  }
  if(collection==='vendors'){
    const statuses=CONFIG.schemas.vendors.filterOptions.slice(1),tones=['slate','blue','emerald','amber','emerald','rose'];
    return renderWidgetRow(statuses.map((status,index)=>statCard(status,rows.filter(row=>row.status===status).length,'store',tones[index]||'slate',`setCollectionFilter('vendors',decodeURIComponent('${encoded(status)}'))`,UI.filter===status)),'status');
  }
  if(collection==='guests'){
    const sent=rows.filter(r=>r.sent==='Đã gửi').length,confirmed=rows.filter(r=>r.rsvp==='Đồng ý').length,attendeeTotal=rows.reduce((sum,row)=>sum+Math.max(0,Number(row.partySize||0)),0),sides=DATA.lookups.guestSides||[];
    const cards=[
      statCard('Tổng số người tham dự',`${new Intl.NumberFormat('vi-VN').format(attendeeTotal)} người`,'users','violet',"setMetricFilter('partySize')",UI.secondaryFilter?.type==='metric'&&UI.secondaryFilter.value==='partySize'),
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
  const schema=getUiSchema(collection),field=schema.fields.find(item=>item[0]===key);if(field?.[2]==='boolean')return ['Có','Không'];const options=getFieldOptions(field?.[3]);
  const values=[];
  (options||[]).forEach(value=>values.push(value));
  collectionRows(collection).forEach(row=>{ const current=row[key]; if(Array.isArray(current)) current.forEach(value=>values.push(value)); else values.push(current); });
  return [...new Set(values.map(value=>String(value??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
}
function filterDateFields(collection){ return (getUiSchema(collection)?.fields||[]).filter(field=>field[2]==='date'); }
function draftSelectedValues(field){ return Array.isArray(UI.filterDraft?.advancedFilters?.[field])?UI.filterDraft.advancedFilters[field]:[]; }
function filterSelectionSummary(field){ const values=draftSelectedValues(field); if(!values.length)return 'Chọn nhiều'; return values.join(', '); }
function renderFilterDialogBody(collection){
  const schema=getUiSchema(collection),dateFields=filterDateFields(collection),fields=(schema.filterFields||[]).filter(key=>filterFieldValues(collection,key).length);
  const dateHtml=dateFields.length?`<section class="filter-form-section"><div><p class="text-sm font-bold">Khoảng ngày</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Có thể nhập một hoặc cả hai mốc ngày; các điều kiện được kết hợp đồng thời.</p></div>${dateFields.map(([key,label])=>{const range=UI.filterDraft?.dateFilters?.[key]||{};return `<div><div class="filter-form-label"><span>${esc(label)}</span><span class="filter-form-operator">trong khoảng</span></div><div class="filter-date-grid"><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Từ ngày</span><input type="date" lang="vi-VN" data-filter-date-field="${esc(key)}" data-date-bound="from" value="${esc(normalizeDateOnly(range.from||''))}" class="filter-control" /></label><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Đến ngày</span><input type="date" lang="vi-VN" data-filter-date-field="${esc(key)}" data-date-bound="to" value="${esc(normalizeDateOnly(range.to||''))}" class="filter-control" /></label></div></div>`;}).join('')}</section>`:'';
  const selectedAdvancedCount=Object.values(UI.filterDraft?.advancedFilters||{}).reduce((sum,values)=>sum+(Array.isArray(values)?values.length:0),0),advancedOpen=UI.filterDraft?.advancedOpen===true||selectedAdvancedCount>0;
  const fieldHtml=fields.length?`<section class="filter-form-section filter-form-section--advanced"><button type="button" data-filter-advanced-toggle class="filter-advanced-toggle" aria-expanded="${advancedOpen?'true':'false'}"><span class="min-w-0 text-left"><span class="block text-sm font-bold">Bộ lọc nâng cao</span><span class="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">${selectedAdvancedCount?`${selectedAdvancedCount} lựa chọn đang áp dụng`:'Mở khi cần lọc theo trạng thái, nhóm hoặc thuộc tính khác.'}</span></span><span class="filter-section-count">${selectedAdvancedCount||fields.length}${selectedAdvancedCount?' đã chọn':' trường'}</span>${icon('chevron-down','size-4 shrink-0 text-slate-400')}</button><div data-filter-advanced-content class="${advancedOpen?'':'hidden'}"><div class="filter-fields-grid">${fields.map(key=>{const values=filterFieldValues(collection,key),selected=draftSelectedValues(key);return `<div class="filter-multiselect"><div class="filter-form-label"><span>${esc(fieldLabel(schema,key))}</span><span class="filter-form-operator">thuộc</span></div><button type="button" data-filter-dropdown="${esc(key)}" aria-expanded="false" class="filter-multiselect-button"><span data-filter-summary="${esc(key)}" class="filter-multiselect-summary ${selected.length?'is-selected':'is-placeholder'}">${esc(filterSelectionSummary(key))}</span>${icon('chevron-down','size-4 shrink-0 text-slate-400')}</button><div data-filter-menu="${esc(key)}" class="filter-multiselect-menu hidden"><div class="border-b border-slate-200 p-2 dark:border-slate-700"><input type="search" data-filter-option-search="${esc(key)}" placeholder="Tìm trong ${esc(fieldLabel(schema,key).toLowerCase())}" class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950" /></div><div class="filter-option-list app-scrollbar">${values.map(value=>`<label class="filter-option-row" data-filter-option-row data-option-text="${esc(String(value).toLowerCase())}"><input type="checkbox" data-filter-draft-field="${esc(key)}" value="${esc(value)}" ${selected.includes(value)?'checked':''} class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" /><span class="min-w-0 flex-1" title="${esc(value)}">${esc(value)}</span></label>`).join('')}</div></div></div>`;}).join('')}</div></div></section>`:'';
  document.getElementById('filterDialogBody').innerHTML=`<section><div class="filter-form-label"><span>Từ khóa</span></div><input id="filterKeywordInput" type="search" value="${esc(UI.filterDraft?.search||'')}" placeholder="Nhập nội dung cần tìm" class="filter-control" /></section>${dateHtml}${fieldHtml}`;
  bindFilterDialogControls(); refreshIcons();
}
function bindFilterDialogControls(){
  document.getElementById('filterKeywordInput')?.addEventListener('input',event=>{UI.filterDraft.search=event.target.value;});
  document.querySelector('[data-filter-advanced-toggle]')?.addEventListener('click',event=>{const content=document.querySelector('[data-filter-advanced-content]'),opening=content?.classList.contains('hidden');content?.classList.toggle('hidden',!opening);event.currentTarget.setAttribute('aria-expanded',String(opening));UI.filterDraft.advancedOpen=opening;});
  document.querySelectorAll('[data-filter-date-field]').forEach(input=>input.addEventListener('change',event=>{ const key=event.target.dataset.filterDateField,bound=event.target.dataset.dateBound; UI.filterDraft.dateFilters[key]=UI.filterDraft.dateFilters[key]||{}; UI.filterDraft.dateFilters[key][bound]=event.target.value; if(!UI.filterDraft.dateFilters[key].from&&!UI.filterDraft.dateFilters[key].to)delete UI.filterDraft.dateFilters[key]; }));
  document.querySelectorAll('[data-filter-dropdown]').forEach(button=>button.addEventListener('click',event=>{ const key=event.currentTarget.dataset.filterDropdown,menu=document.querySelector(`[data-filter-menu="${CSS.escape(key)}"]`),opening=menu?.classList.contains('hidden'); document.querySelectorAll('[data-filter-menu]').forEach(node=>node.classList.add('hidden')); document.querySelectorAll('[data-filter-dropdown]').forEach(node=>node.setAttribute('aria-expanded','false')); if(opening){menu?.classList.remove('hidden');event.currentTarget.setAttribute('aria-expanded','true');menu?.querySelector('input[type="search"]')?.focus();} }));
  document.querySelectorAll('[data-filter-option-search]').forEach(input=>input.addEventListener('input',event=>{ const menu=event.target.closest('[data-filter-menu]'),query=event.target.value.trim().toLowerCase(); menu?.querySelectorAll('[data-filter-option-row]').forEach(row=>row.classList.toggle('hidden',Boolean(query)&&!row.dataset.optionText.includes(query))); }));
  document.querySelectorAll('[data-filter-draft-field]').forEach(input=>input.addEventListener('change',event=>{ const field=event.target.dataset.filterDraftField,selected=new Set(draftSelectedValues(field)); event.target.checked?selected.add(event.target.value):selected.delete(event.target.value); if(selected.size)UI.filterDraft.advancedFilters[field]=[...selected];else delete UI.filterDraft.advancedFilters[field]; const summary=document.querySelector(`[data-filter-summary="${CSS.escape(field)}"]`); if(summary){summary.textContent=filterSelectionSummary(field);summary.classList.toggle('is-placeholder',!selected.size);summary.classList.toggle('is-selected',Boolean(selected.size));} }));
  const dialog=document.getElementById('filterDialog');if(dialog&&!dialog.dataset.outsideDropdownBound){dialog.dataset.outsideDropdownBound='1';dialog.addEventListener('click',event=>{if(event.target.closest('[data-filter-dropdown],[data-filter-menu]'))return;document.querySelectorAll('[data-filter-menu]').forEach(node=>node.classList.add('hidden'));document.querySelectorAll('[data-filter-dropdown]').forEach(node=>node.setAttribute('aria-expanded','false'));});dialog.addEventListener('cancel',()=>{document.querySelectorAll('[data-filter-menu]').forEach(node=>node.classList.add('hidden'));});}
}
function openFilterDialog(){
  const schema=getUiSchema(UI.tab); if(!schema)return;
  const advanced=structuredClone(UI.advancedFilters||{});
  if(UI.filter!=='Tất cả'&&schema.statusField){ const selected=new Set(advanced[schema.statusField]||[]); selected.add(UI.filter); advanced[schema.statusField]=[...selected]; }
  UI.filterDraft={search:UI.search,advancedFilters:advanced,dateFilters:structuredClone(UI.dateFilters||{}),advancedOpen:Object.keys(advanced).length>0};
  document.getElementById('filterDialogTitle').textContent=`Tìm kiếm ${schema.title}`;
  renderFilterDialogBody(UI.tab); const dialog=document.getElementById('filterDialog');dialog.showModal();bindDatePickerUX(dialog); setTimeout(()=>document.getElementById('filterKeywordInput')?.focus(),50);
}
function resetFilterDraft(){ UI.filterDraft={search:'',advancedFilters:{},dateFilters:{},advancedOpen:false}; renderFilterDialogBody(UI.tab); }
function applyFilterDialog(event){ event.preventDefault(); if(!UI.filterDraft)return; UI.search=String(UI.filterDraft.search||''); UI.advancedFilters=structuredClone(UI.filterDraft.advancedFilters||{}); UI.dateFilters=structuredClone(UI.filterDraft.dateFilters||{}); UI.filter='Tất cả'; UI.secondaryFilter=null; UI.visibleCount=CONFIG.pageSize; document.getElementById('filterDialog').close(); UI.filterDraft=null; renderPage(); }
function clearCollectionFilters(){ UI.search='';UI.filter='Tất cả';UI.secondaryFilter=null;UI.advancedFilters={};UI.dateFilters={};UI.filterDraft=null;UI.surveyMetricFilter='';UI.visibleCount=CONFIG.pageSize;renderPage(); }
function renderFilterChips(collection){
  const schema=getUiSchema(collection),chips=[];
  if(UI.search.trim())chips.push(`Từ khóa: ${UI.search.trim()}`);
  if(UI.filter!=='Tất cả')chips.push(`${fieldLabel(schema,schema.statusField)}: ${UI.filter}`);
  Object.entries(UI.advancedFilters||{}).forEach(([field,values])=>{if(values?.length)chips.push(`${fieldLabel(schema,field)}: ${values.join(', ')}`);});
  Object.entries(UI.dateFilters||{}).forEach(([field,range])=>{if(range?.from||range?.to)chips.push(`${fieldLabel(schema,field)}: ${range.from?formatDate(range.from):'…'} → ${range.to?formatDate(range.to):'…'}`);});
  if(UI.secondaryFilter)chips.push('Bộ lọc nhanh từ widget');
  return chips.map(text=>`<span class="filter-chip" title="${esc(text)}">${icon('filter','size-3 shrink-0')}<span>${esc(text)}</span></span>`).join('');
}

function openColumnSettings(){const collection=UI.tab;if(!getUiSchema(collection))return;UI.columnCollection=collection;const visible=getVisibleColumns(collection),all=allColumnKeys(collection),pref=getCurrentPreference()?.columns?.[collection],savedOrder=pref&&typeof pref==='object'&&!Array.isArray(pref)&&Array.isArray(pref.order)?pref.order.filter(key=>all.includes(key)):[],ordered=[...savedOrder,...visible.filter(key=>!savedOrder.includes(key)),...all.filter(key=>!savedOrder.includes(key)&&!visible.includes(key))];UI.columnDraft=ordered.map(key=>({key,visible:visible.includes(key)}));document.getElementById('columnSettingsTitle').textContent=`Cột hiển thị · ${getUiSchema(collection).title}`;renderColumnSettingsDraft();document.getElementById('columnSettingsDialog').showModal();refreshIcons();}
function renderColumnSettingsDraft(){const list=document.getElementById('columnSettingsList'),schema=getUiSchema(UI.columnCollection);if(!list||!schema)return;list.innerHTML=UI.columnDraft.map((item,index)=>`<div class="column-option-row ${item.key===ACTION_COLUMN_KEY?'column-option-row--actions':''}"><label class="column-option-row__main"><input type="checkbox" data-column-visible="${index}" ${item.visible?'checked':''} class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"><span class="column-option-row__copy"><span class="column-option-row__label">${esc(fieldLabel(schema,item.key))}</span><span class="column-option-row__code">${esc(item.key===ACTION_COLUMN_KEY?'Cột thao tác':item.key)}</span></span></label><div class="column-option-row__actions"><button type="button" data-column-up="${index}" ${index===0?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa ${esc(fieldLabel(schema,item.key))} lên">${icon('chevron-up','size-4')}</button><button type="button" data-column-down="${index}" ${index===UI.columnDraft.length-1?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa ${esc(fieldLabel(schema,item.key))} xuống">${icon('chevron-down','size-4')}</button></div></div>`).join('');list.querySelectorAll('[data-column-visible]').forEach(input=>input.addEventListener('change',()=>{UI.columnDraft[Number(input.dataset.columnVisible)].visible=input.checked;}));list.querySelectorAll('[data-column-up]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnUp),-1)));list.querySelectorAll('[data-column-down]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnDown),1)));refreshIcons();}
function moveColumnDraft(index,delta){const next=index+delta;if(next<0||next>=UI.columnDraft.length)return;[UI.columnDraft[index],UI.columnDraft[next]]=[UI.columnDraft[next],UI.columnDraft[index]];renderColumnSettingsDraft();}
function resetColumnSettings(){const defaults=[...getUiSchema(UI.columnCollection).columns,ACTION_COLUMN_KEY],all=allColumnKeys(UI.columnCollection);UI.columnDraft=[...defaults,...all.filter(key=>!defaults.includes(key))].map(key=>({key,visible:defaults.includes(key)}));renderColumnSettingsDraft();}
function saveColumnSettings(event){event.preventDefault();const selected=UI.columnDraft.filter(item=>item.visible).map(item=>item.key);if(!selected.some(key=>key!==ACTION_COLUMN_KEY)){toast('Cần chọn ít nhất một cột dữ liệu để làm tiêu đề bản ghi.','error');return;}const pref=getCurrentPreference(),columns={...(pref?.columns||{}),[UI.columnCollection]:{order:UI.columnDraft.map(item=>item.key),visible:selected}};updateCurrentPreference({columns});document.getElementById('columnSettingsDialog').close();renderPage();toast('Đã lưu thứ tự và cột hiển thị, bao gồm cột Tác vụ.','success');}
function sortableFields(collection){
  const schema=getUiSchema(collection);if(!schema)return [];
  return (schema.fields||[]).filter(field=>!field?.[3]?.editorHidden||field?.[3]?.sortable===true).map(field=>({key:field[0],label:field[1],type:field[2]}));
}
function currentListSort(collection){const saved=getCurrentPreference()?.sorts?.[collection];if(saved&&sortableFields(collection).some(field=>field.key===saved.field))return {field:saved.field,direction:saved.direction==='desc'?'desc':'asc'};return null;}
function applyListSort(collection,rows){const sort=currentListSort(collection);if(!sort)return rows;const schema=getUiSchema(collection),type=fieldType(schema,sort.field),factor=sort.direction==='desc'?-1:1;return [...rows].sort((a,b)=>{
  const av=a?.[sort.field],bv=b?.[sort.field];let cmp=0;
  if(['number','currency','rating'].includes(type))cmp=Number(av||0)-Number(bv||0);
  else if(type==='boolean')cmp=Number(boolValue(av))-Number(boolValue(bv));
  else if(type==='date')cmp=String(normalizeDateOnly(av)||'9999-12-31').localeCompare(String(normalizeDateOnly(bv)||'9999-12-31'));
  else if(type==='time')cmp=String(normalizeTime24(av)||'99:99').localeCompare(String(normalizeTime24(bv)||'99:99'));
  else cmp=String(av??'').localeCompare(String(bv??''),'vi',{numeric:true,sensitivity:'base'});
  return cmp*factor;
});}
function openSortDialog(){const collection=UI.tab,schema=getUiSchema(collection);if(!schema)return;UI.sortCollection=collection;const fields=sortableFields(collection),current=currentListSort(collection)||{field:fields[0]?.key||'',direction:'asc'};document.getElementById('sortDialogTitle').textContent=`Sắp xếp · ${schema.title}`;document.getElementById('sortField').innerHTML=fields.map(field=>`<option value="${esc(field.key)}" ${field.key===current.field?'selected':''}>${esc(field.label)}</option>`).join('');document.getElementById('sortDirectionAsc').checked=current.direction!=='desc';document.getElementById('sortDirectionDesc').checked=current.direction==='desc';const dialog=document.getElementById('sortDialog');if(!dialog.open)dialog.showModal();refreshIcons();}
function saveListSort(event){event.preventDefault();const collection=UI.sortCollection;if(!collection)return;const field=document.getElementById('sortField').value,direction=document.querySelector('input[name="sortDirection"]:checked')?.value||'asc';if(!sortableFields(collection).some(item=>item.key===field))return;updateCurrentPreference({sorts:{[collection]:{field,direction}}});document.getElementById('sortDialog').close();UI.visibleCount=CONFIG.pageSize;renderPage();toast('Đã lưu cách sắp xếp danh sách.','success');}
function resetListSort(){const collection=UI.sortCollection;if(!collection)return;updateCurrentPreference({sorts:{[collection]:null}});document.getElementById('sortDialog').close();UI.visibleCount=CONFIG.pageSize;renderPage();toast('Đã trả sắp xếp về mặc định.','success');}
const GROUP_BY_FIELDS=Object.freeze({
  checklist:['anchorEvent','group','owner','location','priority','status','budgetCategory','startDate','dueDate'],
  timeline:['anchorEvent','group','eventDate','status','location','owner','vendor'],
  budget:['anchorEvent','serviceGroup','category'],
  guests:['side','group','events','invitationType','sent','rsvp','tableNo','vegetarian','transport','room'],
  vendors:['anchorEvent','serviceGroup','category','location','score','status','decisionDue'],
  references:['event','group','interestLevel','priorityLevel','source','surveyStatus','surveyDecision'],
  survey:['tripName','surveyDate','participants','tripStatus','anchorEvent','group','interestLevel','status','decision','visited']
});
const GROUP_BY_CUSTOM_META=Object.freeze({
  references:{surveyDecision:{label:'Quyết định khảo sát',type:'select'}},
  survey:{}
});
function groupBySupported(collection){return Boolean(GROUP_BY_FIELDS[collection]?.length);}
function groupFieldMeta(collection,key){
  const custom=GROUP_BY_CUSTOM_META[collection]?.[key];if(custom)return {key,label:custom.label,type:custom.type||'text',options:custom.options||{}};
  const schema=getUiSchema(collection),field=schema?.fields?.find(item=>item[0]===key);return field?{key,label:field[1],type:field[2]||'text',options:field[3]||{}}:null;
}
function groupByOptions(collection){return (GROUP_BY_FIELDS[collection]||[]).map(key=>groupFieldMeta(collection,key)).filter(Boolean);}
function defaultGroupField(collection){return collection==='survey'?'tripName':'';}
function currentGroupField(collection){
  if(!groupBySupported(collection))return '';
  const groups=getCurrentPreference()?.groups||{},hasSaved=Object.prototype.hasOwnProperty.call(groups,collection),candidate=String(hasSaved?groups[collection]:defaultGroupField(collection)||'');
  return groupByOptions(collection).some(item=>item.key===candidate)?candidate:'';
}
function setGroupField(collection,value){
  if(!groupBySupported(collection))return;const next=String(value||'');if(next&&!groupByOptions(collection).some(item=>item.key===next))return;
  updateCurrentPreference({groups:{[collection]:next}});UI.visibleCount=CONFIG.pageSize;renderPage();
}
function renderGroupControl(collection){
  if(!groupBySupported(collection))return '';const current=currentGroupField(collection),options=[{key:'',label:'Không gộp'},...groupByOptions(collection)];
  return `<label class="reference-group-control group-by-control ${current?'is-active':''}" title="Gộp theo trường dữ liệu"><span>${icon('layers-3','size-4')}</span><select id="groupBySelect" aria-label="Gộp theo">${options.map(item=>`<option value="${esc(item.key)}" ${current===item.key?'selected':''}>${esc(item.label)}</option>`).join('')}</select></label>`;
}

function filterRowsByCurrentCriteria(collection,sourceRows,{includeQuickFilters=true,applySort=true}={}){
  const schema=getUiSchema(collection);let rows=[...(sourceRows||[])];const query=UI.search.trim().toLowerCase();
  if(query)rows=rows.filter(row=>schema.search.some(key=>String(Array.isArray(row[key])?row[key].join(' '):(row[key]??'')).toLowerCase().includes(query)));
  if(includeQuickFilters&&UI.filter!=='Tất cả'&&schema.statusField)rows=rows.filter(row=>row[schema.statusField]===UI.filter);
  if(includeQuickFilters&&UI.secondaryFilter){const f=UI.secondaryFilter;if(f.type==='metric')rows=rows.filter(row=>Number(row[f.value]||0)>0);else rows=rows.filter(row=>row[f.field]===f.value);}
  Object.entries(UI.advancedFilters||{}).forEach(([field,selected])=>{if(!Array.isArray(selected)||!selected.length)return;const fieldDef=schema.fields.find(item=>item[0]===field);rows=rows.filter(row=>{const current=fieldDef?.[2]==='boolean'?[boolValue(row[field])?'Có':'Không']:(Array.isArray(row[field])?row[field].map(String):[String(row[field]??'')]);return selected.some(value=>current.includes(String(value)));});});
  Object.entries(UI.dateFilters||{}).forEach(([field,range])=>{if(!range||(!range.from&&!range.to))return;rows=rows.filter(row=>{const current=String(row[field]||'').slice(0,10);if(!current)return false;if(range.from&&current<range.from)return false;if(range.to&&current>range.to)return false;return true;});});
  if(applySort){const customSort=currentListSort(collection);if(customSort)rows=applyListSort(collection,rows);else if(collection==='timeline')rows.sort((a,b)=>{const ad=String(a.eventDate||'9999-12-31'),bd=String(b.eventDate||'9999-12-31');if(ad!==bd)return ad.localeCompare(bd);return String(a.startTime||'').localeCompare(String(b.startTime||''));});}
  return rows;
}
function statisticsRows(collection){return filterRowsByCurrentCriteria(collection,collectionRows(collection),{includeQuickFilters:false,applySort:false});}
function filteredRows(collection){return filterRowsByCurrentCriteria(collection,collectionRows(collection));}

function groupRawValue(collection,row,key){
  if(collection==='references'&&key==='surveyDecision'){const summary=referenceSurveySummary(row);return summary.latestEvaluation?.decision||summary.candidate?.decision||'Chưa quyết định';}
  return row?.[key];
}
function groupValueEntries(collection,row,key){
  const meta=groupFieldMeta(collection,key)||{type:'text'},raw=groupRawValue(collection,row,key),values=Array.isArray(raw)?raw:[raw];
  const source=values.length?values:[''];const seen=new Set(),entries=[];
  source.forEach(value=>{
    let label='',sortValue=value,keyValue='';
    if(meta.type==='boolean')label=boolValue(value)?(key==='visited'?'Đã đi':'Có'):(key==='visited'?'Chưa đi':'Không');
    else if(meta.type==='date'){const normalized=normalizeDateOnly(value);label=normalized?formatDate(normalized):'';sortValue=normalized||'';}
    else if(['number','currency','rating'].includes(meta.type)){const number=Number(value);label=Number.isFinite(number)&&String(value??'').trim()!==''?new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(number):'';sortValue=Number.isFinite(number)?number:Number.POSITIVE_INFINITY;}
    else label=String(value??'').trim();
    if(!label){label='Chưa xác định';keyValue='__empty__';sortValue=meta.type==='date'?'9999-12-31':Number.POSITIVE_INFINITY;}else keyValue=String(value??label);
    const unique=`${keyValue}::${label}`;if(seen.has(unique))return;seen.add(unique);entries.push({key:keyValue,label,sortValue});
  });
  return entries;
}
function groupOptionRank(collection,key,label){const meta=groupFieldMeta(collection,key),options=getFieldOptions(meta?.options||{});const index=options.findIndex(item=>String(item)===String(label));return index>=0?index:Number.MAX_SAFE_INTEGER;}
function buildGroupedRows(collection,rows,key){
  const meta=groupFieldMeta(collection,key)||{type:'text'},groups=new Map();
  (rows||[]).forEach(row=>groupValueEntries(collection,row,key).forEach(entry=>{let groupKey=entry.key;if(collection==='survey'&&key==='tripName')groupKey=String(row.trip_id||entry.key);if(!groups.has(groupKey))groups.set(groupKey,{key:groupKey,label:entry.label,sortValue:entry.sortValue,rows:[],tripId:collection==='survey'&&key==='tripName'?String(row.trip_id||''):''});groups.get(groupKey).rows.push(row);}));
  return [...groups.values()].sort((a,b)=>{
    if(a.label==='Chưa xác định'&&b.label!=='Chưa xác định')return 1;if(b.label==='Chưa xác định'&&a.label!=='Chưa xác định')return -1;
    if(['number','currency','rating'].includes(meta.type))return Number(a.sortValue)-Number(b.sortValue);
    if(meta.type==='date')return String(a.sortValue||'9999-12-31').localeCompare(String(b.sortValue||'9999-12-31'));
    const ar=groupOptionRank(collection,key,a.label),br=groupOptionRank(collection,key,b.label);if(ar!==br)return ar-br;
    return String(a.label).localeCompare(String(b.label),'vi',{numeric:true,sensitivity:'base'});
  });
}
function summaryRawValue(collection,key,row){
  if(collection==='references'&&key==='surveyDetail'){const summary=referenceSurveySummary(row);return summary.candidate?summary.state||'Có dữ liệu':'';}
  return row?.[key];
}
function summaryHasData(value,type){
  if(Array.isArray(value))return value.some(item=>String(item??'').trim()!=='');
  if(value===null||value===undefined)return false;if(typeof value==='boolean')return true;
  if(['number','currency','rating'].includes(type))return String(value).trim()!==''&&Number.isFinite(Number(value));
  return String(value).trim()!=='';
}
function groupSummaryMetric(collection,schema,key,rows){
  if(key===ACTION_COLUMN_KEY)return {kind:'none',value:'',plain:''};const type=fieldType(schema,key),values=(rows||[]).map(row=>summaryRawValue(collection,key,row));
  if(['number','currency','rating'].includes(type)){
    const total=values.reduce((sum,value)=>{const number=Number(value);return sum+(Number.isFinite(number)?number:0);},0);
    if(type==='currency')return {kind:'sum',value:money(total),plain:money(total)};
    if(key==='durationMinutes')return {kind:'sum',value:esc(formatDurationMinutes(total)),plain:formatDurationMinutes(total)};
    const formatted=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(total);return {kind:'sum',value:esc(formatted),plain:formatted};
  }
  const count=values.reduce((sum,value)=>sum+(summaryHasData(value,type)?1:0),0),text=`${count} dòng`;return {kind:'count',value:esc(text),plain:text};
}
function renderGroupSummaryDesktop(collection,schema,rows,visibleColumns,{leadingCell=false}={}){
  const dataColumns=visibleColumns.filter(key=>key!==ACTION_COLUMN_KEY);let firstData=true;
  const cells=visibleColumns.map(key=>{if(key===ACTION_COLUMN_KEY)return `<td class="group-summary-cell group-summary-cell--actions"></td>`;const metric=groupSummaryMetric(collection,schema,key,rows),isFirst=!leadingCell&&firstData;firstData=false;return `<td class="group-summary-cell ${dataColumnClass(schema,key)}"><div class="group-summary-cell__content">${isFirst?'<strong>Tổng nhóm</strong>':''}<span>${metric.value}</span></div></td>`;}).join('');
  const lead=leadingCell?`<td class="group-summary-cell group-summary-cell--label"><strong>Tổng nhóm</strong></td>`:'';
  return `<tfoot class="group-summary-foot"><tr>${lead}${cells}</tr></tfoot>`;
}
function renderGroupSummaryMobile(collection,schema,rows,visibleColumns){
  const items=visibleColumns.filter(key=>key!==ACTION_COLUMN_KEY).map(key=>{const metric=groupSummaryMetric(collection,schema,key,rows);return `<div class="group-summary-mobile__item"><dt>${esc(fieldLabel(schema,key))}</dt><dd>${metric.value}</dd></div>`;}).join('');
  return `<section class="group-summary-mobile md:hidden"><div class="group-summary-mobile__head"><strong>Tổng nhóm</strong><span>${rows.length} dòng</span></div><dl class="group-summary-mobile__grid">${items}</dl></section>`;
}
function groupHeaderSubtitle(collection,group){
  if(collection==='guests'){const partyTotal=group.rows.reduce((sum,row)=>sum+Math.max(0,Number(row.partySize||0)),0);return `${group.rows.length} dòng · ${partyTotal} người tham dự`;}
  return `${group.rows.length} dòng`;
}
function renderGenericGroupedSection(collection,schema,group,visibleColumns){
  const timelineLead=collection==='timeline',tableRows=collection==='survey'?renderSurveyTableRows(group.rows,visibleColumns):group.rows.map(row=>renderTableRow(collection,schema,row,visibleColumns)).join(''),mobileRows=collection==='survey'?group.rows.map(row=>renderSurveyMobileCard(row,visibleColumns)).join(''):group.rows.map(row=>renderMobileCard(collection,schema,row,visibleColumns)).join('');
  return `<section class="timeline-group"><div class="timeline-group__header"><div class="min-w-0"><p class="truncate text-sm font-bold">${esc(group.label)}</p><p class="mt-0.5 text-[10px] text-slate-400">${esc(groupHeaderSubtitle(collection,group))}</p></div><span class="timeline-group__count">${group.rows.length}</span></div><div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${timelineLead?'<th scope="col" class="data-col data-col--complete px-3 py-3 text-center font-semibold">Tích hoàn thành</th>':''}${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(schema,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(schema,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${tableRows}</tbody>${renderGroupSummaryDesktop(collection,schema,group.rows,visibleColumns,{leadingCell:timelineLead})}</table></div><div class="grid gap-3 p-3 md:hidden">${mobileRows}</div>${renderGroupSummaryMobile(collection,schema,group.rows,visibleColumns)}</section>`;
}
function renderGroupedCollection(collection,schema,rows,visibleColumns){
  const key=currentGroupField(collection);if(!key)return '';const groups=buildGroupedRows(collection,rows,key);if(!groups.length)return emptyState('Không tìm thấy dữ liệu','Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.','search-x',true);
  return `<div class="timeline-group-list">${groups.map(group=>collection==='survey'&&key==='tripName'?renderSurveyGroup(group,visibleColumns):renderGenericGroupedSection(collection,schema,group,visibleColumns)).join('')}</div>`;
}
function referenceShowHidden(){return Boolean(UI.referenceShowHidden);}
function toggleReferenceShowHidden(){UI.referenceShowHidden=!UI.referenceShowHidden;UI.visibleCount=CONFIG.pageSize;renderPage();}
function setReferenceListHidden(id,hidden){if(!ensureMutationReady())return;const row=(DATA.references||[]).find(item=>String(item.id)===String(id));if(!row)return;const before=structuredClone(row);row.listHidden=Boolean(hidden);row.updatedAt=new Date().toISOString();queueUpsert('references',row,before);saveData();UI.visibleCount=CONFIG.pageSize;renderPage();toast(hidden?'Đã ẩn nguồn tham khảo khỏi danh sách.':'Đã hiện lại nguồn tham khảo trong danh sách.','success');}
function renderCollection(collection){
  recomputeDerivedFinancials();
  const schema=CONFIG.schemas[collection],visibleColumns=getVisibleColumns(collection),all=collectionRows(collection),filtered=filteredRows(collection),grouped=Boolean(currentGroupField(collection)),rows=grouped?filtered:filtered.slice(0,UI.visibleCount),hasMore=!grouped&&rows.length<filtered.length,filterCount=activeCollectionFilterCount();
  const toolbarButtonClass='collection-toolbar-button',currentSort=currentListSort(collection);
  const sortButton=`<button id="openSortDialogButton" type="button" aria-label="Sắp xếp danh sách" title="Sắp xếp danh sách" class="${toolbarButtonClass} ${currentSort?'collection-toolbar-button--active':''}">${icon('arrow-up-down','size-4')}<span>Sắp xếp</span></button>`;
  const referenceVisibilityButton=collection==='references'?`<button id="referenceShowHiddenButton" type="button" aria-label="${referenceShowHidden()?'Chỉ xem nguồn đang hiển thị':'Xem tất cả nguồn, gồm nguồn đã ẩn'}" title="${referenceShowHidden()?'Chỉ xem nguồn đang hiển thị':'Xem tất cả nguồn, gồm nguồn đã ẩn'}" class="${toolbarButtonClass} ${referenceShowHidden()?'collection-toolbar-button--active':''}">${icon(referenceShowHidden()?'eye-off':'eye','size-4')}<span>${referenceShowHidden()?'Chỉ xem đang hiển thị':'Xem tất cả'}</span></button>`:'';
  const addDisabled=UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra dữ liệu mới nhất"':'';
  const content=grouped?renderGroupedCollection(collection,schema,filtered,visibleColumns):(rows.length?`<div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${collection==='timeline'?'<th scope="col" class="data-col data-col--complete px-3 py-3 text-center font-semibold">Tích hoàn thành</th>':''}${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(schema,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(schema,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${rows.map(row=>renderTableRow(collection,schema,row,visibleColumns)).join('')}</tbody></table></div><div class="grid gap-3 p-3 md:hidden">${rows.map(row=>renderMobileCard(collection,schema,row,visibleColumns)).join('')}</div>`:emptyState('Không tìm thấy dữ liệu',hasActiveAdvancedFilters()?'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.':`Thêm ${schema.singular} đầu tiên để bắt đầu quản lý.`,'search-x',true));
  return `${collectionWidgets(collection)}<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="collection-panel-toolbar border-b border-slate-200 dark:border-slate-800"><div class="collection-panel-toolbar__heading"><h3>${schema.title}</h3><p>${plural(all.length,'bản ghi')} · ${plural(filtered.length,'kết quả phù hợp')}</p></div><div class="collection-panel-toolbar__actions"><button id="openFilterDialogButton" type="button" aria-label="Tìm kiếm và bộ lọc" title="Tìm kiếm và bộ lọc" class="${toolbarButtonClass} ${filterCount?'collection-toolbar-button--active':''}">${icon('search','size-4')}<span>Tìm kiếm & bộ lọc</span></button>${sortButton}${renderGroupControl(collection)}${referenceVisibilityButton}<button id="customizeColumnsButton" type="button" aria-label="Cột hiển thị" title="Cột hiển thị" class="${toolbarButtonClass}">${icon('columns-3','size-4')}<span>Cột hiển thị</span></button><button id="addRecordButton" type="button" aria-label="Thêm ${esc(schema.singular)}" title="Thêm ${esc(schema.singular)}" ${addDisabled} class="collection-toolbar-add">${icon('plus','size-4')}<span>Thêm ${schema.singular}</span></button></div></div>${content}<div class="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p class="text-xs text-slate-500 dark:text-slate-400">${grouped?'Đang hiển thị toàn bộ':'Đang hiển thị'} <span class="font-semibold text-slate-700 dark:text-slate-200">${rows.length}</span> trong ${filtered.length} bản ghi</p>${hasMore?`<button id="loadMoreButton" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevrons-down','size-3.5')}Xem thêm 20 bản ghi</button>`:`<span class="text-xs font-semibold text-slate-400">Đã hiển thị toàn bộ</span>`}</div></section>`;
}
function mutationActionDisabled(){return UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra dữ liệu mới nhất"':'';}
function completionControl(collection,row,mobile=false){
  const checked=String(row.status||'')==='Hoàn thành',title=collection==='timeline'?(row.event||'mốc lịch trình'):(row.task||'công việc');
  return `<label class="timeline-complete-toggle ${mobile?'timeline-complete-toggle--mobile':''}" title="${checked?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}"><input type="checkbox" data-record-complete="${esc(row.id)}" data-record-complete-collection="${esc(collection)}" ${checked?'checked':''} aria-label="${checked?'Bỏ hoàn thành':'Hoàn thành'} ${esc(title)}"/><span>${icon(checked?'circle-check-big':'circle','size-4')}</span></label>`;
}
function toggleRecordCompletion(collection,id,checked){
  if(!ensureMutationReady()||!['timeline','checklist'].includes(collection))return;const row=(DATA[collection]||[]).find(item=>String(item.id)===String(id));if(!row)return;const before=structuredClone(row);
  if(checked){if(String(row.status||'')!=='Hoàn thành')row.previousStatus=String(row.status||'Chưa bắt đầu')||'Chưa bắt đầu';row.status='Hoàn thành';}
  else {row.status=String(row.previousStatus||'Chưa bắt đầu')||'Chưa bắt đầu';row.previousStatus='';}
  row.updatedAt=new Date().toISOString();queueUpsert(collection,row,before);saveData();renderPage();toast(checked?`Đã đánh dấu ${collection==='timeline'?'Timeline':'Công việc'} hoàn thành.`:`Đã khôi phục trạng thái “${row.status}”.`,'success');
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
function actionButtons(collection,row,mobile=false){ const cls=mobile?'inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 text-[10px] font-semibold dark:border-slate-700 disabled:cursor-not-allowed disabled:opacity-40':'grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-35'; const locked=mutationActionDisabled(),schema=CONFIG.schemas[collection],reportButton=(schema?.reportFields||[]).length?`<button type="button" data-report="${esc(row.id)}" ${locked} class="${cls}" aria-label="Báo cáo">${icon('clipboard-pen-line','size-4')}${mobile?'Báo cáo':''}</button>`:'',hidden=collection==='references'&&boolValue(row.listHidden),hideButton=collection==='references'?`<button type="button" data-reference-hide="${esc(row.id)}" data-hidden="${hidden?'true':'false'}" ${locked} class="${cls} reference-hide-action ${mobile?'reference-hide-action--mobile':''}" aria-label="${hidden?'Hiện lại trong danh sách':'Ẩn khỏi danh sách'}" title="${hidden?'Hiện lại trong danh sách':'Ẩn khỏi danh sách'}">${icon(hidden?'eye':'eye-off','size-4')}${mobile?'':''}</button>`:'';return `${reportButton}<button type="button" data-detail="${esc(row.id)}" class="${cls}" aria-label="Xem chi tiết">${icon('eye','size-4')}${mobile?'Chi tiết':''}</button><button type="button" data-edit="${esc(row.id)}" ${locked} class="${cls}" aria-label="Chỉnh sửa">${icon('pencil','size-4')}${mobile?'Sửa':''}</button>${hideButton}<button type="button" data-delete="${esc(row.id)}" ${locked} class="${cls} ${mobile?'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300':'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'}" aria-label="Xóa">${icon('trash-2','size-4')}${mobile?'Xóa':''}</button>`; }
function titleDisplayValue(schema,key,value){return fieldType(schema,key)==='url'?esc(value||'—'):displayValue(schema,key,value);}
function referenceSurveyStatusCell(row={}){
  const summary=referenceSurveySummary(row),state=summary.state||row.surveyStatus||'Chưa yêu cầu',visit=summary.latestVisit;
  if(!summary.candidate&&!boolValue(row.needsSurvey))return '<span class="reference-survey-empty" aria-label="Không yêu cầu khảo sát">—</span>';
  const canEvaluate=state==='Chờ đánh giá'&&visit&&String(visit.status||'')===SURVEY_VISIT_COMPLETED_STATUS;
  return `<div class="reference-survey-status-cell">${statusBadge(state)}${canEvaluate?`<button type="button" data-reference-list-evaluate="${esc(visit.id)}" class="reference-inline-evaluate" aria-label="Đánh giá khảo sát cho ${esc(referenceDisplayName(row))}">${icon('clipboard-pen-line','size-3.5')}<span>Đánh giá</span></button>`:''}</div>`;
}
function referenceSurveyDetailCell(row={}){
  const summary=referenceSurveySummary(row),candidate=summary.candidate||null,evaluation=summary.latestEvaluation||null;
  if(!candidate&&!boolValue(row.needsSurvey))return '<span class="reference-survey-detail-empty">—</span>';
  const visitCount=Number(summary.visitCount||0),score=Number(summary.latestScore||0),latestDate=summary.latestVisitDate?formatDate(summary.latestVisitDate):'';
  const candidateDecision=String(candidate?.decision||'').trim(),evaluationDecision=String(evaluation?.decision||'').trim();
  let decision=!['','Chưa quyết định'].includes(candidateDecision)?candidateDecision:evaluationDecision;
  if(decision==='Shortlist')decision='Ưu tiên cao';
  const firstLine=[];
  if(visitCount>0)firstLine.push(`${icon('footprints','size-3')}<span><b>${visitCount}</b> lần</span>`);
  else firstLine.push(`${icon('route','size-3')}<span>Chưa thực hiện</span>`);
  if(latestDate)firstLine.push(`${icon('calendar-days','size-3')}<span>${esc(latestDate)}</span>`);
  const secondLine=[];
  if(score>0)secondLine.push(`${icon('star','size-3')}<span><b>${score.toFixed(1)}/10</b></span>`);
  else if(visitCount>0)secondLine.push(`${icon('clipboard-pen-line','size-3')}<span>Chưa có đánh giá</span>`);
  if(decision&&!['Chưa quyết định','Shortlist'].includes(decision))secondLine.push(`${icon('badge-check','size-3')}<span>${esc(decision)}</span>`);
  return `<div class="reference-survey-detail-cell"><div class="reference-survey-detail-cell__line">${firstLine.map(item=>`<span class="reference-survey-detail-cell__item">${item}</span>`).join('')}</div>${secondLine.length?`<div class="reference-survey-detail-cell__line reference-survey-detail-cell__line--result">${secondLine.map(item=>`<span class="reference-survey-detail-cell__item">${item}</span>`).join('')}</div>`:''}</div>`;
}
function referenceSurveyEvaluationNotesCell(row={}){const notes=String(referenceSurveySummary(row).latestEvaluation?.evaluationNotes||'').trim();return notes?`<div class="reference-survey-evaluation-notes">${esc(notes)}</div>`:'<span class="reference-survey-evaluation-notes--empty">—</span>';}
function collectionCellValue(collection,schema,key,row){if(collection==='references'&&key==='surveyStatus')return referenceSurveyStatusCell(row);if(collection==='references'&&key==='surveyDetail')return referenceSurveyDetailCell(row);if(collection==='references'&&key==='surveyEvaluationNotes')return referenceSurveyEvaluationNotesCell(row);return displayValue(schema,key,row[key]);}
function renderTableRow(collection,schema,row,columns=getVisibleColumns(collection)){const titleKey=primaryTitleKey(schema,columns),isHiddenReference=collection==='references'&&boolValue(row.listHidden),completeCell=collection==='timeline'?`<td class="data-col data-col--complete px-3 py-3 align-middle text-center">${completionControl('timeline',row)}</td>`:'';return `<tr class="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/45 ${isHiddenReference?'reference-row--hidden':''}">${completeCell}${columns.map(key=>{if(key===ACTION_COLUMN_KEY)return `<td class="${dataColumnClass(schema,key)} px-4 py-3 align-middle"><div class="flex items-center justify-end gap-1">${actionButtons(collection,row)}</div></td>`;const isTitle=key===titleKey,content=isTitle?titleDisplayValue(schema,key,row[key]):collectionCellValue(collection,schema,key,row);return `<td class="${dataColumnClass(schema,key)} px-5 py-4 align-top ${isTitle?'font-semibold text-slate-900 dark:text-white':'text-slate-600 dark:text-slate-300'}"><div class="data-cell-content">${isTitle?`<div class="record-title-with-check">${collection==='checklist'?completionControl('checklist',row):''}<button type="button" data-detail="${esc(row.id)}" class="record-title-button" aria-label="Xem chi tiết ${esc(schema.singular)}">${content}</button>${isHiddenReference?'<span class="reference-hidden-badge">Đã ẩn</span>':''}</div>`:content}</div></td>`;}).join('')}</tr>`;}
function renderMobileCard(collection,schema,row,columns=getVisibleColumns(collection)){
  const dataColumns=columns.filter(key=>key!==ACTION_COLUMN_KEY),titleKey=primaryTitleKey(schema,dataColumns),secondary=dataColumns.filter(key=>key!==titleKey),showActions=columns.includes(ACTION_COLUMN_KEY),lastIndex=secondary.length-1;
  const secondaryHtml=secondary.map((key,index)=>{const full=(collection==='references'&&key==='surveyEvaluationNotes')||(secondary.length%2===1&&index===lastIndex);return `<div class="mobile-card-field ${full?'mobile-card-field--full':''}"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(fieldLabel(schema,key))}</dt><dd class="mobile-card-value mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">${collectionCellValue(collection,schema,key,row)}</dd></div>`;}).join('');
  return `<article class="mobile-data-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[.99] dark:border-slate-800 dark:bg-slate-900 ${collection==='references'&&boolValue(row.listHidden)?'reference-card--hidden':''}"><div class="mobile-card-title-row">${['timeline','checklist'].includes(collection)?completionControl(collection,row,true):''}<div class="min-w-0 flex-1"><button type="button" data-detail="${esc(row.id)}" class="record-title-button text-sm font-bold leading-6">${titleDisplayValue(schema,titleKey,row[titleKey])}</button>${collection==='references'&&boolValue(row.listHidden)?'<span class="reference-hidden-badge">Đã ẩn</span>':''}</div></div>${secondaryHtml?`<dl class="mobile-card-grid">${secondaryHtml}</dl>`:''}${showActions?`<div class="mobile-card-actions">${actionButtons(collection,row,true)}</div>`:''}</article>`;
}
function emptyState(title,description,emptyIcon='inbox',withAction=false){ return `<div class="px-5 py-16 text-center"><div class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon(emptyIcon,'size-6')}</div><h4 class="mt-4 font-bold">${title}</h4><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">${description}</p>${withAction?`<button type="button" id="clearFiltersButton" class="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('rotate-ccw','size-4')}Đặt lại bộ lọc</button>`:''}</div>`; }
function emptyStateInline(title,description){ return `<div class="px-6 py-12 text-center"><div class="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon('inbox','size-5')}</div><p class="mt-3 font-semibold">${title}</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${description}</p></div>`; }

function renderSyncSettingsCard(settings,endpoint,connectionScope,hasSchemaPassword){
  const migrationReport=FEATURE_FLAGS.legacyV10Migration?parseStoredJson(storage.get(CONFIG.migrationReportKey,''),null):null,migrationIssues=Number(migrationReport?.unresolvedCount||0),migrationState=migrationReport?(migrationIssues?`Cần kiểm tra ${migrationIssues} tham chiếu`:'Đã hoàn tất'):'Đang khóa';
  const issuePreview=(UI.syncIssues||[]).slice(0,5).map(issue=>`<div class="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-500/10"><p class="text-xs font-semibold">${esc(syncIssueLabel(issue))}</p><p class="mt-1 text-[10px] leading-4 text-slate-500 dark:text-slate-400">${esc(issue.message||'Thay đổi cần được kiểm tra.')}</p><div class="mt-2 flex flex-wrap gap-2"><button type="button" data-sync-issue-retry="${esc(issue.changeId)}" class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-300 px-2.5 text-[10px] font-semibold text-amber-800 dark:border-amber-800 dark:text-amber-200">${icon('rotate-ccw','size-3')}Thử lại</button><button type="button" data-sync-issue-discard="${esc(issue.changeId)}" class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[10px] font-semibold dark:border-slate-700">${icon('server','size-3')}Dùng server</button></div></div>`).join('');
  const common=`${healthRow('Thay đổi đang chờ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Cần xử lý',`${(UI.syncIssues||[]).length} thay đổi`,UI.syncIssues?.length?'amber':'emerald')}${healthRow('Xung đột cần xử lý',`${UI.conflicts.length} thay đổi`,UI.conflicts.length?'amber':'emerald')}${issuePreview?`<div class="space-y-2">${issuePreview}${UI.syncIssues.length>5?`<p class="text-[10px] text-slate-400">Còn ${UI.syncIssues.length-5} thay đổi khác cần xử lý.</p>`:''}</div>`:''}${healthRow('Lần đồng bộ gần nhất',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa có',UI.lastSyncAt?'blue':'slate')}${healthRow('Đồng bộ tự động',autoSyncStatusLabel(),UI.syncMode==='automatic'?'amber':activeServerToken(false)?'emerald':'slate')}<button id="settingsSyncNowButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-500/10">${icon('refresh-cw','size-4')}Đồng bộ ngay</button><button id="repairSyncQueueButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-900 dark:text-amber-200 dark:hover:bg-amber-500/10">${icon('wrench','size-4')}Sửa hàng đợi đồng bộ</button><button id="discardPendingQueueButton" type="button" ${(UI.pendingChanges.length||UI.syncIssues?.length||UI.conflicts.length)?'':'disabled'} class="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">${icon('trash-2','size-4')}Bỏ toàn bộ thay đổi chưa đồng bộ</button>`;
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
function attachmentStatus(item){const value=String(item?.status||'attached');return value==='staged'?'staged':'attached';}
function attachmentStatusText(item){return attachmentStatus(item)==='staged'?'Đã tải lên Drive · Chờ gắn bản ghi':'Đã đính kèm trên Google Drive';}
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
  const staged=attachmentStatus(item)==='staged',status=attachmentStatusText(item);
  return `<button type="button" data-view-attachment="${esc(item.id)}" class="${compact?'attachment-action':'detail-attachment-link'}" aria-label="Xem ${esc(item.fileName)}">${compact?`${icon('eye','size-3.5')}<span>Xem</span>`:`<span class="attachment-file-icon">${icon(attachmentFileIcon(item),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(item.fileName)}">${esc(item.fileName)}</span><span class="mt-0.5 block text-[10px] ${staged?'text-amber-600 dark:text-amber-300':'text-slate-400'}">${esc(formatAttachmentSize(item.sizeBytes))} · ${esc(status)}</span></span>${icon('eye','size-4 shrink-0 text-slate-400')}`}</button>`;
}
function renderAttachmentEditorContent(collection,recordId,mode){
  const existing=recordAttachments(collection,recordId),pending=pendingAttachmentRows(),used=existing.length+pending.length,canAdd=Math.max(0,CONFIG.attachmentMaxFiles-used);
  const existingHtml=existing.map(item=>{const staged=attachmentStatus(item)==='staged';return `<div class="attachment-row ${staged?'attachment-row--staged':''}"><span class="attachment-file-icon">${icon(attachmentFileIcon(item),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(item.fileName)}">${esc(item.fileName)}</span><span class="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] ${staged?'text-amber-600 dark:text-amber-300':'text-slate-400'}"><span>${esc(formatAttachmentSize(item.sizeBytes))}</span><span>·</span><span>${esc(attachmentStatusText(item))}</span></span></span>${attachmentViewButton(item,true)}<button type="button" data-delete-attachment="${esc(item.id)}" class="attachment-icon-action attachment-icon-action--danger" aria-label="Xóa ${esc(item.fileName)}">${icon('trash-2','size-3.5')}</button></div>`;}).join('');
  const pendingHtml=pending.map((entry,index)=>`<div class="attachment-row ${entry.status==='error'?'attachment-row--error':''}"><span class="attachment-file-icon">${icon(attachmentFileIcon(entry),'size-4')}</span><span class="min-w-0 flex-1"><span class="block truncate text-xs font-semibold" title="${esc(entry.file.name)}">${esc(entry.file.name)}</span><span class="mt-0.5 block text-[10px] ${entry.status==='error'?'text-rose-600 dark:text-rose-300':'text-slate-400'}">${entry.status==='uploading'?'Đang tải lên Google Drive…':entry.status==='error'?esc(entry.error||'Tải lên thất bại'):esc(formatAttachmentSize(entry.file.size))+' · Chờ tải lên'}</span></span>${entry.status==='uploading'?icon('loader-circle','size-4 animate-spin text-brand-600'):`<button type="button" data-remove-pending-attachment="${index}" class="attachment-icon-action" aria-label="Bỏ tệp">${icon('x','size-3.5')}</button>`}</div>`).join('');
  return `<div class="flex items-start justify-between gap-3"><div><p class="text-sm font-bold">Tệp đính kèm</p><p class="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Tệp được tải lên Google Drive ngay khi chọn · tối đa ${CONFIG.attachmentMaxFiles} tệp/bản ghi · 10 MB/tệp.</p></div><span class="attachment-counter">${used}/${CONFIG.attachmentMaxFiles}</span></div>${existingHtml||pendingHtml?`<div class="mt-3 space-y-2">${existingHtml}${pendingHtml}</div>`:''}<label class="attachment-dropzone mt-3 ${canAdd?'':'attachment-dropzone--disabled'}"><input id="attachmentFileInput" type="file" multiple ${canAdd?'':'disabled'} class="sr-only" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip" /><span class="attachment-dropzone__icon">${icon('paperclip','size-5')}</span><span class="min-w-0"><span class="block text-xs font-semibold">${canAdd?'Chọn tệp để đính kèm':'Đã đạt giới hạn tệp'}</span><span class="mt-0.5 block text-[10px] text-slate-400">PDF, ảnh, Office, TXT, CSV hoặc ZIP</span></span></label>`;
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
  const input=document.getElementById('attachmentFileInput');if(input)input.addEventListener('change',event=>{if(!UI.editing)return;const editor=UI.editing,files=[...(event.target.files||[])],existing=recordAttachments(editor.collection,editor.recordId),pending=Array.isArray(editor.pendingFiles)?editor.pendingFiles:[];let slots=Math.max(0,CONFIG.attachmentMaxFiles-existing.length-pending.length);for(const file of files){if(slots<=0){toast(`Mỗi bản ghi chỉ được tối đa ${CONFIG.attachmentMaxFiles} tệp.`,'error');break;}const error=validateAttachmentFile(file);if(error){toast(error,'error');continue;}if(pending.some(entry=>entry.file.name===file.name&&entry.file.size===file.size)){continue;}pending.push({file,status:'selected',error:'',uploadPromise:null});slots--;}editor.pendingFiles=pending;refreshAttachmentEditorSection();void uploadPendingAttachments(editor);});
  document.querySelectorAll('[data-remove-pending-attachment]').forEach(button=>button.addEventListener('click',()=>{if(!UI.editing)return;const index=Number(button.dataset.removePendingAttachment),entry=UI.editing.pendingFiles[index];if(entry?.status==='uploading'){toast('Tệp đang được tải lên Google Drive. Vui lòng chờ hoàn tất hoặc đóng biểu mẫu; tệp tạm sẽ được tự dọn nếu không gắn vào bản ghi.','info');return;}UI.editing.pendingFiles.splice(index,1);refreshAttachmentEditorSection();}));
  document.querySelectorAll('[data-delete-attachment]').forEach(button=>button.addEventListener('click',()=>deleteStoredAttachment(button.dataset.deleteAttachment)));
  document.querySelectorAll('[data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment)));
}
function fileToBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error(`Không đọc được tệp ${file.name}.`));reader.onload=()=>{const value=String(reader.result||''),comma=value.indexOf(',');if(comma<0)return reject(new Error(`Không mã hóa được tệp ${file.name}.`));resolve(value.slice(comma+1));};reader.readAsDataURL(file);});}
async function uploadAttachmentFile(file,target){const base64=await fileToBase64(file);return postAppsScript({action:'uploadAttachment',collection:target.collection,recordId:target.recordId,context:target.context,stageIfMissing:true,file:{name:file.name,mimeType:file.type||'application/octet-stream',sizeBytes:file.size,base64}},{authMode:'auto',retries:0,timeoutMs:CONFIG.networkTimeouts.attachment||240000});}
const BACKGROUND_ATTACHMENT_QUEUE=[];
const BACKGROUND_ATTACHMENT_FAILURES=new Map();
let backgroundAttachmentBusy=false;
function enqueueBackgroundAttachmentUpload({collection,recordId,mode='edit',files=[],kind='editor'}){const cleanFiles=(files||[]).filter(Boolean);if(!cleanFiles.length)return;BACKGROUND_ATTACHMENT_QUEUE.push({id:uid('attachment-job'),collection,recordId,mode,kind,files:cleanFiles,createdAt:new Date().toISOString()});queueMicrotask(processBackgroundAttachmentQueue);}
async function processBackgroundAttachmentQueue(){if(backgroundAttachmentBusy||!BACKGROUND_ATTACHMENT_QUEUE.length)return;backgroundAttachmentBusy=true;try{while(BACKGROUND_ATTACHMENT_QUEUE.length){const task=BACKGROUND_ATTACHMENT_QUEUE.shift();await runBackgroundAttachmentTask(task);}}finally{backgroundAttachmentBusy=false;}}
async function runBackgroundAttachmentTask(task){const uploaded=[],failed=[];for(const file of task.files){try{const result=await uploadAttachmentFile(file,{collection:task.collection,recordId:task.recordId,context:attachmentContextForMode(task.mode)});if(result.attachment){DATA.attachments=(DATA.attachments||[]).filter(item=>item.id!==result.attachment.id);DATA.attachments.unshift(result.attachment);uploaded.push(result.attachment);}if(result.revision!==undefined)setRemoteRevision(result.revision);}catch(error){failed.push({file,error:error.message||'Không thể tải tệp.'});}}saveData();if(uploaded.length){const staged=uploaded.filter(item=>attachmentStatus(item)==='staged').length;toast(staged?`Đã tải ${uploaded.length} tệp lên Google Drive; ${staged} tệp đang chờ gắn bản ghi.`:`Đã tải ${uploaded.length} tệp lên Google Drive trong nền.`,'success');}if(failed.length)handleBackgroundAttachmentFailure(task,failed);}
function handleBackgroundAttachmentFailure(task,failed){const names=failed.map(item=>item.file?.name).filter(Boolean),message=`${failed.length} tệp chưa tải được lên Google Drive${names.length?`: ${names.join(', ')}`:''}. Bản ghi đã được lưu; hãy kiểm tra và thử lại.`,notification=createUserNotification({type:'attachment',tone:'danger',title:'Không thể tải tệp đính kèm',message,collection:task.collection,recordId:task.recordId});BACKGROUND_ATTACHMENT_FAILURES.set(notification.id,{...task,files:failed.map(item=>item.file).filter(Boolean),errors:failed.map(item=>item.error)});toast('Bản ghi đã lưu nhưng có tệp tải lên thất bại. Lỗi đã được đưa vào Thông báo.','error');reopenBackgroundAttachmentFailure(notification.id);}
function reopenBackgroundAttachmentFailure(notificationId){const task=BACKGROUND_ATTACHMENT_FAILURES.get(notificationId);if(!task)return;try{document.getElementById('attachmentPreviewDialog')?.close();if(task.kind==='survey'){navigate('survey');setTimeout(()=>{openSurveyTripPlanner([],task.recordId);if(UI.surveyPlanner){UI.surveyPlanner.pendingFiles=task.files.map((file,index)=>({file,status:'error',error:task.errors?.[index]||'Tải lên thất bại'}));refreshSurveyPlannerAttachments();}},180);return;}if(CONFIG.schemas[task.collection]){const targetTab=['survey_candidates','survey_evaluations'].includes(task.collection)?'survey':task.collection;navigate(targetTab);setTimeout(()=>{openEditor(task.collection,task.recordId,task.mode);if(UI.editing){UI.editing.pendingFiles=task.files.map((file,index)=>({file,status:'error',error:task.errors?.[index]||'Tải lên thất bại'}));refreshAttachmentEditorSection();}},180);}}catch(_){}}
function retryBackgroundAttachmentFailure(notificationId){const task=BACKGROUND_ATTACHMENT_FAILURES.get(notificationId);if(!task)return;BACKGROUND_ATTACHMENT_FAILURES.delete(notificationId);enqueueBackgroundAttachmentUpload(task);document.getElementById('notificationDetailDialog')?.close();toast('Đang thử tải lại tệp trong nền.','info');}
function setAttachmentPreviewState(state,{title='',message='',previewUrl='',driveUrl=''}={}){const dialog=document.getElementById('attachmentPreviewDialog'),frame=document.getElementById('attachmentPreviewFrame'),loader=document.getElementById('attachmentPreviewLoader'),error=document.getElementById('attachmentPreviewError'),name=document.getElementById('attachmentPreviewTitle'),open=document.getElementById('attachmentPreviewOpenDrive');if(name)name.textContent=title||'Xem tệp đính kèm';if(loader){loader.classList.toggle('hidden',state!=='loading');loader.hidden=state!=='loading';}if(error){error.classList.toggle('hidden',state!=='error');error.hidden=state!=='error';const text=error.querySelector('[data-attachment-preview-error-text]');if(text)text.textContent=message||'Không thể xem trước tệp này.';}if(frame){frame.classList.toggle('hidden',state!=='ready');frame.hidden=state!=='ready';if(state==='ready'&&previewUrl)frame.src=previewUrl;else if(state!=='ready')frame.removeAttribute('src');}if(open){open.classList.toggle('hidden',!driveUrl);open.hidden=!driveUrl;open.href=driveUrl||'#';}if(dialog&&!dialog.open)dialog.showModal();refreshIcons();}
async function openStoredAttachment(id){
  if(!id)return;const item=(DATA.attachments||[]).find(row=>row.id===id);setAttachmentPreviewState('loading',{title:item?.fileName||'Tệp đính kèm'});
  try{const result=await postAppsScript({action:'prepareAttachmentView',attachmentId:id},{authMode:'auto',retries:0,timeoutMs:CONFIG.networkTimeouts.attachment||240000}),previewUrl=String(result.previewUrl||''),driveUrl=String(result.driveUrl||previewUrl||'');if(!previewUrl&&!driveUrl)throw new Error('Không nhận được liên kết xem tệp.');if(previewUrl)setAttachmentPreviewState('ready',{title:item?.fileName||result.fileName||'Tệp đính kèm',previewUrl,driveUrl});else setAttachmentPreviewState('error',{title:item?.fileName||'Tệp đính kèm',message:'Định dạng này chưa hỗ trợ xem trực tiếp trong WeddingOS.',driveUrl});}
  catch(error){setAttachmentPreviewState('error',{title:item?.fileName||'Tệp đính kèm',message:error.message||'Không thể chuẩn bị tệp từ Google Drive.'});}
}
async function uploadPendingAttachments(editor=UI.editing){
  if(!editor||!Array.isArray(editor.pendingFiles)||!editor.pendingFiles.length)return {uploaded:0,failed:0};const target={collection:editor.collection,recordId:editor.recordId,context:attachmentContextForMode(editor.mode)};let uploaded=0,failed=0;
  for(const entry of [...editor.pendingFiles]){
    if(entry.status==='uploading'&&entry.uploadPromise){try{await entry.uploadPromise;}catch(_){}continue;}
    if(!['selected','error'].includes(String(entry.status||'')))continue;
    entry.status='uploading';entry.error='';if(UI.editing===editor)refreshAttachmentEditorSection();
    entry.uploadPromise=(async()=>{try{const result=await uploadAttachmentFile(entry.file,target);if(result.attachment){DATA.attachments=(DATA.attachments||[]).filter(item=>item.id!==result.attachment.id);DATA.attachments.unshift(result.attachment);}editor.pendingFiles=editor.pendingFiles.filter(item=>item!==entry);uploaded++;saveData();if(result.revision!==undefined)setRemoteRevision(result.revision);if(result.attachment&&attachmentStatus(result.attachment)==='staged')toast(`Đã tải ${entry.file.name} lên Google Drive. Tệp sẽ tự gắn khi bản ghi được đồng bộ.`,'success');}
      catch(error){entry.status='error';entry.error=error.message||'Không thể tải tệp.';failed++;if(editor.saved){enqueueBackgroundAttachmentUpload({collection:editor.collection,recordId:editor.recordId,mode:editor.mode,files:[entry.file],kind:'editor'});editor.pendingFiles=editor.pendingFiles.filter(item=>item!==entry);}}
      finally{entry.uploadPromise=null;if(UI.editing===editor)refreshAttachmentEditorSection();}})();
    try{await entry.uploadPromise;}catch(_){}
  }
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
function recordLinksForSource(collection,id){return (DATA.record_links||[]).filter(link=>String(link.source_collection||'')===String(collection||'')&&String(link.source_record_id||'')===String(id||''));}
function relatedRecordTitle(collection,id){const meta=RELATED_LINK_TARGET_MAP[collection],row=(DATA[collection]||[]).find(item=>String(item.id)===String(id));if(!row)return 'Bản ghi không còn tồn tại';if(collection==='references')return referenceContextLabel(row);return String(row[meta?.titleKey]||row.title||row.name||row.task||row.event||row.category||id||'Bản ghi');}
function recordLinkSelectionKey(collection,id){return `${String(collection||'')}::${encodeURIComponent(String(id||''))}`;}
function parseRecordLinkSelectionKey(key){const index=String(key||'').indexOf('::');if(index<1)return{target_collection:'',target_record_id:''};const target_collection=String(key).slice(0,index);let target_record_id='';try{target_record_id=decodeURIComponent(String(key).slice(index+2));}catch(_){target_record_id=String(key).slice(index+2);}return{target_collection,target_record_id};}
function checklistRelatedLinkDraft(){return Array.isArray(UI.editing?.relatedLinks)?UI.editing.relatedLinks:[];}
function renderChecklistRelatedLinksPanel(){const links=checklistRelatedLinkDraft();const grouped=new Map();links.forEach(link=>{const key=link.target_collection;if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(link);});return `<section class="checklist-related-panel" data-checklist-related-panel><div class="checklist-related-panel__head"><div><p class="text-sm font-bold">Liên kết liên quan</p><p class="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Liên kết nhiều bản ghi từ nhiều tính năng; nhấn vào bản ghi để xem nhanh thông tin.</p></div><button type="button" data-related-link-add class="survey-secondary-action">${icon('link-2','size-3.5')} Thêm liên kết</button></div><div class="checklist-related-groups">${links.length?[...grouped.entries()].map(([collection,items])=>`<div class="checklist-related-group"><p>${esc(RELATED_LINK_TARGET_MAP[collection]?.label||collection)}</p>${items.map(link=>`<div class="checklist-related-chip"><button type="button" data-related-link-open="${esc(collection)}" data-related-link-id="${esc(link.target_record_id)}">${esc(relatedRecordTitle(collection,link.target_record_id))}</button><button type="button" data-related-link-remove="${esc(collection)}" data-related-link-id="${esc(link.target_record_id)}" aria-label="Bỏ liên kết">${icon('x','size-3')}</button></div>`).join('')}</div>`).join(''):`<div class="checklist-related-empty">Chưa có liên kết liên quan.</div>`}</div></section>`;}
function refreshChecklistRelatedLinksPanel(){const host=document.querySelector('[data-checklist-related-panel]');if(!host)return;const wrap=document.createElement('div');wrap.innerHTML=renderChecklistRelatedLinksPanel();host.replaceWith(wrap.firstElementChild);bindChecklistRelatedLinksPanel();refreshIcons();}
function bindChecklistRelatedLinksPanel(root=document){root.querySelector?.('[data-related-link-add]')?.addEventListener('click',openRecordLinkPicker);root.querySelectorAll?.('[data-related-link-remove]').forEach(button=>button.addEventListener('click',()=>{UI.editing.relatedLinks=checklistRelatedLinkDraft().filter(link=>!(link.target_collection===button.dataset.relatedLinkRemove&&String(link.target_record_id)===String(button.dataset.relatedLinkId)));refreshChecklistRelatedLinksPanel();}));root.querySelectorAll?.('[data-related-link-open]').forEach(button=>button.addEventListener('click',()=>openRelatedRecord(button.dataset.relatedLinkOpen,button.dataset.relatedLinkId)));}
function ensureRecordLinkDialog(){let dialog=document.getElementById('recordLinkDialog');if(dialog)return dialog;dialog=document.createElement('dialog');dialog.id='recordLinkDialog';dialog.className='dialog-centered record-link-dialog rounded-3xl border border-slate-200 bg-white p-0 shadow-panel dark:border-slate-800 dark:bg-slate-900';dialog.innerHTML=`<div class="survey-dialog-head"><div><p class="survey-eyebrow">Công việc</p><h3>Thêm liên kết liên quan</h3><p>Chọn tính năng rồi chọn một hoặc nhiều bản ghi.</p></div><button type="button" data-record-link-close aria-label="Đóng">${icon('x','size-4')}</button></div><div id="recordLinkDialogBody" class="record-link-dialog__body app-scrollbar"></div><div class="survey-dialog-footer"><button type="button" data-record-link-close class="survey-secondary-action">Hủy</button><button type="button" id="recordLinkApply" class="survey-primary-action">Thêm đã chọn</button></div>`;document.body.appendChild(dialog);dialog.addEventListener('click',event=>{if(event.target.closest('[data-record-link-close]'))dialog.close();});document.getElementById('recordLinkApply')?.addEventListener('click',applyRecordLinkPicker);return dialog;}
function recordLinkPickerRows(collection){const currentId=String(UI.editing?.recordId||'');return (DATA[collection]||[]).filter(row=>!(collection==='checklist'&&String(row.id)===currentId));}
function renderRecordLinkPicker(){const state=UI.recordLinkPicker;if(!state)return;const collection=state.collection,rows=recordLinkPickerRows(collection),query=normalizeLookupText(state.query||''),visible=rows.filter(row=>!query||normalizeLookupText(relatedRecordTitle(collection,row.id)).includes(query)),selected=state.selected;document.getElementById('recordLinkDialogBody').innerHTML=`<div class="record-link-module-tabs">${RELATED_LINK_TARGETS.map(item=>`<button type="button" data-record-link-module="${esc(item.collection)}" class="${collection===item.collection?'is-active':''}">${esc(item.label)}</button>`).join('')}</div><div class="record-link-search"><input id="recordLinkSearch" type="search" value="${esc(state.query||'')}" placeholder="Tìm bản ghi..."></div><div class="record-link-records">${visible.length?visible.map(row=>{const key=recordLinkSelectionKey(collection,row.id),checked=selected.has(key);return `<label class="record-link-record"><input type="checkbox" data-record-link-pick="${esc(key)}" ${checked?'checked':''}><span><strong>${esc(relatedRecordTitle(collection,row.id))}</strong><small>${esc(RELATED_LINK_TARGET_MAP[collection]?.label||collection)}</small></span></label>`;}).join(''):`<div class="checklist-related-empty">Không có bản ghi phù hợp.</div>`}</div><p class="record-link-count">Đã chọn ${selected.size} liên kết</p>`;document.querySelectorAll('[data-record-link-module]').forEach(button=>button.addEventListener('click',()=>{state.collection=button.dataset.recordLinkModule;state.query='';renderRecordLinkPicker();}));document.getElementById('recordLinkSearch')?.addEventListener('input',event=>{state.query=event.target.value;renderRecordLinkPicker();setTimeout(()=>{const input=document.getElementById('recordLinkSearch');if(input){input.focus();const end=input.value.length;try{input.setSelectionRange(end,end);}catch(_){}}},0);});document.querySelectorAll('[data-record-link-pick]').forEach(input=>input.addEventListener('change',()=>{input.checked?selected.add(input.dataset.recordLinkPick):selected.delete(input.dataset.recordLinkPick);document.querySelector('.record-link-count').textContent=`Đã chọn ${selected.size} liên kết`;}));refreshIcons();}
function openRecordLinkPicker(){if(!UI.editing)return;const selected=new Set(checklistRelatedLinkDraft().map(link=>recordLinkSelectionKey(link.target_collection,link.target_record_id)));UI.recordLinkPicker={collection:'checklist',query:'',selected};const dialog=ensureRecordLinkDialog();renderRecordLinkPicker();if(!dialog.open)dialog.showModal();}
function applyRecordLinkPicker(){if(!UI.editing||!UI.recordLinkPicker)return;UI.editing.relatedLinks=[...UI.recordLinkPicker.selected].map(parseRecordLinkSelectionKey).filter(link=>link.target_collection&&link.target_record_id);document.getElementById('recordLinkDialog')?.close();UI.recordLinkPicker=null;refreshChecklistRelatedLinksPanel();}
function applyChecklistRelatedLinks(recordId){const existing=recordLinksForSource('checklist',recordId),draft=checklistRelatedLinkDraft(),wanted=new Set(draft.map(link=>`${link.target_collection}\u0000${link.target_record_id}`)),have=new Set(existing.map(link=>`${link.target_collection}\u0000${link.target_record_id}`));existing.filter(link=>!wanted.has(`${link.target_collection}\u0000${link.target_record_id}`)).forEach(link=>{DATA.record_links=DATA.record_links.filter(row=>row.id!==link.id);queueDelete('record_links',link.id,link);});draft.filter(link=>!have.has(`${link.target_collection}\u0000${link.target_record_id}`)).forEach(link=>{const record={id:uid('link'),source_collection:'checklist',source_record_id:recordId,target_collection:link.target_collection,target_record_id:link.target_record_id,created_at:new Date().toISOString(),created_by:currentPrincipalId(),_rowVersion:0,_updatedAt:'',_updatedBy:''};DATA.record_links.unshift(record);queueUpsert('record_links',record);});}
function openRelatedRecord(collection,id){if(collection==='survey_trips'){document.getElementById('detailDialog')?.close();document.getElementById('editorDialog')?.close();openSurveyTripDayView(id);return;}document.getElementById('detailDialog')?.close();openDetails(collection,id);}
function renderRecordLinksDetail(collection,id){if(collection!=='checklist')return '';const links=recordLinksForSource(collection,id);if(!links.length)return '';const groups=new Map();links.forEach(link=>{if(!groups.has(link.target_collection))groups.set(link.target_collection,[]);groups.get(link.target_collection).push(link);});return `<section class="detail-related-links"><div class="detail-suggestion-block__title">${icon('link-2','size-4')}<span>Liên kết liên quan</span></div>${[...groups.entries()].map(([target,items])=>`<div class="detail-related-group"><p>${esc(RELATED_LINK_TARGET_MAP[target]?.label||target)} · ${items.length}</p>${items.map(link=>`<button type="button" data-related-detail-open="${esc(target)}" data-related-detail-id="${esc(link.target_record_id)}"><span>${esc(relatedRecordTitle(target,link.target_record_id))}</span>${icon('chevron-right','size-3.5')}</button>`).join('')}</div>`).join('')}</section>`;}
function bindRecordLinkDetailActions(root=document){root.querySelectorAll?.('[data-related-detail-open]').forEach(button=>button.addEventListener('click',()=>openRelatedRecord(button.dataset.relatedDetailOpen,button.dataset.relatedDetailId)));}
function cleanupLocalRecordLinksForRecord(collection,id){const removed=(DATA.record_links||[]).filter(link=>(String(link.source_collection)===String(collection)&&String(link.source_record_id)===String(id))||(String(link.target_collection)===String(collection)&&String(link.target_record_id)===String(id)));removed.forEach(link=>queueDelete('record_links',link.id,link));if(removed.length)DATA.record_links=(DATA.record_links||[]).filter(link=>!removed.some(item=>item.id===link.id));}
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
  if(UI.editing?.collection==='checklist'&&section.id==='general')body+=renderChecklistSuggestionPanel(record||{});
  if(UI.editing?.collection==='checklist'&&section.id==='finance')body+=renderChecklistRelatedLinksPanel();
  if(UI.editing?.collection==='references'&&section.id==='classification')body+=renderReferenceSurveyPanel(record||{});
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
function localDateYYYYMMDD(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function bindChecklistStartStatusAutomation(root=document){const start=root.querySelector?.('#field-startDate'),status=root.querySelector?.('#field-status');if(!start||!status)return;const apply=()=>{const today=localDateYYYYMMDD(),existing=UI.editing?.id?(DATA.checklist||[]).find(row=>String(row.id)===String(UI.editing.id)):UI.editing?.seed,alreadyApplied=String(UI.editing?.autoStartAppliedDate||existing?.autoStartAppliedDate||'')===today;if(start.value===today&&status.value==='Chưa bắt đầu'&&!alreadyApplied){status.value='Đang làm';status.dataset.autoStartStatus='1';if(UI.editing)UI.editing.autoStartAppliedDate=today;let note=root.querySelector('[data-checklist-start-status-note]');if(!note){note=document.createElement('p');note.dataset.checklistStartStatusNote='1';note.className='checklist-start-status-note';status.closest('[data-editor-field]')?.appendChild(note);}note.textContent='Trạng thái được tự động cập nhật theo Ngày bắt đầu. Bạn vẫn có thể thay đổi.';}};start.addEventListener('change',apply);status.addEventListener('change',()=>{if(status.dataset.autoStartStatus&&status.value!=='Đang làm'){delete status.dataset.autoStartStatus;root.querySelector('[data-checklist-start-status-note]')?.remove();}});apply();}
function openEditor(collection,id='',mode='edit',seed={}){
  if(!ensureMutationReady())return;const schema=CONFIG.schemas[collection];if(!schema)return;const record=id?(DATA[collection]||[]).find(row=>row.id===id):(seed&&typeof seed==='object'?seed:null),recordId=id||uid(collection);UI.editing={collection,id,recordId,mode,pendingFiles:[],seed:id?{}:structuredClone(seed||{}),relatedLinks:collection==='checklist'?(id?recordLinksForSource('checklist',id).map(link=>({target_collection:link.target_collection,target_record_id:link.target_record_id})):[]):[]};
  document.getElementById('editorTitle').textContent=mode==='report'?`Báo cáo ${schema.singular}`:record?`Chỉnh sửa ${schema.singular}`:`Thêm ${schema.singular}`;
  document.getElementById('editorSubtitle').textContent=mode==='report'?'Cập nhật kết quả thực hiện và số liệu phát sinh. Các số liệu liên kết sẽ được đồng bộ sang Ngân sách.':record?'Các thay đổi được lưu vào hàng đợi để đồng bộ Google Sheets.':`Tạo một ${schema.singular} mới trong hệ thống.`;
  const sections=sectionedFieldsForMode(schema,mode),fields=document.getElementById('editorFields');
  fields.innerHTML=`<div class="editor-form-sections">${sections.map(section=>renderEditorSection(section,record||{})).join('')}${renderAttachmentEditorSection(collection,recordId,mode)}</div>`;
  bindNumberInputs(fields);bindTime24Controls(fields);bindDatePickerUX(fields);bindEditorMultiDropdowns(fields);if(collection==='timeline')updateTimelineDurationField(fields);bindReferenceSourceDetection(fields,collection);bindEditorDerivedControls(fields);bindAttachmentEditorControls();if(collection==='vendors')updateVendorPaymentGate(fields);if(collection==='checklist'){bindChecklistSuggestionPanel(fields);bindChecklistRelatedLinksPanel(fields);bindChecklistStartStatusAutomation(fields);}if(collection==='references')bindReferenceSurveyPanel(fields);if(collection==='survey_evaluations')bindSurveyEvaluationEditor(fields);
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
  else if(type==='multiselect'){const selected=Array.isArray(value)?value:[value].filter(Boolean);if(options?.multiDropdown){control=`<div class="editor-multi-dropdown" data-editor-multi-dropdown="${esc(key)}"><button type="button" id="field-${esc(key)}" class="editor-multi-dropdown__button" data-editor-multi-toggle="${esc(key)}" aria-expanded="false"><span class="editor-multi-dropdown__summary ${selected.length?'':'is-placeholder'}" data-editor-multi-summary="${esc(key)}">${selected.length?esc(selected.join(', ')):'— Chưa chọn —'}</span>${icon('chevron-down','size-4 shrink-0')}</button><div class="editor-multi-dropdown__menu hidden" data-editor-multi-menu="${esc(key)}"><div class="editor-multi-dropdown__search-wrap"><input type="search" data-editor-multi-search="${esc(key)}" placeholder="Tìm ${esc(label.toLowerCase())}" class="editor-multi-dropdown__search" /></div><div class="editor-multi-dropdown__options app-scrollbar">${opts.length?opts.map(option=>`<label class="editor-multi-dropdown__option" data-editor-multi-option-row data-option-text="${esc(String(option).toLowerCase())}"><input type="checkbox" name="${key}" value="${esc(option)}" ${selected.includes(option)?'checked':''}/><span>${esc(option)}</span></label>`).join(''):'<p class="px-3 py-3 text-xs text-slate-400">Chưa có lựa chọn phù hợp.</p>'}</div></div><div class="editor-multi-dropdown__chips" data-editor-multi-chips="${esc(key)}">${selected.map(option=>`<span class="editor-multi-chip">${esc(option)}</span>`).join('')}</div></div>`;}else{control=`<div class="editor-multiselect" role="group" aria-label="${esc(label)}">${opts.length?opts.map(option=>`<label class="editor-multiselect__option"><input type="checkbox" name="${key}" value="${esc(option)}" ${selected.includes(option)?'checked':''}/><span>${esc(option)}</span></label>`).join(''):'<p class="px-3 py-2 text-xs text-slate-400">Chưa có lựa chọn phù hợp.</p>'}</div>`;}}
  else if(type==='rating'){const score=Number(value||0);control=`<div class="rating-picker">${[1,2,3,4,5].map(number=>`<label><input type="radio" name="${key}" value="${number}" ${score===number?'checked':''}/><span>${number} ★</span></label>`).join('')}</div><p class="mt-1 text-[10px] text-slate-400">Chọn mức đánh giá từ 1 đến 5 sao.</p>`;}
  else if(type==='textarea')control=`<textarea ${common} rows="4" class="${baseClass} min-h-28 py-3">${esc(value)}</textarea>`;
  else if(type==='time')control=renderTime24Control(key,label,value);
  else if((type==='number'||type==='currency')&&Array.isArray(options?.selectValues)){const selected=String(value??'');control=`<select ${common} class="${baseClass} h-11"><option value="">— Chưa chọn —</option>${options.selectValues.map(option=>`<option value="${esc(option)}" ${selected===String(option)?'selected':''}>${esc(option)}</option>`).join('')}</select>`;}
  else if((type==='number'||type==='currency')&&options?.readOnly)control=`<input ${common} class="${baseClass} h-11 tabular editor-readonly-field" type="text" inputmode="numeric" readonly aria-readonly="true" value="${esc(formatNumberInputValue(value||0))}" />`;
  else if(type==='number'||type==='currency')control=`<input ${common} class="${baseClass} h-11 tabular" type="text" inputmode="numeric" autocomplete="off" data-number-input="1" data-number-kind="${type}" value="${esc(formatNumberInputValue(value))}" />`;
  else if(type==='date')control=`<input ${common} class="${baseClass} h-11" type="date" lang="vi-VN" value="${esc(normalizeDateOnly(value))}" />`;
  else control=`<input ${common} class="${baseClass} h-11" type="${type}" value="${esc(value??'')}" />`;
  const help=options?.helpText?`<p class="mt-1 text-[10px] leading-4 text-slate-400">${esc(options.helpText)}</p>`:'';
  const wide=['textarea'].includes(type)||Boolean(options?.multiDropdown)||['task','description','notes','includes','paymentTerms','contractUrl'].includes(key);
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

function suggestionContext(record={},useEditorValues=true){
  const editorGroup=useEditorValues?String(document.getElementById('field-group')?.value||''):'';
  const editorEvent=useEditorValues?String(document.getElementById('field-anchorEvent')?.value||''):'';
  const group=String(editorGroup||record?.group||resolveLookupLabel(String(record?.group_id||''),'')||'');
  const event=String(editorEvent||record?.anchorEvent||record?.event||resolveLookupLabel(String(record?.anchor_event_id||''),'')||'');
  const groupItem=lookupItemByValue('checklistGroups',group),eventItem=lookupItemByValue('anchorEvents',event);
  return {group,event,groupId:String(record?.group_id||groupItem?.id||''),eventId:String(record?.anchor_event_id||eventItem?.id||'')};
}
function checklistSuggestionReferences(record={},useEditorValues=true){
  const {group,groupId}=suggestionContext(record,useEditorValues);
  const interestIds=new Set(['Quan tâm','Rất quan tâm'].map(value=>String(lookupItemByValue('interestLevels',value)?.id||'')).filter(Boolean));
  return (DATA.references||[]).filter(row=>{const sameGroup=groupId?String(row.group_id||'')===groupId:normalizeLookupText(row.group)===normalizeLookupText(group);const interestId=String(row.interest_level_id||''),interested=interestId?interestIds.has(interestId):['Quan tâm','Rất quan tâm'].includes(String(row.interestLevel||''));return sameGroup&&interested;}).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0)||String(a.sourceUrl||'').localeCompare(String(b.sourceUrl||''),'vi'));
}
function checklistSuggestionVendors(record={},useEditorValues=true){
  const {group,event,groupId,eventId}=suggestionContext(record,useEditorValues);
  const rank={'Đã cọc':0,'Đã chọn':1,'Đã nhận báo giá':2,'Đang khảo sát':3};
  return (DATA.vendors||[]).filter(row=>Object.prototype.hasOwnProperty.call(rank,String(row.status||''))&&(groupId?String(row.service_group_id||'')===groupId:normalizeLookupText(row.serviceGroup)===normalizeLookupText(group))&&(eventId?String(row.anchor_event_id||'')===eventId:normalizeLookupText(row.anchorEvent)===normalizeLookupText(event))).sort((a,b)=>(rank[String(a.status||'')]??99)-(rank[String(b.status||'')]??99)||Number(b.score||0)-Number(a.score||0)||String(a.name||'').localeCompare(String(b.name||''),'vi'));
}
function renderChecklistSuggestionResults(record={},useEditorValues=true){
  const refs=checklistSuggestionReferences(record,useEditorValues).slice(0,5),vendors=checklistSuggestionVendors(record,useEditorValues).slice(0,5);
  const refHtml=refs.length?refs.map(row=>`<div class="checklist-suggestion-row"><div class="min-w-0"><p class="text-xs font-semibold">${esc(referenceContextLabel(row))}</p><p class="mt-0.5 text-[10px] text-slate-400">${Number(row.rating||0)}/5 · ${esc(row.source||resolveLookupLabel(String(row.source_id||''),'Nguồn tham khảo'))}</p></div><div>${safeExternalUrl(row.sourceUrl)?`<a href="${esc(safeExternalUrl(row.sourceUrl))}" target="_blank" rel="noopener noreferrer" class="vendor-suggestion-link">Mở link tham khảo</a>`:'<span class="vendor-suggestion-link vendor-suggestion-link--empty">Chưa có đường dẫn</span>'}</div><button type="button" data-checklist-reference-detail="${esc(row.id)}" class="vendor-suggestion-action">${icon('eye','size-3.5')}<span>Xem chi tiết</span></button></div>`).join(''):'<p class="checklist-suggestion-empty">Chưa có dữ liệu Tham khảo phù hợp.</p>';
  const vendorHtml=vendors.length?vendors.map(row=>`<div class="checklist-suggestion-row"><div class="min-w-0"><p class="truncate text-xs font-semibold">${esc(row.name||'Nhà cung cấp')}</p><p class="mt-0.5 text-[10px] text-slate-400">${esc(row.status||'—')} · Điểm ${Number(row.score||0)}/10</p></div><div class="text-right text-[10px] font-semibold text-slate-500 dark:text-slate-300">${row.quote?money(row.quote):'Chưa có báo giá'}</div><button type="button" data-checklist-vendor-detail="${esc(row.id)}" class="vendor-suggestion-action">${icon('eye','size-3.5')}<span>Xem chi tiết</span></button></div>`).join(''):'<p class="checklist-suggestion-empty">Chưa có Nhà cung cấp phù hợp.</p>';
  return `<div class="checklist-suggestion-groups"><section class="checklist-suggestion-source"><div class="checklist-suggestion-source__title">${icon('book-open-check','size-4')}<span>Tham khảo</span></div>${refHtml}</section><section class="checklist-suggestion-source"><div class="checklist-suggestion-source__title">${icon('store','size-4')}<span>Nhà cung cấp</span></div>${vendorHtml}</section></div>`;
}
function checklistNeedsSuggestion(record={}){
  const value=record?.needsSuggestion;
  return value===true||value===1||String(value||'').toLowerCase()==='true'||String(value||'')==='1';
}
function renderChecklistSuggestionPanel(record={}){
  const enabled=checklistNeedsSuggestion(record);
  return `<div class="checklist-suggestion-panel" data-checklist-suggestion-panel><div class="checklist-suggestion-toggle-row"><span class="text-sm font-semibold">Cần gợi ý</span><label class="checklist-suggestion-choice"><input type="radio" name="needsSuggestion" value="true" ${enabled?'checked':''}><span>Có</span></label><label class="checklist-suggestion-choice"><input type="radio" name="needsSuggestion" value="false" ${enabled?'':'checked'}><span>Không</span></label></div><div data-checklist-suggestion-results class="${enabled?'':'hidden'}">${renderChecklistSuggestionResults(record)}</div></div>`;
}
function refreshChecklistSuggestionResults(){const host=document.querySelector('[data-checklist-suggestion-results]');if(!host||host.classList.contains('hidden'))return;host.innerHTML=renderChecklistSuggestionResults({});bindChecklistSuggestionDetailActions(host);refreshIcons();}
function bindChecklistSuggestionDetailActions(root=document){root.querySelectorAll('[data-checklist-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.checklistReferenceDetail)));root.querySelectorAll('[data-checklist-vendor-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('vendors',button.dataset.checklistVendorDetail)));}
function bindChecklistSuggestionPanel(root=document){const panel=root.querySelector?.('[data-checklist-suggestion-panel]');if(!panel)return;panel.querySelectorAll('input[name="needsSuggestion"]').forEach(input=>input.addEventListener('change',()=>{const results=panel.querySelector('[data-checklist-suggestion-results]'),show=input.checked&&input.value==='true';results?.classList.toggle('hidden',!show);if(show){results.innerHTML=renderChecklistSuggestionResults({});bindChecklistSuggestionDetailActions(results);refreshIcons();}}));['field-anchorEvent','field-group'].forEach(id=>root.querySelector?.(`#${id}`)?.addEventListener('change',refreshChecklistSuggestionResults));}

function closeEditorMultiDropdowns(exceptKey=''){document.querySelectorAll('[data-editor-multi-menu]').forEach(menu=>{const key=menu.dataset.editorMultiMenu;if(exceptKey&&key===exceptKey)return;menu.classList.add('hidden');document.querySelector(`[data-editor-multi-toggle="${CSS.escape(key)}"]`)?.setAttribute('aria-expanded','false');});}
function updateEditorMultiDropdownSummary(key,root=document){const inputs=[...root.querySelectorAll(`input[name="${CSS.escape(key)}"]:checked`)],values=inputs.map(input=>input.value),summary=root.querySelector(`[data-editor-multi-summary="${CSS.escape(key)}"]`),chips=root.querySelector(`[data-editor-multi-chips="${CSS.escape(key)}"]`);if(summary){summary.textContent=values.length?values.join(', '):'— Chưa chọn —';summary.classList.toggle('is-placeholder',!values.length);}if(chips)chips.innerHTML=values.map(value=>`<span class="editor-multi-chip">${esc(value)}</span>`).join('');}
function bindEditorMultiDropdowns(root=document){root.querySelectorAll?.('[data-editor-multi-dropdown]').forEach(dropdown=>{const key=dropdown.dataset.editorMultiDropdown,toggle=dropdown.querySelector('[data-editor-multi-toggle]'),menu=dropdown.querySelector('[data-editor-multi-menu]'),search=dropdown.querySelector('[data-editor-multi-search]');toggle?.addEventListener('click',event=>{event.stopPropagation();const opening=menu?.classList.contains('hidden');closeEditorMultiDropdowns(opening?key:'');menu?.classList.toggle('hidden',!opening);toggle.setAttribute('aria-expanded',String(opening));if(opening)setTimeout(()=>search?.focus(),20);});search?.addEventListener('input',event=>{const q=event.target.value.trim().toLowerCase();menu?.querySelectorAll('[data-editor-multi-option-row]').forEach(row=>row.classList.toggle('hidden',Boolean(q)&&!row.dataset.optionText.includes(q)));});dropdown.querySelectorAll(`input[name="${CSS.escape(key)}"]`).forEach(input=>input.addEventListener('change',()=>updateEditorMultiDropdownSummary(key,dropdown)));});if(!root.dataset.editorMultiOutsideBound){root.dataset.editorMultiOutsideBound='1';root.addEventListener('click',event=>{if(!event.target.closest('[data-editor-multi-dropdown]'))closeEditorMultiDropdowns();});}}

function vendorSuggestionRows(serviceGroup){
  const target=normalizeLookupText(serviceGroup||'');if(!target)return [];
  const targetItem=lookupItemByValue('checklistGroups',serviceGroup),targetId=String(targetItem?.id||'');
  const interestIds=new Set(['Quan tâm','Rất quan tâm'].map(value=>String(lookupItemByValue('interestLevels',value)?.id||'')).filter(Boolean));
  return (DATA.references||[]).filter(row=>{const sameGroup=targetId?String(row.group_id||'')===targetId:normalizeLookupText(row.group)===target;const interestId=String(row.interest_level_id||''),interested=interestId?interestIds.has(interestId):['Quan tâm','Rất quan tâm'].includes(String(row.interestLevel||''));return sameGroup&&interested;}).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0)||referenceDisplayName(a).localeCompare(referenceDisplayName(b),'vi'));
}
function vendorSurveySuggestionRows(serviceGroup){const target=normalizeLookupText(serviceGroup||'');if(!target)return [];const targetItem=lookupItemByValue('checklistGroups',serviceGroup),targetId=String(targetItem?.id||'');return (DATA.survey_candidates||[]).filter(candidate=>{const decision=String(candidate.decision||'');if(!['Đã chọn','Ưu tiên cao'].includes(decision)||String(candidate.vendor_id||''))return false;const sameGroup=targetId?String(candidate.group_id||'')===targetId:normalizeLookupText(candidate.group)===target;if(!sameGroup)return false;const summary=surveyCandidateSummary(candidate);return surveyEvaluationIsComplete(summary.latestEvaluation);}).map(candidate=>({candidate,summary:surveyCandidateSummary(candidate)})).sort((a,b)=>{const rank=value=>value==='Đã chọn'?0:1,delta=rank(a.candidate.decision)-rank(b.candidate.decision);if(delta)return delta;const score=Number(b.summary.latestScore||0)-Number(a.summary.latestScore||0);if(score)return score;return String(b.summary.latestVisitDate||'').localeCompare(String(a.summary.latestVisitDate||''));});}
function renderVendorSuggestions(serviceGroup){
  const references=vendorSuggestionRows(serviceGroup),survey=vendorSurveySuggestionRows(serviceGroup),refShown=references.slice(0,5),surveyShown=survey.slice(0,5),total=references.length+survey.length;
  if(!serviceGroup)return `<div id="vendorSuggestions" class="vendor-suggestions"><div class="vendor-suggestions__head"><div><p class="text-sm font-bold">Gợi ý tự động</p><p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Chọn Nhóm công việc để xem gợi ý từ Tham khảo và kết quả Khảo sát.</p></div></div></div>`;
  const surveyHtml=surveyShown.length?`<div class="vendor-suggestion-source"><p class="vendor-suggestion-source__title">${icon('map-pinned','size-3.5')} Kết quả khảo sát</p><div class="vendor-suggestions__list">${surveyShown.map(item=>{const row=item.candidate,sum=item.summary;return `<div class="vendor-suggestion-row"><div class="min-w-0"><p class="truncate text-xs font-semibold">${esc(row.name||'Địa điểm khảo sát')}</p><p class="mt-0.5 truncate text-[10px] text-slate-400">${esc(row.decision)} · ${Number(sum.latestScore||0).toFixed(1)}/10 · ${sum.latestVisitDate?esc(formatDate(sum.latestVisitDate)):'Chưa có ngày'}</p></div><div class="min-w-0"><span class="vendor-suggestion-link">${esc(row.anchorEvent||resolveLookupLabel(String(row.anchor_event_id||''),'Khảo sát'))}</span></div><button type="button" data-vendor-survey-detail="${esc(row.id)}" class="vendor-suggestion-action">${icon('eye','size-3.5')}<span>Xem chi tiết</span></button></div>`;}).join('')}</div></div>`:'';
  const refHtml=refShown.length?`<div class="vendor-suggestion-source"><p class="vendor-suggestion-source__title">${icon('book-open-check','size-3.5')} Tham khảo</p><div class="vendor-suggestions__list">${refShown.map(row=>`<div class="vendor-suggestion-row"><div class="min-w-0"><p class="truncate text-xs font-semibold">${esc(referenceContextLabel(row))}</p><p class="mt-0.5 truncate text-[10px] text-slate-400">${Number(row.rating||0)}/5 · ${esc(row.source||resolveLookupLabel(String(row.source_id||''),'Nguồn tham khảo'))}</p></div><div class="min-w-0">${safeExternalUrl(row.sourceUrl)?`<a href="${esc(safeExternalUrl(row.sourceUrl))}" target="_blank" rel="noopener noreferrer" class="vendor-suggestion-link">Mở link tham khảo</a>`:`<span class="vendor-suggestion-link vendor-suggestion-link--empty">Chưa có đường dẫn</span>`}</div><button type="button" data-vendor-reference-detail="${esc(row.id)}" class="vendor-suggestion-action">${icon('eye','size-3.5')}<span>Xem chi tiết</span></button></div>`).join('')}</div></div>`:'';
  return `<div id="vendorSuggestions" class="vendor-suggestions"><div class="vendor-suggestions__head"><div><p class="text-sm font-bold">Gợi ý tự động</p><p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">${total?`${total} gợi ý phù hợp · kết quả Đã chọn được ưu tiên`:'Chưa có gợi ý phù hợp'}</p></div></div>${surveyHtml}${refHtml}</div>`;
}
function refreshVendorSuggestions(){const host=document.getElementById('vendorSuggestions');if(!host)return;const service=document.getElementById('field-serviceGroup')?.value||'';const wrapper=document.createElement('div');wrapper.innerHTML=renderVendorSuggestions(service);host.replaceWith(wrapper.firstElementChild);bindVendorSuggestionActions();refreshIcons();}
function bindVendorSuggestionActions(root=document){root.querySelectorAll('[data-vendor-reference-detail]').forEach(button=>button.addEventListener('click',()=>openDetails('references',button.dataset.vendorReferenceDetail)));root.querySelectorAll('[data-vendor-survey-detail]').forEach(button=>button.addEventListener('click',()=>openSurveyCandidateDetail(button.dataset.vendorSurveyDetail)));}
function renderVendorDetailSuggestions(record={}){
  const serviceGroup=String(record.serviceGroup||resolveLookupLabel(String(record.service_group_id||''),'')||'');
  if(!serviceGroup||(!vendorSuggestionRows(serviceGroup).length&&!vendorSurveySuggestionRows(serviceGroup).length))return '';
  const panel=renderVendorSuggestions(serviceGroup).replace('id="vendorSuggestions"','data-detail-vendor-suggestions');
  return `<section class="detail-suggestion-block detail-suggestion-block--vendor" data-detail-suggestions="vendors">${panel}</section>`;
}
function renderChecklistDetailSuggestions(record={}){
  if(!checklistNeedsSuggestion(record))return '';
  return `<section class="detail-suggestion-block" data-detail-suggestions="checklist"><div class="detail-suggestion-block__title">${icon('sparkles','size-4')}<span>Gợi ý tự động</span></div><p class="detail-suggestion-block__description">Công việc này đã bật Cần gợi ý. Nội dung bên dưới luôn được tính lại từ dữ liệu Tham khảo và Nhà cung cấp mới nhất.</p>${renderChecklistSuggestionResults(record,false)}</section>`;
}
function renderTimelineDetailSuggestions(record={}){
  const refs=checklistSuggestionReferences(record,false),vendors=checklistSuggestionVendors(record,false);
  if(!refs.length&&!vendors.length)return '';
  return `<section class="detail-suggestion-block" data-detail-suggestions="timeline"><div class="detail-suggestion-block__title">${icon('sparkles','size-4')}<span>Gợi ý tự động</span></div><p class="detail-suggestion-block__description">Gợi ý theo Sự kiện liên quan và Nhóm việc của mốc Timeline hiện tại.</p>${renderChecklistSuggestionResults(record,false)}</section>`;
}
function detailSuggestionContent(collection,record){
  if(collection==='checklist')return renderChecklistDetailSuggestions(record);
  if(collection==='vendors')return renderVendorDetailSuggestions(record);
  if(collection==='timeline')return renderTimelineDetailSuggestions(record);
  return '';
}
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
    const linked=(DATA.vendors||[]).filter(v=>{const ids=Array.isArray(v.category_ids)&&v.category_ids.length?v.category_ids:[v.category_id].filter(Boolean);return ACTIVE_VENDOR_FINANCIAL_STATUSES.includes(String(v.status||''))&&String(v.anchor_event_id||'')===String(eventItem?.id||'')&&ids.map(String).includes(String(serviceItem?.id||''));});
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



function saveEditor(event){
  event.preventDefault();if(!ensureMutationReady()||!UI.editing)return;const editing=UI.editing,{collection,id,recordId,mode}=editing,schema=CONFIG.schemas[collection],form=new FormData(event.currentTarget),record=id?DATA[collection].find(row=>row.id===id):{id:recordId,...structuredClone(editing.seed||{})},previous=record?structuredClone(record):{};
  fieldsForMode(schema,mode).forEach(([key,,type])=>{let value=type==='multiselect'?form.getAll(key):(form.get(key)??'');if(type==='rating')value=Number(value||0);else if(['number','currency'].includes(type))value=parseFormattedNumber(value);record[key]=value;});
  if(collection==='vendors'&&!vendorPaymentAllowed(record.status)&&id){['contractValue','deposit','paid','payable','paymentTerms'].forEach(key=>{record[key]=previous[key]??(key==='paymentTerms'?'':0);});}
  if(collection==='references'){record.title=String(form.get('title')??record.title??previous.title??'').trim();if(record.sourceUrl){const detected=detectReferenceSourceFromUrl(record.sourceUrl);if(detected)record.source=detected;}}
  if(collection==='checklist'&&form.has('needsSuggestion'))record.needsSuggestion=String(form.get('needsSuggestion'))==='true';
  if(collection==='references'&&form.has('needsSurvey')){record.needsSurvey=String(form.get('needsSurvey'))==='true';if(record.needsSurvey)record.rating=id?Number(previous.rating||0):0;}
  if(collection==='checklist'&&String(record.startDate||'')===localDateYYYYMMDD()&&String(record.status||'')==='Chưa bắt đầu')record.status='Đang làm';
  if(collection==='vendors'){if(!vendorPaymentAllowed(record.status)&&vendorHasPaymentData(record)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}showVendorPaymentGate();toast('Thanh toán & hợp đồng chỉ được nhập khi Nhà cung cấp đã được chọn.','error');return;}record.score=Number(record.score||0);if(record.score&&(!Number.isInteger(record.score)||record.score<1||record.score>10)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Điểm đánh giá phải nằm trong thang từ 1 đến 10.','error');return;}record.contractValue=Number(record.contractValue||0);record.deposit=Number(record.deposit||0);record.paid=Number(record.paid||0);if([record.contractValue,record.deposit,record.paid].some(value=>value<0)){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Giá trị hợp đồng, Tiền cọc và Đã thanh toán không được là số âm.','error');return;}if(record.deposit+record.paid>record.contractValue){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Tiền cọc + Đã thanh toán không được vượt Giá trị hợp đồng/dịch vụ.','error');return;}applyVendorFinancialValues(record);if(record.status==='Vào shortlist')record.status='Đã nhận báo giá';if(vendorPaymentAllowed(record.status)&&record.contractValue<=0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Khi Nhà cung cấp ở trạng thái Đã chọn/Đã cọc/Hoàn tất, Giá trị hợp đồng/dịch vụ phải lớn hơn 0.','error');return;}if(record.status==='Đã cọc'&&record.deposit<=0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Trạng thái Đã cọc yêu cầu Tiền cọc lớn hơn 0.','error');return;}}
  canonicalizeRecordReferences(collection,record);
  if(collection==='survey_candidates')record.needsRevisit=String(record.decision||'')==='Cần khảo sát lại';
  if(collection==='survey_evaluations'){
    const visit=(DATA.survey_visits||[]).find(row=>String(row.id)===String(record.visit_id||''));if(!visit||String(visit.status||'')!==SURVEY_VISIT_COMPLETED_STATUS){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Chỉ được đánh giá sau khi địa điểm đã được xác nhận Đã đi.','error');return;}
    const scoreKeys=['qualityScore','serviceScore','priceScore'],scores=[];for(const key of scoreKeys){const value=Number(record[key]||0);if(!Number.isInteger(value)||value<1||value>10){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Chất lượng, Tư vấn/Phục vụ và Giá cả phải được chấm từ 1 đến 10.','error');return;}scores.push(value);}
    record.overallScore=Math.round((scores.reduce((sum,value)=>sum+value,0)/scores.length)*10)/10;record.decision=record.decision==='Shortlist'?'Ưu tiên cao':(record.decision||'Chưa quyết định');record.status='Hoàn tất';record.completedAt=record.completedAt||new Date().toISOString();
  }
  const requiredMissing=fieldsForMode(schema,mode).filter(([,label,,options])=>options?.required).filter(([key])=>{const value=record[key];return value===''||value===null||value===undefined||(Array.isArray(value)&&!value.length);});if(requiredMissing.length){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast(`Vui lòng nhập các trường bắt buộc: ${requiredMissing.map(field=>field[1]).join(', ')}.`,'error');focusEditorFieldError(document.getElementById(`field-${requiredMissing[0][0]}`));return;}if(collection==='guests'&&record.rsvp==='Đồng ý'&&Number(record.partySize||0)<1){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Khách RSVP Đồng ý phải có Số người tham dự ít nhất là 1.','error');return;}
  const referenceIssues=canonicalReferenceIssues(collection,record);if(referenceIssues.length){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast(`Không thể xác định duy nhất tham chiếu cho: ${referenceIssues.map(key=>fieldLabel(schema,key)).join(', ')}. Hãy kiểm tra danh mục hoặc tên bản ghi trùng.`,`error`);return;}
  if(collection==='budget'){
    record.budgeted=Number(record.budgeted||0);record.actual=Number(record.actual||0);if(record.budgeted<0||record.actual<0){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}toast('Ngân sách dự kiến và Thực chi không được là số âm.','error');return;}
    const linkedVendors=vendorsForBudgetItem(record),committed=linkedVendors.reduce((sum,vendor)=>sum+Number(vendor.contractValue||0),0);if(linkedVendors.length)record.actual=linkedVendors.reduce((sum,vendor)=>sum+Number(vendor.deposit||0)+Number(vendor.paid||0),0);record.committed=committed;record.payable=Math.max(0,committed-record.actual);record.variance=record.budgeted-record.actual;record.remaining=record.budgeted-committed;
    const limit=budgetLimitState(record.budgeted,id);if(limit.exceeded){if(id){const index=DATA[collection].findIndex(row=>row.id===id);if(index>=0)DATA[collection][index]=previous;}showBudgetLimitDialog(limit);return;}
  }
  if(collection==='checklist'){const today=localDateYYYYMMDD();if(editing.autoStartAppliedDate)record.autoStartAppliedDate=editing.autoStartAppliedDate;if(record.startDate===today&&record.status==='Chưa bắt đầu'&&String(record.autoStartAppliedDate||'')!==today){record.status='Đang làm';record.autoStartAppliedDate=today;}syncChecklistBudget(record);record.variance=Number(record.budgetEstimate||0)-Number(record.actualCost||0);}
  if(collection==='timeline'){record.startTime=normalizeTime24(record.startTime);record.endTime=normalizeTime24(record.endTime);record.durationMinutes=durationMinutesBetween(record.startTime,record.endTime);}
  if(collection==='survey_evaluations')syncSurveyEvaluationOutcome(record,previous);
  if(!id){DATA[collection].unshift(record);UI.editing.id=record.id;}record.updatedAt=new Date().toISOString();queueUpsert(collection,record,id?previous:null);
  if(collection==='checklist')applyChecklistRelatedLinks(record.id);
  if(collection==='survey_evaluations')reconcileSurveyTripStatus(record.visit_id?(DATA.survey_visits||[]).find(row=>String(row.id)===String(record.visit_id))?.trip_id:'');
  if(collection==='references')syncReferenceSurveyCandidate(record,previous);
  if(collection==='vendors'&&record.survey_candidate_id)syncSurveyVendorLink(record);
  recomputeDerivedFinancials();saveData();editing.saved=true;
  const attachmentEntries=Array.isArray(editing.pendingFiles)?editing.pendingFiles:[],inFlight=attachmentEntries.some(entry=>entry.status==='uploading'),backgroundFiles=attachmentEntries.filter(entry=>entry.status!=='uploading').map(entry=>entry.file).filter(Boolean),message=mode==='report'?'Đã cập nhật báo cáo.':id?'Đã cập nhật bản ghi.':'Đã thêm bản ghi mới.';
  document.getElementById('editorDialog').close();UI.editing=null;toast((backgroundFiles.length||inFlight)?`${message} Tệp đính kèm đang được hoàn tất trên Google Drive.`:message,'success');renderPage();if(backgroundFiles.length)enqueueBackgroundAttachmentUpload({collection,recordId:record.id,mode,files:backgroundFiles,kind:'editor'});
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
  // Technical/legacy fields remain in schema for sync compatibility but must never leak into user-facing Detail UI.
  const base=(schema.fields||[]).filter(field=>{const options=field[3]||{};return !options.hidden&&!options.detailHidden;}).map(field=>({field,key:field[0],label:field[1],type:field[2],value:record[field[0]]}));
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
function budgetEventLabel(row={}){return String(row.anchorEvent||resolveLookupLabel(String(row.anchor_event_id||''),'Chưa gán sự kiện')||'Chưa gán sự kiện');}
function budgetServiceGroupLabel(row={}){return String(row.serviceGroup||resolveLookupLabel(String(row.service_group_id||''),'Chưa gán nhóm dịch vụ')||'Chưa gán nhóm dịch vụ');}
function openBudgetOverrunDetails(){
  const rows=statisticsRows('budget').map(row=>({row,overrun:budgetOverrunAmount(row)})).filter(item=>item.overrun>0).sort((a,b)=>b.overrun-a.overrun),total=rows.reduce((sum,item)=>sum+item.overrun,0),dialog=document.getElementById('detailDialog');
  document.getElementById('detailTitle').textContent='Hạng mục vượt ngân sách';
  const desktopRows=rows.map(({row,overrun})=>`<tr class="border-b border-slate-100 last:border-0 dark:border-slate-800"><td class="px-4 py-3 align-top"><button type="button" onclick="document.getElementById('detailDialog').close();openDetails('budget',decodeURIComponent('${encoded(row.id)}'))" class="record-title-button font-semibold">${esc(row.category||'Hạng mục')}</button></td><td class="px-4 py-3 align-top tabular whitespace-nowrap">${money(row.budgeted)}</td><td class="px-4 py-3 align-top tabular whitespace-nowrap font-bold text-rose-600 dark:text-rose-300">${money(overrun)}</td><td class="px-4 py-3 align-top">${esc(budgetEventLabel(row))}</td><td class="px-4 py-3 align-top">${esc(budgetServiceGroupLabel(row))}</td></tr>`).join('');
  const mobileRows=rows.map(({row,overrun})=>`<button type="button" onclick="document.getElementById('detailDialog').close();openDetails('budget',decodeURIComponent('${encoded(row.id)}'))" class="w-full rounded-2xl border border-slate-200 p-4 text-left dark:border-slate-800"><div class="flex items-start justify-between gap-3"><span class="font-bold">${esc(row.category||'Hạng mục')}</span><span class="font-bold text-rose-600 dark:text-rose-300">${money(overrun)}</span></div><dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs"><div><dt class="text-slate-400">Ngân sách</dt><dd class="mt-0.5 font-semibold">${money(row.budgeted)}</dd></div><div><dt class="text-slate-400">Sự kiện</dt><dd class="mt-0.5 font-semibold">${esc(budgetEventLabel(row))}</dd></div><div class="col-span-2"><dt class="text-slate-400">Nhóm dịch vụ</dt><dd class="mt-0.5 font-semibold">${esc(budgetServiceGroupLabel(row))}</dd></div></dl></button>`).join('');
  document.getElementById('detailContent').innerHTML=rows.length?`<div class="space-y-4"><div class="rounded-2xl bg-rose-50 p-4 dark:bg-rose-500/10"><p class="text-xs font-semibold text-rose-700 dark:text-rose-300">Tổng số tiền vượt ngân sách</p><p class="mt-1 text-2xl font-bold tabular text-rose-700 dark:text-rose-200">${money(total)}</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${rows.length} hạng mục phù hợp điều kiện Tìm kiếm & Bộ lọc hiện tại.</p></div><div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[900px] text-left text-sm"><thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr><th class="px-4 py-3">Hạng mục</th><th class="px-4 py-3">Ngân sách</th><th class="px-4 py-3">Số tiền vượt</th><th class="px-4 py-3">Sự kiện liên quan</th><th class="px-4 py-3">Nhóm dịch vụ</th></tr></thead><tbody>${desktopRows}</tbody></table></div><div class="grid gap-3 md:hidden">${mobileRows}</div></div>`:emptyStateInline('Không có hạng mục vượt ngân sách','Không có hạng mục nào vượt ngân sách trong phạm vi Tìm kiếm & Bộ lọc hiện tại.');
  document.getElementById('detailActions').innerHTML=`<button type="button" data-close-dialog="detailDialog" class="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold dark:border-slate-700">Đóng</button>`;
  dialog.classList.remove('detail-popup-shell--compact');if(!dialog.open)dialog.showModal();dialog.querySelectorAll('[data-close-dialog="detailDialog"]').forEach(button=>button.addEventListener('click',()=>dialog.close()));refreshIcons();
}
function openDetails(collection,id){
  const schema=CONFIG.schemas[collection],record=(DATA[collection]||[]).find(row=>row.id===id); if(!record)return;
  document.getElementById('detailTitle').textContent=`Chi tiết ${schema.singular}`;
  const statusKey=schema.statusField||'';
  const rows=detailLayoutRows(collection,schema,record);
  document.getElementById('detailContent').innerHTML=`${collection==='budget'?renderBudgetDetail(schema,record):`<dl class="detail-grid">${rows.flat().map(item=>`<div class="detail-field detail-field--span-${item.span} ${item.key===statusKey?'detail-field--status':''}" data-detail-field="${esc(item.key)}" ${item.logicalGroup?`data-detail-group="${esc(item.logicalGroup)}"`:''}><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(item.label)}</dt><dd class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">${displayValue(schema,item.key,record[item.key])}</dd></div>`).join('')}</dl>`}${detailSuggestionContent(collection,record)}${detailSurveyContent(collection,record)}${renderRecordLinksDetail(collection,id)}${renderDetailAttachments(collection,id)}`;
  const actions=document.getElementById('detailActions'),locked=mutationActionDisabled(),reportButton=(schema.reportFields||[]).length?`<button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openReport('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">${icon('clipboard-pen-line','size-4')}Báo cáo</button>`:'';actions.innerHTML=`${reportButton}${collection==='survey_candidates'?surveyCandidateDetailFooterActions(record):''}<button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openEditor('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">${icon('pencil','size-4')}Chỉnh sửa</button>`;
  const detailDialog=document.getElementById('detailDialog');detailDialog.classList.toggle('detail-popup-shell--compact',collection==='references');if(!detailDialog.open)detailDialog.showModal();
  document.querySelectorAll('#detailDialog [data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment)));
  const detailContent=document.getElementById('detailContent');bindVendorSuggestionActions(detailContent);bindChecklistSuggestionDetailActions(detailContent);bindSurveyDetailActions(detailContent);bindRecordLinkDetailActions(detailContent);document.querySelectorAll('#detailActions [data-survey-create-vendor-footer]').forEach(btn=>btn.addEventListener('click',()=>createVendorFromSurveyCandidate(btn.dataset.surveyCreateVendorFooter)));document.querySelectorAll('#detailActions [data-survey-view-vendor-footer]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('detailDialog')?.close();openDetails('vendors',btn.dataset.surveyViewVendorFooter);}));refreshIcons();
}

function surveyTripHasHistory(tripId){const visits=surveyVisitsForTrip(tripId),visitIds=new Set(visits.map(row=>String(row.id)));return visits.some(row=>String(row.status||'')===SURVEY_VISIT_COMPLETED_STATUS)||(DATA.survey_evaluations||[]).some(row=>visitIds.has(String(row.visit_id||'')));}
function askDeleteSurveyTrip(tripId){if(!ensureMutationReady())return;const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(tripId));if(!trip)return;const visits=surveyVisitsForTrip(trip.id),visitIds=new Set(visits.map(row=>String(row.id))),evaluations=(DATA.survey_evaluations||[]).filter(row=>visitIds.has(String(row.visit_id||'')));UI.deleting={type:'survey-trip',tripId:trip.id};openConfirmDialog('Xóa kế hoạch khảo sát?',`Kế hoạch “${trip.name||'Chưa đặt tên'}” sẽ bị xóa cùng ${visits.length} lần khảo sát${evaluations.length?` và ${evaluations.length} đánh giá`:''}. Các địa điểm không còn kế hoạch hiệu lực sẽ trở về Chờ xếp lịch. Dữ liệu Tham khảo gốc không bị xóa.`);}
function openConfirmDialog(title,description){document.getElementById('confirmTitle').textContent=title;document.getElementById('confirmDescription').textContent=description;const dialog=document.getElementById('confirmDialog');if(dialog&&!dialog.open)dialog.showModal();}
function askDelete(collection,id){if(!ensureMutationReady())return;UI.deleting={type:'record',collection,id};openConfirmDialog('Xóa bản ghi này?','Thao tác sẽ xóa bản ghi khỏi bản xem trước trên thiết bị này và đưa yêu cầu xóa vào hàng đợi đồng bộ.');}
function askLookupDelete(key,index){if(!ensureMutationReady())return;const item=lookupItemsForKey(key,{activeOnly:false})[index];if(!item)return;const refs=referenceCountForLookupItem(item);UI.deleting={type:'lookup',key,itemId:item.id};openConfirmDialog(refs?'Ngưng sử dụng lựa chọn?':'Xóa lựa chọn dùng chung?',refs?`“${item.value}” đang được ${refs} bản ghi tham chiếu nên sẽ được chuyển sang trạng thái Ngưng sử dụng, không xóa lịch sử.`:`Lựa chọn “${item.value}” chưa được tham chiếu và sẽ được xóa khỏi danh mục.`);}
function reconcileSurveyCandidateAfterTripDelete(candidateId){const candidate=(DATA.survey_candidates||[]).find(row=>String(row.id)===String(candidateId));if(!candidate)return;const before=structuredClone(candidate),latest=surveyLatestEvaluation(candidate.id),decision=latest&&surveyEvaluationIsComplete(latest)?String(latest.decision||'Chưa quyết định'):'Chưa quyết định';candidate.decision=decision==='Shortlist'?'Ưu tiên cao':decision;candidate.needsRevisit=candidate.decision==='Cần khảo sát lại';candidate.updatedAt=new Date().toISOString();if(JSON.stringify(before)!==JSON.stringify(candidate))queueUpsert('survey_candidates',candidate,before);}
function deleteSurveyTripNow(tripId){const trip=(DATA.survey_trips||[]).find(row=>String(row.id)===String(tripId));if(!trip)return false;const visits=surveyVisitsForTrip(trip.id),visitIds=new Set(visits.map(row=>String(row.id))),candidateIds=new Set(visits.map(row=>String(row.candidate_id||'')).filter(Boolean)),evaluations=(DATA.survey_evaluations||[]).filter(row=>visitIds.has(String(row.visit_id||'')));const evaluationIds=new Set(evaluations.map(row=>String(row.id)));UI.pendingChanges=UI.pendingChanges.filter(change=>!((change.collection==='survey_trips'&&String(change.id)===String(trip.id))||(change.collection==='survey_visits'&&visitIds.has(String(change.id)))||(change.collection==='survey_evaluations'&&evaluationIds.has(String(change.id)))));savePendingChanges();evaluations.forEach(evaluation=>{DATA.survey_evaluations=(DATA.survey_evaluations||[]).filter(row=>row.id!==evaluation.id);queueDelete('survey_evaluations',evaluation.id,evaluation);});visits.forEach(visit=>{DATA.survey_visits=(DATA.survey_visits||[]).filter(row=>row.id!==visit.id);queueDelete('survey_visits',visit.id,visit);});candidateIds.forEach(reconcileSurveyCandidateAfterTripDelete);cleanupLocalRecordLinksForRecord('survey_trips',trip.id);DATA.survey_trips=(DATA.survey_trips||[]).filter(row=>row.id!==trip.id);DATA.attachments=(DATA.attachments||[]).filter(item=>!(item.collection==='survey_trips'&&item.recordId===trip.id));queueDelete('survey_trips',trip.id,trip);saveData();document.getElementById('surveyDialog')?.close();return true;}

function confirmDelete(){
  if(!ensureMutationReady()||!UI.deleting)return;
  if(UI.deleting.type==='lookup'){const {key,itemId}=UI.deleting,item=lookupItemById(itemId);if(!item)return;const refs=referenceCountForLookupItem(item);if(refs){const before=structuredClone(item);item.active=false;item._updatedAt=new Date().toISOString();queueUpsert('lookup_items',item,before);toast('Đã ngưng sử dụng lựa chọn; dữ liệu lịch sử vẫn được giữ nguyên.','success');}else{DATA.lookup_items=DATA.lookup_items.filter(entry=>entry.id!==itemId);queueDelete('lookup_items',itemId,item);toast('Đã xóa lựa chọn chưa được sử dụng.','success');}rebuildLookupCompatibility();saveData();const totalPages=Math.max(1,Math.ceil(lookupItemsForKey(key,{activeOnly:false}).length/CONFIG.lookupPageSize));UI.lookupPages[key]=Math.min(UI.lookupPages[key]||1,totalPages);document.getElementById('confirmDialog').close();UI.deleting=null;renderPage();return;}
  if(UI.deleting.type==='survey-trip'){const tripId=UI.deleting.tripId,deleted=deleteSurveyTripNow(tripId);document.getElementById('confirmDialog').close();UI.deleting=null;if(deleted){toast('Đã xóa kế hoạch, các lần khảo sát và đánh giá liên quan. Địa điểm phù hợp đã trở về Chờ xếp lịch.','success');renderPage();}return;}
  const {collection,id}=UI.deleting,record=(DATA[collection]||[]).find(row=>row.id===id);
  if(collection==='checklist'&&record)syncChecklistBudget({...record,budget_item_id:'',actualCost:0,payableCost:0},record);
  cleanupLocalRecordLinksForRecord(collection,id);DATA[collection]=(DATA[collection]||[]).filter(row=>row.id!==id); DATA.attachments=(DATA.attachments||[]).filter(item=>!(item.collection===collection&&item.recordId===id)); saveData(); queueDelete(collection,id,record); document.getElementById('confirmDialog').close(); UI.deleting=null; toast('Đã xóa bản ghi trên thiết bị. Hệ thống sẽ tự đồng bộ lên Google Sheets trong nền; tệp đính kèm sẽ được dọn khỏi Google Drive sau khi server xác nhận.','success'); renderPage();
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

function bindAttachmentPreviewDialog(){const dialog=document.getElementById('attachmentPreviewDialog');if(!dialog||dialog.dataset.bound)return;dialog.dataset.bound='1';dialog.addEventListener('close',()=>{const frame=document.getElementById('attachmentPreviewFrame');if(frame)frame.removeAttribute('src');});}

function bindPageEvents(){
  bindAttachmentPreviewDialog();
  bindSurveyPageEvents();
  document.getElementById('openFilterDialogButton')?.addEventListener('click',openFilterDialog);
  document.getElementById('clearCollectionFiltersButton')?.addEventListener('click',clearCollectionFilters);
  document.getElementById('addRecordButton')?.addEventListener('click',()=>openEditor(UI.tab));
  document.getElementById('customizeColumnsButton')?.addEventListener('click',openColumnSettings);
  document.getElementById('openSortDialogButton')?.addEventListener('click',openSortDialog);
  document.getElementById('groupBySelect')?.addEventListener('change',event=>setGroupField(UI.tab,event.target.value));
  document.getElementById('referenceShowHiddenButton')?.addEventListener('click',toggleReferenceShowHidden);
  document.getElementById('editDashboardDescription')?.addEventListener('click',openDashboardTextEditor);
  document.getElementById('loadMoreButton')?.addEventListener('click',()=>{UI.visibleCount+=CONFIG.pageSize;renderPage();});
  document.getElementById('clearFiltersButton')?.addEventListener('click',clearCollectionFilters);
  document.querySelectorAll('[data-report]').forEach(button=>button.addEventListener('click',()=>openReport(UI.tab,button.dataset.report)));
  document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>openDetails(UI.tab,button.dataset.detail)));document.querySelectorAll('[data-reference-list-evaluate]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();openSurveyEvaluation(button.dataset.referenceListEvaluate);}));
  document.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>openEditor(UI.tab,button.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',()=>askDelete(UI.tab,button.dataset.delete)));document.querySelectorAll('[data-reference-hide]').forEach(button=>button.addEventListener('click',()=>setReferenceListHidden(button.dataset.referenceHide,button.dataset.hidden!=='true')));
  document.querySelectorAll('[data-record-complete]').forEach(input=>input.addEventListener('change',()=>toggleRecordCompletion(input.dataset.recordCompleteCollection,input.dataset.recordComplete,input.checked)));
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
  document.getElementById('repairSyncQueueButton')?.addEventListener('click',()=>repairSyncQueue({syncAfter:true,announce:true}));
  document.getElementById('discardPendingQueueButton')?.addEventListener('click',discardAllPendingChanges);
  document.querySelectorAll('[data-sync-issue-retry]').forEach(button=>button.addEventListener('click',()=>retrySyncIssue(button.dataset.syncIssueRetry)));
  document.querySelectorAll('[data-sync-issue-discard]').forEach(button=>button.addEventListener('click',()=>discardSyncIssue(button.dataset.syncIssueDiscard)));
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
  const body={...payload,source:'WeddingOS',clientVersion:'12.3.6',sentAt:new Date().toISOString(),requestId:payload.requestId||uid('request'),...(token?{sessionToken:token}:{}),...(!hasPayloadPassword&&attachBootstrapPassword?{password}:{}),...(!hasPayloadSchemaPassword&&schemaPassword?{schemaPassword}:{})};
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
  rejected.forEach(item=>{const change=pendingById.get(String(item.changeId||''));if(change)addSyncIssue(change,item.code||'SYNC_REJECTED',item.message||'Máy chủ từ chối thay đổi.',{serverRecord:item.serverRecord||null});});
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


function syncRequestIsGlobalFailure(error={}){return ['AUTH_REQUIRED','SCHEMA_MISSING','INVALID_SCHEMA_PASSWORD','INVALID_CONNECTION_PASSWORD','POST_REQUIRED','NETWORK_ERROR','REQUEST_TIMEOUT','HTTP_ERROR'].includes(String(error.code||''))||/timeout|network|fetch|máy chủ.*phản hồi/i.test(String(error.message||''));}
async function postSyncBatch(batch,{manifest=null,admin=false}={}){const payload={action:'applyChanges',mode:'delta',protocolVersion:CONFIG.syncProtocolVersion,baseRevision:remoteRevision(),deviceId:deviceId(),changes:structuredClone(batch)};if(admin&&manifest)payload.schema=manifest;return postAppsScript(payload,{admin});}
async function syncPendingBatches({manifest=null,admin=false}={}){const targetIds=new Set((UI.pendingChanges||[]).map(change=>String(change.changeId||''))),summary={applied:0,conflicts:0,rejected:0,batches:0};let guard=0;while(guard++<100){const remaining=(UI.pendingChanges||[]).filter(change=>targetIds.has(String(change.changeId||'')));if(!remaining.length)break;const batch=remaining.slice(0,Math.max(1,Number(CONFIG.syncBatchSize||10)));try{const result=await postSyncBatch(batch,{manifest,admin});summary.batches++;summary.applied+=Number(result.appliedChangeIds?.length||0);summary.conflicts+=Number(result.conflicts?.length||0);summary.rejected+=Number(result.rejected?.length||0);if(admin&&manifest)recordSchemaSync(configuredEndpoint(),result,manifest);absorbSyncV2Result(result);setRemoteRevision(Number(result.revision||remoteRevision()));}catch(error){if(syncRequestIsGlobalFailure(error))throw error;if(batch.length===1){error.syncCollection=batch[0]?.collection||'';addSyncIssue(batch[0],error.code||'SYNC_REQUEST_REJECTED',error.message||'Không thể áp dụng thay đổi này.');UI.pendingChanges=UI.pendingChanges.filter(change=>String(change.changeId||'')!==String(batch[0]?.changeId||''));savePendingChanges();summary.rejected++;continue;}for(const change of batch){try{const result=await postSyncBatch([change],{manifest,admin});summary.batches++;summary.applied+=Number(result.appliedChangeIds?.length||0);summary.conflicts+=Number(result.conflicts?.length||0);summary.rejected+=Number(result.rejected?.length||0);if(admin&&manifest)recordSchemaSync(configuredEndpoint(),result,manifest);absorbSyncV2Result(result);setRemoteRevision(Number(result.revision||remoteRevision()));}catch(singleError){if(syncRequestIsGlobalFailure(singleError))throw singleError;singleError.syncCollection=change.collection;addSyncIssue(change,singleError.code||'SYNC_REQUEST_REJECTED',singleError.message||'Không thể áp dụng thay đổi này.');UI.pendingChanges=UI.pendingChanges.filter(item=>String(item.changeId||'')!==String(change.changeId||''));savePendingChanges();summary.rejected++;}}}}
  return summary;}
async function syncPreview(options={}){
  const automatic=Boolean(options&&options.automatic),knownStatus=options?.knownStatus||null;if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){if(!automatic){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');}return false;}
  UI.syncing=true;UI.syncMode=automatic?'automatic':'manual';UI.autoSyncLastAttemptAt=new Date().toISOString();setManualSyncControlsDisabled(true);setButtonLoading('syncButton',true,automatic?'Tự động đồng bộ':'Đang đồng bộ');
  try{
    const status=knownStatus||await getServerStatus();if(status.requiresAccountLogin&&!activeServerToken(false))throw remoteError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.','AUTH_REQUIRED');
    if(status.initialized===false&&!isAdministrator()&&UI.pendingChanges.length)throw remoteError('Google Sheets chưa có cấu trúc dữ liệu. Hãy đăng nhập quản trị để khởi tạo schema trước khi đồng bộ.','SCHEMA_MISSING');
    const serverRevision=Number(status.revision||0),localRevision=remoteRevision();if(!options?.skipPreflight)preflightPendingChanges();
    if(!UI.pendingChanges.length){if(serverRevision!==localRevision){await loadRemoteSnapshot(false);UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(!automatic)toast('Đã tải thay đổi mới nhất từ Google Sheets.','success');return true;}if(!automatic&&needsSchemaSync(endpoint)&&isAdministrator()){const manifest=buildSchemaManifest(),result=await postAppsScript({action:'registerSchema',reason:'automatic',forceSchema:false,schema:manifest},{admin:true});recordSchemaSync(endpoint,result,manifest);toast('Đã kiểm tra và cập nhật cấu trúc Google Sheets.','success');}else if(!automatic)toast((UI.syncIssues||[]).length?`Không còn thay đổi có thể gửi; ${(UI.syncIssues||[]).length} thay đổi đang ở mục Cần xử lý.`:(UI.conflicts.length?'Không có thay đổi mới để gửi; còn xung đột cần xử lý.':'Không có thay đổi mới cần đồng bộ.'),'info');UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(UI.conflicts.length){notifySyncConflicts(UI.conflicts.length);openNextSyncConflict();}else UI.syncConflictNotificationId='';UI.syncFailureNotificationId='';if(UI.tab==='settings')renderPage();return true;}
    const manifest=buildSchemaManifest(),beforeIssues=(UI.syncIssues||[]).length,beforeConflicts=(UI.conflicts||[]).length,summary=await syncPendingBatches({manifest,admin:isAdministrator()}),resultRevision=remoteRevision(),newIssues=Math.max(0,(UI.syncIssues||[]).length-beforeIssues),newConflicts=Math.max(0,(UI.conflicts||[]).length-beforeConflicts),remoteChangedBefore=serverRevision!==localRevision;
    if(remoteChangedBefore||newIssues||newConflicts){try{await refreshRemoteSnapshotPreservingPending(isAdministrator());}catch(error){console.warn('Không tải lại được thay đổi đồng thời từ thiết bị khác',error);setRemoteRevision(resultRevision);}}
    UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(newConflicts)notifySyncConflicts(newConflicts);else if(!UI.conflicts.length)UI.syncConflictNotificationId='';if(!automatic){const parts=[];if(summary.applied)parts.push(`${summary.applied} thay đổi đã đồng bộ`);if(newIssues)parts.push(`${newIssues} cần xử lý`);if(newConflicts)parts.push(`${newConflicts} xung đột`);toast(parts.length?parts.join(' · '):'Đã đồng bộ dữ liệu an toàn lên Google Sheets.',newIssues||newConflicts?'info':'success');}if(UI.tab==='dashboard'||UI.tab==='settings')renderPage();UI.autoSyncLastError='';UI.syncFailureNotificationId='';return true;
  }catch(error){
    if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';stopAutoSync();enforceLoginGate();}
    const protocolMessage=['INVALID_CHANGE_OPERATION','REVISION_CONFLICT'].includes(error.code)?'Apps Script đang dùng cơ chế đồng bộ cũ hoặc chưa được redeploy. Hãy cập nhật Apps Script từ gói hiện tại; thay đổi cục bộ vẫn được giữ nguyên.':`Không thể đồng bộ Google Sheets: ${error.message}`;
    if(automatic){console.warn('Auto sync failed',error);UI.autoSyncLastError=error.message||'Không thể đồng bộ tự động.';}else{console.error('Delta sync failed',error);toast(protocolMessage,'error');}
    notifySyncFailure(error,protocolMessage);return false;
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

function resetData(){if(!confirm('Đặt lại dữ liệu cục bộ về trạng thái trống? Các thay đổi chưa đồng bộ sẽ bị xóa.'))return;clearSettingsDraft();clearRememberedLogin();lockAuthenticatedShell();DATA=migrateData(INITIAL_DATA);UI.pendingChanges=[];UI.syncIssues=[];UI.conflicts=[];AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=true;secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);secrets.remove(CONFIG.sensitiveSessionKey);secrets.remove(CONFIG.sensitivePendingKey);savePendingChanges();saveSyncIssues();saveSyncConflicts();saveData();storage.remove(CONFIG.fullSyncEndpointKey);storage.remove(CONFIG.lastFullSyncAtKey);storage.remove(CONFIG.schemaEndpointKey);storage.remove(CONFIG.schemaSignatureKey);storage.remove(CONFIG.remoteSchemaHashKey);applyCurrentPreferences();toast('Đã đặt lại dữ liệu cục bộ về trạng thái trống. WeddingOS sẽ ưu tiên dữ liệu Google Sheets khi kết nối.','success');renderNavigation();renderPage();}

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

window.navigate=navigate;window.openProfileDialog=openProfileDialog;window.openColumnSettings=openColumnSettings;window.openEditor=openEditor;window.openNotificationCenter=openNotificationCenter;window.openReport=openReport;window.openDetails=openDetails;window.openBudgetOverrunDetails=openBudgetOverrunDetails;window.setCollectionFilter=setCollectionFilter;window.setMetricFilter=setMetricFilter;window.setGuestFilter=setGuestFilter;window.setSurveyMetricFilter=setSurveyMetricFilter;window.openSurveyTripPlanner=openSurveyTripPlanner;document.addEventListener('DOMContentLoaded',init);

