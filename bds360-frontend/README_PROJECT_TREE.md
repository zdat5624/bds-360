
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
│  ├─ google-maps.png
│  └─ images
│     ├─ banner-real-estate.png
│     └─ image_Pippit_202604212240.png
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (back-office)
│  │  │  └─ manage
│  │  │     ├─ layout.tsx
│  │  │     ├─ page.tsx
│  │  │     └─ statistics
│  │  │        ├─ posts
│  │  │        │  └─ page.tsx
│  │  │        ├─ transactions
│  │  │        │  └─ page.tsx
│  │  │        └─ users
│  │  │           └─ page.tsx
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
│  │  │  │     │  ├─ page.tsx
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ edit
│  │  │  │     │        └─ page.tsx
│  │  │  │     ├─ profile
│  │  │  │     │  └─ page.tsx
│  │  │  │     └─ vips
│  │  │  │        └─ page.tsx
│  │  │  ├─ (no-sidebar)
│  │  │  │  └─ saved-posts
│  │  │  │     ├─ layout.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ SavedPostsSidebar.tsx
│  │  │  ├─ (public)
│  │  │  │  ├─ (listings)
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ rent
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ sale
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ posts
│  │  │  │  │  └─ [id]
│  │  │  │  │     ├─ nearby-locations-sidebar.tsx
│  │  │  │  │     ├─ page.tsx
│  │  │  │  │     ├─ post-analytics.tsx
│  │  │  │  │     ├─ post-basic-info.tsx
│  │  │  │  │     ├─ post-characteristics.tsx
│  │  │  │  │     ├─ post-gallery.tsx
│  │  │  │  │     ├─ post-meta.tsx
│  │  │  │  │     ├─ post-seller-sidebar.tsx
│  │  │  │  │     └─ related-posts-sidebar.tsx
│  │  │  │  └─ u
│  │  │  │     └─ [id]
│  │  │  │        └─ page.tsx
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
│  │  │  ├─ reveal-phone.button.tsx
│  │  │  ├─ saved-posts-badge.tsx
│  │  │  ├─ table-action.dropdown.tsx
│  │  │  └─ user-info.tsx
│  │  ├─ icons
│  │  │  ├─ custom-icons.tsx
│  │  │  └─ index.ts
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
│  │  ├─ search-suggestions.ts
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
│  │  │  │  ├─ compass-selector.tsx
│  │  │  │  ├─ delete-post.modal.tsx
│  │  │  │  ├─ filter-modal.tsx
│  │  │  │  ├─ filter-tags.tsx
│  │  │  │  ├─ for-you-posts.tsx
│  │  │  │  ├─ hero-smart-filter-bar.tsx
│  │  │  │  ├─ listing-card.tsx
│  │  │  │  ├─ map-dot-marker.tsx
│  │  │  │  ├─ map-selector.tsx
│  │  │  │  ├─ post-card.tsx
│  │  │  │  ├─ post-detail.modal.tsx
│  │  │  │  ├─ post-filter.modal.tsx
│  │  │  │  ├─ post-popup.tsx
│  │  │  │  ├─ post-view-statistics.tsx
│  │  │  │  ├─ posts-map.tsx
│  │  │  │  ├─ price-marker.tsx
│  │  │  │  ├─ property-map.tsx
│  │  │  │  ├─ related-posts.tsx
│  │  │  │  ├─ save-post-button.tsx
│  │  │  │  ├─ smart-filter-bar.tsx
│  │  │  │  └─ vip-marker.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ use-post-filter-url.ts
│  │  │  ├─ index.ts
│  │  │  ├─ posts.constant.ts
│  │  │  ├─ posts.schema.ts
│  │  │  └─ posts.util.ts
│  │  ├─ statistics
│  │  │  ├─ api
│  │  │  │  ├─ manage-post-statistics.queries.ts
│  │  │  │  ├─ manage-post-statistics.types.ts
│  │  │  │  ├─ manage-statistics.queries.ts
│  │  │  │  ├─ manage-statistics.types.ts
│  │  │  │  ├─ manage-transaction-statistics.queries.ts
│  │  │  │  ├─ manage-transaction-statistics.types.ts
│  │  │  │  ├─ manage-user-statistics.queries.ts
│  │  │  │  ├─ manage-user-statistics.types.ts
│  │  │  │  ├─ user-statistics.queries.ts
│  │  │  │  └─ user-statistics.types.ts
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
│  │  │  │  ├─ user-info.tsx
│  │  │  │  ├─ verification-detail.modal.tsx
│  │  │  │  ├─ verification-history.modal.tsx
│  │  │  │  └─ verification-section.tsx
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
│  │  ├─ index.ts
│  │  └─ ui.store.ts
│  ├─ styles
│  │  └─ antd-overrides.css
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