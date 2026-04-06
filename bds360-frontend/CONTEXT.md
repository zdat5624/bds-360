> **[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**
> 
> **1. Core Tech Stack:**
> - Framework: Next.js (App Router)
> - Language: TypeScript
> - Data Fetching: TanStack React Query v5 + Axios
> - lib/custom-fetch: Axios instance with Response Unwrapping logic.
> - Validation: Zod v4
> - Styling: Tailwind CSS + Antd design
> 
> **2. Architectural Philosophy:**
> - **Feature-Based Architecture:** Logic chia theo Domain.
> - **Anti-Corruption Layer:** Tầng Adapter có nhiệm vụ chuyển đổi dữ liệu từ API thành dữ liệu UI cần (nếu cần) và xử lý side-effects (invalidate cache, toast).
> 
> **3. Folder Structure Highlights:**
> - `src/lib/custom-fetch.ts`: "The Brain". Chứa logic `ExtractData<T>` để tự động loại bỏ lớp vỏ `code/message` của Backend, chỉ trả về `data`.
> 
> **4. Data Handling Strategy (CRITICAL):**
> - **The Envelope:** Backend luôn trả về `{ code, message, data, validationErrors }`.
> - **Business Logic Error:** Lỗi có `code !== 10000` được xử lý tập trung bằng `message.error` trong interceptor và ném ra `Promise.reject`.
> 
> **5. Coding Rules for AI:**
>   - Mutation hooks (Create/Update/Delete) phải bao gồm `onSuccess: () => queryClient.invalidateQueries(...)`.
> - **Component Rules:** >   - UI Component chỉ nhận dữ liệu đã "sạch" từ Feature API.
>   - Luôn sử dụng Absolute Imports với alias `@/` khi ở ngoài thư mục `features` và các thư mục share dùng chung. Không dùng path tương đối `../`.
> - **Barrel Files:** Chỉ dùng `index.ts` ở gốc của mỗi Feature để export Public API. Không dùng `index.ts` bên trong các thư mục con (api, components).

> - **Component & Styling Rules (CRITICAL):** Ưu tiên Ant Design: Luôn sử dụng các component của Antd (Table, Button, Form, Select, v.v.) để đảm bảo đồng bộ Theme. Hạn chế Custom UI: Tránh việc tự định nghĩa component bằng HTML/CSS/Tailwind nếu Antd đã cung cấp giải pháp tương đương. Chỉ dùng Tailwind cho việc căn chỉnh Layout (padding, margin, flex) hoặc khi Antd không đáp ứng được yêu cầu đặc thù.

Dưới đây là bản đã được gom lại cho gọn gàng, ít xuống dòng nhưng vẫn giữ nguyên đầy đủ ý nghĩa để bạn dán vào tài liệu:

> **6. Naming & Folder Conventions (CRITICAL):**
> - **File & Folder Casing:** Bắt buộc sử dụng `kebab-case` cho tên file/thư mục (e.g., `[tên-tính-năng].form.tsx`, `kebab-case.tsx`), tuyệt đối không dùng `camelCase` hay `PascalCase` để tránh lỗi môi trường hệ điều hành.
> - **File Suffixes:** Tên file phải có hậu tố chức năng rõ ràng: Components (`.tsx`), Schemas (`.schema.ts`), Constants (`.constant.ts`), Utilities (`.util.ts`), Types (`.types.ts`), API Hooks đặt theo hành động (`[action].ts` như `get-posts.ts`).
> - **Code-Level Naming:** Sử dụng `PascalCase` cho React Components & Types, `camelCase` cho Functions & Variables, và `UPPER_SNAKE_CASE` cho Constants.
> - **Barrel Files (`index.ts`):** Chỉ đặt ở cấp cao nhất của thư mục Feature (e.g., `features/auth/index.ts`) hoặc Shared Component; KHÔNG tạo trong thư mục con để tối ưu Tree-shaking và tránh import vòng (circular dependency).
> **File Path Comments:**: Mọi file PHẢI bắt đầu bằng một dòng comment chứa đường dẫn đầy đủ tính từ thư mục gốc (root) để dễ dàng định vị (e.g.,  @/features/auth/api/user.queries.ts).

---
> ```text
> src/
> │
> ├── app/                        # 1. TẦNG APP ROUTER (Chỉ chứa định tuyến, không chứa logic)
> │   ├── (auth)/login/page.tsx   # Tự động gọi Component từ thư mục tính năng (features/auth)
> │   ├── dashboard/page.tsx      
> │   ├── layout.tsx              # Root Layout bọc các Global Providers
> │   └── provider.tsx            # Nơi cấu hình QueryClientProvider, ThemeProvider...
> │
> │
> ├── features/                   # 3. TẦNG NGHIỆP VỤ (NƠI CODE CHÍNH ⭐)
> │   │                           # Mỗi thư mục là một ứng dụng thu nhỏ, độc lập hoàn toàn.
> │   ├── auth/                   # ---> FEATURE: XÁC THỰC NGƯỜI DÙNG
> │   │   ├── api/                # TẦNG API
> │   |   │   ├── types.ts        # chứa các type
> │   │   │   └── user.mutations.ts      # Chứa custom hook
> │   │   │   └── user.queries.ts        # Chứa custom hook
> │   │   ├── components/         # UI Components chỉ dùng riêng cho Auth
> │   │   │   └── login.form.tsx  
> │   │   ├── utils/              # Các hàm hỗ trợ riêng cho Auth
> │   │   ├── auth.schema.ts      # Cung cấp luật lệ ZOD v4
> │   │   ├── auth.constant.ts    # Cung cấp hằng số
> │   │   ├── auth.util.ts        # Cung cấp hàm tiện ích
> │   │   └── index.ts            # PUBLIC API: Chỉ export những gì cho phép `app/` và nơi khác gọi
> │   │
> │   └── posts/                  # ---> FEATURE: QUẢN LÝ BÀI ĐĂNG
> │       ├── api/                # Adapter gọi API bài đăng (hook, types)
> │       │   ├── user.mutations.ts 
> │       │   ├── types.ts        # chứa các type
> │       │   └── user.queries.ts  # Sử dụng useCreatePostMutation và kèm logic Invalidate Cache
> │       ├── components/         # post-list.tsx, create-post-modal.tsx...
> │       └── index.ts            # PUBLIC API
> │
> ├── components/                 # 4. TẦNG SHARED UI (Dùng chung toàn ứng dụng)
> │   ├── base/                   # Dumb Components (Nút bấm, Modal, Input...)
> │   ├── composite/              # UI kết hợp
> │   └── layouts/                # Header, Footer, Sidebar
> │
> ├── lib/                        # 5. TẦNG SHARED CONFIG (Cấu hình lõi)
> │   ├──         # Custom Axios Instance (Xử lý bóc vỏ ApiResponse và ném lỗi 400/500)
> │   └── utils.ts                # Tailwind merge (cn), ...
> │
> ├── config/                     # Chứa các config biến môi trường (env.ts), routes, theme.ts, ...
> ├── constants/                  # Chứa các constant dùng chung
> ├── hooks/                      # Custom hooks dùng chung (useWindowSize, useDebounce...)
> ├── stores/                     # Global state Zustand toàn ứng dụng (Theme store, auth, ...)
> └── types/                      # TypeScript definitions dùng chung (...)
>     ├── api.types.ts            # Các type chung cho toàn bộ Network/API
>     ├── common.types.ts         # Các type chung cho UI/Logic (Pagination, Option...)
>     └── index.ts                # Barrel file để export mọi thứ
> └── utils/                      # Chứa các hàm util dùng chung

> ```
