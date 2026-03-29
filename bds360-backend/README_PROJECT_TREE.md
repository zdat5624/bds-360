
```
bds360-backend
├─ .mvn
│  └─ wrapper
│     └─ maven-wrapper.properties
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ README.md
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ vn
│  │  │     └─ bds360
│  │  │        └─ backend
│  │  │           ├─ Bds360BackendApplication.java
│  │  │           ├─ common
│  │  │           │  ├─ advice
│  │  │           │  │  └─ FormatRestResponse.java
│  │  │           │  ├─ annotation
│  │  │           │  │  └─ ApiMessage.java
│  │  │           │  ├─ constant
│  │  │           │  │  ├─ GenderEnum.java
│  │  │           │  │  ├─ NotificationType.java
│  │  │           │  │  ├─ PostStatusEnum.java
│  │  │           │  │  ├─ PostTypeEnum.java
│  │  │           │  │  ├─ RoleEnum.java
│  │  │           │  │  ├─ TransactionFilterType.java
│  │  │           │  │  └─ TransStatusEnum.java
│  │  │           │  ├─ dto
│  │  │           │  │  ├─ request
│  │  │           │  │  └─ response
│  │  │           │  │     ├─ ApiResponse.java
│  │  │           │  │     └─ ResCreateUserDTO.java
│  │  │           │  ├─ exception
│  │  │           │  │  ├─ AppException.java
│  │  │           │  │  ├─ CustomErrorController.java
│  │  │           │  │  ├─ ErrorCode.java
│  │  │           │  │  ├─ ForbiddenException.java
│  │  │           │  │  ├─ GlobalExceptionHandler.java
│  │  │           │  │  ├─ InputInvalidException.java
│  │  │           │  │  ├─ NotFoundException.java
│  │  │           │  │  ├─ PermissionException.java
│  │  │           │  │  └─ StorageException.java
│  │  │           │  └─ util
│  │  │           ├─ config
│  │  │           │  ├─ CorsConfig.java
│  │  │           │  └─ InterceptorConfig.java
│  │  │           ├─ modules
│  │  │           │  ├─ address
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ MapboxConfig.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AddressController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ DistrictDTO.java
│  │  │           │  │  │  │  ├─ ProvinceDTO.java
│  │  │           │  │  │  │  └─ WardDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ CoordinateResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ District.java
│  │  │           │  │  │  ├─ Province.java
│  │  │           │  │  │  └─ Ward.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │  │  ├─ EmailRequest.java
│  │  │           │  │  │  │  ├─ LoginDTO.java
│  │  │           │  │  │  │  ├─ RegisterDTO.java
│  │  │           │  │  │  │  └─ ResetPasswordRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResLoginDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ PasswordResetToken.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ PasswordResetTokenRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ ForgotPasswordService.java
│  │  │           │  ├─ category
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ CategoryController.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Category.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ CategoryRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ CategoryService.java
│  │  │           │  ├─ email
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ EmailController.java
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
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Notification.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ NotificationRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ NotificationService.java
│  │  │           │  ├─ post
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ PostController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ PostRequestDTO.java
│  │  │           │  │  │  │  ├─ UpdatePostDTO.java
│  │  │           │  │  │  │  └─ UpdatePostStatusDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ MapPostDTO.java
│  │  │           │  │  │     └─ ResAddressDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ Image.java
│  │  │           │  │  │  └─ Post.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │     ├─ AdminStatisticsDTO.java
│  │  │           │  │  │     └─ MonthlyRevenueDTO.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  └─ service
│  │  │           │  │     └─ AdminStatisticsService.java
│  │  │           │  ├─ transaction
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ ConfigVNPAY.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  ├─ PaymentController.java
│  │  │           │  │  │  └─ TransactionController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  └─ CreatePaymentDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResPaymentLinkDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Transaction.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ TransactionRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     ├─ TransactionService.java
│  │  │           │  │     └─ VNPAYService.java
│  │  │           │  ├─ user
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ UserController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateUserDTO.java
│  │  │           │  │  │  │  ├─ UpdateProfileDTO.java
│  │  │           │  │  │  │  ├─ UserFilterRequest.java
│  │  │           │  │  │  │  └─ UserUpdateDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ ResUpdateUserDTO.java
│  │  │           │  │  │     └─ UserDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ User.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ UserRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  └─ UserService.java
│  │  │           │  │  └─ specification
│  │  │           │  │     └─ UserSpecification.java
│  │  │           │  └─ vip
│  │  │           │     ├─ controller
│  │  │           │     │  └─ VipController.java
│  │  │           │     ├─ entity
│  │  │           │     │  └─ Vip.java
│  │  │           │     ├─ mapper
│  │  │           │     ├─ repository
│  │  │           │     │  └─ VipRepository.java
│  │  │           │     └─ service
│  │  │           │        └─ VipService.java
│  │  │           ├─ scheduler
│  │  │           │  └─ SystemJobScheduler.java
│  │  │           ├─ security
│  │  │           │  ├─ CustomAuthenticationEntryPoint.java
│  │  │           │  ├─ PermissionInterceptor.java
│  │  │           │  ├─ SecurityConfiguration.java
│  │  │           │  ├─ SecurityUtil.java
│  │  │           │  └─ UserDetailCustom.java
│  │  │           ├─ StartupRunner.java
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


```
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
│  │  │           ├─ common
│  │  │           │  ├─ advice
│  │  │           │  ├─ annotation
│  │  │           │  │  └─ ApiMessage.java
│  │  │           │  ├─ constant
│  │  │           │  │  ├─ GenderEnum.java
│  │  │           │  │  ├─ NotificationType.java
│  │  │           │  │  ├─ PostStatusEnum.java
│  │  │           │  │  ├─ PostTypeEnum.java
│  │  │           │  │  ├─ RoleEnum.java
│  │  │           │  │  ├─ TransactionFilterType.java
│  │  │           │  │  └─ TransStatusEnum.java
│  │  │           │  ├─ dto
│  │  │           │  │  ├─ request
│  │  │           │  │  └─ response
│  │  │           │  │     ├─ ApiResponse.java
│  │  │           │  │     └─ ResCreateUserDTO.java
│  │  │           │  ├─ exception
│  │  │           │  │  ├─ AppException.java
│  │  │           │  │  ├─ CustomErrorController.java
│  │  │           │  │  ├─ ErrorCode.java
│  │  │           │  │  ├─ ForbiddenException.java
│  │  │           │  │  ├─ GlobalExceptionHandler.java
│  │  │           │  │  ├─ InputInvalidException.java
│  │  │           │  │  ├─ NotFoundException.java
│  │  │           │  │  ├─ PermissionException.java
│  │  │           │  │  └─ StorageException.java
│  │  │           │  └─ util
│  │  │           ├─ config
│  │  │           │  ├─ CorsConfig.java
│  │  │           │  └─ InterceptorConfig.java
│  │  │           ├─ modules
│  │  │           │  ├─ address
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ MapboxConfig.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AddressController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ DistrictDTO.java
│  │  │           │  │  │  │  ├─ ProvinceDTO.java
│  │  │           │  │  │  │  └─ WardDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ CoordinateResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ District.java
│  │  │           │  │  │  ├─ Province.java
│  │  │           │  │  │  └─ Ward.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │  │  ├─ EmailRequest.java
│  │  │           │  │  │  │  ├─ LoginDTO.java
│  │  │           │  │  │  │  ├─ RegisterDTO.java
│  │  │           │  │  │  │  └─ ResetPasswordRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResLoginDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ PasswordResetToken.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ PasswordResetTokenRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ ForgotPasswordService.java
│  │  │           │  ├─ category
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ CategoryController.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Category.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ CategoryRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ CategoryService.java
│  │  │           │  ├─ email
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ EmailController.java
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
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Notification.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ NotificationRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ NotificationService.java
│  │  │           │  ├─ post
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ PostController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ PostRequestDTO.java
│  │  │           │  │  │  │  ├─ UpdatePostDTO.java
│  │  │           │  │  │  │  └─ UpdatePostStatusDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ MapPostDTO.java
│  │  │           │  │  │     └─ ResAddressDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ Image.java
│  │  │           │  │  │  └─ Post.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │     ├─ AdminStatisticsDTO.java
│  │  │           │  │  │     └─ MonthlyRevenueDTO.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  └─ service
│  │  │           │  │     └─ AdminStatisticsService.java
│  │  │           │  ├─ transaction
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ ConfigVNPAY.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  ├─ PaymentController.java
│  │  │           │  │  │  └─ TransactionController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  └─ CreatePaymentDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResPaymentLinkDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Transaction.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ TransactionRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     ├─ TransactionService.java
│  │  │           │  │     └─ VNPAYService.java
│  │  │           │  ├─ user
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ UserController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateUserDTO.java
│  │  │           │  │  │  │  ├─ UpdateProfileDTO.java
│  │  │           │  │  │  │  ├─ UserFilterRequest.java
│  │  │           │  │  │  │  └─ UserUpdateDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ ResUpdateUserDTO.java
│  │  │           │  │  │     └─ UserDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ User.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ UserRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  └─ UserService.java
│  │  │           │  │  └─ specification
│  │  │           │  │     └─ UserSpecification.java
│  │  │           │  └─ vip
│  │  │           │     ├─ controller
│  │  │           │     │  └─ VipController.java
│  │  │           │     ├─ entity
│  │  │           │     │  └─ Vip.java
│  │  │           │     ├─ mapper
│  │  │           │     ├─ repository
│  │  │           │     │  └─ VipRepository.java
│  │  │           │     └─ service
│  │  │           │        └─ VipService.java
│  │  │           ├─ scheduler
│  │  │           │  └─ SystemJobScheduler.java
│  │  │           ├─ security
│  │  │           │  ├─ CustomAuthenticationEntryPoint.java
│  │  │           │  ├─ PermissionInterceptor.java
│  │  │           │  ├─ SecurityConfiguration.java
│  │  │           │  ├─ SecurityUtil.java
│  │  │           │  └─ UserDetailCustom.java
│  │  │           ├─ StartupRunner.java
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


