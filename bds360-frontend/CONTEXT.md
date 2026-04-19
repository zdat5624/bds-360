**[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**

**1. Core Tech Stack:**
- Framework: Next.js (App Router)
- Language: TypeScript
- Data Fetching: TanStack React Query v5 + Axios
- lib/custom-fetch: Axios instance with Response Unwrapping logic.
- Validation: Zod v4
- Styling: Tailwind CSS + Antd design
- Phong cách: SAAS (Clean & Flat)

**2. Architectural Philosophy:**
- **Feature-Based Architecture:** Logic chia theo Domain.
- **Anti-Corruption Layer:** Tầng Adapter có nhiệm vụ chuyển đổi dữ liệu từ API thành dữ liệu UI cần (nếu cần) và xử lý side-effects (invalidate cache, toast).

**3. Folder Structure Highlights:**
- `src/lib/custom-fetch.ts`: "The Brain". Chứa logic `ExtractData<T>` để tự động loại bỏ lớp vỏ `code/message` của Backend, chỉ trả về `data`.

**4. Data Handling Strategy (CRITICAL):**
- **The Envelope:** Backend luôn trả về `{ code, message, data, validationErrors }`.
- **Business Logic Error:** Lỗi có `code !== 10000` được xử lý tập trung bằng `message.error` trong interceptor và ném ra `Promise.reject`.

**5. Component & Styling Rules (CRITICAL):**

- **Design System & Visual Style:** Tuân thủ tuyệt đối Ant Design System (v5 Default Aesthetic). Định hướng UI theo phong cách Professional Enterprise (SaaS): sạch sẽ, chuẩn mực, ưu tiên hiển thị cấu trúc dữ liệu và tối ưu trải nghiệm người dùng doanh nghiệp.
- **Antd First (UI Consistency):** BẮT BUỘC sử dụng các component của Antd (Table, Button, Form, Select, v.v.) làm ưu tiên hàng đầu. Tuyệt đối không tự chế lại UI bằng HTML/Tailwind nếu Antd đã cung cấp giải pháp tương đương nhằm đảm bảo đồng bộ Theme. Quy tắc tham chiếu: Khi sử dụng bất kỳ component nào, BẮT BUỘC tham khảo code mẫu (Demo) và API tại tài liệu chính thức: https://ant.design để áp dụng đúng cấu trúc props, slots và đảm bảo chuẩn UX/UI của thư viện. 
- **Single Source of Truth (Zero Tailwind Colors):** Toàn bộ "lớp da" của ứng dụng (màu chữ, nền, viền, bóng đổ, bo góc) PHẢI được quản lý tập trung bởi Design Token của Ant Design (tại `src/config/theme.ts`). 
  - **NGHIÊM CẤM** sử dụng các class màu sắc của Tailwind (ví dụ: `text-red-500`, `bg-blue-600`, `border-gray-200`, `hover:bg-gray-100`).
  - Tuyệt đối không hard-code mã màu HEX/RGB/HSL trong các component.
- **Strict Separation of Concerns:**
  - **Tailwind CSS:** CHỈ DÙNG để dựng cấu trúc, layout và tinh chỉnh khoảng cách (utilities: `flex`, `grid`, `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `absolute`...). Không dùng Tailwind để ghi đè (override) visual style của Antd.
  - **Antd Token:** DÙNG để quyết định nhận diện thị giác (Visuals).
- **Implementation Rule (Hook `useAppTheme`):** Khi cần tô màu cho một thẻ HTML thuần (`<div>`, `<span>`) hoặc cần can thiệp màu sắc, BẮT BUỘC phải gọi custom hook `useAppTheme()` (từ `@/hooks/use-app-theme.ts`) để trích xuất các token màu (như `colorPrimary`, `colorBgContainer`, `colorTextSecondary`...) và truyền qua thuộc tính `style={...}` inline. Điều này đảm bảo Consistency 100% và hệ thống luôn sẵn sàng cho Dark/Light Mode.
- **Form Spacing Standard (Optical Alignment):**
  - **Item Margin:** Mặc định sử dụng margin của Ant Design (thường là 24px). Chỉ dùng `mb-0` cho item cuối cùng trong một block Form để tránh cộng dồn khoảng cách với Divider/Footer.
  - **Grouped Fields:**: không thêm margin vào thẻ `div` bọc ngoài, hãy để `Form.Item` tự quản lý khoảng cách dọc. Nếu antd không tự xử lý được mới tự style bằng taiwind hoặc style (có thể sẽ dùng important '!').
- **Ant Design v5+ API Strict Compliance (Zero Warnings):** Tuyệt đối không sử dụng các props đã bị Deprecated để tránh Warning trên Console. Bắt buộc cập nhật tài liệu và tuân thủ các quy chuẩn API mới nhất của Ant Design (v5.14+):
  - **Modal/Drawer:** Dùng `destroyOnHidden` (TUYỆT ĐỐI KHÔNG dùng `destroyOnClose`).
  - **Modal/Drawer:** Dùng `mask={{ closable: boolean }}` (TUYỆT ĐỐI KHÔNG dùng `maskClosable={boolean}`).
  - **Tag:** Dùng `variant="filled"` hoặc `variant="outlined"` hoặc ... (TUYỆT ĐỐI KHÔNG dùng `bordered={false}`).



**6. Naming & Folder Conventions (CRITICAL):**
- **File & Folder Casing:** Bắt buộc sử dụng `kebab-case` cho tên file/thư mục, tuyệt đối không dùng `camelCase` hay `PascalCase` để tránh lỗi môi trường hệ điều hành.
- **File Suffixes cho Components (Dot-notation):** Khuyến khích sử dụng dấu chấm (`.`) để định danh rõ loại Component giao diện.
  - **Form:** `[tên].form.tsx` (e.g., `login.form.tsx`, `forgot-password.form.tsx`)
  - **Button:** `[tên].button.tsx` (e.g., `google-auth.button.tsx`)
  - **Modal/Drawer:** `[tên].modal.tsx` / `[tên].drawer.tsx` (e.g., `create-post.modal.tsx`)
  - **Standard UI:** Với các component cấu trúc chung chung (layout, block hiển thị lớn) có thể giữ hậu tố tiêu chuẩn (e.g., `user-info.tsx`, `manage-sidebar.tsx`).
- **File Suffixes cho Non-Components:** Tên file phải có hậu tố chức năng rõ ràng: Schemas (`.schema.ts`), Constants (`.constant.ts`), Utilities (`.util.ts`), Types (`.types.ts`), API Hooks đặt theo hành động (`[action].mutations.ts` hoặc `[action].queries.ts` như `auth.queries.ts`).
- **Code-Level Naming:** Sử dụng `PascalCase` cho React Components & Types, `camelCase` cho Functions & Variables, và `UPPER_SNAKE_CASE` cho Constants.
- **Barrel Files (`index.ts`):** Chỉ đặt ở cấp cao nhất của thư mục Feature (e.g., `features/auth/index.ts`) hoặc Shared Component; KHÔNG tạo trong thư mục con để tối ưu Tree-shaking và tránh import vòng (circular dependency).
- **File Path Comments:** Mọi file PHẢI bắt đầu bằng một dòng comment chứa đường dẫn đầy đủ tính từ thư mục gốc (root) để dễ dàng định vị (e.g., `// @/features/auth/components/google-auth.button.tsx`).

---
```text
src/
│
├── app/                        # 1. TẦNG APP ROUTER (Chỉ chứa định tuyến, không chứa logic)
│   ├── auth/login/page.tsx   # Tự động gọi Component từ thư mục tính năng (features/auth)
│   ├── dashboard/page.tsx      
│   ├── layout.tsx              # Root Layout bọc các Global Providers
│   └── provider.tsx            # Nơi cấu hình QueryClientProvider, ThemeProvider...
│
│
├── features/                   # 3. TẦNG NGHIỆP VỤ (NƠI CODE CHÍNH ⭐)
│   │                           # Mỗi thư mục là một ứng dụng thu nhỏ, độc lập hoàn toàn.
│   ├── auth/                   # ---FEATURE: XÁC THỰC NGƯỜI DÙNG
│   │   ├── api/                # TẦNG API
│   |   │   ├── types.ts        # chứa các type
│   │   │   └── user.mutations.ts      # Chứa custom hook
│   │   │   └── user.queries.ts        # Chứa custom hook
│   │   ├── components/         # UI Components chỉ dùng riêng cho Auth
│   │   │   └── login.form.tsx  
│   │   ├── utils/              # Các hàm hỗ trợ riêng cho Auth
│   │   ├── auth.schema.ts      # Cung cấp luật lệ ZOD v4
│   │   ├── auth.constant.ts    # Cung cấp hằng số
│   │   ├── auth.util.ts        # Cung cấp hàm tiện ích
│   │   └── index.ts            # PUBLIC API: Chỉ export những gì cho phép `app/` và nơi khác gọi
│   │
│   └── posts/                  # ---FEATURE: QUẢN LÝ BÀI ĐĂNG
│       ├── api/                # Adapter gọi API bài đăng (hook, types)
│       │   ├── user.mutations.ts 
│       │   ├── types.ts        # chứa các type
│       │   └── user.queries.ts  # Sử dụng useCreatePostMutation và kèm logic Invalidate Cache
│       ├── components/         # post-list.tsx, create-post-modal.tsx...
│       └── index.ts            # PUBLIC API
│
├── components/                 # 4. TẦNG SHARED UI (Dùng chung toàn ứng dụng)
│   ├── base/                   # Dumb Components (Nút bấm, Modal, Input...)
│   ├── composite/              # UI kết hợp
│   └── layouts/                # Header, Footer, Sidebar
│
├── lib/                        # 5. TẦNG SHARED CONFIG (Cấu hình lõi)
│   ├──         # Custom Axios Instance (Xử lý bóc vỏ ApiResponse và ném lỗi 400/500)
│   └── utils.ts                # Tailwind merge (cn), ...
│
├── config/                     # Chứa các config biến môi trường (env.ts), routes.ts, theme.ts, ...
├── constants/                  # Chứa các constant dùng chung
├── hooks/                      # Custom hooks dùng chung (useWindowSize, useDebounce...)
├── stores/                     # Global state Zustand toàn ứng dụng (Theme store, auth, ...)
└── types/                      # TypeScript definitions dùng chung (...)
    ├── api.types.ts            # Các type chung cho toàn bộ Network/API
    ├── common.types.ts         # Các type chung cho UI/Logic (Pagination, Option...)
    └── index.ts                # Barrel file để export mọi thứ
└── utils/                      # Chứa các hàm util dùng chung
    ├── date.util.ts            # setup dayjs và các hàm format day


```

