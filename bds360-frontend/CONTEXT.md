> **[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**
> 
> **1. Core Tech Stack:**
> - Framework: Next.js (App Router)
> - Language: TypeScript
> - Data Fetching: TanStack React Query v5 + Axios
> - API Code Generation: Orval (Tags-split mode)
> - lib/custom-fetch: Axios instance with Response Unwrapping logic.
> 
> **2. Architectural Philosophy:**
> - **Feature-Based Architecture:** Logic chia theo Domain.
> - **Adapter Pattern:** Mọi API Hook từ `api/generated` PHẢI được bọc lại trong `features/[feature]/api`. 
> - **Anti-Corruption Layer:** Tầng Adapter có nhiệm vụ chuyển đổi dữ liệu từ API thành dữ liệu UI cần (nếu cần) và xử lý side-effects (invalidate cache, toast).
> 
> **3. Folder Structure Highlights:**
> - `src/api/generated/`: Read-only. Chứa interface gốc (ApiResponsePostResponse, v.v.).
> - `src/lib/custom-fetch.ts`: "The Brain". Chứa logic `ExtractData<T>` để tự động loại bỏ lớp vỏ `code/message` của Backend, chỉ trả về `data`.
> 
> **4. Data Handling Strategy (CRITICAL):**
> - **The Envelope:** Backend luôn trả về `{ code, message, data, validationErrors }`.
> - **The Unwrapping:** Hàm `customFetch` sử dụng `ExtractData<T>` để "xuyên thấu" qua lớp vỏ. 
>   - Ví dụ: Nếu Orval gen `customFetch<ApiResponseUserResponse>`, kết quả thực tế hàm trả về là `UserResponse`.
> - **Business Logic Error:** Lỗi có `code !== 10000` được xử lý tập trung bằng `message.error` trong interceptor và ném ra `Promise.reject`.
> 
> **5. Coding Rules for AI:**
> - **Type Selection:** Trong `src/api/generated/api.schemas.ts`, Orval gen ra các `type` phẳng. 
>   - AI phải chọn phần "ruột" (e.g., `UserResponse`) và alias thành Domain Name (e.g., `type User = UserResponse`) tại tầng Adapter.
>   - KHÔNG sử dụng các type có tiền tố `ApiResponse...` ở tầng UI.
> - **Adapter Implementation:** >   - Mọi file trong `features/[feature]/api/` phải export các custom hooks bọc từ generated hooks.
>   - Mutation hooks (Create/Update/Delete) phải bao gồm `onSuccess: () => queryClient.invalidateQueries(...)`.
> - **Component Rules:** >   - UI Component chỉ nhận dữ liệu đã "sạch" từ Feature API.
>   - Luôn sử dụng Absolute Imports với alias `@/`. Không dùng path tương đối `../`.
> - **Barrel Files:** Chỉ dùng `index.ts` ở gốc của mỗi Feature để export Public API. Không dùng `index.ts` bên trong các thư mục con (api, components).

---

### 📋 MẪU PROMPT NGỮ CẢNH DỰ ÁN (Copy toàn bộ phần bên dưới)

> **[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**
> 
> **1. Core Tech Stack:**
> - Framework: Next.js (App Router)
> - Language: TypeScript
> - Data Fetching: TanStack React Query v5 + Axios
> - API Code Generation: Orval (Tags-split mode)
> - Validation: Zod
> - Styling: Tailwind CSS + shadcn/ui
> 
> **2. Architectural Philosophy:**
> - **Feature-Based Architecture:** Logic được chia nhỏ theo từng nghiệp vụ (Domain-driven).
> - **Adapter Pattern (Anti-Corruption Layer):** Code gọi API tự động sinh ra (Generated API) phải được bọc lại (Wrap) bởi thư mục Feature trước khi đưa lên UI Component.
> - **Unidirectional Flow:** Tầng App gọi Feature -> Feature gọi Shared. TUYỆT ĐỐI KHÔNG import chéo giữa các Feature (ví dụ: `features/auth` không được import code từ `features/posts`).
> 
> 
> ```text
> src/
> │
> ├── app/                        # 1. TẦNG APP ROUTER (Chỉ chứa định tuyến, không chứa logic)
> │   ├── (auth)/login/page.tsx   # Tự động gọi Component từ thư mục tính năng (features/auth)
> │   ├── dashboard/page.tsx      
> │   ├── layout.tsx              # Root Layout bọc các Global Providers
> │   └── provider.tsx            # Nơi cấu hình QueryClientProvider, ThemeProvider...
> │
> ├── api/                        # 2. TẦNG INFRASTRUCTURE (Chứa API tự động sinh)
> │   └── generated/              # KHU VỰC CỦA MÁY (KHÔNG ĐƯỢC CODE TAY VÀO ĐÂY)
> │       ├── auth/               # Code do Orval đẻ ra dựa trên Swagger Tag "auth"
> │       │   ├── auth.ts         # Chứa Axios fetcher và các React Query hooks (useLoginMutation...)
> │       └── posts/              # Code do Orval đẻ ra dựa trên Swagger Tag "posts"
> │       └── api.schemas.ts/     # Chứa toàn bộ schemas của api generated
> │
> ├── features/                   # 3. TẦNG NGHIỆP VỤ (NƠI CODE CHÍNH ⭐)
> │   │                           # Mỗi thư mục là một ứng dụng thu nhỏ, độc lập hoàn toàn.
> │   ├── auth/                   # ---> FEATURE: XÁC THỰC NGƯỜI DÙNG
> │   │   ├── api/                # [TẦNG ADAPTER]: Bọc hook từ `api/generated/auth`
> │   │   │   └── login.ts        # Chứa custom hook (useAuthLogin) xử lý lưu token, Toast, Navigate
> │   │   ├── components/         # UI Components chỉ dùng riêng cho Auth
> │   │   │   └── login.form.tsx  
> │   │   ├── utils/              # Các hàm hỗ trợ riêng cho Auth
> │   │   └── index.ts            # PUBLIC API: Chỉ export những gì cho phép `app/` và nơi khác gọi
> │   │
> │   └── posts/                  # ---> FEATURE: QUẢN LÝ BÀI ĐĂNG
> │       ├── api/                # Adapter gọi API bài đăng
> │       │   ├── get-posts.ts    # Sử dụng useGetPostsQuery từ thư mục generated
> │       │   └── create-post.ts  # Sử dụng useCreatePostMutation và kèm logic Invalidate Cache
> │       ├── components/         # post-list.tsx, create-post-modal.tsx...
> │       └── index.ts            # PUBLIC API
> │
> ├── components/                 # 4. TẦNG SHARED UI (Dùng chung toàn ứng dụng)
> │   ├── ui/                     # Dumb Components (Nút bấm, Modal, Input... từ shadcn/ui)
> │   └── layouts/                # Header, Footer, Sidebar
> │
> ├── lib/                        # 5. TẦNG SHARED CONFIG (Cấu hình lõi)
> │   ├── custom-fetch.ts         # Custom Axios Instance (Xử lý bóc vỏ ApiResponse và ném lỗi 400/500)
> │   ├── react-query.ts          # Default options cho React Query (staleTime, retry...)
> │   └── utils.ts                # Tailwind merge (cn), formatCurrency, formatDate...
> │
> ├── config/                     # Biến môi trường (env.ts), hằng số hệ thống
> ├── hooks/                      # Custom hooks dùng chung (useWindowSize, useDebounce...)
> ├── stores/                     # Global state toàn ứng dụng (Theme store, Language store)
> └── types/                      # TypeScript definitions dùng chung (AppConfig...)
> ```
