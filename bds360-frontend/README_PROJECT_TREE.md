
```
bds360-frontend
├─ .eslintrc.json
├─ CONTEXT.md
├─ env.d.ts
├─ global.d.ts
├─ next.config.mjs
├─ orval.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ google-maps.png
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (back-office)
│  │  │  └─ manage
│  │  │     ├─ layout.tsx
│  │  │     └─ page.tsx
│  │  ├─ (main)
│  │  │  ├─ (account)
│  │  │  │  └─ user
│  │  │  │     ├─ change-password
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ layout.tsx
│  │  │  │     ├─ notifications
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ payments
│  │  │  │     │  ├─ page.tsx
│  │  │  │     │  └─ result
│  │  │  │     │     └─ page.tsx
│  │  │  │     ├─ posts
│  │  │  │     │  ├─ create
│  │  │  │     │  │  ├─ confirm-post-creation.modal.tsx
│  │  │  │     │  │  ├─ create-post-success.modal.tsx
│  │  │  │     │  │  ├─ page.tsx
│  │  │  │     │  │  ├─ step-1-general.tsx
│  │  │  │     │  │  ├─ step-2-location.tsx
│  │  │  │     │  │  ├─ step-3-details-media.tsx
│  │  │  │     │  │  └─ step-4-checkout.tsx
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ profile
│  │  │  │     │  └─ page.tsx
│  │  │  │     └─ vips
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
│  │  ├─ not-found.tsx
│  │  └─ provider.tsx
│  ├─ components
│  │  ├─ base
│  │  │  ├─ app.modal.tsx
│  │  │  ├─ confirm.modal.tsx
│  │  │  ├─ data.table.tsx
│  │  │  ├─ filter.button.tsx
│  │  │  ├─ index.ts
│  │  │  └─ search.input.tsx
│  │  ├─ composite
│  │  │  ├─ filter.modal.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ table-action.dropdown.tsx
│  │  │  └─ user-info.tsx
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
│  │  ├─ role.constant.ts
│  │  └─ vip-packages.constant.ts
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
│  │  │  │  ├─ change-password.form.tsx
│  │  │  │  ├─ forgot-password.form.tsx
│  │  │  │  ├─ google-auth.button.tsx
│  │  │  │  ├─ login.form.tsx
│  │  │  │  ├─ logout-confirm.modal.tsx
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
│  │  │  ├─ index.ts
│  │  │  ├─ media.constant.ts
│  │  │  └─ media.schema.ts
│  │  ├─ notifications
│  │  │  ├─ api
│  │  │  │  ├─ notifications.mutations.ts
│  │  │  │  ├─ notifications.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  │  ├─ delete-notifications-action.tsx
│  │  │  │  ├─ floating-notification.button.tsx
│  │  │  │  ├─ notification-bell.button.tsx
│  │  │  │  ├─ notification-detail.modal.tsx
│  │  │  │  └─ notification.popover.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ notifications.constant.tsx
│  │  │  └─ notifications.schema.ts
│  │  ├─ posts
│  │  │  ├─ api
│  │  │  │  ├─ posts.mutations.ts
│  │  │  │  ├─ posts.queries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ components
│  │  │  │  ├─ delete-post.modal.tsx
│  │  │  │  ├─ map-dot-marker.tsx
│  │  │  │  ├─ map-selector.tsx
│  │  │  │  ├─ post-detail.modal.tsx
│  │  │  │  ├─ post-filter.modal.tsx
│  │  │  │  ├─ post-view-statistics.tsx
│  │  │  │  ├─ price-marker.tsx
│  │  │  │  ├─ property-map.tsx
│  │  │  │  └─ vip-marker.tsx
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
│  │  │  │  ├─ top-up.button.tsx
│  │  │  │  ├─ top-up.modal.tsx
│  │  │  │  └─ transaction-detail.modal.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ transactions.constant.ts
│  │  │  └─ transactions.schema.ts
│  │  ├─ users
│  │  │  ├─ api
│  │  │  │  ├─ types.ts
│  │  │  │  ├─ user.mutations.ts
│  │  │  │  └─ user.queries.ts
│  │  │  ├─ components
│  │  │  │  ├─ update-profile.form.tsx
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
│  │     │  └─ vip-packages.list.tsx
│  │     ├─ index.ts
│  │     └─ vips.schema.ts
│  ├─ hooks
│  │  ├─ index.ts
│  │  └─ use-app-theme.ts
│  ├─ lib
│  │  ├─ custom-fetch.ts
│  │  ├─ index.ts
│  │  └─ utils.ts
│  ├─ providers
│  │  ├─ auth.provider.tsx
│  │  ├─ index.ts
│  │  └─ socket.provider.tsx
│  ├─ stores
│  │  ├─ auth.store.ts
│  │  └─ index.ts
│  ├─ styles
│  │  └─ antd-overrides.css
│  ├─ types
│  │  ├─ api.types.ts
│  │  ├─ common.types.ts
│  │  ├─ index.ts
│  │  ├─ mapbox.d.ts
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