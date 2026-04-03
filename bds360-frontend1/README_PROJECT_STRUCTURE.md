

> **[SYSTEM CONTEXT] PROJECT ARCHITECTURE GUIDELINES**
> 
> **1. Core Tech Stack:**
> - Framework: Next.js (App Router)
> - Language: TypeScript
> - Data Fetching: TanStack React Query v5 + Axios
> - API Code Generation: Orval (Tags-split mode)
> - Validation: Zod
> - Styling: Tailwind CSS + Ant design
> 
> **2. Architectural Philosophy:**
> - **Feature-Based Architecture:** Logic được chia nhỏ theo từng nghiệp vụ (Domain-driven).
> - **Adapter Pattern (Anti-Corruption Layer):** Code gọi API tự động sinh ra (Generated API) phải được bọc lại (Wrap) bởi thư mục Feature trước khi đưa lên UI Component.
> - **Unidirectional Flow:** Tầng App gọi Feature -> Feature gọi Shared. TUYỆT ĐỐI KHÔNG import chéo giữa các Feature (ví dụ: `features/auth` không được import code từ `features/posts`).
> 
> **3. Complete Folder Structure:**
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
> │   └── generated/              # 🤖 KHU VỰC CỦA MÁY (KHÔNG ĐƯỢC CODE TAY VÀO ĐÂY)
> │       ├── auth/               # Code do Orval đẻ ra dựa trên Swagger Tag "auth"
> │       │   ├── auth.ts         # Chứa Axios fetcher và các React Query hooks (useLoginMutation...)
> │       │   └── auth.schemas.ts # Chứa TypeScript Interfaces & Zod schemas
> │       └── posts/              # Code do Orval đẻ ra dựa trên Swagger Tag "posts"
> │
> ├── features/                   # 3. TẦNG NGHIỆP VỤ (NƠI CODE CHÍNH ⭐)
> │   │                           # Mỗi thư mục là một ứng dụng thu nhỏ, độc lập hoàn toàn.
> │   ├── auth/                   # ---> FEATURE: XÁC THỰC NGƯỜI DÙNG
> │   │   ├── api/                # [TẦNG ADAPTER]: Bọc hook từ `api/generated/auth`
> │   │   │   └── login.ts        # Chứa custom hook (useAuthLogin) xử lý lưu token, Toast, Navigate
> │   │   ├── components/         # UI Components chỉ dùng riêng cho Auth
> │   │   │   └── login-form.tsx  
> │   │   ├── stores/             # Global state cục bộ của riêng Auth (ví dụ: Zustand store)
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
> 
> **4. Coding Rules for AI:**
> - When generating a UI component for a specific feature, place it in `src/features/[feature-name]/components/`.
> - Do not write raw `fetch` or `axios` calls in components. Always assume API hooks are generated in `src/api/generated/` and must be wrapped in `src/features/[feature-name]/api/`.
> - When performing a Mutation (Create, Update, Delete), ensure the wrapped API hook calls `queryClient.invalidateQueries` to update the UI cache.
> - Never use relative paths like `../../components/ui/button`. Use absolute imports using the `@/` alias (e.g., `@/components/ui/button`).
> - Do not use Barrel Files (`index.ts`) INSIDE the `features/[feature-name]/` subdirectories (like `api/index.ts` or `components/index.ts`). Only use a single `index.ts` at the root of the feature directory to expose its public API.

---
