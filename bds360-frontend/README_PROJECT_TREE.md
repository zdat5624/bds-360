
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
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ sale
│  │  │  │     └─ page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ auth
│  │  │  ├─ forgot-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
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
│  │     ├─ manage-footer.tsx
│  │     ├─ manage-header.tsx
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
│  │  ├─ menus.constant.tsx
│  │  ├─ pagination.constant.ts
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
│  │  │  │  ├─ forgot-password.form.tsx
│  │  │  │  ├─ login.form.tsx
│  │  │  │  └─ register.form.tsx
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