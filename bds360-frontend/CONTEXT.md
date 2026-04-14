**[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**

**1. Core Tech Stack:**
- Framework: Next.js (App Router)
- Language: TypeScript
- Data Fetching: TanStack React Query v5 + Axios
- lib/custom-fetch: Axios instance with Response Unwrapping logic.
- Validation: Zod v4
- Styling: Tailwind CSS + Antd design
- Phong cách: SAAS

**2. Architectural Philosophy:**
- **Feature-Based Architecture:** Logic chia theo Domain.
- **Anti-Corruption Layer:** Tầng Adapter có nhiệm vụ chuyển đổi dữ liệu từ API thành dữ liệu UI cần (nếu cần) và xử lý side-effects (invalidate cache, toast).

**3. Folder Structure Highlights:**
- `src/lib/custom-fetch.ts`: "The Brain". Chứa logic `ExtractData<T>` để tự động loại bỏ lớp vỏ `code/message` của Backend, chỉ trả về `data`.

**4. Data Handling Strategy (CRITICAL):**
- **The Envelope:** Backend luôn trả về `{ code, message, data, validationErrors }`.
- **Business Logic Error:** Lỗi có `code !== 10000` được xử lý tập trung bằng `message.error` trong interceptor và ném ra `Promise.reject`.

**5. Component & Styling Rules (CRITICAL):**
    Design System: Tuân thủ tuyệt đối Ant Design System (v5 Default Aesthetic).

    UI Consistency: Luôn sử dụng component của Antd (Table, Button, Form, Select, v.v.). Không tự chế UI bằng HTML/Tailwind nếu Antd đã có.

    Theme Source: AI phải căn cứ vào cấu hình trong ConfigProvider (antdTheme) để sinh code.

    Tailwind Usage: Chỉ dùng Tailwind cho Layout Utilities (spacing, flex, grid, alignment). Tuyệt đối không dùng Tailwind để ghi đè (override) style mặc định của Antd (như đổi màu, bo góc, bóng đổ) trừ khi có yêu cầu đặc biệt.

    Visual Style: Ưu tiên phong cách Professional Enterprise đặc trưng của Antd: Sạch sẽ, chuẩn mực, tập trung vào cấu trúc dữ liệu và trải nghiệm người dùng doanh nghiệp.

    Component & Styling Rules (CRITICAL): Ưu tiên Ant Design: Luôn sử dụng các component của Antd (Table, Button, Form, Select, v.v.) để đảm bảo đồng bộ Theme. Hạn chế Custom UI: Tránh việc tự định nghĩa component bằng HTML/CSS/Tailwind nếu Antd đã cung cấp giải pháp tương đương. Chỉ dùng Tailwind cho việc căn chỉnh Layout (padding, margin, flex) hoặc khi Antd không đáp ứng được yêu cầu đặc thù.
    Dưới đây là đoạn text chuẩn mực, mang tính chất "thiết quân luật" mà bạn có thể bổ sung trực tiếp vào file `CONTEXT.md` (ở mục **5. Component & Styling Rules**) hoặc dùng làm System Prompt để ép các AI (hoặc team dev) tuân thủ tuyệt đối quy tắc sử dụng màu sắc:

* **Single Source of Truth:** Toàn bộ màu sắc của ứng dụng (màu chữ, nền, viền, bóng đổ...) PHẢI được quản lý tập trung bởi Design Token của Ant Design v5 (được định nghĩa tại `src/config/theme.ts`). Tuyệt đối không hard-code mã màu HEX/RGB/HSL trong component.
* **Zero Tailwind Colors:** NGHIÊM CẤM việc sử dụng các class màu sắc của Tailwind (ví dụ: `text-red-500`, `bg-blue-600`, `border-gray-200`, `hover:bg-gray-100`). Bất kỳ pull request/code generation nào chứa class màu Tailwind đều bị coi là vi phạm kiến trúc.
* **Separation of Concerns:** * **Tailwind:** CHỈ DÙNG để dựng cấu trúc, layout và khoảng cách (flex, grid, p-*, m-*, gap-*, w-*, h-*, absolute...).
    * **Antd Token:** DÙNG để định hình "lớp da" của UI (màu sắc, bo góc, bóng đổ).
* **Implementation Rule (Hook `useAppTheme`):** Khi cần tô màu cho một thẻ HTML thường (`<div>`, `<span>`) hoặc override màu, BẮT BUỘC phải gọi custom hook `useAppTheme()` từ `@/hooks/use-app-theme.ts` để trích xuất các token màu (như `colorPrimary`, `colorBgContainer`, `colorTextSecondary`...) và truyền chúng qua thuộc tính `style={}` inline.
* **Mục đích cốt lõi:** Đảm bảo UI đạt tính nhất quán (Consistency) 100% theo tiêu chuẩn Enterprise, đồng thời đảm bảo tính năng chuyển đổi Dark/Light mode hoặc Re-branding (đổi màu thương hiệu) sau này có thể hoạt động ngay lập tức mà không cần sửa code ở từng component.



**6. Naming & Folder Conventions (CRITICAL):**
- **File & Folder Casing:** Bắt buộc sử dụng `kebab-case` cho tên file/thư mục (e.g., `[tên-tính-năng].form.tsx`, `kebab-case.tsx`), tuyệt đối không dùng `camelCase` hay `PascalCase` để tránh lỗi môi trường hệ điều hành.
- **File Suffixes:** Tên file phải có hậu tố chức năng rõ ràng: Components (`.tsx`), Schemas (`.schema.ts`), Constants (`.constant.ts`), Utilities (`.util.ts`), Types (`.types.ts`), API Hooks đặt theo hành động (`[action].ts` như `get-posts.ts`).
- **Code-Level Naming:** Sử dụng `PascalCase` cho React Components & Types, `camelCase` cho Functions & Variables, và `UPPER_SNAKE_CASE` cho Constants.
- **Barrel Files (`index.ts`):** Chỉ đặt ở cấp cao nhất của thư mục Feature (e.g., `features/auth/index.ts`) hoặc Shared Component; KHÔNG tạo trong thư mục con để tối ưu Tree-shaking và tránh import vòng (circular dependency).
**File Path Comments:**: Mọi file PHẢI bắt đầu bằng một dòng comment chứa đường dẫn đầy đủ tính từ thư mục gốc (root) để dễ dàng định vị (e.g.,  @/features/auth/api/user.queries.ts).

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


Project tree hoàn chỉnh:


```
bds360-frontend
├─ .eslintrc.json
├─ CONTEXT.md
├─ env.d.ts
├─ next.config.mjs
├─ orval.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ README_PROJECT_TREE.md
├─ src
│  ├─ api
│  ├─ app
│  │  ├─ (back-office)
│  │  │  └─ manage
│  │  │     ├─ layout.tsx
│  │  │     └─ page.tsx
│  │  ├─ (main)
│  │  │  ├─ (account)
│  │  │  │  └─ user
│  │  │  │     ├─ layout.tsx
│  │  │  │     └─ profile
│  │  │  │        └─ page.tsx
│  │  │  ├─ (public)
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ rent
│  │  │  │  └─ sale
│  │  │  └─ layout.tsx
│  │  ├─ favicon.ico
│  │  ├─ fonts
│  │  │  ├─ GeistMonoVF.woff
│  │  │  └─ GeistVF.woff
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ provider.tsx
│  ├─ components
│  │  ├─ base
│  │  ├─ composite
│  │  ├─ index.ts
│  │  └─ layouts
│  │     ├─ footer.tsx
│  │     ├─ header.tsx
│  │     ├─ index.tsx
│  │     ├─ manage-sidebar.tsx
│  │     └─ user-sidebar.tsx
│  ├─ config
│  │  ├─ env.ts
│  │  ├─ fonts.ts
│  │  ├─ index.ts
│  │  ├─ routes.ts
│  │  └─ theme.ts
│  ├─ constants
│  │  ├─ gender.constant.ts
│  │  ├─ index.ts
│  │  ├─ listing.constant.ts
│  │  ├─ pagination.ts
│  │  └─ role.constant.ts
│  ├─ features
│  │  ├─ addresses
│  │  │  ├─ addresses.schema.ts
│  │  │  ├─ api
│  │  │  │  ├─ addresses.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  └─ index.ts
│  │  ├─ auth
│  │  │  ├─ api
│  │  │  │  ├─ auth.mutations.ts
│  │  │  │  ├─ auth.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ auth.schema.ts
│  │  │  ├─ components
│  │  │  │  └─ test.tsx
│  │  │  └─ index.ts
│  │  ├─ categories
│  │  │  ├─ api
│  │  │  │  ├─ categories.mutations.ts
│  │  │  │  ├─ categories.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ categories.schema.ts
│  │  │  ├─ components
│  │  │  └─ index.ts
│  │  ├─ media
│  │  │  ├─ api
│  │  │  │  ├─ media.mutations.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ media.constant.ts
│  │  │  └─ media.schema.ts
│  │  ├─ notifications
│  │  │  ├─ api
│  │  │  │  ├─ notifications.mutations.ts
│  │  │  │  ├─ notifications.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ notifications.constant.ts
│  │  │  └─ notifications.schema.ts
│  │  ├─ posts
│  │  │  ├─ api
│  │  │  │  ├─ posts.mutations.ts
│  │  │  │  ├─ posts.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ posts.constant.ts
│  │  │  └─ posts.schema.ts
│  │  ├─ statistics
│  │  │  ├─ api
│  │  │  │  ├─ statistics.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  └─ statistics.schema.ts
│  │  ├─ transactions
│  │  │  ├─ api
│  │  │  │  ├─ transactions.mutations.ts
│  │  │  │  ├─ transactions.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  ├─ index.ts
│  │  │  ├─ transactions.constant.ts
│  │  │  └─ transactions.schema.ts
│  │  ├─ users
│  │  │  ├─ api
│  │  │  │  ├─ types.ts
│  │  │  │  ├─ user.mutations.ts
│  │  │  │  └─ user.queries.ts
│  │  │  ├─ components
│  │  │  │  └─ user-info.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ users.constant.ts
│  │  │  └─ users.schema.ts
│  │  └─ vips
│  │     ├─ api
│  │     │  ├─ types.ts
│  │     │  ├─ vips.mutations.ts
│  │     │  └─ vips.queries.ts
│  │     ├─ components
│  │     ├─ index.ts
│  │     └─ vips.schema.ts
│  ├─ hooks
│  │  ├─ index.ts
│  │  └─ use-app-theme.ts
│  ├─ lib
│  │  ├─ custom-fetch.ts
│  │  ├─ index.ts
│  │  └─ utils.ts
│  ├─ stores
│  ├─ types
│  │  ├─ api.types.ts
│  │  ├─ common.types.ts
│  │  ├─ index.ts
│  │  └─ models.types.ts
│  └─ utils
│     ├─ date.util.ts
│     ├─ error.util.ts
│     ├─ index.ts
│     ├─ number.util.ts
│     ├─ storage.util.ts
│     └─ string.util.ts
├─ tailwind.config.ts
└─ tsconfig.json

```