```
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
│  │  │           ├─ common
│  │  │           │  ├─ advice
│  │  │           │  ├─ annotation
│  │  │           │  │  └─ ApiMessage.java
│  │  │           │  ├─ constant
│  │  │           │  │  ├─ GenderEnum.java
│  │  │           │  │  ├─ NotificationType.java
│  │  │           │  │  ├─ PostStatusEnum.java
│  │  │           │  │  ├─ PostTypeEnum.java
│  │  │           │  │  ├─ RoleEnum.java
│  │  │           │  │  ├─ TransactionFilterType.java
│  │  │           │  │  └─ TransStatusEnum.java
│  │  │           │  ├─ dto
│  │  │           │  │  ├─ request
│  │  │           │  │  └─ response
│  │  │           │  │     ├─ ApiResponse.java
│  │  │           │  │     └─ ResCreateUserDTO.java
│  │  │           │  ├─ exception
│  │  │           │  │  ├─ AppException.java
│  │  │           │  │  ├─ CustomErrorController.java
│  │  │           │  │  ├─ ErrorCode.java
│  │  │           │  │  ├─ ForbiddenException.java
│  │  │           │  │  ├─ GlobalExceptionHandler.java
│  │  │           │  │  ├─ InputInvalidException.java
│  │  │           │  │  ├─ NotFoundException.java
│  │  │           │  │  ├─ PermissionException.java
│  │  │           │  │  └─ StorageException.java
│  │  │           │  └─ util
│  │  │           ├─ config
│  │  │           │  ├─ CorsConfig.java
│  │  │           │  └─ InterceptorConfig.java
│  │  │           ├─ modules
│  │  │           │  ├─ address
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ MapboxConfig.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ AddressController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ DistrictDTO.java
│  │  │           │  │  │  │  ├─ ProvinceDTO.java
│  │  │           │  │  │  │  └─ WardDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ CoordinateResponse.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ District.java
│  │  │           │  │  │  ├─ Province.java
│  │  │           │  │  │  └─ Ward.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │  │  ├─ EmailRequest.java
│  │  │           │  │  │  │  ├─ LoginDTO.java
│  │  │           │  │  │  │  ├─ RegisterDTO.java
│  │  │           │  │  │  │  └─ ResetPasswordRequest.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResLoginDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ PasswordResetToken.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ PasswordResetTokenRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ ForgotPasswordService.java
│  │  │           │  ├─ category
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ CategoryController.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Category.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ CategoryRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ CategoryService.java
│  │  │           │  ├─ email
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ EmailController.java
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
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Notification.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ NotificationRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     └─ NotificationService.java
│  │  │           │  ├─ post
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ PostController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ PostRequestDTO.java
│  │  │           │  │  │  │  ├─ UpdatePostDTO.java
│  │  │           │  │  │  │  └─ UpdatePostStatusDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ MapPostDTO.java
│  │  │           │  │  │     └─ ResAddressDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  ├─ Image.java
│  │  │           │  │  │  └─ Post.java
│  │  │           │  │  ├─ mapper
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
│  │  │           │  │  │     ├─ AdminStatisticsDTO.java
│  │  │           │  │  │     └─ MonthlyRevenueDTO.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  └─ service
│  │  │           │  │     └─ AdminStatisticsService.java
│  │  │           │  ├─ transaction
│  │  │           │  │  ├─ config
│  │  │           │  │  │  └─ ConfigVNPAY.java
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  ├─ PaymentController.java
│  │  │           │  │  │  └─ TransactionController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  └─ CreatePaymentDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     └─ ResPaymentLinkDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ Transaction.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ TransactionRepository.java
│  │  │           │  │  └─ service
│  │  │           │  │     ├─ TransactionService.java
│  │  │           │  │     └─ VNPAYService.java
│  │  │           │  ├─ user
│  │  │           │  │  ├─ controller
│  │  │           │  │  │  └─ UserController.java
│  │  │           │  │  ├─ dto
│  │  │           │  │  │  ├─ request
│  │  │           │  │  │  │  ├─ CreateUserDTO.java
│  │  │           │  │  │  │  ├─ UpdateProfileDTO.java
│  │  │           │  │  │  │  ├─ UserFilterRequest.java
│  │  │           │  │  │  │  └─ UserUpdateDTO.java
│  │  │           │  │  │  └─ response
│  │  │           │  │  │     ├─ ResUpdateUserDTO.java
│  │  │           │  │  │     └─ UserDTO.java
│  │  │           │  │  ├─ entity
│  │  │           │  │  │  └─ User.java
│  │  │           │  │  ├─ mapper
│  │  │           │  │  ├─ repository
│  │  │           │  │  │  └─ UserRepository.java
│  │  │           │  │  ├─ service
│  │  │           │  │  │  └─ UserService.java
│  │  │           │  │  └─ specification
│  │  │           │  │     └─ UserSpecification.java
│  │  │           │  └─ vip
│  │  │           │     ├─ controller
│  │  │           │     │  └─ VipController.java
│  │  │           │     ├─ entity
│  │  │           │     │  └─ Vip.java
│  │  │           │     ├─ mapper
│  │  │           │     ├─ repository
│  │  │           │     │  └─ VipRepository.java
│  │  │           │     └─ service
│  │  │           │        └─ VipService.java
│  │  │           ├─ scheduler
│  │  │           │  └─ SystemJobScheduler.java
│  │  │           ├─ security
│  │  │           │  ├─ CustomAuthenticationEntryPoint.java
│  │  │           │  ├─ PermissionInterceptor.java
│  │  │           │  ├─ SecurityConfiguration.java
│  │  │           │  ├─ SecurityUtil.java
│  │  │           │  └─ UserDetailCustom.java
│  │  │           ├─ StartupRunner.java
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

```