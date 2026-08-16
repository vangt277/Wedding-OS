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

const INITIAL_DATA = {"checklist":[{"id":"checklist-001","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Chiến lược","task":"Họp hai gia đình lần 1: thống nhất mô hình 4 sự kiện","anchorEvent":"Rước dâu","offsetDays":-330,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-002","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Chiến lược","task":"Chọn 3 khoảng tháng phù hợp trong năm 2027","anchorEvent":"Rước dâu","offsetDays":-325,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-003","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Phong tục","task":"Chỉ định 1 người tư vấn ngày giờ được hai gia đình công nhận","anchorEvent":"Rước dâu","offsetDays":-320,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-004","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Phong tục","task":"Lập danh sách ngày loại trừ do lịch gia đình/công việc","anchorEvent":"Rước dâu","offsetDays":-315,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-005","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Tài chính","task":"Thống nhất nguyên tắc phân chia chi phí giữa hai bên","anchorEvent":"Rước dâu","offsetDays":-310,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-006","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Tài chính","task":"Mở file/tài khoản theo dõi chi phí riêng","anchorEvent":"Rước dâu","offsetDays":-305,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-007","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Nhân sự","task":"Chỉ định đầu mối nhà trai","anchorEvent":"Rước dâu","offsetDays":-300,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-008","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Nhân sự","task":"Chỉ định đầu mối nhà gái","anchorEvent":"Rước dâu","offsetDays":-300,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-009","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Khách mời","task":"Lập danh sách khách sơ bộ nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-295,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-010","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Khách mời","task":"Lập danh sách khách sơ bộ nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-295,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-011","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Khách mời","task":"Phân nhóm A chắc chắn/B có khả năng/C chưa chắc","anchorEvent":"Rước dâu","offsetDays":-290,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-012","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Ngân sách","task":"Tính mức trần số bàn tại mỗi địa phương","anchorEvent":"Rước dâu","offsetDays":-285,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-013","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Lập tiêu chí chọn nhà hàng TP.HCM","anchorEvent":"Tiệc nhà gái","offsetDays":-280,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-014","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Lập tiêu chí chọn nhà hàng Lộc Ninh","anchorEvent":"Tiệc nhà trai","offsetDays":-280,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-015","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Khảo sát tối thiểu 3 nhà hàng tại TP.HCM","anchorEvent":"Tiệc nhà gái","offsetDays":-270,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-016","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Khảo sát tối thiểu 3 nhà hàng tại Lộc Ninh/khu vực lân cận","anchorEvent":"Tiệc nhà trai","offsetDays":-270,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-017","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"So sánh phí menu, đồ uống, VAT, phục vụ, trang trí và bàn dự phòng","anchorEvent":"Rước dâu","offsetDays":-260,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-018","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Ngày cưới","task":"Chốt ngày ăn hỏi","anchorEvent":"Ăn hỏi","offsetDays":-250,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-019","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Ngày cưới","task":"Chốt ngày rước dâu","anchorEvent":"Rước dâu","offsetDays":-250,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-020","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Ngày cưới","task":"Chốt ngày tiệc nhà trai và nhà gái","anchorEvent":"Rước dâu","offsetDays":-245,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-021","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Giữ chỗ và ký hợp đồng nhà hàng nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-240,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":10000000,"actualCost":0,"variance":10000000,"notes":""},{"id":"checklist-022","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Địa điểm","task":"Giữ chỗ và ký hợp đồng nhà hàng nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-240,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":15000000,"actualCost":0,"variance":15000000,"notes":""},{"id":"checklist-023","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Điều phối","task":"Khảo sát planner bán phần/điều phối ngày cưới","anchorEvent":"Rước dâu","offsetDays":-235,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-024","phase":"TRƯỚC","milestone":"T-12 đến T-10 tháng","group":"Điều phối","task":"Ký hợp đồng điều phối 3 ngày chính","anchorEvent":"Rước dâu","offsetDays":-225,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":5000000,"actualCost":0,"variance":5000000,"notes":""},{"id":"checklist-025","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Concept","task":"Chốt concept “Từ hai nơi, về một nhà” hoặc câu chuyện thay thế","anchorEvent":"Rước dâu","offsetDays":-210,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-026","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Concept","task":"Chốt bảng màu burgundy – champagne – vàng đồng","anchorEvent":"Rước dâu","offsetDays":-205,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-027","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang trí","task":"Khảo sát 2–3 đơn vị trang trí","anchorEvent":"Rước dâu","offsetDays":-200,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-028","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang trí","task":"Chốt phạm vi trang trí nhà gái và bàn thờ gia tiên","anchorEvent":"Ăn hỏi","offsetDays":-195,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-029","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang trí","task":"Chốt phạm vi trang trí nhà trai và bàn thờ gia tiên","anchorEvent":"Rước dâu","offsetDays":-195,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-030","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang trí","task":"Chốt check-in, sân khấu, gallery và lối đi cho hai tiệc","anchorEvent":"Rước dâu","offsetDays":-190,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-031","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang trí","task":"Yêu cầu phối cảnh và danh sách hoa tươi/hoa lụa","anchorEvent":"Rước dâu","offsetDays":-185,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-032","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Hình ảnh","task":"Khảo sát studio ảnh cưới","anchorEvent":"Rước dâu","offsetDays":-210,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-033","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Hình ảnh","task":"Chọn phong cách ảnh cưới tối giản, sang trọng","anchorEvent":"Rước dâu","offsetDays":-205,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-034","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Hình ảnh","task":"Ký hợp đồng pre-wedding và phóng sự ngày cưới","anchorEvent":"Rước dâu","offsetDays":-195,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":8000000,"actualCost":0,"variance":8000000,"notes":""},{"id":"checklist-035","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang phục","task":"Thử dáng váy cưới","anchorEvent":"Tiệc nhà gái","offsetDays":-200,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-036","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang phục","task":"Chốt phương án áo dài ăn hỏi/gia tiên","anchorEvent":"Ăn hỏi","offsetDays":-190,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-037","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang phục","task":"Chọn suit chú rể và áo dài nam","anchorEvent":"Rước dâu","offsetDays":-185,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Chú rể","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-038","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Trang sức","task":"Khảo sát nhẫn cưới và lập mức trần","anchorEvent":"Rước dâu","offsetDays":-180,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-039","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Lưu trú","task":"Lập danh sách khách cần phòng nghỉ","anchorEvent":"Rước dâu","offsetDays":-175,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-040","phase":"TRƯỚC","milestone":"T-9 đến T-7 tháng","group":"Di chuyển","task":"Ước tính số xe đoàn rước dâu","anchorEvent":"Rước dâu","offsetDays":-170,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-041","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Ảnh cưới","task":"Chốt địa điểm studio và ngoại cảnh gần TP.HCM","anchorEvent":"Rước dâu","offsetDays":-165,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-042","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Ảnh cưới","task":"Chụp pre-wedding","anchorEvent":"Rước dâu","offsetDays":-155,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-043","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Ảnh cưới","task":"Chọn ảnh album, ảnh cổng và ảnh trình chiếu","anchorEvent":"Rước dâu","offsetDays":-145,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-044","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Họp hai gia đình thống nhất số mâm quả","anchorEvent":"Ăn hỏi","offsetDays":-160,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-045","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Chốt danh mục từng mâm và bên chuẩn bị","anchorEvent":"Ăn hỏi","offsetDays":-155,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-046","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Chốt nạp tài/lễ dẫn cưới và cách trao","anchorEvent":"Ăn hỏi","offsetDays":-150,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-047","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Chốt trang sức trao trong lễ","anchorEvent":"Ăn hỏi","offsetDays":-145,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-048","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Chốt số người bê tráp hai bên","anchorEvent":"Ăn hỏi","offsetDays":-140,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-049","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Phong tục","task":"Chốt quy tắc hoàn lễ/lại quả","anchorEvent":"Ăn hỏi","offsetDays":-135,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-050","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Trang phục","task":"Chọn trang phục bố mẹ hai bên","anchorEvent":"Rước dâu","offsetDays":-150,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-051","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Trang phục","task":"Chọn áo đội bê tráp/phù dâu phù rể","anchorEvent":"Ăn hỏi","offsetDays":-140,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-052","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Trang sức","task":"Đặt hoặc mua nhẫn cưới","anchorEvent":"Rước dâu","offsetDays":-130,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":10000000,"actualCost":0,"variance":10000000,"notes":""},{"id":"checklist-053","phase":"TRƯỚC","milestone":"T-6 đến T-5 tháng","group":"Pháp lý","task":"Kiểm tra giấy tờ đăng ký kết hôn","anchorEvent":"Đăng ký kết hôn","offsetDays":-45,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-054","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thực đơn","task":"Thử món nhà hàng nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-110,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-055","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thực đơn","task":"Thử món nhà hàng nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-110,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-056","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thực đơn","task":"Chốt cấu trúc menu 7 món và đồ uống","anchorEvent":"Rước dâu","offsetDays":-100,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-057","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thực đơn","task":"Chốt phương án suất chay","anchorEvent":"Rước dâu","offsetDays":-95,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà hàng","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-058","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Bánh/Tráng miệng","task":"Chốt bánh mô hình + bánh thật nhỏ hoặc tháp bánh nhỏ","anchorEvent":"Tiệc nhà gái","offsetDays":-90,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Thấp","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-059","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"MC/Kịch bản","task":"Chọn MC cho tiệc nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-90,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Chú rể","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-060","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"MC/Kịch bản","task":"Chọn MC cho tiệc nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-90,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-061","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Âm nhạc","task":"Lập danh sách nhạc nghi thức và nhạc nền","anchorEvent":"Tiệc nhà gái","offsetDays":-85,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-062","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Video","task":"Chốt nội dung video/slideshow pre-wedding","anchorEvent":"Tiệc nhà gái","offsetDays":-80,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-063","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Phát biểu","task":"Chọn người đại diện phát biểu nhà trai","anchorEvent":"Ăn hỏi","offsetDays":-80,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-064","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Phát biểu","task":"Chọn người đại diện phát biểu nhà gái","anchorEvent":"Ăn hỏi","offsetDays":-80,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-065","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thiệp","task":"Chọn mẫu thiệp giấy bán thiết kế","anchorEvent":"Tiệc nhà gái","offsetDays":-85,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-066","phase":"TRƯỚC","milestone":"T-4 đến T-3 tháng","group":"Thiệp","task":"Thiết kế thiệp điện tử đồng bộ màu sắc","anchorEvent":"Tiệc nhà gái","offsetDays":-80,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-067","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Khách mời","task":"Chốt danh sách mời vòng 1","anchorEvent":"Rước dâu","offsetDays":-56,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-068","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Thiệp","task":"Kiểm tra chính tả tên bố mẹ, địa chỉ, giờ tiệc","anchorEvent":"Tiệc nhà gái","offsetDays":-52,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-069","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Thiệp","task":"In thiệp giấy, dư 10%","anchorEvent":"Tiệc nhà gái","offsetDays":-49,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-070","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Thiệp","task":"Gửi save-the-date cho khách ở xa","anchorEvent":"Tiệc nhà gái","offsetDays":-49,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-071","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Trang phục","task":"Chốt áo dài ăn hỏi/gia tiên","anchorEvent":"Ăn hỏi","offsetDays":-49,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-072","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Trang phục","task":"Chốt váy làm lễ","anchorEvent":"Tiệc nhà gái","offsetDays":-49,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-073","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Trang phục","task":"Chốt váy đi bàn","anchorEvent":"Tiệc nhà gái","offsetDays":-45,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-074","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Trang phục","task":"Chốt suit và áo dài chú rể","anchorEvent":"Rước dâu","offsetDays":-45,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-075","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Làm đẹp","task":"Đặt lịch makeup cho từng sự kiện","anchorEvent":"Rước dâu","offsetDays":-45,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-076","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Lưu trú","task":"Giữ phòng cho khách/ê-kíp cần lưu trú","anchorEvent":"Rước dâu","offsetDays":-45,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-077","phase":"TRƯỚC","milestone":"T-8 đến T-6 tuần","group":"Di chuyển","task":"Giữ xe đoàn rước dâu","anchorEvent":"Rước dâu","offsetDays":-45,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":3000000,"actualCost":0,"variance":3000000,"notes":""},{"id":"checklist-078","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Làm đẹp","task":"Thử makeup dưới ánh sáng tự nhiên và ánh sáng vàng","anchorEvent":"Tiệc nhà gái","offsetDays":-35,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-079","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Trang phục","task":"Thử toàn bộ váy cùng giày và phụ kiện","anchorEvent":"Tiệc nhà gái","offsetDays":-32,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-080","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Trang phục","task":"Thử suit chú rể và kiểm tra chiều dài quần/tay áo","anchorEvent":"Rước dâu","offsetDays":-32,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-081","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Hoa cưới","task":"Chốt hoa cầm tay và hoa cài áo","anchorEvent":"Rước dâu","offsetDays":-30,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-082","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Âm nhạc","task":"Chốt bài bước vào lễ đường và nhạc nghi thức","anchorEvent":"Tiệc nhà gái","offsetDays":-28,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-083","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Phát biểu","task":"Soạn lời phát biểu đại diện hai bên","anchorEvent":"Ăn hỏi","offsetDays":-28,"startDate":"","dueDate":"","location":"Online","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-084","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Phát biểu","task":"Soạn lời cảm ơn cô dâu chú rể","anchorEvent":"Tiệc nhà gái","offsetDays":-25,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-085","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Hình ảnh","task":"Lập danh sách ảnh bắt buộc với gia đình","anchorEvent":"Rước dâu","offsetDays":-25,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-086","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Video","task":"Duyệt video/slideshow và lưu 2 USB","anchorEvent":"Tiệc nhà gái","offsetDays":-21,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-087","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Trang trí","task":"Duyệt phối cảnh cuối cùng của 4 địa điểm","anchorEvent":"Rước dâu","offsetDays":-21,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-088","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Thiệp","task":"Phát thiệp giấy cho người lớn tuổi/họ hàng","anchorEvent":"Tiệc nhà gái","offsetDays":-28,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-089","phase":"TRƯỚC","milestone":"T-5 đến T-3 tuần","group":"Thiệp","task":"Gửi thiệp điện tử cho bạn bè/đồng nghiệp","anchorEvent":"Tiệc nhà gái","offsetDays":-21,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-090","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"RSVP","task":"Gọi xác nhận khách quan trọng nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-14,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-091","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"RSVP","task":"Gọi xác nhận khách quan trọng nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-14,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-092","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Khách mời","task":"Chốt số bàn cam kết nhà trai","anchorEvent":"Tiệc nhà trai","offsetDays":-10,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-093","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Khách mời","task":"Chốt số bàn cam kết nhà gái","anchorEvent":"Tiệc nhà gái","offsetDays":-10,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-094","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Khách mời","task":"Phân bàn và đánh dấu người lớn tuổi/trẻ em","anchorEvent":"Tiệc nhà gái","offsetDays":-9,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-095","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Khách mời","task":"Chốt suất chay và dị ứng thực phẩm","anchorEvent":"Rước dâu","offsetDays":-9,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà hàng","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-096","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Di chuyển","task":"Khảo sát tuyến Lộc Ninh – TP.HCM đúng khung giờ","anchorEvent":"Rước dâu","offsetDays":-14,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-097","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Di chuyển","task":"Chốt điểm đón, số xe, tài xế và người quản lý xe","anchorEvent":"Rước dâu","offsetDays":-10,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-098","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Lưu trú","task":"Chốt danh sách phòng và người ở từng phòng","anchorEvent":"Rước dâu","offsetDays":-10,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà trai","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-099","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Nhà cung cấp","task":"Tổ chức họp điều phối chung","anchorEvent":"Rước dâu","offsetDays":-10,"startDate":"","dueDate":"","location":"Online","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-100","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Nhà cung cấp","task":"Gửi timeline cho nhà hàng, makeup, ảnh/video, xe, trang trí","anchorEvent":"Rước dâu","offsetDays":-9,"startDate":"","dueDate":"","location":"Online","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-101","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Nhà cung cấp","task":"Chốt giờ nhà cung cấp vào lắp đặt","anchorEvent":"Rước dâu","offsetDays":-8,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-102","phase":"TRƯỚC","milestone":"T-14 đến T-8 ngày","group":"Pháp lý","task":"Hoàn tất đăng ký kết hôn","anchorEvent":"Đăng ký kết hôn","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-103","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Thời tiết","task":"Kiểm tra thời tiết và phương án mưa","anchorEvent":"Rước dâu","offsetDays":-7,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-104","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Mâm quả","task":"Kiểm tra mâm quả, lễ phẩm, hoàn lễ","anchorEvent":"Ăn hỏi","offsetDays":-3,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-105","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Tài chính","task":"Chia tiền lì xì 200.000đ/người và ghi mã phong bì","anchorEvent":"Ăn hỏi","offsetDays":-3,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-106","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Trang sức","task":"Kiểm tra nhẫn, trang sức, hộp nhẫn","anchorEvent":"Rước dâu","offsetDays":-3,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-107","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Trang phục","task":"Nhận và kiểm tra váy, suit, áo dài","anchorEvent":"Rước dâu","offsetDays":-3,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-108","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Khẩn cấp","task":"Chuẩn bị kit: kim chỉ, băng dính thời trang, khăn giấy, sạc","anchorEvent":"Rước dâu","offsetDays":-3,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-109","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"In ấn","task":"In 3 bản timeline, danh sách bàn, liên hệ nhà cung cấp","anchorEvent":"Rước dâu","offsetDays":-3,"startDate":"","dueDate":"","location":"Online","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-110","phase":"TRƯỚC","milestone":"T-7 đến T-3 ngày","group":"Bàn giao","task":"Bàn giao mọi đầu việc vận hành cho điều phối","anchorEvent":"Rước dâu","offsetDays":-2,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-111","phase":"TRƯỚC","milestone":"T-2","group":"Công nghệ","task":"Sạc điện thoại, pin dự phòng; kiểm tra 2 USB nhạc/video","anchorEvent":"Rước dâu","offsetDays":-2,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-112","phase":"TRƯỚC","milestone":"T-2","group":"Tài chính","task":"Chốt người giữ tiền mừng và người đối soát","anchorEvent":"Tiệc nhà gái","offsetDays":-2,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-113","phase":"TRƯỚC","milestone":"T-2","group":"Nghi thức","task":"Chốt người cầm nhẫn, lễ phẩm và gọi người chụp ảnh","anchorEvent":"Rước dâu","offsetDays":-2,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-114","phase":"TRƯỚC","milestone":"T-1","group":"Sức khỏe","task":"Ngủ sớm, không thử mỹ phẩm mới, không đổi tóc","anchorEvent":"Rước dâu","offsetDays":-1,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-115","phase":"TRƯỚC","milestone":"T-1","group":"Timeline","task":"Rà soát timeline 15 phút, không thay đổi lớn","anchorEvent":"Rước dâu","offsetDays":-1,"startDate":"","dueDate":"","location":"Online","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-116","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Trang trí","task":"Nghiệm thu cổng, bàn thờ gia tiên, bàn tiếp khách","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-117","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Nghi thức","task":"Điểm danh đội bê tráp và hướng dẫn thứ tự","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-118","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Nghi thức","task":"Kiểm tra mâm quả và người giữ nạp tài/trang sức","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-119","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Nghi thức","task":"Điều phối chào hỏi, trao lễ vật, phát biểu, gia tiên","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-120","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Hình ảnh","task":"Gọi đúng nhóm người vào danh sách ảnh bắt buộc","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-121","phase":"TRONG","milestone":"Ngày ăn hỏi","group":"Hoàn lễ","task":"Kiểm kê và thực hiện lại quả đúng thỏa thuận","anchorEvent":"Ăn hỏi","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-122","phase":"TRONG","milestone":"Ngày rước dâu","group":"Di chuyển","task":"Điểm danh đoàn, kiểm tra xe, hành lý, lễ phẩm","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-123","phase":"TRONG","milestone":"Ngày rước dâu","group":"Di chuyển","task":"Xuất phát có dự phòng 60–90 phút","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Chú rể","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-124","phase":"TRONG","milestone":"Ngày rước dâu","group":"Nghi thức","task":"Thông báo nhà gái trước khi đoàn vào","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-125","phase":"TRONG","milestone":"Ngày rước dâu","group":"Nghi thức","task":"Điều phối phát biểu, gia tiên, trao nhẫn/trang sức","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-126","phase":"TRONG","milestone":"Ngày rước dâu","group":"Hình ảnh","task":"Chụp đủ ảnh gia đình trước khi xuất phát","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-127","phase":"TRONG","milestone":"Ngày rước dâu","group":"Di chuyển","task":"Kiểm tra hành lý cô dâu và số người trên từng xe","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-128","phase":"TRONG","milestone":"Ngày rước dâu","group":"Gia tiên","task":"Thực hiện lễ gia tiên tại nhà trai","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-129","phase":"TRONG","milestone":"Tiệc nhà trai","group":"Nghiệm thu","task":"Kiểm tra sân khấu, âm thanh, menu, bàn dự phòng","anchorEvent":"Tiệc nhà trai","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-130","phase":"TRONG","milestone":"Tiệc nhà trai","group":"Đón khách","task":"Bố trí lễ tân, sơ đồ bàn và người hướng dẫn người lớn tuổi","anchorEvent":"Tiệc nhà trai","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-131","phase":"TRONG","milestone":"Tiệc nhà trai","group":"Nghi thức","task":"Khai tiệc đúng giờ, nghi thức không quá 15 phút","anchorEvent":"Tiệc nhà trai","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"MC","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-132","phase":"TRONG","milestone":"Tiệc nhà trai","group":"Phục vụ","task":"Theo dõi tốc độ lên món và bổ sung đồ uống","anchorEvent":"Tiệc nhà trai","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà hàng","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-133","phase":"TRONG","milestone":"Tiệc nhà trai","group":"Tài chính","task":"Niêm phong tiền mừng, có 2 người bàn giao","anchorEvent":"Tiệc nhà trai","offsetDays":0,"startDate":"","dueDate":"","location":"Lộc Ninh","owner":"Nhà trai","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-134","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Nghiệm thu","task":"Kiểm tra check-in, sân khấu, màn hình, âm thanh","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-135","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Tổng duyệt","task":"Tổng duyệt bước vào, trao nhẫn, cắt bánh/cảm ơn bố mẹ","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-136","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Đón khách","task":"Bố trí lễ tân, sơ đồ bàn, bàn chay và bàn VIP","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-137","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Nghi thức","task":"Khai tiệc đúng giờ, không ép khách tham gia trò chơi","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"MC","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-138","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Hình ảnh","task":"Chụp gia đình trước khi khách đông và khi tiễn khách","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-139","phase":"TRONG","milestone":"Tiệc nhà gái","group":"Tài chính","task":"Niêm phong tiền mừng, có biên bản bàn giao","anchorEvent":"Tiệc nhà gái","offsetDays":0,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-140","phase":"TRONG","milestone":"Cuối mỗi sự kiện","group":"Tài sản","task":"Thu nhẫn, trang sức, giấy tờ, điện thoại, quà và vật dụng","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Planner/Điều phối","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-141","phase":"TRONG","milestone":"Cuối mỗi sự kiện","group":"Đối soát","task":"Xác nhận số bàn thực tế và phát sinh bằng văn bản","anchorEvent":"Rước dâu","offsetDays":0,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-142","phase":"SAU","milestone":"T+1 ngày","group":"Tài chính","task":"Kiểm kê tiền mừng với 2 người chứng kiến","anchorEvent":"Tiệc nhà gái","offsetDays":1,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Nhà gái","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-143","phase":"SAU","milestone":"T+1 ngày","group":"Đối soát","task":"Đối soát hóa đơn nhà hàng và bàn phát sinh","anchorEvent":"Tiệc nhà gái","offsetDays":1,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-144","phase":"SAU","milestone":"T+1 ngày","group":"Trang phục","task":"Trả váy, suit và phụ kiện đúng hạn","anchorEvent":"Tiệc nhà gái","offsetDays":1,"startDate":"","dueDate":"","location":"TP.HCM","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-145","phase":"SAU","milestone":"T+1 ngày","group":"Tài sản","task":"Kiểm tra đồ thất lạc và vật dụng thuê","anchorEvent":"Tiệc nhà gái","offsetDays":1,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Planner/Điều phối","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-146","phase":"SAU","milestone":"T+1 ngày","group":"Cảm ơn","task":"Gửi lời cảm ơn nhóm hỗ trợ chính","anchorEvent":"Tiệc nhà gái","offsetDays":1,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-147","phase":"SAU","milestone":"T+3 đến T+7","group":"Cảm ơn","task":"Gửi tin cảm ơn khách mời","anchorEvent":"Tiệc nhà gái","offsetDays":3,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-148","phase":"SAU","milestone":"T+3 đến T+7","group":"Nhà cung cấp","task":"Thanh toán phần còn lại theo hợp đồng","anchorEvent":"Tiệc nhà gái","offsetDays":5,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-149","phase":"SAU","milestone":"T+3 đến T+7","group":"Ảnh nhanh","task":"Nhận và gửi ảnh preview cho bố mẹ","anchorEvent":"Tiệc nhà gái","offsetDays":7,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-150","phase":"SAU","milestone":"T+3 đến T+7","group":"Ngân sách","task":"Đóng bảng chi phí tạm thời","anchorEvent":"Tiệc nhà gái","offsetDays":7,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-151","phase":"SAU","milestone":"T+30 đến T+60","group":"Album","task":"Duyệt album và yêu cầu sửa tên/ngày nếu sai","anchorEvent":"Tiệc nhà gái","offsetDays":30,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-152","phase":"SAU","milestone":"T+30 đến T+60","group":"Video","task":"Duyệt video, lưu file chất lượng cao ở 2 nơi","anchorEvent":"Tiệc nhà gái","offsetDays":45,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-153","phase":"SAU","milestone":"T+30 đến T+60","group":"Ngân sách","task":"Tổng kết ngân sách và quỹ dự phòng còn lại","anchorEvent":"Tiệc nhà gái","offsetDays":60,"startDate":"","dueDate":"","location":"Online","owner":"Cô dâu","priority":"Cao","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-154","phase":"SAU","milestone":"T+30 đến T+60","group":"Gia đình","task":"Tổ chức bữa cơm cảm ơn hai gia đình","anchorEvent":"Tiệc nhà gái","offsetDays":30,"startDate":"","dueDate":"","location":"Cả hai nơi","owner":"Cô dâu","priority":"Thấp","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":""},{"id":"checklist-155","phase":"SAU","milestone":"T+3 đến T+7","group":"Tuần trăng mật","task":"Khởi hành sau cưới 3–7 ngày nếu lịch phù hợp","anchorEvent":"Tiệc nhà gái","offsetDays":4,"startDate":"","dueDate":"","location":"Di chuyển","owner":"Cô dâu","priority":"Trung bình","status":"Chưa bắt đầu","budgetEstimate":0,"actualCost":0,"variance":0,"notes":"Ngân sách riêng 30 triệu/2 người"}],"timeline":[{"event":"Đăng ký kết hôn","startTime":"09:00","durationMinutes":60,"endTime":"10:00","description":"Nộp hồ sơ, kiểm tra thông tin, nhận giấy hẹn/giấy chứng nhận","location":"Cơ quan hộ tịch","owner":"Cô dâu","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-001"},{"event":"Lễ ăn hỏi","startTime":"06:30","durationMinutes":90,"endTime":"08:00","description":"Trang trí, kiểm tra bàn thờ, trà nước và khu đón khách","location":"Nhà gái TP.HCM","owner":"Planner/Điều phối","vendor":"Trang trí","status":"Chưa bắt đầu","notes":"","id":"timeline-002"},{"event":"Lễ ăn hỏi","startTime":"08:00","durationMinutes":45,"endTime":"08:45","description":"Makeup, thay áo dài, kiểm tra mâm quả","location":"Nhà gái TP.HCM","owner":"Cô dâu","vendor":"Makeup/Mâm quả","status":"Chưa bắt đầu","notes":"","id":"timeline-003"},{"event":"Lễ ăn hỏi","startTime":"08:45","durationMinutes":30,"endTime":"09:15","description":"Đội bê tráp có mặt, nghe hướng dẫn, sắp thứ tự","location":"Nhà gái TP.HCM","owner":"Planner/Điều phối","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-004"},{"event":"Lễ ăn hỏi","startTime":"09:15","durationMinutes":15,"endTime":"09:30","description":"Đoàn nhà trai tập trung ngoài nhà gái","location":"TP.HCM","owner":"Nhà trai","vendor":"Xe","status":"Chưa bắt đầu","notes":"","id":"timeline-005"},{"event":"Lễ ăn hỏi","startTime":"09:30","durationMinutes":15,"endTime":"09:45","description":"Chào hỏi và trao mâm quả","location":"Nhà gái TP.HCM","owner":"Đại diện hai bên","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-006"},{"event":"Lễ ăn hỏi","startTime":"09:45","durationMinutes":15,"endTime":"10:00","description":"Đại diện hai gia đình phát biểu","location":"Nhà gái TP.HCM","owner":"MC gia đình","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-007"},{"event":"Lễ ăn hỏi","startTime":"10:00","durationMinutes":30,"endTime":"10:30","description":"Cô dâu ra mắt, mở lễ phẩm, lễ gia tiên","location":"Nhà gái TP.HCM","owner":"Planner/Điều phối","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-008"},{"event":"Lễ ăn hỏi","startTime":"10:30","durationMinutes":20,"endTime":"10:50","description":"Trao trang sức, nạp tài và chụp ảnh","location":"Nhà gái TP.HCM","owner":"Hai gia đình","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-009"},{"event":"Lễ ăn hỏi","startTime":"10:50","durationMinutes":80,"endTime":"12:10","description":"Tiệc nhẹ/dùng bữa, hoàn lễ và kết thúc","location":"Nhà gái TP.HCM","owner":"Nhà gái","vendor":"Ẩm thực","status":"Chưa bắt đầu","notes":"","id":"timeline-010"},{"event":"Rước dâu","startTime":"04:30","durationMinutes":30,"endTime":"05:00","description":"Tập trung đoàn, điểm danh, kiểm tra lễ phẩm và hành lý","location":"Lộc Ninh","owner":"Planner/Điều phối","vendor":"Xe","status":"Chưa bắt đầu","notes":"","id":"timeline-011"},{"event":"Rước dâu","startTime":"05:00","durationMinutes":240,"endTime":"09:00","description":"Di chuyển Lộc Ninh → TP.HCM, có điểm dừng dự phòng","location":"Di chuyển","owner":"Chú rể","vendor":"Xe","status":"Chưa bắt đầu","notes":"","id":"timeline-012"},{"event":"Rước dâu","startTime":"09:00","durationMinutes":30,"endTime":"09:30","description":"Đến điểm chờ gần nhà gái, chỉnh trang phục","location":"TP.HCM","owner":"Planner/Điều phối","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-013"},{"event":"Rước dâu","startTime":"09:30","durationMinutes":20,"endTime":"09:50","description":"Đoàn vào nhà, đại diện hai bên phát biểu","location":"Nhà gái TP.HCM","owner":"Đại diện hai bên","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-014"},{"event":"Rước dâu","startTime":"09:50","durationMinutes":40,"endTime":"10:30","description":"Lễ gia tiên, trao nhẫn/trang sức, cô dâu chào gia đình","location":"Nhà gái TP.HCM","owner":"Planner/Điều phối","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-015"},{"event":"Rước dâu","startTime":"10:30","durationMinutes":30,"endTime":"11:00","description":"Chụp ảnh bắt buộc và kiểm tra hành lý","location":"Nhà gái TP.HCM","owner":"Nhà gái","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-016"},{"event":"Rước dâu","startTime":"11:00","durationMinutes":270,"endTime":"15:30","description":"Đưa dâu về Lộc Ninh, nghỉ dọc đường nếu cần","location":"Di chuyển","owner":"Chú rể","vendor":"Xe","status":"Chưa bắt đầu","notes":"","id":"timeline-017"},{"event":"Rước dâu","startTime":"15:30","durationMinutes":45,"endTime":"16:15","description":"Lễ gia tiên nhà trai, chụp ảnh gia đình","location":"Nhà trai Lộc Ninh","owner":"Nhà trai","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-018"},{"event":"Rước dâu","startTime":"16:15","durationMinutes":120,"endTime":"18:15","description":"Cô dâu nghỉ, ăn nhẹ, thay trang phục","location":"Lộc Ninh","owner":"Cô dâu","vendor":"","status":"Chưa bắt đầu","notes":"","id":"timeline-019"},{"event":"Tiệc nhà trai","startTime":"06:30","durationMinutes":120,"endTime":"08:30","description":"Trang trí và nhà cung cấp vào sảnh","location":"Nhà hàng Lộc Ninh","owner":"Planner/Điều phối","vendor":"Trang trí","status":"Chưa bắt đầu","notes":"","id":"timeline-020"},{"event":"Tiệc nhà trai","startTime":"08:30","durationMinutes":30,"endTime":"09:00","description":"Kiểm tra sân khấu, âm thanh, bàn tiệc","location":"Nhà hàng Lộc Ninh","owner":"Planner/Điều phối","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-021"},{"event":"Tiệc nhà trai","startTime":"09:30","durationMinutes":30,"endTime":"10:00","description":"Chụp ảnh không gian và gia đình","location":"Nhà hàng Lộc Ninh","owner":"Nhà trai","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-022"},{"event":"Tiệc nhà trai","startTime":"10:00","durationMinutes":80,"endTime":"11:20","description":"Đón khách, hướng dẫn chỗ ngồi","location":"Nhà hàng Lộc Ninh","owner":"Nhà trai","vendor":"Lễ tân","status":"Chưa bắt đầu","notes":"","id":"timeline-023"},{"event":"Tiệc nhà trai","startTime":"11:20","durationMinutes":10,"endTime":"11:30","description":"Mời khách ổn định chỗ ngồi","location":"Nhà hàng Lộc Ninh","owner":"MC","vendor":"Âm thanh","status":"Chưa bắt đầu","notes":"","id":"timeline-024"},{"event":"Tiệc nhà trai","startTime":"11:30","durationMinutes":15,"endTime":"11:45","description":"Nghi thức khai tiệc","location":"Nhà hàng Lộc Ninh","owner":"MC","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-025"},{"event":"Tiệc nhà trai","startTime":"11:45","durationMinutes":90,"endTime":"13:15","description":"Phục vụ món, cô dâu chú rể đi bàn","location":"Nhà hàng Lộc Ninh","owner":"Nhà hàng","vendor":"Ẩm thực","status":"Chưa bắt đầu","notes":"","id":"timeline-026"},{"event":"Tiệc nhà trai","startTime":"13:15","durationMinutes":45,"endTime":"14:00","description":"Tiễn khách, niêm phong tiền mừng, đối soát","location":"Nhà hàng Lộc Ninh","owner":"Nhà trai","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-027"},{"event":"Tiệc nhà gái","startTime":"13:30","durationMinutes":120,"endTime":"15:30","description":"Trang trí ngoài vào lắp đặt","location":"Nhà hàng TP.HCM","owner":"Planner/Điều phối","vendor":"Trang trí","status":"Chưa bắt đầu","notes":"","id":"timeline-028"},{"event":"Tiệc nhà gái","startTime":"15:30","durationMinutes":30,"endTime":"16:00","description":"Kiểm tra sảnh, màn hình, âm thanh, video","location":"Nhà hàng TP.HCM","owner":"Planner/Điều phối","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-029"},{"event":"Tiệc nhà gái","startTime":"16:00","durationMinutes":30,"endTime":"16:30","description":"Makeup hoàn thiện và thay váy","location":"Nhà hàng TP.HCM","owner":"Cô dâu","vendor":"Makeup","status":"Chưa bắt đầu","notes":"","id":"timeline-030"},{"event":"Tiệc nhà gái","startTime":"16:30","durationMinutes":30,"endTime":"17:00","description":"Tổng duyệt nghi thức","location":"Nhà hàng TP.HCM","owner":"Planner/Điều phối","vendor":"MC/Âm thanh","status":"Chưa bắt đầu","notes":"","id":"timeline-031"},{"event":"Tiệc nhà gái","startTime":"17:00","durationMinutes":30,"endTime":"17:30","description":"Chụp ảnh không gian và gia đình","location":"Nhà hàng TP.HCM","owner":"Nhà gái","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-032"},{"event":"Tiệc nhà gái","startTime":"17:30","durationMinutes":50,"endTime":"18:20","description":"Đón khách","location":"Nhà hàng TP.HCM","owner":"Nhà gái","vendor":"Lễ tân","status":"Chưa bắt đầu","notes":"","id":"timeline-033"},{"event":"Tiệc nhà gái","startTime":"18:20","durationMinutes":10,"endTime":"18:30","description":"Mời khách vào bàn","location":"Nhà hàng TP.HCM","owner":"MC","vendor":"Âm thanh","status":"Chưa bắt đầu","notes":"","id":"timeline-034"},{"event":"Tiệc nhà gái","startTime":"18:30","durationMinutes":15,"endTime":"18:45","description":"Nghi thức: bước vào, phát biểu, trao nhẫn, cảm ơn bố mẹ","location":"Nhà hàng TP.HCM","owner":"MC","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-035"},{"event":"Tiệc nhà gái","startTime":"18:45","durationMinutes":90,"endTime":"20:15","description":"Khai tiệc, phục vụ món, đi bàn","location":"Nhà hàng TP.HCM","owner":"Nhà hàng","vendor":"Ẩm thực","status":"Chưa bắt đầu","notes":"","id":"timeline-036"},{"event":"Tiệc nhà gái","startTime":"20:15","durationMinutes":45,"endTime":"21:00","description":"Chụp ảnh cuối, tiễn khách, niêm phong tiền mừng","location":"Nhà hàng TP.HCM","owner":"Nhà gái","vendor":"Ảnh/Video","status":"Chưa bắt đầu","notes":"","id":"timeline-037"},{"event":"Tiệc nhà gái","startTime":"21:00","durationMinutes":30,"endTime":"21:30","description":"Đối soát bàn, thu tài sản, bàn giao sảnh","location":"Nhà hàng TP.HCM","owner":"Planner/Điều phối","vendor":"Nhà hàng","status":"Chưa bắt đầu","notes":"","id":"timeline-038"}],"budget":[{"category":"Hai tiệc nhà hàng & đồ uống","budgeted":160000000,"committed":0,"actual":0,"variance":160000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Giả định khoảng 30 bàn tổng","id":"budget-001"},{"category":"Trang trí hai nhà & hai nhà hàng","budgeted":36000000,"committed":0,"actual":0,"variance":36000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Tận dụng hạng mục tiêu chuẩn nhà hàng","id":"budget-002"},{"category":"Ảnh cưới, phóng sự & video","budgeted":28000000,"committed":0,"actual":0,"variance":28000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Không livestream/same-day edit","id":"budget-003"},{"category":"Nhẫn & trang sức cưới","budgeted":35000000,"committed":0,"actual":0,"variance":35000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Không tính vàng gia đình tặng thêm","id":"budget-004"},{"category":"Trang phục & làm đẹp","budgeted":26000000,"committed":0,"actual":0,"variance":26000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Áo dài, 2 váy, suit, makeup","id":"budget-005"},{"category":"Mâm quả, nạp tài & nghi lễ","budgeted":18000000,"committed":0,"actual":0,"variance":18000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Cần chốt rõ khoản nạp tài","id":"budget-006"},{"category":"Xe đưa đón, phòng nghỉ & vận chuyển","budgeted":14000000,"committed":0,"actual":0,"variance":14000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Ưu tiên đoàn rước dâu/người lớn tuổi","id":"budget-007"},{"category":"Planner bán phần & điều phối","budgeted":15000000,"committed":0,"actual":0,"variance":15000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Rước dâu + 2 tiệc","id":"budget-008"},{"category":"Thiệp, lì xì & quà đội hỗ trợ","budgeted":8000000,"committed":0,"actual":0,"variance":8000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Lì xì 200.000đ/người","id":"budget-009"},{"category":"MC, âm thanh & chương trình","budgeted":5000000,"committed":0,"actual":0,"variance":5000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Tận dụng gói cơ bản nhà hàng","id":"budget-010"},{"category":"Thủ tục, in ấn & vật dụng","budgeted":5000000,"committed":0,"actual":0,"variance":5000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Đăng ký kết hôn, in checklist, kit khẩn cấp","id":"budget-011"},{"category":"Dao động giá & phát sinh nhỏ","budgeted":10000000,"committed":0,"actual":0,"variance":10000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Không thay thế quỹ dự phòng","id":"budget-012"},{"category":"Quỹ dự phòng 10%","budgeted":40000000,"committed":0,"actual":0,"variance":40000000,"paid":0,"payable":0,"dueDate":"","vendor":"","notes":"Chỉ dùng khi cô dâu phê duyệt","id":"budget-013"}],"guests":[],"vendors":[{"category":"Nhà hàng nhà trai","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-001"},{"category":"Nhà hàng nhà trai","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-002"},{"category":"Nhà hàng nhà trai","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-003"},{"category":"Nhà hàng nhà gái","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-004"},{"category":"Nhà hàng nhà gái","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-005"},{"category":"Nhà hàng nhà gái","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-006"},{"category":"Trang trí","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-007"},{"category":"Trang trí","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-008"},{"category":"Trang trí","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-009"},{"category":"Studio ảnh cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-010"},{"category":"Studio ảnh cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-011"},{"category":"Studio ảnh cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-012"},{"category":"Ảnh phóng sự","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-013"},{"category":"Ảnh phóng sự","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-014"},{"category":"Ảnh phóng sự","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-015"},{"category":"Quay phim","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-016"},{"category":"Quay phim","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-017"},{"category":"Quay phim","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-018"},{"category":"Makeup","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-019"},{"category":"Makeup","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-020"},{"category":"Makeup","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-021"},{"category":"Váy cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-022"},{"category":"Váy cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-023"},{"category":"Váy cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-024"},{"category":"Suit/Áo dài","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-025"},{"category":"Suit/Áo dài","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-026"},{"category":"Suit/Áo dài","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-027"},{"category":"Mâm quả","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-028"},{"category":"Mâm quả","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-029"},{"category":"Mâm quả","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-030"},{"category":"Xe đưa đón","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-031"},{"category":"Xe đưa đón","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-032"},{"category":"Xe đưa đón","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-033"},{"category":"Phòng nghỉ","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-034"},{"category":"Phòng nghỉ","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-035"},{"category":"Phòng nghỉ","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-036"},{"category":"MC","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-037"},{"category":"MC","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-038"},{"category":"MC","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-039"},{"category":"Planner/Điều phối","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-040"},{"category":"Planner/Điều phối","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-041"},{"category":"Planner/Điều phối","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-042"},{"category":"In thiệp","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-043"},{"category":"In thiệp","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-044"},{"category":"In thiệp","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-045"},{"category":"Hoa cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-046"},{"category":"Hoa cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-047"},{"category":"Hoa cưới","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-048"},{"category":"Nhẫn/Trang sức","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-049"},{"category":"Nhẫn/Trang sức","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-050"},{"category":"Nhẫn/Trang sức","name":"","location":"","contact":"","quote":0,"includes":"","deposit":0,"paymentTerms":"","score":0,"status":"Đang khảo sát","decisionDue":"","contractUrl":"","notes":"","id":"vendor-051"}],"settings":[{"id":"setting-brideName","key":"brideName","value":"","notes":"Nhập tên cô dâu"},{"id":"setting-groomName","key":"groomName","value":"","notes":"Nhập tên chú rể"},{"id":"setting-registrationDate","key":"registrationDate","value":"","notes":"Nhập khi đã chốt"},{"id":"setting-engagementDate","key":"engagementDate","value":"","notes":"Tổ chức tại TP.HCM"},{"id":"setting-pickupDate","key":"pickupDate","value":"","notes":"TP.HCM → Lộc Ninh, Bình Phước"},{"id":"setting-groomPartyDate","key":"groomPartyDate","value":"","notes":"Tiệc trưa tại Lộc Ninh"},{"id":"setting-bridePartyDate","key":"bridePartyDate","value":"","notes":"Tiệc tối tại TP.HCM"},{"id":"setting-totalBudget","key":"totalBudget","value":400000000,"notes":"Đã gồm quỹ dự phòng"},{"id":"setting-reserveBudget","key":"reserveBudget","value":40000000,"notes":"10% ngân sách tổng"},{"id":"setting-operatingBudget","key":"operatingBudget","value":360000000,"notes":"Mức trần ký hợp đồng"},{"id":"setting-groomGuests","key":"groomGuests","value":150,"notes":"Điều chỉnh sau khi lập danh sách"},{"id":"setting-brideGuests","key":"brideGuests","value":150,"notes":"Điều chỉnh sau khi lập danh sách"},{"id":"setting-guestsPerTable","key":"guestsPerTable","value":10,"notes":"Dùng để ước tính số bàn"},{"id":"setting-style","key":"style","value":"Sang trọng – tối giản – lãng mạn","notes":"Đỏ burgundy, champagne, vàng đồng"},{"id":"setting-finalDecisionMaker","key":"finalDecisionMaker","value":"Cô dâu","notes":"Các thay đổi chi phí >2 triệu cần duyệt"}]};

const CONFIG = {
  storageKey: 'wedding-os-preview-v4-cache',
  legacyStorageKey: 'wedding-os-preview-v3',
  pendingKey: 'wedding-os-pending-changes-v1',
  endpointKey: 'wedding-os-google-sheets-endpoint',
  passwordKey: 'wedding-os-google-sheets-password',
  schemaPasswordKey: 'wedding-os-google-sheets-schema-password',
  endpointUrlParam: 'wos_endpoint',
  schemaVersion: 10,
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
  attachmentMaxFiles: 5,
  attachmentMaxBytes: 10 * 1024 * 1024,

  pageSize: 20,
  lookupPageSize: 5,
  nav: [
    {id:'dashboard', label:'Tổng quan', icon:'layout-dashboard', tone:'blue', description:'Sức khỏe kế hoạch'},
    {id:'checklist', label:'Checklist', icon:'list-checks', tone:'emerald', description:'155 đầu việc'},
    {id:'timeline', label:'Timeline', icon:'calendar-clock', tone:'indigo', description:'Lịch trình sự kiện'},
    {id:'budget', label:'Ngân sách', icon:'wallet-cards', tone:'amber', description:'Theo dõi dòng tiền'},
    {id:'guests', label:'Khách mời', icon:'users-round', tone:'violet', description:'Xác nhận và xếp bàn'},
    {id:'vendors', label:'Nhà cung cấp', icon:'store', tone:'orange', description:'Báo giá và hợp đồng'},
    {id:'references', label:'Tham khảo', icon:'book-open-check', tone:'rose', description:'Nguồn ý tưởng và đánh giá'},
    {id:'settings', label:'Thiết lập', icon:'settings-2', tone:'cyan', description:'Thông tin và danh mục'}
  ],
  schemas: {
    checklist: {
      title:'Checklist', singular:'công việc', icon:'list-checks',
      search:['task','group','owner','location','milestone','budgetCategory'],
      filterFields:['phase','milestone','group','anchorEvent','location','owner','priority','status','budgetCategory'],
      statusField:'status', filterOptions:['Tất cả','Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],
      columns:['task','milestone','owner','budgetCategory','priority','status','dueDate'],
      fields:[
        ['phase','Giai đoạn','select',{lookup:'checklistPhases'}], ['milestone','Mốc thời gian','select',{lookup:'checklistMilestones'}],
        ['group','Nhóm việc','select',{lookup:'checklistGroups'}], ['task','Công việc chi tiết','textarea'],
        ['anchorEvent','Sự kiện neo','select',{lookup:'anchorEvents'}],
        ['offsetDays','Offset ngày','number'], ['startDate','Ngày bắt đầu','date'], ['dueDate','Hạn hoàn thành','date'],
        ['location','Địa điểm','text'], ['owner','Người phụ trách','select',{lookup:'owners'}],
        ['priority','Ưu tiên','select',['Cao','Trung bình','Thấp']],
        ['status','Trạng thái','select',['Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy']],
        ['budgetCategory','Hạng mục ngân sách','select',{dynamic:'budgetCategories',allowBlank:true}],
        ['budgetEstimate','Ngân sách dự kiến','currency'], ['actualCost','Thực chi','currency'],
        ['payableCost','Cần thanh toán','currency'], ['notes','Ghi chú / kết quả','textarea']
      ],
      reportFields:['status','budgetCategory','actualCost','payableCost','notes']
    },
    timeline: {
      title:'Timeline sự kiện', singular:'mốc lịch trình', icon:'calendar-clock',
      search:['event','description','location','owner','vendor'],
      filterFields:['eventDate','event','location','owner','vendor','status'],
      statusField:'status', filterOptions:['Tất cả','Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy'],
      columns:['eventDate','event','startTime','endTime','description','location','owner','vendor','status'],
      fields:[
        ['eventDate','Ngày sự kiện','date'], ['event','Sự kiện','text'], ['startTime','Giờ bắt đầu','time'], ['durationMinutes','Thời lượng (phút)','number'],
        ['endTime','Giờ kết thúc','time'], ['description','Chương trình chi tiết','textarea'],
        ['location','Địa điểm','text'], ['owner','Người phụ trách','select',{lookup:'owners'}],
        ['vendor','Nhà cung cấp','select',{dynamic:'vendors',allowBlank:true}],
        ['status','Trạng thái','select',['Chưa bắt đầu','Đang làm','Chờ xác nhận','Hoàn thành','Tạm hoãn','Hủy']],
        ['notes','Ghi chú / kết quả','textarea']
      ],
      reportFields:['status','owner','vendor','notes']
    },
    budget: {
      title:'Ngân sách', singular:'hạng mục ngân sách', icon:'wallet-cards',
      search:['category','vendor','notes'], filterFields:['category','vendor'], statusField:null, filterOptions:['Tất cả'],
      columns:['category','budgeted','payable','actual','remaining','vendor','dueDate'],
      fields:[
        ['category','Hạng mục','text'], ['budgeted','Ngân sách đề xuất','currency'],
        ['committed','Đã ký / cam kết','currency'], ['payable','Cần thanh toán','currency'],
        ['actual','Thực chi','currency'], ['dueDate','Hạn thanh toán','date'],
        ['vendor','Nhà cung cấp','multiselect',{dynamic:'vendors'}], ['notes','Ghi chú','textarea']
      ],
      reportFields:['payable','actual','dueDate','notes']
    },
    guests: {
      title:'Khách mời', singular:'khách mời', icon:'users-round',
      search:['name','side','group','phone','tableNo'], filterFields:['side','group','events','invitationType','sent','rsvp','vegetarian','transport','room','tableNo'], statusField:'rsvp',
      filterOptions:['Tất cả','Chưa phản hồi','Đồng ý','Từ chối','Chưa chắc'],
      columns:['name','side','group','phone','sent','rsvp','partySize','tableNo','transport','room'],
      fields:[
        ['name','Họ tên','text'], ['side','Bên mời','select',{lookup:'guestSides'}],
        ['group','Nhóm khách','select',{lookup:'guestGroups'}],
        ['phone','Số điện thoại','tel'], ['events','Sự kiện tham dự','text'],
        ['invitationType','Hình thức thiệp','select',{lookup:'invitationTypes'}],
        ['sent','Đã gửi thiệp','select',['Chưa','Đã gửi']], ['sentDate','Ngày gửi','date'],
        ['rsvp','Xác nhận tham gia','select',['Chưa phản hồi','Đồng ý','Từ chối','Chưa chắc']],
        ['partySize','Số người đi','number'], ['tableNo','Bàn','text'],
        ['vegetarian','Món chay','select',['Không','Có']], ['transport','Cần xe','select',['Không','Có']],
        ['room','Cần phòng','select',['Không','Có']], ['giftValue','Tiền mừng / quà','currency'],
        ['notes','Ghi chú','textarea']
      ],
      reportFields:['sent','sentDate','rsvp','partySize','notes']
    },
    vendors: {
      title:'Nhà cung cấp', singular:'nhà cung cấp', icon:'store',
      search:['category','name','location','contact','status'], filterFields:['category','location','status'], statusField:'status',
      filterOptions:['Tất cả','Đang khảo sát','Đã nhận báo giá','Vào shortlist','Đã chọn','Đã cọc','Hoàn tất','Loại'],
      columns:['category','name','location','quote','deposit','score','status','decisionDue'],
      fields:[
        ['category','Nhóm dịch vụ','select',{lookup:'vendorCategories'}], ['name','Tên nhà cung cấp','text'], ['location','Địa điểm','text'],
        ['contact','Liên hệ','text'], ['quote','Báo giá','currency'], ['includes','Hạng mục bao gồm','textarea'],
        ['deposit','Tiền cọc','currency'], ['paymentTerms','Điều khoản thanh toán','textarea'],
        ['score','Điểm /10','number'], ['status','Trạng thái','select',['Đang khảo sát','Đã nhận báo giá','Vào shortlist','Đã chọn','Đã cọc','Hoàn tất','Loại']],
        ['decisionDue','Hạn quyết định','date'], ['contractUrl','Link / hợp đồng','url'], ['notes','Ghi chú','textarea']
      ],
      reportFields:['status','deposit','notes']
    },
    references: {
      title:'Tham khảo', singular:'nguồn tham khảo', icon:'book-open-check',
      search:['group','source','event','sourceUrl','notes'], filterFields:['group','source','event','interestLevel','priorityLevel','rating'], statusField:null,
      filterOptions:['Tất cả'],
      columns:['group','event','sourceUrl','interestLevel','priorityLevel','source','rating','notes'],
      fields:[
        ['group','Nhóm việc','select',{lookup:'checklistGroups'}],
        ['event','Sự kiện','text'],
        ['sourceUrl','Link nguồn tham khảo','url'],
        ['interestLevel','Mức độ quan tâm','select',{lookup:'interestLevels'}],
        ['priorityLevel','Mức độ ưu tiên','select',{lookup:'referencePriorities'}],
        ['source','Nguồn thông tin','select',{lookup:'referenceSources'}],
        ['rating','Đánh giá','rating'],
        ['notes','Ghi chú','textarea']
      ],
      reportFields:['rating','notes']
    }
  },
  lookupLabels: {
    checklistPhases:'Giai đoạn Checklist', checklistMilestones:'Mốc thời gian', checklistGroups:'Nhóm việc',
    anchorEvents:'Sự kiện neo', owners:'Người phụ trách', guestSides:'Bên mời', guestGroups:'Nhóm khách',
    invitationTypes:'Hình thức thiệp', vendorCategories:'Nhóm dịch vụ nhà cung cấp',
    referenceSources:'Nguồn thông tin tham khảo', interestLevels:'Mức độ quan tâm', referencePriorities:'Mức độ ưu tiên tham khảo'
  }
};

const ACCENT_THEMES = {
  pink:{label:'Hồng', swatch:'#c94c68', vars:{50:'#fdf2f4',200:'#f6d0d8',300:'#eea9b7',400:'#df748a',500:'#c94c68',600:'#aa304d',700:'#8e263f',800:'#772238',900:'#651f34'}},
  blue:{label:'Xanh biển', swatch:'#2563eb', vars:{50:'#eff6ff',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'}},
  green:{label:'Xanh lá', swatch:'#059669', vars:{50:'#ecfdf5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b'}}
};

const UI = {
  tab:'dashboard', editMode:false, loading:false, search:'', filter:'Tất cả', visibleCount:CONFIG.pageSize,
  secondaryFilter:null, advancedFilters:{}, dateFilters:{}, filterDraft:null, filterPanelOpen:false, lookupPages:{}, editing:null, deleting:null, mobileActionsOpen:false,
  timelineSortDirection:'asc', columnCollection:null, columnDraft:[],
  hydrationState:'idle', hydrationHasCache:false, hydrationError:'', hydrationRunId:0, mutationLocked:false, serverRevisionHint:0,
  syncing:false, syncMode:'', autoSyncTimer:null, autoSyncNextAt:'', autoSyncLastAttemptAt:'', autoSyncLastError:'', lastSyncAt:storage.get('wedding-last-sync-at',''), pendingChanges:loadPendingChanges('admin')
};

let DATA = loadData();

function uniqueValues(rows,key) {
  return [...new Set((rows || []).map(row => String(row?.[key] ?? '').trim()).filter(Boolean))];
}


function moduleCollectionNames() { return Object.keys(CONFIG.schemas || {}); }
function recordCollectionNames() { return [...moduleCollectionNames(),'attachments','settings','security','accounts','preferences','notifications']; }
function syncCollectionNames() { return [...recordCollectionNames(),'lookups']; }

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
  return ordered.filter(key=>/^[A-Za-z][A-Za-z0-9_]{0,79}$/.test(key)).map(key=>{
    const definition=configured.get(key),type=manifestFieldType(key,definition?.[2],observedFieldSample(collection,key)),options=definition?.[3];
    const field={key,label:manifestFieldLabel(key,definition?.[1]),type,required:key==='id',hidden:key==='id'||key==='updatedAt',allowBlank:key!=='id',width:manifestFieldWidth(type,key)};
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
  modules.settings={collection:'settings',sheetName:'settings',title:'Thiết lập',dataShape:'records',sensitive:false,adminOnly:true,ownerScoped:false,fields:[
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
  modules.lookups={collection:'lookups',sheetName:'lookups',title:'Danh mục dùng chung',dataShape:'lookupMap',sensitive:false,adminOnly:true,ownerScoped:false,fields:[
    {key:'id',label:'ID',type:'text',required:true,hidden:true,allowBlank:false,width:130},
    {key:'key',label:'Khóa danh mục',type:'text',required:true,hidden:false,allowBlank:false,width:190},
    {key:'values',label:'Danh sách giá trị',type:'json',required:false,hidden:false,allowBlank:true,width:420},
    {key:'updatedAt',label:'Cập nhật lúc',type:'datetime',required:false,hidden:true,allowBlank:true,width:150}
  ]};
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

function migrateData(input) {
  const data = input && typeof input === 'object' ? structuredClone(input) : structuredClone(INITIAL_DATA);
  recordCollectionNames().forEach(key => { if (!Array.isArray(data[key])) data[key] = []; });
  recordCollectionNames().forEach(key => data[key].forEach(row => { if(!/^[A-Za-z0-9_-]{1,120}$/.test(String(row?.id||''))) row.id=uid(key); }));
  ensureSetting(data,'accentTheme',storage.get(CONFIG.accentKey,'pink'),'Màu giao diện');
  ensureSetting(data,'googleSheetsEndpoint',storage.get(CONFIG.endpointKey,''),'Google Apps Script Web App URL');
  ensureSetting(data,'guestsPerTable',10,'Dùng để ước tính số bàn');
  ensureSetting(data,'dashboardDescription','Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.','Mô tả hiển thị tại tab Tổng quan');
  data.lookups = data.lookups && typeof data.lookups === 'object' ? data.lookups : {};
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
  Object.entries(defaults).forEach(([key,values]) => {
    if (!Array.isArray(data.lookups[key]) || !data.lookups[key].length) data.lookups[key] = values;
    data.lookups[key] = [...new Set(data.lookups[key].map(value => String(value).trim()).filter(Boolean))];
  });
  data.lookups.referenceSources=[...new Set([...(data.lookups.referenceSources||[]),...defaults.referenceSources])];
  data.checklist.forEach(row => {
    if (!('budgetCategory' in row)) row.budgetCategory = '';
    if (!('payableCost' in row)) row.payableCost = 0;
  });
  const settingMap={};(data.settings||[]).forEach(row=>settingMap[row.key]=row.value);
  const timelineDateMap={'Đăng ký kết hôn':settingMap.registrationDate,'Lễ ăn hỏi':settingMap.engagementDate,'Ăn hỏi':settingMap.engagementDate,'Rước dâu':settingMap.pickupDate,'Tiệc nhà trai':settingMap.groomPartyDate,'Tiệc nhà gái':settingMap.bridePartyDate};
  data.timeline.forEach(row => { if (!('eventDate' in row)||!row.eventDate) row.eventDate = timelineDateMap[row.event]||''; });
  data.security.forEach(row=>{row.passwordIterations=Number(row.passwordIterations||row.iterations||120000);row.passwordAlgorithm=row.passwordAlgorithm||row.algorithm||'PBKDF2-SHA256-256';});
  data.accounts.forEach(row=>{row.passwordIterations=Number(row.passwordIterations||row.iterations||120000);row.passwordAlgorithm=row.passwordAlgorithm||'PBKDF2-SHA256-256';row.encryptionIterations=Number(row.encryptionIterations||row.iterations||120000);row.encryptionAlgorithm=row.encryptionAlgorithm||row.algorithm||'AES-GCM-256 / PBKDF2-SHA256';});

  data.preferences.forEach(row => { if(typeof row.columns==='string'){try{row.columns=JSON.parse(row.columns)||{};}catch(_){row.columns={};}} if(!row.columns||typeof row.columns!=='object'||Array.isArray(row.columns))row.columns={}; });
  data.references.forEach(row => {
    row.rating = Math.min(5,Math.max(0,Number(row.rating || 0)));
  });
  data.budget.forEach(row => {
    if (!('payable' in row)) row.payable = Number(row.paid || 0);
    if (!Array.isArray(row.vendor)) row.vendor = row.vendor ? String(row.vendor).split(',').map(v => v.trim()).filter(Boolean) : [];
    row.remaining = Number(row.budgeted || 0) - Number(row.actual || 0) - Number(row.payable || 0);
    row.variance = Number(row.budgeted || 0) - Number(row.actual || 0);
  });
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

function queueChange(change) {
  const key = `${change.collection}:${change.id}`;
  const index = UI.pendingChanges.findIndex(item => `${item.collection}:${item.id}` === key);
  const normalized = {...change,changedAt:new Date().toISOString()};
  if (index >= 0) UI.pendingChanges[index] = normalized; else UI.pendingChanges.push(normalized);
  savePendingChanges();
}

function queueUpsert(collection,record) { queueChange({op:'upsert',collection,id:record.id,record:structuredClone(record)}); }
function queueDelete(collection,id) { queueChange({op:'delete',collection,id}); }

function updatePendingIndicators(){
  const count=UI.pendingChanges.length;document.querySelectorAll('[data-pending-count]').forEach(node=>node.textContent=count?String(count):'');const syncButton=document.getElementById('syncButton');
  if(syncButton&&!syncButton.disabled)syncButton.title=needsInitialFullSync()?`Cần đồng bộ toàn bộ dữ liệu lần đầu (${count} thay đổi cục bộ)`:needsSchemaSync()?'Cấu trúc Google Sheets cần được cập nhật':(count?`${count} thay đổi đang chờ đồng bộ`:'Không có thay đổi đang chờ');
  setManualSyncControlsDisabled(UI.syncing);
}

function uid(prefix='row') { return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(16).slice(2)}`; }
function esc(value='') { return String(value ?? '').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char])); }
function encoded(value=''){ return encodeURIComponent(String(value??'')); }
function money(value) { return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(Number(value||0)); }
function compactMoney(value) { return new Intl.NumberFormat('vi-VN',{notation:'compact',maximumFractionDigits:1}).format(Number(value||0))+' ₫'; }
function formatDate(value) { if(!value)return 'Chưa chốt'; const date=new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime())?String(value):new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(date); }
function formatDateTime(value) { return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value)); }
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
function getSettings(){ const map={}; (DATA.settings||[]).forEach(item=>map[item.key]=item.value); return map; }
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
  if(type==='currency'||['budgeted','committed','actual','variance','paid','payable','remaining','quote','deposit','giftValue','budgetEstimate','actualCost','payableCost'].includes(key)) return `<span class="tabular whitespace-nowrap font-medium">${money(value)}</span>`;
  if(type==='date'||key.toLowerCase().includes('date')||key.toLowerCase().includes('due')) return `<span class="whitespace-nowrap">${esc(formatDate(value))}</span>`;
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
  const mobileItems=CONFIG.nav.filter(item=>['dashboard','checklist','budget','guests'].includes(item.id));
  document.getElementById('mobileNav').innerHTML=`${mobileItems.map(item=>`<button type="button" data-nav="${item.id}" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition ${UI.tab===item.id?'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300':'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}"><span class="nav-mobile-icon nav-feature-icon--${item.tone||'slate'}">${icon(item.icon,'size-5')}</span><span class="truncate">${item.label}</span></button>`).join('')}<button id="mobileMoreButton" type="button" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">${icon('ellipsis','size-5')}<span>Thêm</span></button>`;
  document.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.nav)));
  document.getElementById('mobileMoreButton')?.addEventListener('click',toggleMobileActions);
  updateCoupleWidget();
}

function updateCoupleWidget(){ const settings=getSettings(); const label=(settings.groomName||'Tên chú rể')+' × '+(settings.brideName||'Tên cô dâu'); const node=document.getElementById('coupleWidgetName'); if(node) node.textContent=label; }

const SECURITY_POLICY={defaultPassword:'admin@123',passwordIterations:120000,encryptionIterations:120000,minPasswordLength:6};
const AUTH={settingsUnlocked:false,masterPassword:'',pendingTab:null,passwordChangeForced:false,accounts:[],editingAccountId:null,passwordAccountId:null,currentUserId:secrets.get(CONFIG.accountSessionKey,''),adminBypass:false,adminAuthenticated:false,currentProfile:null,serverRequiresLogin:false,remoteStatus:null};

function lockAuthenticatedShell(){stopAutoSync();document.body.classList.add('auth-locked');document.getElementById('mainContent')?.replaceChildren();document.getElementById('desktopNav')?.replaceChildren();document.getElementById('mobileNav')?.replaceChildren();}
function unlockAuthenticatedShell(){document.body.classList.remove('auth-locked');}
function clearRememberedLogin(){storage.remove(CONFIG.rememberLoginKey);storage.remove(CONFIG.rememberedAuthKey);}
function saveRememberedLogin(remember, payload={}){
  if(!remember){clearRememberedLogin();return;}
  const record={version:1,endpoint:configuredEndpoint(),accountId:String(payload.accountId||AUTH.currentUserId||''),profile:payload.profile||currentUserProfile(),sessionToken:String(payload.sessionToken||serverAccountToken()||''),expiresAt:String(payload.expiresAt||''),savedAt:new Date().toISOString()};
  storage.set(CONFIG.rememberLoginKey,'1');storage.set(CONFIG.rememberedAuthKey,JSON.stringify(record));
}
function restoreRememberedLogin(){
  if(storage.get(CONFIG.rememberLoginKey,'')!=='1')return false;
  const record=parseStoredJson(storage.get(CONFIG.rememberedAuthKey,''),null);
  if(!record||record.version!==1||String(record.endpoint||'')!==configuredEndpoint()){clearRememberedLogin();return false;}
  if(record.expiresAt&&Date.parse(record.expiresAt)<=Date.now()){clearRememberedLogin();return false;}
  if(!record.accountId){clearRememberedLogin();return false;}
  AUTH.currentUserId=String(record.accountId);AUTH.currentProfile=record.profile||null;
  secrets.set(CONFIG.accountSessionKey,AUTH.currentUserId);
  if(record.profile)secrets.set(CONFIG.accountProfileKey,JSON.stringify(record.profile));
  if(record.sessionToken)secrets.set(CONFIG.accountServerSessionKey,record.sessionToken);
  return true;
}
function renderAuthenticatedWorkspace(){unlockAuthenticatedShell();applyCurrentPreferences();renderNavigation();renderHeader();renderPage();updatePendingIndicators();updateNotificationBadge();refreshIcons();if(!UI.mutationLocked&&UI.hydrationState!=='loading')startAutoSync();}


function parseStoredJson(value,fallback=null){try{return JSON.parse(String(value||''))||fallback;}catch(_){return fallback;}}
function currentPrincipalId(){if(AUTH.currentUserId)return AUTH.currentUserId;if(AUTH.adminAuthenticated||AUTH.adminBypass||!(DATA.accounts||[]).length)return'admin';return'guest';}
function preferenceRecordId(accountId=currentPrincipalId()){return`preference-${String(accountId).replace(/[^A-Za-z0-9_-]/g,'-')}`;}
function getCurrentPreference(){const accountId=currentPrincipalId();return(DATA.preferences||[]).find(row=>row.accountId===accountId||row.id===preferenceRecordId(accountId))||null;}
function updateCurrentPreference(patch={}){const accountId=currentPrincipalId(),id=preferenceRecordId(accountId),existing=getCurrentPreference()||{id,accountId,theme:'',accent:'',columns:{}};const record={...existing,...patch,id,accountId,columns:{...(existing.columns||{}),...(patch.columns||{})},updatedAt:new Date().toISOString()};const index=(DATA.preferences||[]).findIndex(row=>row.id===id||row.accountId===accountId);if(index>=0)DATA.preferences[index]=record;else(DATA.preferences||(DATA.preferences=[])).push(record);queueUpsert('preferences',record);saveData();return record;}
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
async function verifySettingsPassword(password){const record=securityAccessRecord();if(!record)return String(password)===SECURITY_POLICY.defaultPassword;const verifier=await passwordVerifier(password,record.passwordSalt,record.passwordIterations||record.iterations);return verifier===record.passwordVerifier;}
async function createSecurityAccessRecord(password){const salt=crypto.getRandomValues(new Uint8Array(16)),passwordSalt=bytesToBase64(salt),passwordVerifierValue=await passwordVerifier(password,passwordSalt,SECURITY_POLICY.passwordIterations);return{id:'security-settings-access',kind:'settingsAccess',passwordVerifier:passwordVerifierValue,passwordSalt,passwordIterations:SECURITY_POLICY.passwordIterations,passwordAlgorithm:'PBKDF2-SHA256-256',forceChange:false,updatedAt:new Date().toISOString()};}
async function loadAccountCache(password){const decoded=[];let metadataChanged=false;for(const row of(DATA.accounts||[])){try{const profile=await decryptJson(row,password),account={...profile,id:row.id,status:row.status||profile.status||'active',usernameHash:row.usernameHash,passwordHash:row.passwordHash,passwordSalt:row.passwordSalt,createdAt:profile.createdAt||row.updatedAt,updatedAt:row.updatedAt};decoded.push(account);if(row.displayName!==profile.displayName||row.userCode!==profile.userCode||row.usernameLabel!==profile.username){row.displayName=profile.displayName;row.userCode=profile.userCode;row.usernameLabel=profile.username;row.updatedAt=new Date().toISOString();queueUpsert('accounts',row);metadataChanged=true;}}catch(error){console.warn('Không giải mã được tài khoản',row.id,error);throw new Error('Không thể giải mã hồ sơ tài khoản bằng mật khẩu quản trị hiện tại.');}}AUTH.accounts=decoded;if(metadataChanged)saveData();return decoded;}
async function secureAccountRow(account,password){const encrypted=await encryptJson({userCode:account.userCode,displayName:account.displayName,username:account.username,createdAt:account.createdAt||new Date().toISOString()},password);return{id:account.id,userCode:account.userCode,displayName:account.displayName,usernameLabel:account.username,usernameHash:account.usernameHash,passwordHash:account.passwordHash,passwordSalt:account.passwordSalt,passwordIterations:Number(account.passwordIterations||SECURITY_POLICY.passwordIterations),passwordAlgorithm:account.passwordAlgorithm||'PBKDF2-SHA256-256',status:account.status||'active',...encrypted,updatedAt:new Date().toISOString()};}
function showInlineError(id,message=''){const node=document.getElementById(id);if(!node)return;node.textContent=message;node.classList.toggle('hidden',!message);}
function openSettingsAccessDialog(){AUTH.pendingTab='settings';const form=document.getElementById('settingsAccessForm');form?.reset();showInlineError('settingsAccessError','');const dialog=document.getElementById('settingsAccessDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>document.getElementById('settingsAccessPassword')?.focus(),50);}

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
async function getServerStatus(){const endpoint=configuredEndpoint();if(!endpoint)return null;const result=await postAppsScript({action:'getStatus'},{authMode:'none',trackRevision:false});AUTH.remoteStatus=result;AUTH.serverRequiresLogin=Boolean(result.requiresAccountLogin);storage.set(CONFIG.remoteStatusKey,JSON.stringify({checkedAt:new Date().toISOString(),...result}));return result;}
function applyRemoteSnapshotResult(result,admin=false,{render=true}={}){
  const remote=validateRemoteData(result.data||{});
  DATA=admin?migrateData(remote):migrateData({...remote,accounts:[],security:[]});
  if(result.profile)setSessionProfile({...result.profile,id:result.profile.id||AUTH.currentUserId});
  setRemoteRevision(result.revision||0);saveData();applyCurrentPreferences();
  if(render){renderNavigation();renderHeader();renderPage();}
  return result;
}

async function loadRemoteSnapshot(admin=false,explicitToken=''){const result=await postAppsScript({action:'load',...(explicitToken?{sessionToken:explicitToken}:{})},{admin,authMode:explicitToken?'none':'auto'});return applyRemoteSnapshotResult(result,admin,{render:true});}
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
async function logoutServerToken(token){if(!token||!configuredEndpoint())return;try{await postAppsScript({action:'logout',sessionToken:token},{authMode:'none'});}catch(_){} }
async function submitSettingsAccess(event){
  event.preventDefault();const password=document.getElementById('settingsAccessPassword').value;showInlineError('settingsAccessError','');
  try{
    const endpoint=configuredEndpoint(),accountProfileBefore=AUTH.currentUserId?currentUserProfile():null;
    if(endpoint){
      try{
        const challenge=await postAppsScript({action:'adminChallenge'},{authMode:'none'}),verifier=await passwordVerifier(password,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,'admin');
        const login=await postAppsScript({action:'adminLogin',nonce:challenge.nonce,proof,includeData:true},{authMode:'none'});secrets.set(CONFIG.adminServerSessionKey,login.sessionToken);setRemoteRevision(login.revision||remoteRevision());
        if(login.data)applyRemoteSnapshotResult(login,true,{render:false});else await loadRemoteSnapshot(true);if(accountProfileBefore)setSessionProfile(accountProfileBefore);
      }catch(error){
        if(error.code!=='ADMIN_NOT_INITIALIZED')throw error;
        if(!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng.');return;}
      }
    }else if(!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng.');return;}
    if(securityAccessRecord()&&!await verifySettingsPassword(password)){showInlineError('settingsAccessError','Mật khẩu quản trị không đúng với dữ liệu đã mã hóa.');return;}
    AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;AUTH.masterPassword=password;await loadAccountCache(password);document.getElementById('settingsAccessDialog').close();if(!securityAccessRecord()){openSettingsPasswordDialog(true);return;}unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;startAutoSync();
  }catch(error){showInlineError('settingsAccessError',error.message||'Không thể xác thực mật khẩu.');}
}
async function ensureAdminServerSession(){
  if(serverAdminToken()||!configuredEndpoint()||!AUTH.settingsUnlocked||!AUTH.masterPassword)return serverAdminToken();
  const challenge=await postAppsScript({action:'adminChallenge'},{authMode:'none'}),verifier=await passwordVerifier(AUTH.masterPassword,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,'admin');
  const login=await postAppsScript({action:'adminLogin',nonce:challenge.nonce,proof},{authMode:'none'});secrets.set(CONFIG.adminServerSessionKey,login.sessionToken);setRemoteRevision(login.revision||remoteRevision());return login.sessionToken;
}

function cancelSettingsAccess(){AUTH.pendingTab=null;document.getElementById('settingsAccessDialog').close();if(AUTH.adminBypass){AUTH.adminBypass=false;enforceLoginGate();}}
function openSettingsPasswordDialog(force=false){AUTH.passwordChangeForced=Boolean(force);const form=document.getElementById('settingsPasswordForm');form?.reset();showInlineError('settingsPasswordError','');document.getElementById('settingsPasswordTitle').textContent=force?'Đổi mật khẩu mặc định':'Đổi mật khẩu quản trị';document.getElementById('settingsPasswordDescription').textContent=force?'Bạn đang sử dụng mật khẩu mặc định. Hãy đặt mật khẩu mới trước khi truy cập khu vực Thiết lập.':'Nhập mật khẩu hiện tại và đặt mật khẩu quản trị mới.';document.getElementById('cancelSettingsPassword').classList.toggle('hidden',force);const dialog=document.getElementById('settingsPasswordDialog');if(!dialog.open)dialog.showModal();refreshIcons();setTimeout(()=>document.getElementById('settingsCurrentPassword')?.focus(),50);}
async function submitSettingsPassword(event){event.preventDefault();const current=document.getElementById('settingsCurrentPassword').value,newPassword=document.getElementById('settingsNewPassword').value,confirmPassword=document.getElementById('settingsConfirmPassword').value;showInlineError('settingsPasswordError','');try{if(!await verifySettingsPassword(current)){showInlineError('settingsPasswordError','Mật khẩu hiện tại không đúng.');return;}if(newPassword.length<SECURITY_POLICY.minPasswordLength){showInlineError('settingsPasswordError',`Mật khẩu mới phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}if(newPassword===SECURITY_POLICY.defaultPassword){showInlineError('settingsPasswordError','Không được tiếp tục sử dụng mật khẩu mặc định.');return;}if(newPassword!==confirmPassword){showInlineError('settingsPasswordError','Hai lần nhập mật khẩu mới chưa khớp.');return;}if(!AUTH.accounts.length&&(DATA.accounts||[]).length)await loadAccountCache(current);const nextRows=[];for(const account of AUTH.accounts)nextRows.push(await secureAccountRow(account,newPassword));const securityRecord=await createSecurityAccessRecord(newPassword);DATA.security=[...(DATA.security||[]).filter(row=>row.id!==securityRecord.id),securityRecord];DATA.accounts=nextRows;queueUpsert('security',securityRecord);nextRows.forEach(row=>queueUpsert('accounts',row));AUTH.masterPassword=newPassword;AUTH.settingsUnlocked=true;AUTH.adminAuthenticated=true;saveData();document.getElementById('settingsPasswordDialog').close();toast('Đã cập nhật mật khẩu quản trị và mã hóa lại hồ sơ tài khoản.','success');if(AUTH.passwordChangeForced){unlockAuthenticatedShell();completeNavigation(AUTH.pendingTab||'settings');AUTH.pendingTab=null;}else if(UI.tab==='settings')renderPage();}catch(error){showInlineError('settingsPasswordError',error.message||'Không thể đổi mật khẩu.');}}
function cancelSettingsPassword(){if(AUTH.passwordChangeForced)return;document.getElementById('settingsPasswordDialog').close();}

function normalizeUsername(value){return String(value||'').trim().toLowerCase();}
function openAccountEditor(id=''){if(!AUTH.settingsUnlocked)return;AUTH.editingAccountId=id||null;const account=id?AUTH.accounts.find(item=>item.id===id):null;document.getElementById('accountDialogTitle').textContent=account?'Sửa thông tin tài khoản':'Tạo tài khoản mới';document.getElementById('accountUserCode').value=account?.userCode||'';document.getElementById('accountDisplayName').value=account?.displayName||'';document.getElementById('accountUsername').value=account?.username||'';document.getElementById('accountInitialPassword').value='';document.getElementById('accountInitialPasswordWrap').classList.toggle('hidden',Boolean(account));document.getElementById('accountInitialPassword').required=!account;showInlineError('accountFormError','');document.getElementById('accountDialog').showModal();refreshIcons();setTimeout(()=>document.getElementById('accountUserCode')?.focus(),50);}
async function saveAccount(event){event.preventDefault();if(!AUTH.settingsUnlocked||!AUTH.masterPassword)return;const userCode=document.getElementById('accountUserCode').value.trim(),displayName=document.getElementById('accountDisplayName').value.trim(),username=document.getElementById('accountUsername').value.trim(),normalized=normalizeUsername(username),initialPassword=document.getElementById('accountInitialPassword').value;showInlineError('accountFormError','');const existing=AUTH.editingAccountId?AUTH.accounts.find(item=>item.id===AUTH.editingAccountId):null;if(!userCode||!displayName||!normalized){showInlineError('accountFormError','Vui lòng nhập đầy đủ Mã người dùng, Tên người dùng và Tên đăng nhập.');return;}if(AUTH.accounts.some(item=>item.id!==existing?.id&&item.userCode.toLowerCase()===userCode.toLowerCase())){showInlineError('accountFormError','Mã người dùng đã tồn tại.');return;}if(AUTH.accounts.some(item=>item.id!==existing?.id&&normalizeUsername(item.username)===normalized)){showInlineError('accountFormError','Tên đăng nhập đã tồn tại.');return;}if(!existing&&initialPassword.length<SECURITY_POLICY.minPasswordLength){showInlineError('accountFormError',`Mật khẩu ban đầu phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}try{const account=existing?{...existing,userCode,displayName,username}:{id:uid('account'),userCode,displayName,username,status:'active',createdAt:new Date().toISOString()};account.usernameHash=await sha256Base64(normalized);if(!existing){account.passwordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));account.passwordHash=await passwordVerifier(initialPassword,account.passwordSalt,SECURITY_POLICY.passwordIterations);account.passwordIterations=SECURITY_POLICY.passwordIterations;account.passwordAlgorithm='PBKDF2-SHA256-256';}const secureRow=await secureAccountRow(account,AUTH.masterPassword),rowIndex=(DATA.accounts||[]).findIndex(row=>row.id===account.id);if(rowIndex>=0)DATA.accounts[rowIndex]=secureRow;else DATA.accounts.push(secureRow);const cacheIndex=AUTH.accounts.findIndex(item=>item.id===account.id);if(cacheIndex>=0)AUTH.accounts[cacheIndex]=account;else AUTH.accounts.unshift(account);queueUpsert('accounts',secureRow);saveData();document.getElementById('accountDialog').close();toast(existing?'Đã cập nhật thông tin tài khoản.':'Đã tạo tài khoản mới.','success');renderPage();}catch(error){showInlineError('accountFormError',error.message||'Không thể lưu tài khoản.');}}
async function toggleAccountLock(id){const account=AUTH.accounts.find(item=>item.id===id);if(!account)return;if(AUTH.currentUserId===id&&account.status!=='locked'){toast('Không thể khóa tài khoản đang đăng nhập.','error');return;}account.status=account.status==='locked'?'active':'locked';const row=await secureAccountRow(account,AUTH.masterPassword),index=DATA.accounts.findIndex(item=>item.id===id);if(index>=0)DATA.accounts[index]=row;queueUpsert('accounts',row);saveData();toast(account.status==='locked'?'Đã khóa tài khoản.':'Đã mở khóa tài khoản.','success');renderPage();}
function openAccountPassword(id){const account=AUTH.accounts.find(item=>item.id===id);if(!account)return;AUTH.passwordAccountId=id;document.getElementById('accountPasswordForm').reset();document.getElementById('accountPasswordAccount').textContent=`Tài khoản: ${account.displayName} (${account.username})`;showInlineError('accountPasswordError','');document.getElementById('accountPasswordDialog').showModal();refreshIcons();setTimeout(()=>document.getElementById('accountNewPassword')?.focus(),50);}
async function saveAccountPassword(event){event.preventDefault();const password=document.getElementById('accountNewPassword').value,confirmPassword=document.getElementById('accountConfirmPassword').value,account=AUTH.accounts.find(item=>item.id===AUTH.passwordAccountId);showInlineError('accountPasswordError','');if(!account)return;if(password.length<SECURITY_POLICY.minPasswordLength){showInlineError('accountPasswordError',`Mật khẩu phải có ít nhất ${SECURITY_POLICY.minPasswordLength} ký tự.`);return;}if(password!==confirmPassword){showInlineError('accountPasswordError','Hai lần nhập mật khẩu chưa khớp.');return;}account.passwordSalt=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));account.passwordHash=await passwordVerifier(password,account.passwordSalt,SECURITY_POLICY.passwordIterations);account.passwordIterations=SECURITY_POLICY.passwordIterations;account.passwordAlgorithm='PBKDF2-SHA256-256';const row=await secureAccountRow(account,AUTH.masterPassword),index=DATA.accounts.findIndex(item=>item.id===account.id);if(index>=0)DATA.accounts[index]=row;queueUpsert('accounts',row);saveData();document.getElementById('accountPasswordDialog').close();toast('Đã đặt lại mật khẩu tài khoản.','success');renderPage();}
function renderAccountManagement(){const accounts=AUTH.accounts||[];return`<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 class="font-bold tracking-tight">Quản lý và cấp tài khoản</h3><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Hồ sơ được mã hóa trước khi đồng bộ; mật khẩu chỉ lưu dưới dạng mã xác thực một chiều.</p></div><div class="flex flex-wrap gap-2"><button id="changeSettingsPasswordButton" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('shield-keyhole','size-4')}Đổi mật khẩu quản trị</button><button id="addAccountButton" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-xs font-semibold text-white transition hover:bg-brand-800">${icon('user-plus','size-4')}Tạo tài khoản</button></div></div>${accounts.length?`<div class="account-table-wrap border-t border-slate-200 dark:border-slate-800"><table class="account-table"><thead><tr><th>Mã người dùng</th><th>Tên người dùng</th><th>Tên đăng nhập</th><th>Trạng thái</th><th>Tác vụ</th></tr></thead><tbody>${accounts.map(account=>`<tr><td class="font-semibold">${esc(account.userCode)}</td><td>${esc(account.displayName)}</td><td>${esc(account.username)}</td><td>${account.status==='locked'?'<span class="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Đã khóa</span>':'<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Đang hoạt động</span>'}</td><td><div class="flex flex-wrap gap-1.5"><button type="button" data-account-edit="${esc(account.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold dark:border-slate-700">Sửa</button><button type="button" data-account-password="${esc(account.id)}" class="rounded-lg border border-blue-200 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900 dark:text-blue-300">Mật khẩu</button><button type="button" data-account-lock="${esc(account.id)}" class="rounded-lg border ${account.status==='locked'?'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300':'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300'} px-2.5 py-1.5 text-[11px] font-semibold">${account.status==='locked'?'Mở khóa':'Khóa'}</button></div></td></tr>`).join('')}</tbody></table></div>`:`<div class="border-t border-slate-200 px-6 py-10 text-center dark:border-slate-800"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon('users-round','size-5')}</span><p class="mt-3 text-sm font-semibold">Chưa có tài khoản nào</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Tạo tài khoản đầu tiên để bật cơ chế đăng nhập WeddingOS.</p></div>`}</section>`;}

async function submitAccountLogin(event){
  event.preventDefault();const username=normalizeUsername(document.getElementById('loginUsername').value),password=document.getElementById('loginPassword').value,remember=Boolean(document.getElementById('loginRememberMe')?.checked);showInlineError('loginError','');setButtonLoading('accountLoginSubmitButton',true,'Đang xác thực');
  try{
    const usernameHash=await sha256Base64(username),endpoint=configuredEndpoint();let loginMeta={};
    if(endpoint){
      const challenge=await postAppsScript({action:'loginChallenge',usernameHash},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth}),verifier=await passwordVerifier(password,challenge.passwordSalt,challenge.passwordIterations),proof=await proofForVerifier(verifier,challenge.nonce,usernameHash);
      const login=await postAppsScript({action:'login',usernameHash,nonce:challenge.nonce,proof,includeData:false},{authMode:'none',retries:0,timeoutMs:CONFIG.networkTimeouts.auth,trackRevision:false});
      AUTH.currentUserId=login.profile?.id||'';AUTH.adminAuthenticated=false;AUTH.adminBypass=false;secrets.set(CONFIG.accountSessionKey,AUTH.currentUserId);secrets.set(CONFIG.accountServerSessionKey,login.sessionToken);setSessionProfile(login.profile);UI.serverRevisionHint=Number(login.revision||0);
      const hasCache=activateUserCache(AUTH.currentUserId);loginMeta={accountId:AUTH.currentUserId,profile:login.profile,sessionToken:login.sessionToken,expiresAt:login.expiresAt};
      UI.hydrationState='loading';UI.hydrationHasCache=hasCache;UI.hydrationError='';UI.mutationLocked=true;UI.loading=!hasCache;
    }else{
      const row=(DATA.accounts||[]).find(item=>item.usernameHash===usernameHash);if(!row||row.status==='locked'){showInlineError('loginError','Tên đăng nhập hoặc mật khẩu không đúng.');return;}
      const verifier=await passwordVerifier(password,row.passwordSalt,row.passwordIterations||row.iterations);if(verifier!==row.passwordHash){showInlineError('loginError','Tên đăng nhập hoặc mật khẩu không đúng.');return;}
      AUTH.currentUserId=row.id;AUTH.adminAuthenticated=false;AUTH.adminBypass=false;secrets.set(CONFIG.accountSessionKey,row.id);const profile={id:row.id,userCode:row.userCode||'',displayName:row.displayName||row.usernameLabel||username,username:row.usernameLabel||username,status:row.status||'active',kind:'account'};setSessionProfile(profile);loginMeta={accountId:row.id,profile,sessionToken:'',expiresAt:''};UI.hydrationState='ready';UI.hydrationHasCache=true;UI.hydrationError='';UI.mutationLocked=false;UI.loading=false;
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
function openAdminFromLogin(){document.getElementById('accountLoginDialog').close();AUTH.adminBypass=true;lockAuthenticatedShell();navigate('settings');}

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
  document.getElementById('selfPasswordDialog').close();toast('Đã đổi mật khẩu tài khoản.','success');
}catch(error){showInlineError('selfPasswordError',error.message||'Không thể đổi mật khẩu.');}}
function logoutCurrentUser(){document.getElementById('profileDialog')?.close();const token=serverAccountToken();logoutServerToken(token);clearRememberedLogin();UI.hydrationRunId+=1;UI.hydrationState='idle';UI.hydrationHasCache=false;UI.hydrationError='';UI.mutationLocked=false;UI.loading=false;lockAuthenticatedShell();AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=false;AUTH.adminBypass=false;AUTH.settingsUnlocked=false;AUTH.masterPassword='';AUTH.accounts=[];secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);toast('Đã đăng xuất khỏi WeddingOS.','info');enforceLoginGate();}

function localISODate(date=new Date()){const offset=date.getTimezoneOffset()*60000;return new Date(date.getTime()-offset).toISOString().slice(0,10);}
function notificationRecordTitle(collection,record){const primary={checklist:'task',timeline:'event',budget:'category',guests:'name',vendors:'name',references:'event'}[collection];return String(record?.[primary]||CONFIG.schemas[collection]?.title||'Bản ghi');}
function currentNotifications(){const today=localISODate(),items=[],settings=getSettings(),settingDates={registrationDate:'Đăng ký kết hôn',engagementDate:'Lễ ăn hỏi',pickupDate:'Rước dâu',groomPartyDate:'Tiệc nhà trai',bridePartyDate:'Tiệc nhà gái'};Object.entries(settingDates).forEach(([field,label])=>{if(settings[field]===today)items.push({id:`settings-${field}-${today}`,type:'date',tone:'date',title:`${label} diễn ra hôm nay`,message:`Ngày ${formatDate(today)} là mốc ${label.toLowerCase()} trong kế hoạch cưới.`,collection:'settings',field,value:today});});const dateFields={checklist:['dueDate'],timeline:['eventDate'],budget:['dueDate'],vendors:['decisionDue']};Object.entries(dateFields).forEach(([collection,fields])=>(DATA[collection]||[]).forEach(record=>fields.forEach(field=>{if(record[field]===today&&!['Hoàn thành','Hủy','Loại'].includes(record.status))items.push({id:`${collection}-${record.id}-${field}-${today}`,type:'date',tone:'date',title:`${fieldLabel(CONFIG.schemas[collection],field)} đến hạn hôm nay`,message:`${notificationRecordTitle(collection,record)} · ${formatDate(today)}`,collection,recordId:record.id,field,value:today});})));(DATA.budget||[]).forEach(record=>{const budgeted=Number(record.budgeted||0);if(budgeted<=0)return;const used=Number(record.actual||0)+Number(record.payable||0),remaining=budgeted-used,ratio=remaining/budgeted;if(remaining<0)items.push({id:`budget-over-${record.id}`,type:'budget',tone:'danger',title:`${record.category} đã vượt ngân sách`,message:`Vượt ${money(Math.abs(remaining))}. Tổng thực chi và cần thanh toán là ${money(used)} trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id});else if(ratio<.1)items.push({id:`budget-low-${record.id}`,type:'budget',tone:'warning',title:`${record.category} sắp hết ngân sách`,message:`Chỉ còn ${money(remaining)} (${Math.max(0,Math.round(ratio*100))}%) trên ngân sách ${money(budgeted)}.`,collection:'budget',recordId:record.id});});(DATA.notifications||[]).filter(row=>!row.accountId||row.accountId==='all'||row.accountId===currentPrincipalId()).forEach(row=>items.push({id:row.id,type:row.type,tone:row.tone,title:row.title,message:row.message,collection:row.collection,recordId:row.recordId,value:row.eventDate,readAt:row.readAt}));const unique=new Map();items.forEach(item=>unique.set(item.id,item));const order={danger:0,warning:1,date:2};return[...unique.values()].sort((a,b)=>(order[a.tone]??9)-(order[b.tone]??9));}
function updateNotificationBadge(){const count=currentNotifications().length,node=document.getElementById('notificationCount'),button=document.getElementById('notificationButton');if(node){node.textContent=count>99?'99+':String(count);node.classList.toggle('hidden',count===0);}if(button)button.title=count?`${count} thông báo cần chú ý`:'Không có thông báo mới';}
function openNotificationCenter(){const items=currentNotifications(),list=document.getElementById('notificationList');document.getElementById('notificationSummary').textContent=items.length?`${items.length} nội dung cần chú ý theo dữ liệu hiện tại.`:'Không có hạn mục đến hạn hoặc cảnh báo ngân sách.';list.innerHTML=items.length?items.map(item=>`<button type="button" data-notification-id="${esc(item.id)}" class="notification-item"><span class="notification-dot notification-dot--${item.tone}"></span><span class="min-w-0 flex-1"><span class="block text-sm font-semibold leading-5">${esc(item.title)}</span><span class="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">${esc(item.message)}</span></span>${icon('chevron-right','mt-1 size-4 shrink-0 text-slate-300')}</button>`).join(''):`<div class="px-6 py-12 text-center"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">${icon('bell-off','size-5')}</span><p class="mt-3 text-sm font-semibold">Chưa có cảnh báo</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Hệ thống sẽ tự động kiểm tra lại khi dữ liệu thay đổi.</p></div>`;list.querySelectorAll('[data-notification-id]').forEach(button=>button.addEventListener('click',()=>openNotificationDetail(button.dataset.notificationId)));document.getElementById('notificationDialog').showModal();refreshIcons();}
function openNotificationDetail(id){const item=currentNotifications().find(notification=>notification.id===id);if(!item)return;document.getElementById('notificationDialog').close();document.getElementById('notificationDetailType').textContent=item.type==='budget'?'Cảnh báo ngân sách':'Nhắc việc theo thời gian';document.getElementById('notificationDetailTitle').textContent=item.title;const iconWrap=document.getElementById('notificationDetailIcon');iconWrap.className=`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone==='danger'?'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300':item.tone==='warning'?'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300':'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'}`;iconWrap.innerHTML=icon(item.tone==='danger'?'triangle-alert':item.tone==='warning'?'badge-alert':'calendar-check','size-5');let details=`<div class="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/60 dark:text-slate-200">${esc(item.message)}</div>`;if(item.recordId&&CONFIG.schemas[item.collection]){const schema=CONFIG.schemas[item.collection],record=(DATA[item.collection]||[]).find(row=>row.id===item.recordId);if(record)details+=`<dl class="mt-4 grid gap-3 sm:grid-cols-2">${schema.fields.slice(0,8).map(([key,label])=>`<div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(label)}</dt><dd class="mt-1 text-sm">${displayValue(schema,key,record[key])}</dd></div>`).join('')}</dl>`;}document.getElementById('notificationDetailContent').innerHTML=details;document.getElementById('notificationDetailActions').innerHTML=item.recordId?`<button id="openNotificationRecord" type="button" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white">${icon('arrow-up-right','size-4')}Mở bản ghi</button>`:'';document.getElementById('openNotificationRecord')?.addEventListener('click',()=>{document.getElementById('notificationDetailDialog').close();navigate(item.collection);setTimeout(()=>openDetails(item.collection,item.recordId),180);});document.getElementById('notificationDetailDialog').showModal();refreshIcons();}

function completeNavigation(tab){const leavingSettings=UI.tab==='settings'&&tab!=='settings';if(leavingSettings){const adminToken=serverAdminToken();logoutServerToken(adminToken);secrets.remove(CONFIG.adminServerSessionKey);AUTH.settingsUnlocked=false;AUTH.adminAuthenticated=false;AUTH.masterPassword='';AUTH.accounts=[];AUTH.adminBypass=false;if(configuredEndpoint()){DATA.accounts=[];DATA.security=[];secrets.remove(CONFIG.sensitiveSessionKey);saveData();}}UI.tab=tab;UI.search='';UI.filter='Tất cả';UI.secondaryFilter=null;UI.advancedFilters={};UI.dateFilters={};UI.filterDraft=null;UI.filterPanelOpen=false;UI.visibleCount=CONFIG.pageSize;closeSidebar();setLoading(true);renderNavigation();renderHeader();setTimeout(()=>{setLoading(false);renderPage();if(tab!=='settings')enforceLoginGate();},120);}

function navigate(tab){if(tab==='settings'&&!AUTH.settingsUnlocked){openSettingsAccessDialog();return;}completeNavigation(tab);}

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
function renderPage(){const container=document.getElementById('mainContent');let content;if(UI.hydrationState==='error'&&!UI.hydrationHasCache)content=renderHydrationErrorState();else content=UI.loading?renderSkeleton():UI.tab==='dashboard'?renderDashboard():UI.tab==='settings'?renderSettings():renderCollection(UI.tab);container.innerHTML=`${renderHydrationBanner()}${content}`;bindPageEvents();document.getElementById('retryHydrationButton')?.addEventListener('click',()=>initialHydrateAfterLogin(true));bindNumberInputs(container);updateCoupleWidget();updateNotificationBadge();updatePendingIndicators();updateHydrationUi();refreshIcons();}
function renderSkeleton(){ return `<div class="space-y-5 animate-pulse-soft"><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${Array.from({length:4},()=>`<div class="h-36 rounded-2xl bg-slate-200/70 dark:bg-slate-800"></div>`).join('')}</div><div class="grid gap-5 xl:grid-cols-3"><div class="h-[430px] rounded-2xl bg-slate-200/70 dark:bg-slate-800 xl:col-span-2"></div><div class="h-[430px] rounded-2xl bg-slate-200/70 dark:bg-slate-800"></div></div></div>`; }

function daysUntil(value){ if(!value)return null; const now=new Date(); now.setHours(0,0,0,0); const date=new Date(`${value}T00:00:00`); if(Number.isNaN(date.getTime()))return null; return Math.ceil((date-now)/86400000); }
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
function saveDashboardText(event){event.preventDefault();if(!isAdministrator()){toast('Bạn không có quyền chỉnh sửa nội dung này.','error');return;}const value=document.getElementById('dashboardDescriptionInput').value.trim();if(!value)return;let item=(DATA.settings||[]).find(row=>row.key==='dashboardDescription');if(item){item.value=value;item.updatedAt=new Date().toISOString();}else{item={id:'setting-dashboardDescription',key:'dashboardDescription',value,notes:'Mô tả hiển thị tại tab Tổng quan',updatedAt:new Date().toISOString()};DATA.settings.push(item);}queueUpsert('settings',item);saveData();document.getElementById('dashboardTextDialog').close();renderPage();toast('Đã cập nhật nội dung giới thiệu tại Tổng quan.','success');}

function renderDashboard(){
  const checklist=DATA.checklist||[],budget=DATA.budget||[],guests=DATA.guests||[],vendors=DATA.vendors||[],settings=getSettings();
  const done=checklist.filter(row=>row.status==='Hoàn thành').length,inProgress=checklist.filter(row=>row.status==='Đang làm').length,waiting=checklist.filter(row=>row.status==='Chờ xác nhận').length;
  const completion=checklist.length?Math.round(done/checklist.length*100):0;
  const budgeted=budget.reduce((s,r)=>s+Number(r.budgeted||0),0),committed=budget.reduce((s,r)=>s+Number(r.committed||0),0),actual=budget.reduce((s,r)=>s+Number(r.actual||0),0),payable=budget.reduce((s,r)=>s+Number(r.payable||0),0);
  const attending=guests.filter(row=>row.rsvp==='Đồng ý').reduce((s,r)=>s+Number(r.partySize||1),0),rsvpCount=guests.filter(row=>row.name&&row.rsvp!=='Chưa phản hồi').length,namedGuests=guests.filter(row=>row.name).length;
  const selectedVendors=vendors.filter(row=>['Đã chọn','Đã cọc','Hoàn tất'].includes(row.status)).length,upcoming=checklist.filter(row=>row.status!=='Hoàn thành').slice(0,5);
  return `<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="relative isolate overflow-hidden px-5 py-6 sm:px-7 sm:py-8"><div class="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-brand-200/45 blur-3xl dark:bg-brand-900/25"></div><div class="absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-900/20"></div><div class="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"><div class="max-w-2xl"><div class="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-500/10 dark:text-brand-300">${icon('sparkles','size-3.5')} Wedding planning workspace</div><h3 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">${esc((settings.groomName||'Chú rể')+' × '+(settings.brideName||'Cô dâu'))}</h3><div class="mt-2 flex max-w-2xl items-start gap-2"><p class="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">${esc(settings.dashboardDescription||'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.')}</p>${isAdministrator()?`<button id="editDashboardDescription" type="button" aria-label="Chỉnh sửa nội dung giới thiệu" class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-brand-700 dark:hover:bg-slate-800 dark:hover:text-brand-300">${icon('pencil','size-3.5')}</button>`:''}</div><div class="mt-5 flex flex-wrap gap-2">${dateChip('Ăn hỏi',settings.engagementDate,'heart-handshake')}${dateChip('Rước dâu',settings.pickupDate,'car-front')}${dateChip('Tiệc nhà trai',settings.groomPartyDate,'sun')}${dateChip('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</div></div><div class="grid min-w-[260px] grid-cols-2 gap-3 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/45"><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Tiến độ</p><p class="mt-1 text-2xl font-bold tabular">${completion}%</p></div><div><p class="text-xs font-medium text-slate-500 dark:text-slate-400">Ngân sách</p><p class="mt-1 text-2xl font-bold tabular">${compactMoney(settings.totalBudget||400000000)}</p></div><div class="col-span-2"><div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div class="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-700" style="width:${completion}%"></div></div></div></div></div></div></section>
  <section class="countdown-grid event-progress-grid">${countdownCard('Đăng ký kết hôn',settings.registrationDate,'file-signature')}${countdownCard('Lễ ăn hỏi',settings.engagementDate,'heart-handshake')}${countdownCard('Rước dâu',settings.pickupDate,'car-front')}${countdownCard('Tiệc nhà trai',settings.groomPartyDate,'sun')}${countdownCard('Tiệc nhà gái',settings.bridePartyDate,'moon-star')}</section>
  <section class="dashboard-metric-grid">${metricCard('Tiến độ tổng thể',`${completion}%`,`${done}/${checklist.length} công việc hoàn thành`,'circle-check-big','emerald',`${completion}%`)}${metricCard('Đang xử lý',inProgress,`${waiting} việc chờ xác nhận`,'loader-circle','blue')}${metricCard('Dòng tiền',compactMoney(actual),`Cần thanh toán ${compactMoney(payable)}`,'chart-no-axes-combined',actual>Number(settings.operatingBudget||360000000)?'rose':'violet')}${metricCard('Khách xác nhận',attending,`${rsvpCount}/${namedGuests||0} lời phản hồi`,'users-round','amber')}</section>
  <section class="mt-5 grid gap-5 xl:grid-cols-3"><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">${panelHeader('Việc cần ưu tiên','Theo dõi những đầu việc chưa hoàn thành','arrow-up-right','Mở checklist',"navigate('checklist')")}<div class="divide-y divide-slate-100 dark:divide-slate-800">${upcoming.length?upcoming.map((row,index)=>`<button type="button" onclick="openDetails('checklist',decodeURIComponent('${encoded(row.id)}'))" class="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/55 sm:px-6"><span class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-brand-500/10 dark:group-hover:text-brand-300">${String(index+1).padStart(2,'0')}</span><span class="min-w-0 flex-1"><span class="block font-semibold leading-6">${esc(row.task)}</span><span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span class="inline-flex items-center gap-1">${icon('user-round','size-3.5')}${esc(row.owner||'Chưa giao')}</span><span class="inline-flex items-center gap-1">${icon('map-pin','size-3.5')}${esc(row.location||'Chưa chốt')}</span></span></span><span class="hidden shrink-0 sm:block">${statusBadge(row.status)}</span>${icon('chevron-right','mt-2 size-4 shrink-0 text-slate-300')}</button>`).join(''):emptyStateInline('Chưa có công việc','Thêm công việc mới để bắt đầu theo dõi tiến độ.')}</div></div><div class="space-y-5"><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Ngân sách','Tỷ lệ sử dụng kế hoạch','wallet-cards')}<div class="space-y-5 px-5 pb-6 sm:px-6">${budgetProgress('Đã cam kết',committed,budgeted,'bg-indigo-500')}${budgetProgress('Thực chi',actual,budgeted,'bg-brand-600')}<div class="grid grid-cols-2 gap-3 pt-1"><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Còn lại</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(Math.max(budgeted-actual-payable,0))}</p></div><div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60"><p class="text-xs text-slate-500 dark:text-slate-400">Dự phòng</p><p class="mt-1 text-sm font-bold tabular">${compactMoney(settings.reserveBudget||40000000)}</p></div></div></div></div><div class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Tình trạng dữ liệu','Google Sheets là nguồn dữ liệu chính','activity')}<div class="space-y-3 px-5 pb-6 sm:px-6">${healthRow('Thay đổi chờ đồng bộ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Nhà cung cấp đã chọn',`${selectedVendors} đơn vị`,selectedVendors?'blue':'slate')}${healthRow('Lần đồng bộ cuối',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa đồng bộ',UI.lastSyncAt?'emerald':'amber')}</div></div></div></section>`;
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
      statCard('Ngân sách đề xuất',compactMoney(totals.budgeted),'wallet-cards','blue',"setMetricFilter('budgeted')",UI.secondaryFilter?.type==='metric'&&UI.secondaryFilter.value==='budgeted'),
      statCard('Cần thanh toán',compactMoney(totals.payable),'receipt-text','amber',"setMetricFilter('payable')",UI.secondaryFilter?.value==='payable'),
      statCard('Thực chi',compactMoney(totals.actual),'badge-dollar-sign','rose',"setMetricFilter('actual')",UI.secondaryFilter?.value==='actual'),
      statCard('Còn lại',compactMoney(totals.remaining),'piggy-bank','emerald',"setMetricFilter('remaining')",UI.secondaryFilter?.value==='remaining')
    ],'budget');
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

function statCard(label,value,iconName,tone,action,active=false){ const tones={emerald:'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',blue:'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',amber:'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',orange:'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',rose:'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',slate:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}; return `<button type="button" onclick="${action}" class="widget-stat-card rounded-2xl border ${active?'border-brand-500 ring-1 ring-brand-600/10':'border-slate-200 dark:border-slate-800'} bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:bg-slate-900 dark:hover:border-slate-700" aria-label="${esc(label)}: ${esc(value)}"><div class="widget-stat-card__head"><div class="widget-stat-card__copy"><p class="widget-stat-card__label text-xs font-semibold text-slate-500 dark:text-slate-400">${label}</p><p class="widget-stat-card__value text-lg font-bold tabular sm:text-xl">${value}</p></div><span class="widget-stat-card__icon grid size-8 place-items-center rounded-xl ${tones[tone]||tones.slate}">${icon(iconName,'size-3.5')}</span></div></button>`; }

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
  const dateHtml=dateFields.length?`<section class="filter-form-section"><div><p class="text-sm font-bold">Khoảng ngày</p><p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Có thể nhập một hoặc cả hai mốc ngày; các điều kiện được kết hợp đồng thời.</p></div>${dateFields.map(([key,label])=>{const range=UI.filterDraft?.dateFilters?.[key]||{};return `<div><div class="filter-form-label"><span>${esc(label)}</span><span class="filter-form-operator">trong khoảng</span></div><div class="filter-date-grid"><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Từ ngày</span><input type="date" data-filter-date-field="${esc(key)}" data-date-bound="from" value="${esc(range.from||'')}" class="filter-control" /></label><label><span class="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">Đến ngày</span><input type="date" data-filter-date-field="${esc(key)}" data-date-bound="to" value="${esc(range.to||'')}" class="filter-control" /></label></div></div>`;}).join('')}</section>`:'';
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
  renderFilterDialogBody(UI.tab); document.getElementById('filterDialog').showModal(); setTimeout(()=>document.getElementById('filterKeywordInput')?.focus(),50);
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
function renderColumnSettingsDraft(){const list=document.getElementById('columnSettingsList'),schema=CONFIG.schemas[UI.columnCollection];if(!list||!schema)return;list.innerHTML=UI.columnDraft.map((item,index)=>`<div class="column-option-row ${item.key===ACTION_COLUMN_KEY?'column-option-row--actions':''}"><label class="inline-flex items-center gap-3"><input type="checkbox" data-column-visible="${index}" ${item.visible?'checked':''} class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"><span class="text-sm font-semibold">${esc(fieldLabel(schema,item.key))}</span></label><span class="truncate text-[10px] font-mono text-slate-400">${esc(item.key===ACTION_COLUMN_KEY?'core.actions':item.key)}</span><span class="flex"><button type="button" data-column-up="${index}" ${index===0?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa lên">${icon('chevron-up','size-4')}</button><button type="button" data-column-down="${index}" ${index===UI.columnDraft.length-1?'disabled':''} class="column-move-button disabled:opacity-30" aria-label="Đưa xuống">${icon('chevron-down','size-4')}</button></span></div>`).join('');list.querySelectorAll('[data-column-visible]').forEach(input=>input.addEventListener('change',()=>{UI.columnDraft[Number(input.dataset.columnVisible)].visible=input.checked;}));list.querySelectorAll('[data-column-up]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnUp),-1)));list.querySelectorAll('[data-column-down]').forEach(button=>button.addEventListener('click',()=>moveColumnDraft(Number(button.dataset.columnDown),1)));refreshIcons();}
function moveColumnDraft(index,delta){const next=index+delta;if(next<0||next>=UI.columnDraft.length)return;[UI.columnDraft[index],UI.columnDraft[next]]=[UI.columnDraft[next],UI.columnDraft[index]];renderColumnSettingsDraft();}
function resetColumnSettings(){const defaults=[...CONFIG.schemas[UI.columnCollection].columns,ACTION_COLUMN_KEY],all=allColumnKeys(UI.columnCollection);UI.columnDraft=[...defaults,...all.filter(key=>!defaults.includes(key))].map(key=>({key,visible:defaults.includes(key)}));renderColumnSettingsDraft();}
function saveColumnSettings(event){event.preventDefault();const selected=UI.columnDraft.filter(item=>item.visible).map(item=>item.key);if(!selected.some(key=>key!==ACTION_COLUMN_KEY)){toast('Cần chọn ít nhất một cột dữ liệu để làm tiêu đề bản ghi.','error');return;}const pref=getCurrentPreference(),columns={...(pref?.columns||{}),[UI.columnCollection]:{order:UI.columnDraft.map(item=>item.key),visible:selected}};updateCurrentPreference({columns});document.getElementById('columnSettingsDialog').close();renderPage();toast('Đã lưu thứ tự và cột hiển thị, bao gồm cột Tác vụ.','success');}
function toggleTimelineSort(){UI.timelineSortDirection=UI.timelineSortDirection==='asc'?'desc':'asc';renderPage();}

function filteredRows(collection){
  const schema=CONFIG.schemas[collection]; let rows=[...collectionRows(collection)]; const query=UI.search.trim().toLowerCase();
  if(query) rows=rows.filter(row=>schema.search.some(key=>String(Array.isArray(row[key])?row[key].join(' '):(row[key]??'')).toLowerCase().includes(query)));
  if(UI.filter!=='Tất cả'&&schema.statusField) rows=rows.filter(row=>row[schema.statusField]===UI.filter);
  if(UI.secondaryFilter){ const f=UI.secondaryFilter; if(f.type==='metric') rows=rows.filter(row=>Number(row[f.value]||0)>0); else rows=rows.filter(row=>row[f.field]===f.value); }
  Object.entries(UI.advancedFilters||{}).forEach(([field,selected])=>{ if(!Array.isArray(selected)||!selected.length)return; rows=rows.filter(row=>{ const current=Array.isArray(row[field])?row[field].map(String):[String(row[field]??'')]; return selected.some(value=>current.includes(String(value))); }); });
  Object.entries(UI.dateFilters||{}).forEach(([field,range])=>{ if(!range||(!range.from&&!range.to))return; rows=rows.filter(row=>{ const current=String(row[field]||'').slice(0,10); if(!current)return false; if(range.from&&current<range.from)return false; if(range.to&&current>range.to)return false; return true; }); });
  if(collection==='timeline')rows.sort((a,b)=>{const direction=UI.timelineSortDirection==='desc'?-1:1,ad=String(a.eventDate||'9999-12-31'),bd=String(b.eventDate||'9999-12-31');if(ad!==bd)return ad.localeCompare(bd)*direction;return String(a.startTime||'').localeCompare(String(b.startTime||''))*direction;});
  return rows;
}

function renderCollection(collection){
  const schema=CONFIG.schemas[collection],visibleColumns=getVisibleColumns(collection),all=collectionRows(collection),filtered=filteredRows(collection),rows=filtered.slice(0,UI.visibleCount),hasMore=rows.length<filtered.length,filterCount=activeCollectionFilterCount();
  const toolbarButtonClass='collection-toolbar-button';
  const sortButton=collection==='timeline'?`<button id="timelineSortButton" type="button" class="${toolbarButtonClass}">${icon(UI.timelineSortDirection==='asc'?'arrow-up-narrow-wide':'arrow-down-wide-narrow','size-4')}<span>Ngày ${UI.timelineSortDirection==='asc'?'tăng dần':'giảm dần'}</span></button>`:'';
  const addDisabled=UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra phiên bản dữ liệu mới nhất"':'';
  return `${collectionWidgets(collection)}<section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="collection-panel-toolbar border-b border-slate-200 dark:border-slate-800"><div class="collection-panel-toolbar__heading"><h3>${schema.title}</h3><p>${plural(all.length,'bản ghi')} · ${plural(filtered.length,'kết quả phù hợp')}</p></div><div class="collection-panel-toolbar__actions"><button id="openFilterDialogButton" type="button" class="${toolbarButtonClass} ${filterCount?'collection-toolbar-button--active':''}">${icon('search','size-4')}<span>Tìm kiếm & bộ lọc</span>${filterCount?`<span class="rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] text-white">${filterCount}</span>`:''}</button>${filterCount?`<button id="clearCollectionFiltersButton" type="button" class="${toolbarButtonClass} collection-toolbar-button--muted">${icon('filter-x','size-4')}<span>Xóa lọc</span></button>`:''}${sortButton}<button id="customizeColumnsButton" type="button" class="${toolbarButtonClass}">${icon('columns-3','size-4')}<span>Cột hiển thị</span></button><button id="addRecordButton" type="button" ${addDisabled} class="collection-toolbar-add">${icon('plus','size-4')}<span>Thêm ${schema.singular}</span></button></div></div>${filterCount?`<div class="filter-active-strip"><span class="mr-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Đang lọc</span>${renderFilterChips(collection)}</div>`:''}
  ${rows.length?`<div class="collection-table-scroll hidden md:block app-scrollbar"><table class="data-table w-full min-w-[980px] text-left text-sm"><thead class="collection-table-head bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr>${visibleColumns.map(key=>`<th scope="col" class="${dataColumnClass(schema,key)} px-5 py-3 font-semibold ${key===ACTION_COLUMN_KEY?'text-right':''}">${esc(fieldLabel(schema,key))}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${rows.map(row=>renderTableRow(collection,schema,row,visibleColumns)).join('')}</tbody></table></div><div class="grid gap-3 p-3 md:hidden">${rows.map(row=>renderMobileCard(collection,schema,row,visibleColumns)).join('')}</div>`:emptyState('Không tìm thấy dữ liệu',hasActiveAdvancedFilters()?'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả.':`Thêm ${schema.singular} đầu tiên để bắt đầu quản lý.`,'search-x',true)}
  <div class="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p class="text-xs text-slate-500 dark:text-slate-400">Đang hiển thị <span class="font-semibold text-slate-700 dark:text-slate-200">${rows.length}</span> trong ${filtered.length} bản ghi</p>${hasMore?`<button id="loadMoreButton" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevrons-down','size-3.5')}Xem thêm 20 bản ghi</button>`:`<span class="text-xs font-semibold text-slate-400">Đã hiển thị toàn bộ</span>`}</div></section>`;
}

function mutationActionDisabled(){return UI.mutationLocked?'disabled aria-disabled="true" title="Đang kiểm tra dữ liệu mới nhất"':'';}
function actionButtons(collection,row,mobile=false){ const cls=mobile?'inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 text-[10px] font-semibold dark:border-slate-700 disabled:cursor-not-allowed disabled:opacity-40':'grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-35'; const locked=mutationActionDisabled();return `<button type="button" data-report="${esc(row.id)}" ${locked} class="${cls}" aria-label="Báo cáo">${icon('clipboard-pen-line','size-4')}${mobile?'Báo cáo':''}</button><button type="button" data-detail="${esc(row.id)}" class="${cls}" aria-label="Xem chi tiết">${icon('eye','size-4')}${mobile?'Chi tiết':''}</button><button type="button" data-edit="${esc(row.id)}" ${locked} class="${cls}" aria-label="Chỉnh sửa">${icon('pencil','size-4')}${mobile?'Sửa':''}</button><button type="button" data-delete="${esc(row.id)}" ${locked} class="${cls} ${mobile?'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300':'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300'}" aria-label="Xóa">${icon('trash-2','size-4')}${mobile?'Xóa':''}</button>`; }
function titleDisplayValue(schema,key,value){return fieldType(schema,key)==='url'?esc(value||'—'):displayValue(schema,key,value);}
function renderTableRow(collection,schema,row,columns=getVisibleColumns(collection)){const titleKey=primaryTitleKey(schema,columns);return `<tr class="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/45">${columns.map(key=>{if(key===ACTION_COLUMN_KEY)return `<td class="${dataColumnClass(schema,key)} px-4 py-3 align-middle"><div class="flex items-center justify-end gap-1">${actionButtons(collection,row)}</div></td>`;const isTitle=key===titleKey,content=isTitle?titleDisplayValue(schema,key,row[key]):displayValue(schema,key,row[key]);return `<td class="${dataColumnClass(schema,key)} px-5 py-4 align-top ${isTitle?'font-semibold text-slate-900 dark:text-white':'text-slate-600 dark:text-slate-300'}"><div class="data-cell-content">${isTitle?`<button type="button" data-detail="${esc(row.id)}" class="record-title-button" aria-label="Xem chi tiết ${esc(schema.singular)}">${content}</button>`:content}</div></td>`;}).join('')}</tr>`;}
function renderMobileCard(collection,schema,row,columns=getVisibleColumns(collection)){const dataColumns=columns.filter(key=>key!==ACTION_COLUMN_KEY),titleKey=primaryTitleKey(schema,dataColumns),secondary=dataColumns.filter(key=>key!==titleKey).slice(0,4),showActions=columns.includes(ACTION_COLUMN_KEY);return `<article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[.99] dark:border-slate-800 dark:bg-slate-900"><div class="flex items-start gap-3"><div class="min-w-0 flex-1"><button type="button" data-detail="${esc(row.id)}" class="record-title-button text-sm font-bold leading-6">${titleDisplayValue(schema,titleKey,row[titleKey])}</button>${schema.statusField?`<div class="mt-2">${statusBadge(row[schema.statusField])}</div>`:''}</div></div><dl class="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">${secondary.map(key=>`<div class="min-w-0"><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(fieldLabel(schema,key))}</dt><dd class="mobile-card-value mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">${displayValue(schema,key,row[key])}</dd></div>`).join('')}</dl>${showActions?`<div class="mt-4 flex gap-1">${actionButtons(collection,row,true)}</div>`:''}</article>`;}
function emptyState(title,description,emptyIcon='inbox',withAction=false){ return `<div class="px-5 py-16 text-center"><div class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon(emptyIcon,'size-6')}</div><h4 class="mt-4 font-bold">${title}</h4><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">${description}</p>${withAction?`<button type="button" id="clearFiltersButton" class="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('rotate-ccw','size-4')}Đặt lại bộ lọc</button>`:''}</div>`; }
function emptyStateInline(title,description){ return `<div class="px-6 py-12 text-center"><div class="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">${icon('inbox','size-5')}</div><p class="mt-3 font-semibold">${title}</p><p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${description}</p></div>`; }

function renderSettings(){
  const settings=getSettings(),accent=getCurrentPreference()?.accent||settings.accentTheme||'pink',endpoint=String(settings.googleSheetsEndpoint||storage.get(CONFIG.endpointKey,'')).trim(),connectionScope=AUTH.remoteStatus?.connectionPasswordScope||'bootstrap-only',hasSchemaPassword=Boolean(connectionSecrets.get(CONFIG.schemaPasswordKey,''));
  return `<div class="space-y-5"><div class="grid gap-5 xl:grid-cols-3"><section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">${panelHeader('Thông tin kế hoạch','Các ngày chính, ngân sách và quy mô khách mời','settings-2')}<form id="settingsForm" class="grid gap-5 px-5 pb-6 sm:grid-cols-2 sm:px-6">${settingInput('brideName','Tên cô dâu',settings.brideName,'text','Nhập tên cô dâu')}${settingInput('groomName','Tên chú rể',settings.groomName,'text','Nhập tên chú rể')}${settingInput('registrationDate','Ngày đăng ký kết hôn',settings.registrationDate,'date')}${settingInput('engagementDate','Ngày lễ ăn hỏi',settings.engagementDate,'date')}${settingInput('pickupDate','Ngày rước dâu',settings.pickupDate,'date')}${settingInput('groomPartyDate','Ngày tiệc nhà trai',settings.groomPartyDate,'date')}${settingInput('bridePartyDate','Ngày tiệc nhà gái',settings.bridePartyDate,'date')}${settingInput('totalBudget','Ngân sách tổng',settings.totalBudget,'number')}${settingInput('reserveBudget','Quỹ dự phòng',settings.reserveBudget,'number')}${settingInput('operatingBudget','Ngân sách vận hành',settings.operatingBudget,'number')}${settingInput('groomGuests','Khách dự kiến nhà trai',settings.groomGuests,'number')}${settingInput('brideGuests','Khách dự kiến nhà gái',settings.brideGuests,'number')}<div class="sm:col-span-2">${settingInput('style','Phong cách',settings.style,'text','Sang trọng – tối giản – lãng mạn')}</div><div class="sm:col-span-2">${settingTextarea('dashboardDescription','Nội dung giới thiệu tại Tổng quan',settings.dashboardDescription,'Quản lý công việc, ngân sách, khách mời và nhà cung cấp trong một giao diện thống nhất, đồng bộ thay đổi lên Google Sheets.')}</div><div class="sm:col-span-2 flex justify-end"><button type="submit" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500">${icon('save','size-4')}Lưu thiết lập</button></div></form></section><div class="space-y-5"><section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900"><div class="flex items-center justify-between gap-3 px-4 py-4"><div><h3 class="text-sm font-bold tracking-tight">Màu giao diện</h3><p class="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Lựa chọn màu chủ đạo</p></div><span class="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">${icon('palette','size-4')}</span></div><div class="settings-appearance-grid grid grid-cols-3 gap-2 px-4 pb-3">${Object.entries(ACCENT_THEMES).map(([key,theme])=>`<button type="button" data-accent="${key}" class="appearance-choice ${accent===key?'is-active':''}"><span class="size-4 shrink-0 rounded-full" style="background:${theme.swatch}"></span><span class="truncate leading-none">${theme.label}</span></button>`).join('')}</div><div class="mx-4 mt-2 border-t border-slate-200 pb-4 pt-4 dark:border-slate-800"><button id="settingsThemeButton" type="button" class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"><span class="flex items-center gap-3"><span class="grid size-8 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">${icon(isDark()?'moon-star':'sun','size-3.5')}</span><span class="leading-none"><span class="block text-xs font-semibold leading-4">Dark mode</span><span class="block text-[10px] leading-4 text-slate-500 dark:text-slate-400">${isDark()?'Đang bật':'Đang tắt'}</span></span></span><span class="relative h-5 w-9 rounded-full transition ${isDark()?'bg-brand-600':'bg-slate-300 dark:bg-slate-700'}"><span class="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition ${isDark()?'left-[18px]':'left-0.5'}"></span></span></button></div></section><section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Đồng bộ dữ liệu','Google Sheets Apps Script và hàng đợi thay đổi','database')}<div class="space-y-3 px-5 pb-6 sm:px-6">${healthRow('Thay đổi đang chờ',`${UI.pendingChanges.length} bản ghi`,UI.pendingChanges.length?'amber':'emerald')}${healthRow('Khởi tạo dữ liệu',endpoint?(needsInitialFullSync(endpoint)?'Chưa đồng bộ toàn bộ':'Đã hoàn tất'):'Chưa kết nối',endpoint&&!needsInitialFullSync(endpoint)?'emerald':'amber')}${healthRow('Cấu trúc Google Sheets',remoteSchemaStatus(endpoint),endpoint&&!needsSchemaSync(endpoint)?'emerald':'amber')}${healthRow('Lần đồng bộ gần nhất',UI.lastSyncAt?formatDateTime(UI.lastSyncAt):'Chưa có',UI.lastSyncAt?'blue':'slate')}${healthRow('Đồng bộ tự động',autoSyncStatusLabel(),UI.syncMode==='automatic'?'amber':activeServerToken(false)?'emerald':'slate')}<div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div class="flex items-start gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">${icon('link-2','size-4')}</span><div class="min-w-0 flex-1"><p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Google Sheets Apps Script URL</p><p class="mt-1 truncate text-xs font-medium" title="${esc(endpoint)}">${endpoint?esc(endpoint):'Chưa cấu hình'}</p><p class="mt-1 text-[10px] text-slate-400">Mật khẩu kết nối: ${connectionScope==='bootstrap-only'?'Chỉ dùng khi khởi tạo':'Không sử dụng'} · Schema: ${hasSchemaPassword?'Mật khẩu riêng':'Theo phiên quản trị'}</p></div></div><button id="openConnectionDialog" type="button" class="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-brand-700 dark:bg-white dark:text-slate-950 dark:hover:bg-brand-300">${icon('key-round','size-3.5')}Cập nhật kết nối</button></div><button id="schemaSyncButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center gap-3 rounded-2xl border border-indigo-200 px-4 py-3 text-left text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10">${icon('table-properties','size-4')}Cập nhật cấu trúc sheet tự động</button><button id="fullSyncButton" type="button" ${endpoint?'':'disabled'} class="flex w-full items-center gap-3 rounded-2xl border border-brand-200 px-4 py-3 text-left text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-900 dark:text-brand-300 dark:hover:bg-brand-500/10">${icon('cloud-upload','size-4')}Đồng bộ toàn bộ dữ liệu hiện có</button><button id="exportButton" type="button" class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">${icon('download','size-4 text-slate-500')}Xuất dữ liệu JSON</button><button id="resetButton" type="button" class="flex w-full items-center gap-3 rounded-2xl border border-rose-200 px-4 py-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">${icon('rotate-ccw','size-4')}Khôi phục dữ liệu mặc định</button></div></section></div></div>
  ${renderAccountManagement()}
  <section class="rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">${panelHeader('Danh mục dùng chung','Mỗi danh mục hiển thị tối đa 5 bản ghi trên một trang','list-plus')}<div class="grid gap-4 px-5 pb-6 sm:grid-cols-2 xl:grid-cols-3 sm:px-6">${Object.entries(CONFIG.lookupLabels).map(([key,label])=>lookupManager(key,label)).join('')}</div></section>
  <section class="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-500/10"><div class="flex gap-3"><span class="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">${icon('info','size-4')}</span><div><p class="text-sm font-bold text-blue-900 dark:text-blue-100">Google Sheets là nguồn lưu trữ chính</p><p class="mt-1 text-xs leading-5 text-blue-800/75 dark:text-blue-200/70">Khi thêm module hoặc trường mới trong cấu hình HTML, lần đồng bộ tiếp theo sẽ tự tạo sheet và bổ sung cột tương ứng trước khi ghi dữ liệu. Hệ thống không tự xóa cột hoặc sheet cũ để tránh mất dữ liệu.</p></div></div></section></div>`;
}

function settingInput(key,label,value,type='text',placeholder=''){
  const numeric=type==='number';
  return `<label class="block"><span class="mb-2 block text-sm font-semibold">${label}</span><input name="${key}" type="${numeric?'text':type}" ${numeric?'inputmode="numeric" data-number-input="1" autocomplete="off"':''} value="${esc(numeric?formatNumberInputValue(value):value??'')}" placeholder="${esc(placeholder)}" class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600" /></label>`;
}
function settingTextarea(key,label,value,placeholder=''){
  return `<label class="block"><span class="mb-2 block text-sm font-semibold">${esc(label)}</span><textarea name="${esc(key)}" rows="4" maxlength="320" required placeholder="${esc(placeholder)}" class="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600">${esc(value??'')}</textarea><span class="mt-1 block text-[10px] text-slate-400">Tối đa 320 ký tự; nội dung này hiển thị tại tab Tổng quan.</span></label>`;
}
function lookupManager(key,label){
  const values=DATA.lookups[key]||[],pageSize=CONFIG.lookupPageSize,totalPages=Math.max(1,Math.ceil(values.length/pageSize)),page=Math.min(Math.max(1,Number(UI.lookupPages[key]||1)),totalPages),start=(page-1)*pageSize,visible=values.slice(start,start+pageSize); UI.lookupPages[key]=page;
  return `<div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><div class="flex items-start justify-between gap-2"><div><p class="text-sm font-bold">${label}</p><p class="mt-1 text-[10px] text-slate-400">${values.length} lựa chọn</p></div><span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">${page}/${totalPages}</span></div><div class="mt-3 min-h-[12.25rem] space-y-2">${visible.map((value,index)=>{const actualIndex=start+index;return `<div class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/60"><span class="min-w-0 flex-1 truncate text-xs font-medium" title="${esc(value)}">${esc(value)}</span><button type="button" data-lookup-edit="${key}" data-index="${actualIndex}" class="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-brand-700 dark:hover:bg-slate-800">${icon('pencil','size-3.5')}</button><button type="button" data-lookup-delete="${key}" data-index="${actualIndex}" class="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10">${icon('x','size-3.5')}</button></div>`;}).join('')||'<div class="grid min-h-[10rem] place-items-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-800">Chưa có lựa chọn</div>'}</div><div class="mt-3 flex items-center justify-between gap-2"><button type="button" data-lookup-page="${key}" data-page="${page-1}" ${page<=1?'disabled':''} class="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevron-left','size-3.5')}</button><span class="text-[10px] font-medium text-slate-400">${values.length?`${start+1}–${Math.min(start+pageSize,values.length)} / ${values.length}`:'0 / 0'}</span><button type="button" data-lookup-page="${key}" data-page="${page+1}" ${page>=totalPages?'disabled':''} class="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800">${icon('chevron-right','size-3.5')}</button></div><div class="mt-3 flex gap-2"><input data-lookup-input="${key}" placeholder="Thêm lựa chọn" class="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"/><button type="button" data-lookup-add="${key}" class="grid size-9 place-items-center rounded-xl bg-brand-700 text-white hover:bg-brand-800">${icon('plus','size-4')}</button></div></div>`;
}

function getFieldOptions(options){
  if(Array.isArray(options)) return options;
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

function fieldsForMode(schema,mode){ return mode==='report'?schema.fields.filter(field=>schema.reportFields.includes(field[0])):schema.fields; }
function ensureMutationReady(){if(!UI.mutationLocked)return true;toast('Dữ liệu đang được kiểm tra phiên bản mới nhất. Vui lòng chờ đồng bộ ban đầu hoàn tất.','info');return false;}
function openEditor(collection,id='',mode='edit'){
  if(!ensureMutationReady())return;const schema=CONFIG.schemas[collection];if(!schema)return;const record=id?(DATA[collection]||[]).find(row=>row.id===id):null,recordId=id||uid(collection);UI.editing={collection,id,recordId,mode,pendingFiles:[]};
  document.getElementById('editorTitle').textContent=mode==='report'?`Báo cáo ${schema.singular}`:record?`Chỉnh sửa ${schema.singular}`:`Thêm ${schema.singular}`;
  document.getElementById('editorSubtitle').textContent=mode==='report'?'Cập nhật kết quả thực hiện và số liệu phát sinh. Các số liệu liên kết sẽ được đồng bộ sang Ngân sách.':record?'Các thay đổi được lưu vào hàng đợi để đồng bộ Google Sheets.':`Tạo một ${schema.singular} mới trong hệ thống.`;
  const fields=document.getElementById('editorFields');fields.innerHTML=fieldsForMode(schema,mode).map(field=>renderEditorField(field,record?.[field[0]])).join('')+renderAttachmentEditorSection(collection,recordId,mode);bindNumberInputs(fields);bindReferenceSourceDetection(fields,collection);bindAttachmentEditorControls();
  const dialog=document.getElementById('editorDialog');dialog.showModal();refreshIcons();setTimeout(()=>dialog.querySelector('input:not([type="file"]),select,textarea')?.focus(),50);
}

function openReport(collection,id){ openEditor(collection,id,'report'); }
function renderEditorField([key,label,type,options],value=''){
  const baseClass='w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600';
  const common=`name="${key}" id="field-${key}"`;let control='';const opts=getFieldOptions(options);const allowBlank=options?.allowBlank;
  if(type==='select')control=`<select ${common} class="${baseClass} h-11">${allowBlank?'<option value="">— Chưa chọn —</option>':''}${opts.map(option=>`<option value="${esc(option)}" ${String(value)===String(option)?'selected':''}>${esc(option)}</option>`).join('')}</select>`;
  else if(type==='multiselect'){const selected=Array.isArray(value)?value:[value].filter(Boolean);control=`<select ${common} multiple size="5" class="${baseClass} min-h-28 py-2">${opts.map(option=>`<option value="${esc(option)}" ${selected.includes(option)?'selected':''}>${esc(option)}</option>`).join('')}</select><p class="mt-1 text-[10px] text-slate-400">Giữ Ctrl/Cmd để chọn nhiều nhà cung cấp.</p>`;}
  else if(type==='rating'){const score=Number(value||0);control=`<div class="rating-picker">${[1,2,3,4,5].map(number=>`<label><input type="radio" name="${key}" value="${number}" ${score===number?'checked':''}/><span>${number} ★</span></label>`).join('')}</div><p class="mt-1 text-[10px] text-slate-400">Chọn mức đánh giá từ 1 đến 5 sao.</p>`;}
  else if(type==='textarea')control=`<textarea ${common} rows="4" class="${baseClass} min-h-28 py-3">${esc(value)}</textarea>`;
  else if(type==='number'||type==='currency')control=`<input ${common} class="${baseClass} h-11 tabular" type="text" inputmode="numeric" autocomplete="off" data-number-input="1" data-number-kind="${type}" value="${esc(formatNumberInputValue(value))}" />`;
  else control=`<input ${common} class="${baseClass} h-11" type="${type}" value="${esc(value??'')}" />`;
  return `<label class="block"><span class="mb-2 flex items-center gap-1.5 text-sm font-semibold">${esc(label)}${['task','name','category','event'].includes(key)?'<span class="text-brand-600">*</span>':''}</span>${control}</label>`;
}

function syncChecklistBudget(next,previous={}){
  const prevCategory=previous.budgetCategory||'',nextCategory=next.budgetCategory||'';
  const prevActual=Number(previous.actualCost||0),nextActual=Number(next.actualCost||0),prevPayable=Number(previous.payableCost||0),nextPayable=Number(next.payableCost||0);
  const adjust=(category,actualDelta,payableDelta)=>{ if(!category)return; const row=(DATA.budget||[]).find(item=>item.category===category); if(!row)return; row.actual=Math.max(0,Number(row.actual||0)+actualDelta); row.payable=Math.max(0,Number(row.payable||0)+payableDelta); row.remaining=Number(row.budgeted||0)-Number(row.actual||0)-Number(row.payable||0); row.variance=Number(row.budgeted||0)-Number(row.actual||0); row.updatedAt=new Date().toISOString(); queueUpsert('budget',row); };
  if(prevCategory===nextCategory) adjust(nextCategory,nextActual-prevActual,nextPayable-prevPayable); else { adjust(prevCategory,-prevActual,-prevPayable); adjust(nextCategory,nextActual,nextPayable); }
}

async function saveEditor(event){
  event.preventDefault();if(!ensureMutationReady()||!UI.editing)return;const editing=UI.editing,{collection,id,recordId,mode}=editing,schema=CONFIG.schemas[collection],form=new FormData(event.currentTarget),record=id?DATA[collection].find(row=>row.id===id):{id:recordId},previous=record?structuredClone(record):{};
  fieldsForMode(schema,mode).forEach(([key,,type])=>{let value=type==='multiselect'?form.getAll(key):(form.get(key)??'');if(type==='rating')value=Number(value||0);else if(['number','currency'].includes(type))value=parseFormattedNumber(value);record[key]=value;});
  if(collection==='references'&&record.sourceUrl){const detected=detectReferenceSourceFromUrl(record.sourceUrl);if(detected)record.source=detected;}
  if(collection==='budget'){record.variance=Number(record.budgeted||0)-Number(record.actual||0);record.remaining=Number(record.budgeted||0)-Number(record.actual||0)-Number(record.payable||0);}
  if(collection==='checklist'){record.variance=Number(record.budgetEstimate||0)-Number(record.actualCost||0);syncChecklistBudget(record,previous);}
  if(collection==='timeline'&&record.startTime&&record.durationMinutes)record.endTime=addMinutes(record.startTime,Number(record.durationMinutes));
  if(!id){DATA[collection].unshift(record);UI.editing.id=record.id;}record.updatedAt=new Date().toISOString();saveData();queueUpsert(collection,record);
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
    const preferred=[statusKey,'event','eventDate','startTime','durationMinutes','endTime','description','location','owner','vendor','notes'].filter(Boolean);
    const used=new Set();
    const ordered=[];
    preferred.forEach(key=>{const item=byKey.get(key);if(item&&!used.has(key)){ordered.push(item);used.add(key);}});
    base.forEach(item=>{if(!used.has(item.key))ordered.push(item);});
    return ordered;
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
function openDetails(collection,id){
  const schema=CONFIG.schemas[collection],record=(DATA[collection]||[]).find(row=>row.id===id); if(!record)return;
  document.getElementById('detailTitle').textContent=`Chi tiết ${schema.singular}`;
  const statusKey=schema.statusField||'';
  const rows=detailLayoutRows(collection,schema,record);
  document.getElementById('detailContent').innerHTML=`<dl class="detail-grid">${rows.flat().map(item=>`<div class="detail-field detail-field--span-${item.span} ${item.key===statusKey?'detail-field--status':''}" data-detail-field="${esc(item.key)}" ${item.logicalGroup?`data-detail-group="${esc(item.logicalGroup)}"`:''}><dt class="text-[10px] font-bold uppercase tracking-wide text-slate-400">${esc(item.label)}</dt><dd class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">${displayValue(schema,item.key,record[item.key])}</dd></div>`).join('')}</dl>${renderDetailAttachments(collection,id)}`;
  const actions=document.getElementById('detailActions'),locked=mutationActionDisabled();actions.innerHTML=`<button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openReport('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">${icon('clipboard-pen-line','size-4')}Báo cáo</button><button type="button" ${locked} onclick="document.getElementById('detailDialog').close();openEditor('${collection}',decodeURIComponent('${encoded(id)}'))" class="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">${icon('pencil','size-4')}Chỉnh sửa</button>`;
  document.getElementById('detailDialog').showModal(); document.querySelectorAll('#detailDialog [data-view-attachment]').forEach(button=>button.addEventListener('click',()=>openStoredAttachment(button.dataset.viewAttachment))); refreshIcons();
}

function openConfirmDialog(title,description){ document.getElementById('confirmTitle').textContent=title; document.getElementById('confirmDescription').textContent=description; document.getElementById('confirmDialog').showModal(); }
function askDelete(collection,id){if(!ensureMutationReady())return;UI.deleting={type:'record',collection,id};openConfirmDialog('Xóa bản ghi này?','Thao tác sẽ xóa bản ghi khỏi bản xem trước trên thiết bị này và đưa yêu cầu xóa vào hàng đợi đồng bộ.');}
function askLookupDelete(key,index){ const current=DATA.lookups[key]?.[index]; if(current===undefined)return; UI.deleting={type:'lookup',key,index}; openConfirmDialog('Xóa lựa chọn dùng chung?',`Lựa chọn “${current}” sẽ bị xóa khỏi danh mục. Các bản ghi đang dùng giá trị này không tự động bị xóa.`); }
function confirmDelete(){
  if(!ensureMutationReady()||!UI.deleting)return;
  if(UI.deleting.type==='lookup'){ const {key,index}=UI.deleting; DATA.lookups[key]?.splice(index,1); const totalPages=Math.max(1,Math.ceil((DATA.lookups[key]?.length||0)/CONFIG.lookupPageSize)); UI.lookupPages[key]=Math.min(UI.lookupPages[key]||1,totalPages); saveData(); queueUpsert('lookups',{id:key,key,values:DATA.lookups[key]||[]}); document.getElementById('confirmDialog').close(); UI.deleting=null; toast('Đã xóa lựa chọn dùng chung.','success'); renderPage(); return; }
  const {collection,id}=UI.deleting,record=(DATA[collection]||[]).find(row=>row.id===id);
  if(collection==='checklist'&&record) syncChecklistBudget({...record,budgetCategory:'',actualCost:0,payableCost:0},record);
  if(collection==='budget'&&record) (DATA.checklist||[]).forEach(task=>{ if(task.budgetCategory===record.category){task.budgetCategory='';task.updatedAt=new Date().toISOString();queueUpsert('checklist',task);} });
  DATA[collection]=(DATA[collection]||[]).filter(row=>row.id!==id); DATA.attachments=(DATA.attachments||[]).filter(item=>!(item.collection===collection&&item.recordId===id)); saveData(); queueDelete(collection,id); document.getElementById('confirmDialog').close(); UI.deleting=null; toast('Đã xóa bản ghi và đưa vào hàng đợi đồng bộ. Tệp đính kèm sẽ được dọn khỏi Google Drive khi đồng bộ.','success'); renderPage();
}

function saveSettingsForm(event){
  event.preventDefault();const form=new FormData(event.currentTarget),numericKeys=['totalBudget','reserveBudget','operatingBudget','groomGuests','brideGuests'];
  for(const [key,value] of form.entries()){const normalized=numericKeys.includes(key)?parseFormattedNumber(value):(key==='dashboardDescription'?String(value).trim():value);let item=DATA.settings.find(row=>row.key===key);if(item)item.value=normalized;else{item={id:`setting-${key}`,key,value:normalized,notes:key==='dashboardDescription'?'Mô tả hiển thị tại tab Tổng quan':''};DATA.settings.push(item);}item.updatedAt=new Date().toISOString();queueUpsert('settings',item);}
  saveData();updateCoupleWidget();toast('Đã lưu thiết lập vào hàng đợi đồng bộ.','success');renderNavigation();renderPage();
}
async function openConnectionSettings(){
  const settings=getSettings(),endpoint=String(embeddedEndpoint()||endpointFromLocation()||settings.googleSheetsEndpoint||storage.get(CONFIG.endpointKey,''));document.getElementById('connectionEndpoint').value=endpoint;
  const passwordInput=document.getElementById('connectionPassword'),toggle=document.getElementById('toggleConnectionPassword'),hint=document.getElementById('connectionPasswordSetupHint');
  const applyState=()=>{const initialized=Boolean(AUTH.remoteStatus?.initialized&&Number(AUTH.remoteStatus?.accountCount||0)>0);passwordInput.value=initialized?'':connectionSecrets.get(CONFIG.passwordKey,'');passwordInput.disabled=initialized;toggle.disabled=initialized;passwordInput.type='password';if(hint)hint.textContent=initialized?'Hệ thống đã khởi tạo. Đăng nhập từ thiết bị khác chỉ cần tài khoản đã cấp.':'Nhập một lần để khởi tạo; sau khi tạo tài khoản sẽ không phải nhập lại.';return initialized;};
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
  const previous=configuredEndpoint();let item=DATA.settings.find(row=>row.key==='googleSheetsEndpoint');if(item)item.value=endpoint;else{item={id:'setting-googleSheetsEndpoint',key:'googleSheetsEndpoint',value:endpoint,notes:'Google Apps Script Web App URL'};DATA.settings.push(item);}item.updatedAt=new Date().toISOString();
  persistEndpointBootstrap(endpoint);if(!document.getElementById('connectionPassword')?.disabled)connectionSecrets.set(CONFIG.passwordKey,password);connectionSecrets.set(CONFIG.schemaPasswordKey,schemaPassword);
  if(previous!==endpoint){storage.remove(CONFIG.fullSyncEndpointKey);storage.remove(CONFIG.lastFullSyncAtKey);storage.remove(CONFIG.schemaEndpointKey);storage.remove(CONFIG.schemaSignatureKey);storage.remove(CONFIG.remoteSchemaHashKey);}
  queueUpsert('settings',item);saveData();document.getElementById('connectionDialog').close();toast('Đã cập nhật kết nối Google Sheets.','success');if(UI.tab==='settings')renderPage();
  if(endpoint&&initialSync)await syncAllDataToGoogleSheets('initial');else if(endpoint)await syncSchemaToGoogleSheets('connection');startAutoSync();
}

function toggleConnectionPassword(){ const input=document.getElementById('connectionPassword'); if(!input)return; input.type=input.type==='password'?'text':'password'; const iconNode=document.querySelector('#toggleConnectionPassword i'); if(iconNode)iconNode.setAttribute('data-lucide',input.type==='password'?'eye':'eye-off'); refreshIcons(); }

function addLookupValue(key){ const input=document.querySelector(`[data-lookup-input="${key}"]`),value=input?.value.trim(); if(!value)return; DATA.lookups[key]=DATA.lookups[key]||[]; if(DATA.lookups[key].includes(value)){toast('Lựa chọn này đã tồn tại.','error');return;} DATA.lookups[key].push(value); UI.lookupPages[key]=Math.ceil(DATA.lookups[key].length/CONFIG.lookupPageSize); saveData(); queueUpsert('lookups',{id:key,key,values:DATA.lookups[key]}); renderPage(); }
function editLookupValue(key,index){ const current=DATA.lookups[key]?.[index]; if(current===undefined)return; const next=prompt('Nhập giá trị mới:',current)?.trim(); if(!next||next===current)return; DATA.lookups[key][index]=next; replaceLookupReferences(key,current,next); saveData(); queueUpsert('lookups',{id:key,key,values:DATA.lookups[key]}); renderPage(); }
function deleteLookupValue(key,index){ askLookupDelete(key,index); }
function setLookupPage(key,page){ const totalPages=Math.max(1,Math.ceil((DATA.lookups[key]?.length||0)/CONFIG.lookupPageSize)); UI.lookupPages[key]=Math.min(Math.max(1,Number(page||1)),totalPages); renderPage(); }
function replaceLookupReferences(key,oldValue,newValue){ const mapping={checklistPhases:[['checklist','phase']],checklistMilestones:[['checklist','milestone']],checklistGroups:[['checklist','group'],['references','group']],anchorEvents:[['checklist','anchorEvent']],owners:[['checklist','owner'],['timeline','owner']],guestSides:[['guests','side']],guestGroups:[['guests','group']],invitationTypes:[['guests','invitationType']],vendorCategories:[['vendors','category']],referenceSources:[['references','source']],interestLevels:[['references','interestLevel']],referencePriorities:[['references','priorityLevel']]}; (mapping[key]||[]).forEach(([collection,field])=>(DATA[collection]||[]).forEach(row=>{if(row[field]===oldValue){row[field]=newValue;queueUpsert(collection,row);}})); }

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
  document.getElementById('timelineSortButton')?.addEventListener('click',toggleTimelineSort);
  document.getElementById('editDashboardDescription')?.addEventListener('click',openDashboardTextEditor);
  document.getElementById('loadMoreButton')?.addEventListener('click',()=>{UI.visibleCount+=CONFIG.pageSize;renderPage();});
  document.getElementById('clearFiltersButton')?.addEventListener('click',clearCollectionFilters);
  document.querySelectorAll('[data-report]').forEach(button=>button.addEventListener('click',()=>openReport(UI.tab,button.dataset.report)));
  document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>openDetails(UI.tab,button.dataset.detail)));
  document.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>openEditor(UI.tab,button.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',()=>askDelete(UI.tab,button.dataset.delete)));
  document.getElementById('settingsForm')?.addEventListener('submit',saveSettingsForm); document.getElementById('settingsThemeButton')?.addEventListener('click',toggleTheme);
  document.getElementById('addAccountButton')?.addEventListener('click',()=>openAccountEditor()); document.getElementById('changeSettingsPasswordButton')?.addEventListener('click',()=>openSettingsPasswordDialog(false));
  document.querySelectorAll('[data-account-edit]').forEach(button=>button.addEventListener('click',()=>openAccountEditor(button.dataset.accountEdit))); document.querySelectorAll('[data-account-password]').forEach(button=>button.addEventListener('click',()=>openAccountPassword(button.dataset.accountPassword))); document.querySelectorAll('[data-account-lock]').forEach(button=>button.addEventListener('click',()=>toggleAccountLock(button.dataset.accountLock)));
  document.querySelectorAll('[data-accent]').forEach(button=>button.addEventListener('click',()=>setAccent(button.dataset.accent)));
  document.querySelectorAll('[data-lookup-add]').forEach(button=>button.addEventListener('click',()=>addLookupValue(button.dataset.lookupAdd)));
  document.querySelectorAll('[data-lookup-edit]').forEach(button=>button.addEventListener('click',()=>editLookupValue(button.dataset.lookupEdit,Number(button.dataset.index))));
  document.querySelectorAll('[data-lookup-delete]').forEach(button=>button.addEventListener('click',()=>deleteLookupValue(button.dataset.lookupDelete,Number(button.dataset.index))));
  document.querySelectorAll('[data-lookup-page]').forEach(button=>button.addEventListener('click',()=>setLookupPage(button.dataset.lookupPage,Number(button.dataset.page))));
  document.getElementById('openConnectionDialog')?.addEventListener('click',openConnectionSettings);
  document.getElementById('schemaSyncButton')?.addEventListener('click',()=>syncSchemaToGoogleSheets('manual'));
  document.getElementById('fullSyncButton')?.addEventListener('click',()=>syncAllDataToGoogleSheets('manual'));
  document.getElementById('exportButton')?.addEventListener('click',exportData); document.getElementById('resetButton')?.addEventListener('click',resetData);
}

let renderTimer; function debounceRender(){clearTimeout(renderTimer);renderTimer=setTimeout(renderPage,130);}

function toggleEditMode(){UI.editMode=!UI.editMode;renderHeader();renderPage();toast(UI.editMode?'Đã bật chế độ chỉnh sửa.':'Đã kết thúc chế độ chỉnh sửa.','info');}
async function savePreview(){ setButtonLoading('saveButton',true,'Đang lưu'); await wait(250); saveData(); setButtonLoading('saveButton',false); toast(`${UI.pendingChanges.length} thay đổi đã được lưu vào hàng đợi. Bấm Đồng bộ để ghi lên Google Sheets.`,'success'); }

function buildFullSyncChanges(){
  const changes=[];
  recordCollectionNames().forEach(collection=>(DATA[collection]||[]).forEach(record=>changes.push({op:'upsert',collection,id:record.id,record:structuredClone(record),changedAt:new Date().toISOString()})));
  Object.entries(DATA.lookups||{}).forEach(([key,values])=>changes.push({op:'upsert',collection:'lookups',id:key,record:{id:key,key,values:structuredClone(values),updatedAt:new Date().toISOString()},changedAt:new Date().toISOString()}));
  return changes;
}
function countSnapshotRecords(snapshot=DATA){
  return syncCollectionNames().reduce((total,collection)=>{
    const value=snapshot?.[collection];
    return total+(collection==='lookups'&&value&&typeof value==='object'&&!Array.isArray(value)?Object.keys(value).length:Array.isArray(value)?value.length:0);
  },0);
}
function appsScriptTimeoutFor(payload){
  const action=String(payload?.action||'');
  if(action==='getStatus'||action==='getSyncState')return CONFIG.networkTimeouts.status;
  if(action==='load')return CONFIG.networkTimeouts.load;
  if(action==='registerSchema'||action==='verifyWorkbook')return CONFIG.networkTimeouts.schema;
  if(action==='applyChanges')return payload?.mode==='full'?CONFIG.networkTimeouts.full:CONFIG.networkTimeouts.delta;
  if(action==='uploadAttachment'||action==='deleteAttachment'||action==='prepareAttachmentView')return CONFIG.networkTimeouts.attachment;
  if(['loginChallenge','login','adminChallenge','adminLogin','changePasswordChallenge','changeOwnPassword','requestAdminPasswordReset','confirmAdminPasswordReset'].includes(action))return CONFIG.networkTimeouts.auth;
  return CONFIG.networkTimeouts.default;
}
function retryableRequestError(error){return ['REQUEST_TIMEOUT','NETWORK_ERROR','HTTP_RETRYABLE'].includes(String(error?.code||''));}
function requestCanReplaySafely(payload){
  const action=String(payload?.action||'');
  if(['getStatus','load','loginChallenge','adminChallenge','changePasswordChallenge'].includes(action))return true;
  return Boolean(AUTH.remoteStatus?.requestReplay)&&['applyChanges','registerSchema','verifyWorkbook'].includes(action);
}
async function postAppsScript(payload,options={}){
  const endpoint=normalizeAppsScriptEndpoint(configuredEndpoint()),password=connectionSecrets.get(CONFIG.passwordKey,''),schemaPassword=connectionSecrets.get(CONFIG.schemaPasswordKey,''),admin=Boolean(options.admin||AUTH.settingsUnlocked),authMode=options.authMode||'auto';
  const token=authMode==='none'?'':activeServerToken(admin),action=String(payload?.action||''),hasPayloadPassword=Object.prototype.hasOwnProperty.call(payload,'password'),hasPayloadSchemaPassword=Object.prototype.hasOwnProperty.call(payload,'schemaPassword');
  const bootstrapPasswordActions=['load','registerSchema','applyChanges','verifyWorkbook','updateConnectionPassword','setConnectionPassword'];const attachBootstrapPassword=!token&&bootstrapPasswordActions.includes(action)&&password;
  const body={...payload,source:'WeddingOS',clientVersion:'9.4.1',sentAt:new Date().toISOString(),requestId:payload.requestId||uid('request'),...(token?{sessionToken:token}:{}),...(!hasPayloadPassword&&attachBootstrapPassword?{password}:{}),...(!hasPayloadSchemaPassword&&schemaPassword?{schemaPassword}:{})};
  const serialized=JSON.stringify(body),timeoutMs=Number(options.timeoutMs||appsScriptTimeoutFor(body)),maxRetries=Number.isInteger(options.retries)?Math.max(0,options.retries):(requestCanReplaySafely(body)?1:0);let lastError;
  for(let attempt=0;attempt<=maxRetries;attempt+=1){try{const response=await fetchWithTimeout(endpoint,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:serialized},timeoutMs);if(!response.ok)throw remoteError(`HTTP ${response.status}`,response.status>=500?'HTTP_RETRYABLE':'HTTP_ERROR');const result=await readJsonResponse(response);if(result.success===false)throw remoteError(result.message||'Google Sheets từ chối dữ liệu',result.code||'REMOTE_ERROR');if(options.trackRevision!==false&&result.revision!==undefined)setRemoteRevision(result.revision);return result;}catch(error){lastError=error;if(attempt>=maxRetries||!retryableRequestError(error))break;await wait(1200*(attempt+1));}}
  throw lastError;
}
async function syncSchemaToGoogleSheets(reason='manual'){
  if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');return false;}if(!isAdministrator()&&!connectionSecrets.get(CONFIG.passwordKey,'')){toast('Cần đăng nhập quản trị để cập nhật cấu trúc Google Sheets.','error');return false;}
  UI.syncing=true;UI.syncMode='manual';setManualSyncControlsDisabled(true);setButtonLoading('schemaSyncButton',true,'Đang cập nhật cấu trúc');
  try{const manifest=buildSchemaManifest(),result=await postAppsScript({action:'registerSchema',reason,forceSchema:reason==='manual',schema:manifest},{admin:true});recordSchemaSync(endpoint,result,manifest);const count=(result.changes||[]).length;toast(count?`Đã cập nhật cấu trúc Google Sheets: ${count} thay đổi.`:'Cấu trúc Google Sheets đã đúng với ứng dụng.','success');if(UI.tab==='settings')renderPage();return true;}
  catch(error){console.error('Schema sync failed',error);toast(`Không thể cập nhật cấu trúc Google Sheets: ${error.message}`,'error');return false;}
  finally{UI.syncing=false;UI.syncMode='';setButtonLoading('schemaSyncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();}
}
async function syncAllDataToGoogleSheets(reason='manual'){
  if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');return false;}UI.syncing=true;UI.syncMode='manual';setManualSyncControlsDisabled(true);setButtonLoading('syncButton',true,'Đang đồng bộ');setButtonLoading('fullSyncButton',true,'Đang đẩy dữ liệu');
  try{const status=await getServerStatus(),hasRemote=Boolean(status?.hasData),confirmReplace=hasRemote&&reason==='manual'&&confirm('Google Sheets đã có dữ liệu. Đồng bộ toàn bộ sẽ thay thế dữ liệu từ xa. Bạn có chắc chắn muốn tiếp tục?');if(hasRemote&&!confirmReplace){if(!UI.pendingChanges.length){await hydrateFromGoogleSheets(true);toast('Đã tải dữ liệu hiện có từ Google Sheets thay vì ghi đè.','info');}else toast('Google Sheets đã có dữ liệu. Hãy xử lý thay đổi cục bộ trước khi tải lại; hệ thống không tự ghi đè.','error');return false;}
    const snapshot=structuredClone(DATA),recordCount=countSnapshotRecords(snapshot),manifest=buildSchemaManifest(),result=await postAppsScript({action:'applyChanges',mode:'full',replaceRemote:true,confirmReplaceRemote:confirmReplace,baseRevision:Number(status?.revision||0),reason,schema:manifest,snapshot},{admin:true});recordSchemaSync(endpoint,result,manifest);UI.pendingChanges=[];savePendingChanges();UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);storage.set(CONFIG.fullSyncEndpointKey,endpoint);storage.set(CONFIG.lastFullSyncAtKey,UI.lastSyncAt);setRemoteRevision(result.revision||0);try{await ensureAdminServerSession();startAutoSync();}catch(error){console.warn('Không tạo được phiên quản trị sau khởi tạo',error);}toast(`Đã đồng bộ toàn bộ ${recordCount} bản ghi và danh mục.`,'success');if(UI.tab==='dashboard'||UI.tab==='settings')renderPage();return true;}
  catch(error){console.error('Full sync failed',error);toast(`Không thể đồng bộ toàn bộ dữ liệu: ${error.message}`,'error');return false;}
  finally{UI.syncing=false;UI.syncMode='';setButtonLoading('syncButton',false);setButtonLoading('fullSyncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();}
}
async function syncPreview(options={}){
  const automatic=Boolean(options&&options.automatic),knownStatus=options?.knownStatus||null;if(UI.syncing)return false;const endpoint=configuredEndpoint();if(!endpoint){if(!automatic){toast('Chưa cấu hình Google Sheets Apps Script URL trong tab Thiết lập.','error');navigate('settings');}return false;}
  UI.syncing=true;UI.syncMode=automatic?'automatic':'manual';UI.autoSyncLastAttemptAt=new Date().toISOString();setManualSyncControlsDisabled(true);setButtonLoading('syncButton',true,automatic?'Tự động đồng bộ':'Đang đồng bộ');
  try{
    const status=knownStatus||await getServerStatus();if(status.requiresAccountLogin&&!activeServerToken(false)){throw remoteError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.','AUTH_REQUIRED');}
    if(status.hasData===false){if(automatic)return false;UI.syncing=false;UI.syncMode='';setButtonLoading('syncButton',false);setManualSyncControlsDisabled(false);return await syncAllDataToGoogleSheets('first-sync');}
    const serverRevision=Number(status.revision||0),localRevision=remoteRevision();
    if(serverRevision!==localRevision){if(UI.pendingChanges.length)throw remoteError('Dữ liệu Google Sheets đã thay đổi trên thiết bị khác trong khi thiết bị này còn thay đổi chưa gửi.','REVISION_CONFLICT');await loadRemoteSnapshot(false);UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);if(!automatic)toast('Đã tải thay đổi mới nhất từ Google Sheets.','success');return true;}
    if(!UI.pendingChanges.length){
      if(!automatic&&needsSchemaSync(endpoint)&&isAdministrator()){const manifest=buildSchemaManifest(),result=await postAppsScript({action:'registerSchema',reason:'automatic',forceSchema:false,schema:manifest},{admin:true});recordSchemaSync(endpoint,result,manifest);toast('Đã kiểm tra và cập nhật cấu trúc Google Sheets.','success');}
      else if(!automatic)toast('Không có thay đổi mới cần đồng bộ.','info');
      UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);return true;
    }
    const manifest=buildSchemaManifest(),result=await postAppsScript({action:'applyChanges',mode:'delta',baseRevision:localRevision,schema:manifest,changes:structuredClone(UI.pendingChanges)},{admin:isAdministrator()});recordSchemaSync(endpoint,result,manifest);UI.pendingChanges=[];savePendingChanges();UI.lastSyncAt=new Date().toISOString();storage.set('wedding-last-sync-at',UI.lastSyncAt);setRemoteRevision(result.revision||localRevision);if(!automatic)toast('Đã đồng bộ dữ liệu an toàn lên Google Sheets.','success');if(UI.tab==='dashboard'||UI.tab==='settings')renderPage();UI.autoSyncLastError='';return true;
  }catch(error){
    if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';stopAutoSync();enforceLoginGate();}
    if(automatic){console.warn('Auto sync failed',error);UI.autoSyncLastError=error.message||'Không thể đồng bộ tự động.';if(error.code==='REVISION_CONFLICT')toast('Đồng bộ tự động tạm dừng vì có xung đột dữ liệu. Các thay đổi cục bộ vẫn được giữ nguyên.','error');}
    else{console.error('Delta sync failed',error);toast(error.code==='REVISION_CONFLICT'?'Phát hiện xung đột dữ liệu. Các thay đổi cục bộ vẫn được giữ nguyên để bạn kiểm tra.':`Không thể đồng bộ Google Sheets: ${error.message}`,'error');}
    return false;
  }finally{UI.syncing=false;UI.syncMode='';UI.autoSyncNextAt=activeServerToken(false)?new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString():'';setButtonLoading('syncButton',false);setManualSyncControlsDisabled(false);updatePendingIndicators();if(UI.tab==='settings')renderPage();}
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
  return UI.autoSyncNextAt?`Kiểm tra mỗi 15 giây · kế tiếp ${new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(UI.autoSyncNextAt))}`:'Kiểm tra mỗi 15 giây khi có thay đổi';
}
async function getSyncState(){return postAppsScript({action:'getSyncState'},{authMode:'auto',trackRevision:false,retries:0,timeoutMs:CONFIG.networkTimeouts.status});}
async function autoSyncTick(){
  if(UI.syncing||UI.hydrationState==='loading'||document.body.classList.contains('auth-locked')||!activeServerToken(false))return;
  UI.autoSyncLastAttemptAt=new Date().toISOString();
  try{const state=await getSyncState(),serverRevision=Number(state.revision||0);if(UI.pendingChanges.length||serverRevision!==remoteRevision())await syncPreview({automatic:true,knownStatus:state});UI.autoSyncLastError='';}
  catch(error){if(error.code==='AUTH_REQUIRED'){clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';stopAutoSync();enforceLoginGate();return;}UI.autoSyncLastError=error.message||'Không thể kiểm tra dữ liệu mới.';console.warn('Auto sync state check failed',error);}
  finally{UI.autoSyncNextAt=activeServerToken(false)?new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString():'';updatePendingIndicators();if(UI.tab==='settings')renderPage();}
}
function stopAutoSync(){if(UI.autoSyncTimer){clearInterval(UI.autoSyncTimer);UI.autoSyncTimer=null;}UI.autoSyncNextAt='';}
function startAutoSync(){
  stopAutoSync();if(!configuredEndpoint()||!activeServerToken(false)||document.body.classList.contains('auth-locked')||UI.hydrationState==='loading')return;
  UI.autoSyncNextAt=new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString();
  UI.autoSyncTimer=setInterval(()=>{UI.autoSyncNextAt=new Date(Date.now()+CONFIG.autoSyncIntervalMs).toISOString();autoSyncTick();},CONFIG.autoSyncIntervalMs);
  updatePendingIndicators();
}

function toggleTheme(){setUserTheme(!isDark());}
function setAccent(key){const theme=ACCENT_THEMES[key]?key:'pink';applyAccentTheme(theme);storage.set(CONFIG.accentKey,theme);updateCurrentPreference({accent:theme});renderNavigation();renderHeader();renderPage();renderProfileDialogContent();}
function updateThemeIcon(){const button=document.getElementById('profileButton'),profile=currentUserProfile();if(button)button.title=`Đang đăng nhập: ${profile.displayName||'Người dùng'}`;const dot=document.getElementById('profileStatusDot');if(dot){dot.classList.toggle('bg-rose-500',profile.status==='locked');dot.classList.toggle('bg-emerald-500',profile.status!=='locked');}}
function openSidebar(){document.getElementById('sidebar').classList.remove('-translate-x-full');document.getElementById('sidebarOverlay').classList.remove('hidden');document.body.classList.add('overflow-hidden');}
function closeSidebar(){if(window.innerWidth>=1024)return;document.getElementById('sidebar').classList.add('-translate-x-full');document.getElementById('sidebarOverlay').classList.add('hidden');document.body.classList.remove('overflow-hidden');}
function toggleMobileActions(){UI.mobileActionsOpen=!UI.mobileActionsOpen;document.getElementById('mobileActions').classList.toggle('hidden',!UI.mobileActionsOpen);}
function exportData(){const safeData=structuredClone(DATA);safeData.security=[];safeData.accounts=(safeData.accounts||[]).map(row=>({id:row.id,userCode:row.userCode,displayName:row.displayName,usernameLabel:row.usernameLabel,status:row.status,updatedAt:row.updatedAt}));const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),securityRedacted:true,data:safeData,pendingChanges:UI.pendingChanges.filter(change=>!['security','accounts'].includes(change.collection))},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`wedding-os-safe-backup-${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(url);toast('Đã xuất bản sao JSON đã loại bỏ hash, salt, ciphertext và khóa phiên.','success');}

function resetData(){if(!confirm('Khôi phục toàn bộ dữ liệu mặc định? Các thay đổi chưa đồng bộ sẽ bị xóa.'))return;clearRememberedLogin();lockAuthenticatedShell();DATA=migrateData(INITIAL_DATA);UI.pendingChanges=[];AUTH.currentUserId='';AUTH.currentProfile=null;AUTH.adminAuthenticated=true;secrets.remove(CONFIG.accountSessionKey);secrets.remove(CONFIG.accountProfileKey);secrets.remove(CONFIG.accountServerSessionKey);secrets.remove(CONFIG.adminServerSessionKey);storage.remove(CONFIG.remoteRevisionKey);storage.remove(CONFIG.remoteStatusKey);secrets.remove(CONFIG.sensitiveSessionKey);secrets.remove(CONFIG.sensitivePendingKey);savePendingChanges();saveData();storage.remove(CONFIG.fullSyncEndpointKey);storage.remove(CONFIG.lastFullSyncAtKey);storage.remove(CONFIG.schemaEndpointKey);storage.remove(CONFIG.schemaSignatureKey);storage.remove(CONFIG.remoteSchemaHashKey);applyCurrentPreferences();toast('Đã khôi phục dữ liệu mặc định trên thiết bị. WeddingOS sẽ kiểm tra Google Sheets trước khi cho phép đồng bộ toàn bộ.','success');renderNavigation();renderPage();}

function toast(message,type='info'){const tones={success:['circle-check-big','border-emerald-200 bg-white text-slate-900 dark:border-emerald-900 dark:bg-slate-900 dark:text-white','bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'],info:['info','border-blue-200 bg-white text-slate-900 dark:border-blue-900 dark:bg-slate-900 dark:text-white','bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'],error:['circle-alert','border-rose-200 bg-white text-slate-900 dark:border-rose-900 dark:bg-slate-900 dark:text-white','bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300']};const [toastIcon,wrapper,iconClass]=tones[type]||tones.info,id=uid('toast'),node=document.createElement('div');node.id=id;node.className=`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-panel animate-slide-in ${wrapper}`;node.innerHTML=`<span class="grid size-9 shrink-0 place-items-center rounded-xl ${iconClass}">${icon(toastIcon,'size-4')}</span><div class="min-w-0 flex-1"><p class="text-sm font-semibold">${esc(message)}</p></div><button type="button" aria-label="Đóng thông báo" class="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white">${icon('x','size-3.5')}</button>`;node.querySelector('button').addEventListener('click',()=>node.remove());document.getElementById('toastRegion').appendChild(node);refreshIcons();setTimeout(()=>node.remove(),5200);}

function bindGlobalEvents(){
  document.getElementById('openSidebar').addEventListener('click',openSidebar);document.getElementById('closeSidebar').addEventListener('click',closeSidebar);document.getElementById('sidebarOverlay').addEventListener('click',closeSidebar);document.getElementById('profileButton').addEventListener('click',openProfileDialog);document.getElementById('notificationButton').addEventListener('click',openNotificationCenter);document.getElementById('settingsAccessForm').addEventListener('submit',submitSettingsAccess);document.getElementById('cancelSettingsAccess').addEventListener('click',cancelSettingsAccess);document.getElementById('forgotAdminPassword').addEventListener('click',()=>sendAdminPasswordResetCode(false));document.getElementById('adminPasswordResetForm').addEventListener('submit',submitAdminPasswordReset);document.getElementById('cancelAdminPasswordReset').addEventListener('click',cancelAdminPasswordReset);document.getElementById('resendAdminResetCode').addEventListener('click',()=>sendAdminPasswordResetCode(true));document.getElementById('settingsPasswordForm').addEventListener('submit',submitSettingsPassword);document.getElementById('cancelSettingsPassword').addEventListener('click',cancelSettingsPassword);document.getElementById('accountForm').addEventListener('submit',saveAccount);document.getElementById('accountPasswordForm').addEventListener('submit',saveAccountPassword);document.getElementById('accountLoginForm').addEventListener('submit',submitAccountLogin);document.getElementById('selfPasswordForm').addEventListener('submit',submitSelfPassword);document.getElementById('columnSettingsForm').addEventListener('submit',saveColumnSettings);document.getElementById('resetColumnSettingsButton').addEventListener('click',resetColumnSettings);document.getElementById('dashboardTextForm').addEventListener('submit',saveDashboardText);document.getElementById('adminAccessFromLogin').addEventListener('click',openAdminFromLogin);document.getElementById('editButton')?.addEventListener('click',toggleEditMode);document.getElementById('saveButton')?.addEventListener('click',savePreview);document.getElementById('syncButton').addEventListener('click',syncPreview);document.getElementById('editorForm').addEventListener('submit',saveEditor);document.getElementById('confirmDeleteButton').addEventListener('click',confirmDelete);document.getElementById('connectionForm').addEventListener('submit',saveConnectionSettings);document.getElementById('toggleConnectionPassword').addEventListener('click',toggleConnectionPassword);document.getElementById('copyConnectionLink').addEventListener('click',copyConnectionLink);document.getElementById('filterForm').addEventListener('submit',applyFilterDialog);document.getElementById('resetFilterDraftButton').addEventListener('click',resetFilterDraft);
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.closeDialog).close()));
  ['accountLoginDialog','settingsPasswordDialog','adminPasswordResetDialog'].forEach(id=>document.getElementById(id)?.addEventListener('cancel',event=>{if(id==='accountLoginDialog'||id==='adminPasswordResetDialog'||AUTH.passwordChangeForced)event.preventDefault();}));
  document.querySelectorAll('[data-mobile-action]').forEach(button=>button.addEventListener('click',()=>{toggleMobileActions();({edit:toggleEditMode,save:savePreview,sync:syncPreview})[button.dataset.mobileAction]?.();}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeSidebar();if(UI.mobileActionsOpen)toggleMobileActions();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'){event.preventDefault();savePreview();}});
  window.addEventListener('resize',()=>{if(window.innerWidth>=1024){document.getElementById('sidebarOverlay').classList.add('hidden');document.body.classList.remove('overflow-hidden');}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&UI.autoSyncNextAt&&Date.parse(UI.autoSyncNextAt)<=Date.now()&&!UI.syncing)autoSyncTick();});
}

async function init(){
  lockAuthenticatedShell();applyCurrentPreferences();bindGlobalEvents();refreshIcons();importEndpointBootstrap();restoreRememberedLogin();const endpoint=configuredEndpoint();
  if(endpoint){
    if(AUTH.currentUserId&&serverAccountToken()){
      try{const state=await getSyncState();UI.serverRevisionHint=Number(state.revision||0);const hasCache=activateUserCache(AUTH.currentUserId);UI.hydrationState='loading';UI.hydrationHasCache=hasCache;UI.hydrationError='';UI.mutationLocked=true;UI.loading=!hasCache;renderAuthenticatedWorkspace();initialHydrateAfterLogin();return;}
      catch(error){console.warn('Không xác minh được phiên đã ghi nhớ',error);clearRememberedLogin();secrets.remove(CONFIG.accountServerSessionKey);AUTH.currentUserId='';AUTH.currentProfile=null;showInlineError('loginError',error.code==='AUTH_REQUIRED'?'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.':`Không thể xác minh phiên đăng nhập: ${error.message}`);}
    }
    enforceLoginGate();getServerStatus().catch(error=>{console.warn('Không tải được trạng thái máy chủ',error);showInlineError('loginError',`Không thể kết nối Google Sheets: ${error.message}`);});return;
  }
  const row=(DATA.accounts||[]).find(item=>item.id===AUTH.currentUserId&&item.status!=='locked');if(row){UI.hydrationState='ready';UI.mutationLocked=false;renderAuthenticatedWorkspace();return;}enforceLoginGate();
}
window.navigate=navigate;window.openProfileDialog=openProfileDialog;window.openColumnSettings=openColumnSettings;window.openEditor=openEditor;window.openNotificationCenter=openNotificationCenter;window.openReport=openReport;window.openDetails=openDetails;window.setCollectionFilter=setCollectionFilter;window.setMetricFilter=setMetricFilter;window.setGuestFilter=setGuestFilter;document.addEventListener('DOMContentLoaded',init);

