
```
bds360-backend
├─ .mvn
│  └─ wrapper
│     └─ maven-wrapper.properties
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ README.md
├─ README_PROJECT_TREE.md
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ vn
│  │  │     └─ bds360
│  │  │        └─ backend
│  │  │           ├─ Bds360BackendApplication.java
│  │  │           ├─ bootstrap
│  │  │           │  └─ StartupRunner.java
│  │  │           ├─ common
│  │  │           │  ├─ annotation
│  │  │           │  ├─ config
│  │  │           │  │  ├─ CorsConfig.java
│  │  │           │  │  ├─ InterceptorConfig.java
│  │  │           │  │  └─ WebArgumentResolverConfig.java
│  │  │           │  ├─ constant
│  │  │           │  │  ├─ Gender.java
│  │  │           │  │  ├─ ListingType.java
│  │  │           │  │  ├─ NotificationType.java
│  │  │           │  │  ├─ PostStatus.java
│  │  │           │  │  ├─ Role.java
│  │  │           │  │  └─ TransactionStatus.java
│  │  │           │  ├─ dto
│  │  │           │  │  ├─ request
│  │  │           │  │  │  └─ BaseFilterRequest.java
│  │  │           │  │  └─ response
│  │  │           │  │     ├─ ApiResponse.java
│  │  │           │  │     └─ PageResponse.java
│  │  │           │  ├─ exception
│  │  │           │  │  ├─ AppException.java
│  │  │           │  │  ├─ CustomErrorController.java
│  │  │           │  │  ├─ ErrorCode.java
│  │  │           │  │  └─ GlobalExceptionHandler.java
│  │  │           │  ├─ mapper
│  │  │           │  │  └─ MapperConfiguration.java
│  │  │           │  └─ util
│  │  │           ├─ modules
│  │  │           │  ├─ address
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ MapboxConfig.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AddressController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateDistrictRequest.java
│  │  │           │  │  │  │  ├─ CreateProvinceRequest.java
│  │  │           │  │  │  │  └─ CreateWardRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ CoordinateResponse.java
│  │  │           │  │  │     ├─ DistrictResponse.java
│  │  │           │  │  │     ├─ ProvinceResponse.java
│  │  │           │  │  │     └─ WardResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ District.java
│  │  │           │  │  │  ├─ Province.java
│  │  │           │  │  │  └─ Ward.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ AddressMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  ├─ DistrictRepository.java
│  │  │           │  │  │  ├─ ProvinceRepository.java
│  │  │           │  │  │  └─ WardRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     ├─ AddressService.java
│  │  │           │  │     └─ MapboxGeocodeService.java
│  │  │           │  ├─ auth
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AuthController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ ChangePasswordRequest.java
│  │  │           │  │  │  │  ├─ ForgotPasswordRequest.java
│  │  │           │  │  │  │  ├─ LoginRequest.java
│  │  │           │  │  │  │  ├─ RegisterRequest.java
│  │  │           │  │  │  │  └─ ResetPasswordRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ LoginResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ PasswordResetToken.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ PasswordResetTokenRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     ├─ AuthService.java
│  │  │           │  │     └─ ForgotPasswordService.java
│  │  │           │  ├─ category
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ CategoryController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CategoryCreateRequest.java
│  │  │           │  │  │  │  ├─ CategoryFilterRequest.java
│  │  │           │  │  │  │  └─ CategoryUpdateRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ CategoryResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Category.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ CategoryMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ CategoryRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ CategoryService.java
│  │  │           │  ├─ email
│  │  │           │  │  └─ service
│  │  │           │  │     └─ EmailService.java
│  │  │           │  ├─ media
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ MediaWebConfig.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ FileUploadController.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ FileStorageService.java
│  │  │           │  ├─ notification
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ NotificationController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateNotificationRequest.java
│  │  │           │  │  │  │  └─ ViewPhoneNotificationRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ NotificationCountResponse.java
│  │  │           │  │  │     └─ NotificationResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Notification.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ NotificationMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ NotificationRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ NotificationService.java
│  │  │           │  ├─ post
│  │  │           │  │  ├─ constant
│  │  │           │  │  │  ├─ Furnishing.java
│  │  │           │  │  │  ├─ LegalStatus.java
│  │  │           │  │  │  └─ PropertyDirection.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  ├─ AdminPostController.java
│  │  │           │  │  │  └─ PostController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ ListingDetailRequest.java
│  │  │           │  │  │  │  ├─ PostCreateRequest.java
│  │  │           │  │  │  │  ├─ PostFilterRequest.java
│  │  │           │  │  │  │  ├─ UpdatePostRequest.java
│  │  │           │  │  │  │  └─ UpdatePostStatusRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ PostResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ Image.java
│  │  │           │  │  │  ├─ ListingDetail.java
│  │  │           │  │  │  └─ Post.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ PostMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  ├─ ImageRepository.java
│  │  │           │  │  │  └─ PostRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  └─ PostService.java
│  │  │           │  │  └─ specification
│  │  │           │  │     └─ PostSpecification.java
│  │  │           │  ├─ statistics
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AdminStatisticsController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ AdminStatisticsResponse.java
│  │  │           │  │  │     └─ MonthlyRevenueResponse.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  └─ service
│  │  │           │  │     └─ AdminStatisticsService.java
│  │  │           │  ├─ transaction
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ VnPayProperties.java
│  │  │           │  │  ├─ constant
│  │  │           │  │  │  └─ TransactionFilterType.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  ├─ PaymentController.java
│  │  │           │  │  │  └─ TransactionController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreatePaymentRequest.java
│  │  │           │  │  │  │  └─ TransactionFilterRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ PaymentLinkResponse.java
│  │  │           │  │  │     └─ TransactionResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Transaction.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ TransactionMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ TransactionRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  ├─ TransactionService.java
│  │  │           │  │  │  └─ VNPAYService.java
│  │  │           │  │  ├─ specification
│  │  │           │  │  │  └─ TransactionSpecification.java
│  │  │           │  │  └─ util
│  │  │           │  │     └─ VnPayUtil.java
│  │  │           │  ├─ user
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ UserController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateUserRequest.java
│  │  │           │  │  │  │  ├─ UpdateProfileRequest.java
│  │  │           │  │  │  │  ├─ UpdateUserRequest.java
│  │  │           │  │  │  │  └─ UserFilterRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ UserResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ User.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  │  └─ UserMapper.java
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ UserRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  └─ UserService.java
│  │  │           │  │  └─ specification
│  │  │           │  │     └─ UserSpecification.java
│  │  │           │  └─ vip
│  │  │           │     ├─ controller
│  │  │           │     │  └─ VipController.java
│  │  │           │     ├─ dto
│  │  │           │     │  ├─ request
│  │  │           │     │  │  └─ UpdateVipPriceRequest.java
│  │  │           │     │  └─ response
│  │  │           │     │     └─ VipResponse.java
│  │  │           │     ├─ entity
│  │  │           │     │  └─ Vip.java
│  │  │           │     ├─ mapper
│  │  │           │     │  └─ VipMapper.java
│  │  │           │     ├─ repository
│  │  │           │     │  └─ VipRepository.java
│  │  │           │     └─ service
│  │  │           │        └─ VipService.java
│  │  │           ├─ scheduler
│  │  │           │  └─ SystemJobScheduler.java
│  │  │           ├─ security
│  │  │           │  ├─ annotation
│  │  │           │  │  ├─ CurrentUser.java
│  │  │           │  │  ├─ IsAdmin.java
│  │  │           │  │  └─ RequireLogin.java
│  │  │           │  ├─ CustomAccessDeniedHandler.java
│  │  │           │  ├─ CustomAuthenticationEntryPoint.java
│  │  │           │  ├─ CustomUserDetailsService.java
│  │  │           │  ├─ PermissionInterceptor.java
│  │  │           │  ├─ resolver
│  │  │           │  │  └─ CurrentUserArgumentResolver.java
│  │  │           │  ├─ SecurityConfiguration.java
│  │  │           │  └─ SecurityUtil.java
│  │  │           └─ websocket
│  │  │              └─ WebSocketConfig.java
│  │  └─ resources
│  │     ├─ application-prod.properties
│  │     ├─ application.properties
│  │     ├─ data
│  │     │  └─ address.json
│  │     └─ templates
│  │        ├─ deposit-success.html
│  │        └─ forgot-password.html
│  └─ test
│     └─ java
│        └─ vn
│           └─ bds360
│              └─ backend
│                 └─ Bds360BackendApplicationTests.java
└─
```