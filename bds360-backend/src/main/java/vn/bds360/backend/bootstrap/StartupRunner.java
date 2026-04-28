package vn.bds360.backend.bootstrap;

import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import vn.bds360.backend.common.config.AppProperties;
import vn.bds360.backend.common.constant.ListingType;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.Role;
import vn.bds360.backend.modules.address.dto.request.CreateDistrictRequest;
import vn.bds360.backend.modules.address.dto.request.CreateProvinceRequest;
import vn.bds360.backend.modules.address.dto.request.CreateWardRequest;
import vn.bds360.backend.modules.address.entity.District;
import vn.bds360.backend.modules.address.entity.Province;
import vn.bds360.backend.modules.address.entity.Ward;
import vn.bds360.backend.modules.address.repository.DistrictRepository;
import vn.bds360.backend.modules.address.repository.ProvinceRepository;
import vn.bds360.backend.modules.address.repository.WardRepository;
import vn.bds360.backend.modules.address.service.MapboxGeocodeService;
import vn.bds360.backend.modules.category.entity.Category;
import vn.bds360.backend.modules.category.repository.CategoryRepository;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.repository.NotificationRepository;
import vn.bds360.backend.modules.post.constant.CompassDirection;
import vn.bds360.backend.modules.post.constant.Furnishing;
import vn.bds360.backend.modules.post.constant.LegalStatus;
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Image;
import vn.bds360.backend.modules.post.entity.ListingDetail;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.post.repository.PostViewHistoryRepository;
import vn.bds360.backend.modules.post.repository.SavedPostRepository;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.constant.TransactionType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.transaction.util.VnPayUtil;
import vn.bds360.backend.modules.user.constant.Gender;
import vn.bds360.backend.modules.user.constant.VerificationStatus;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.entity.VerificationSubmission;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.user.repository.VerificationSubmissionRepository;
import vn.bds360.backend.modules.vip.entity.Vip;
import vn.bds360.backend.modules.vip.repository.VipRepository;

@Component
@RequiredArgsConstructor
public class StartupRunner implements CommandLineRunner {

    private final NotificationRepository notificationRepository;
    private final VipRepository vipRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final MapboxGeocodeService mapboxGeocodeService;
    private final JdbcTemplate jdbcTemplate;
    private final PostViewHistoryRepository postViewHistoryRepository;
    private final SavedPostRepository savedPostRepository;

    private final VerificationSubmissionRepository verificationRepo;
    // private final VnPayProperties vnPayProperties;
    private final AppProperties appProperties;

    @Override
    public void run(String... args) {

        System.out.println(">>> START INIT DATABASE");

        System.out.println(">>> INIT TABLE 'users': 1 ADMIN, 50 USER");

        if (this.userRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT TABLE 'users' : ALREADY HAVE DATA ... ");
        } else {
            initSampleUsers();
        }

        // Kiểm tra nếu database table provinces,dictrics,wars đã có dữ liệu thì không
        // init
        if (this.provinceRepository.count() > 0 || this.districtRepository.count() > 0
                || this.wardRepository.count() > 0) {
            System.out.println(
                    ">>> SKIP! INIT ADDRESS DATA TABLE 'provinces', 'districs', 'wards': ALREADY HAVE DATA ... ");
        } else {
            try {

                ObjectMapper objectMapper = new ObjectMapper();

                try (InputStream inputStream = new ClassPathResource("/data/address.json").getInputStream()) {
                    List<CreateProvinceRequest> provinceDTOs = objectMapper.readValue(inputStream,
                            new TypeReference<List<CreateProvinceRequest>>() {
                            });

                    for (CreateProvinceRequest provinceDTO : provinceDTOs) {
                        Province province = convertToEntity(provinceDTO);
                        provinceRepository.save(province);
                    }
                    System.out.println(">>> INIT ADDRESS DATA TABLE provinces, districs, wards: SUCCESS");
                } catch (Exception e) {
                    e.printStackTrace();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        initSampleCategories();

        initSampleVips();

        initSamplePosts();

        initSampleInteractions();

        initSampleTransactions();

        initSampleNotifications();

        System.out.println(">>> END INIT DATABASE");

    }

    private void initSampleUsers() {
        if (userRepository.count() > 1)
            return; // Tránh seed đè dữ liệu

        List<User> userList = new ArrayList<>();
        String password = passwordEncoder.encode("123456");
        Random random = new Random();
        Instant now = Instant.now();
        // ===== DATA NAME =====
        String[] lastNames = { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Đặng" };
        String[] maleMiddleNames = { "Văn", "Hữu", "Đức" };
        String[] femaleMiddleNames = { "Thị", "Ngọc", "Thu" };
        String[] maleFirstNames = { "Anh", "Bình", "Cường", "Dũng", "Hải", "Hưng", "Khánh", "Minh", "Nam" };
        String[] femaleFirstNames = { "Anh", "Hà", "Hương", "Lan", "Linh", "Mai", "Ngọc", "Thảo", "Trang" };

        String[] addresses = { "Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh" };

        // ===== 1. ADMIN =====
        User admin = new User();
        admin.setEmail("admin@gmail.com");
        admin.setName("Quản trị viên");
        admin.setPassword(password);
        admin.setRole(Role.ADMIN);
        admin.setGender(Gender.MALE);
        admin.setAvatar("https://randomuser.me/api/portraits/men/97.jpg");
        admin.setBalance(1_000_000_000L);
        admin.setPhone("0123456789");
        admin.setAddress("TP. Hồ Chí Minh");
        admin.setCreatedAt(now.minus(4 * 365L, java.time.temporal.ChronoUnit.DAYS));
        userList.add(admin);

        // ===== 2. USERS =====
        for (int i = 1; i <= 50; i++) {
            User user = new User();

            user.setEmail("user" + i + "@gmail.com");
            user.setPassword(password);
            user.setRole(Role.USER);

            // Giới tính
            Gender gender = random.nextBoolean() ? Gender.MALE : Gender.FEMALE;
            user.setGender(gender);

            // ===== RANDOM NAME =====
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String middleName = (gender == Gender.MALE)
                    ? maleMiddleNames[random.nextInt(maleMiddleNames.length)]
                    : femaleMiddleNames[random.nextInt(femaleMiddleNames.length)];

            String firstName = (gender == Gender.MALE)
                    ? maleFirstNames[random.nextInt(maleFirstNames.length)]
                    : femaleFirstNames[random.nextInt(femaleFirstNames.length)];

            user.setName(lastName + " " + middleName + " " + firstName);

            // ===== AVATAR =====
            String genderApiDir = (gender == Gender.MALE) ? "men" : "women";
            int avatarIndex = random.nextInt(100); // tránh vượt range
            user.setAvatar("https://randomuser.me/api/portraits/" + genderApiDir + "/" + avatarIndex + ".jpg");

            // ===== OTHER INFO =====
            user.setBalance(500_000L * i);
            user.setPhone("09" + String.format("%08d", random.nextInt(100_000_000)));
            user.setAddress(addresses[random.nextInt(addresses.length)]);

            long randomDaysAgo = random.nextLong(1, 4 * 365 + 1);
            // Trừ thêm một lượng giây ngẫu nhiên trong ngày đó cho nó thật
            long randomSecondsInDay = random.nextLong(86400);

            Instant randomCreatedAt = now
                    .minus(randomDaysAgo, java.time.temporal.ChronoUnit.DAYS)
                    .minusSeconds(randomSecondsInDay);

            user.setCreatedAt(randomCreatedAt);
            // Cập nhật updatedAt bằng createdAt luôn cho logic
            user.setUpdatedAt(randomCreatedAt);

            userList.add(user);
        }

        userRepository.saveAll(userList);

        // ===== 3. VERIFICATION =====
        seedVerificationSubmissions(userList);
    }

    private void seedVerificationSubmissions(List<User> users) {
        List<VerificationSubmission> submissions = new ArrayList<>();
        Instant now = Instant.now();

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);

            // Reset mặc định
            user.setIsVerified(false);

            int caseType = i % 3;

            switch (caseType) {
                case 0 -> {
                    // ===== CASE 1: Đã duyệt =====
                    submissions.add(createSub(
                            user,
                            VerificationStatus.REJECTED,
                            "Ảnh mờ",
                            now.minusSeconds(86400 * 3)));

                    submissions.add(createSub(
                            user,
                            VerificationStatus.APPROVED,
                            "Hợp lệ",
                            now.minusSeconds(86400)));

                    user.setIsVerified(true);
                }

                case 1 -> {
                    // ===== CASE 2: Bị từ chối + đang chờ =====
                    submissions.add(createSub(
                            user,
                            VerificationStatus.REJECTED,
                            "Sai định dạng",
                            now.minusSeconds(86400 * 2)));

                    submissions.add(createSub(
                            user,
                            VerificationStatus.PENDING,
                            null,
                            now.minusSeconds(3600)));

                    user.setIsVerified(false);
                }

                case 2 -> {
                    // ===== CASE 3: Mới gửi lần đầu =====
                    submissions.add(createSub(
                            user,
                            VerificationStatus.PENDING,
                            null,
                            now.minusSeconds(7200)));

                    user.setIsVerified(false);
                }
            }
        }

        // Lưu toàn bộ user
        userRepository.saveAll(users);

        // Lưu toàn bộ submissions
        verificationRepo.saveAll(submissions);
    }

    // Hàm helper để tạo object submission nhanh gọn
    private VerificationSubmission createSub(User user, VerificationStatus status, String note, Instant createdAt) {
        VerificationSubmission sub = VerificationSubmission.builder()
                .user(user)
                .idCardFront(
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg/960px-C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg")
                .idCardBack("https://media.vov.vn/sites/default/files/styles/large/public/2021-10/Can%20cuoc.jpg")
                .status(status)
                .reviewNote(note)
                .build();

        // Vì Builder không set được @PrePersist khi seed thủ công có timeline, ta set
        // cứng createdAt
        sub.setCreatedAt(createdAt);

        if (status != VerificationStatus.PENDING) {
            sub.setReviewedAt(createdAt.plusSeconds(3600 * 2)); // Duyệt sau khi nộp 2 tiếng
            sub.setReviewedBy("admin@gmail.com");
        }

        return sub;
    }

    private void initSampleCategories() {
        if (categoryRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT ADDRESS DATA TABLE category: ALREADY HAVE DATA ... ");
            return;
        }

        ArrayList<Category> lst = new ArrayList<Category>();
        lst.add(new Category("Cho thuê căn hộ chung cư", ListingType.RENT));
        lst.add(new Category("Cho thuê chung cư mini, căn hộ dịch vụ", ListingType.RENT));
        lst.add(new Category("Cho thuê nhà riêng", ListingType.RENT));
        lst.add(new Category("Cho thuê nhà biệt thự, liền kề", ListingType.RENT));
        lst.add(new Category("Cho thuê nhà mặt phố", ListingType.RENT));
        lst.add(new Category("Cho thuê shophouse, nhà phố thương mại", ListingType.RENT));
        lst.add(new Category("Cho thuê nhà trọ, phòng trọ", ListingType.RENT));
        lst.add(new Category("Cho thuê văn phòng", ListingType.RENT));
        lst.add(new Category("Cho thuê, sang nhượng cửa hàng, ki ốt", ListingType.RENT));
        lst.add(new Category("Cho thuê kho, nhà xưởng, đất", ListingType.RENT));
        lst.add(new Category("Cho thuê loại bất động sản khác", ListingType.RENT));

        lst.add(new Category("Bán căn hộ chung cư", ListingType.SALE));
        lst.add(new Category("Bán chung cư mini, căn hộ dịch vụ", ListingType.SALE));
        lst.add(new Category("Bán nhà riêng", ListingType.SALE));
        lst.add(new Category("Bán nhà biệt thự, liền kề", ListingType.SALE));
        lst.add(new Category("Bán nhà mặt phố", ListingType.SALE));
        lst.add(new Category("Bán shophouse, nhà phố thương mại", ListingType.SALE));
        lst.add(new Category("Bán đất nền dự án", ListingType.SALE));
        lst.add(new Category("Bán đất", ListingType.SALE));
        lst.add(new Category("Bán trang trại, khu nghỉ dưỡng", ListingType.SALE));
        lst.add(new Category("Bán condotel", ListingType.SALE));
        lst.add(new Category("Bán kho, nhà xưởng", ListingType.SALE));
        lst.add(new Category("Bán loại bất động sản khác", ListingType.SALE));

        this.categoryRepository.saveAll(lst);

        System.out.println(">>> INIT ADDRESS DATA TABLE 'categories' : SUCCESS");

    }

    private void initSampleVips() {
        if (vipRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT ADDRESS DATA TABLE vips: ALREADY HAVE DATA ... ");
            return;
        }

        ArrayList<Vip> lst = new ArrayList<Vip>();
        lst.add(new Vip(0, "VIP 0", 0));
        lst.add(new Vip(1, "VIP 1", 2000));
        lst.add(new Vip(2, "VIP 2", 4000));

        this.vipRepository.saveAll(lst);

        System.out.println(">>> INIT ADDRESS DATA TABLE 'vips' : SUCCESS");

    }

    // ====================================================================
    // 🌟 3. HÀM HELPER ĐIỀN NỘI DUNG VÀ HÌNH ẢNH (Tách từ switch-case)
    // ====================================================================
    private void populateContentAndImages(Post post, String categoryName, double roundedArea, String fullAddress,
            Random random, String baseImageUrl, int loopIndex) {
        String title = "";
        String description = "";
        List<String> sampleImageUrls = new ArrayList<>();

        switch (categoryName) {
            case "Cho thuê căn hộ chung cư":
                title = String.format("Cho Thuê Căn Hộ Chung Cư 2 Phòng Ngủ %s m2 Gần Trung Tâm", roundedArea);
                description = String.format(
                        "Cho thuê căn hộ chung cư cao cấp, diện tích %s m2, gồm 2 phòng ngủ rộng rãi và 1 phòng khách thoáng mát. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chungcucaocap (1).jpg",
                        "chungcucaocap (2).jpg", "chungcucaocap (3).jpg", "chungcucaocap (4).jpg",
                        "chungcucaocap (5).jpg", "chungcucaocap (6).jpg", "canhochungcu (1).jpg",
                        "canhochungcu (2).jpg", "canhochungcu (3).jpg", "canhochungcu (4).jpg",
                        "canhochungcu (5).jpg", "canhochungcu (6).jpg", "canhochungcu (7).jpg",
                        "canhochungcu (8).jpg", "canhochungcu (9).jpg", "canhochungcu (10).jpg",
                        "canhochungcu (11).jpg");
                break;
            case "Cho thuê chung cư mini, căn hộ dịch vụ":
                title = String.format("Cho Thuê Chung Cư Mini %s m2 Gần Trường Đại Học", roundedArea);
                description = String.format(
                        "Cho thuê chung cư mini tiện nghi, diện tích %s m2, gồm 1 phòng ngủ ấm cúng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chungcu (1).jpg",
                        "chungcu (2).jpg", "chungcu (3).jpg", "chungcu (4).jpg", "chungcu (5).jpg",
                        "chungcu (6).jpg", "canhochungcumini (1).jpg", "canhochungcumini (2).jpg",
                        "canhochungcumini (3).jpg", "canhochungcumini (4).jpg", "canhochungcumini (5).jpg",
                        "canhochungcumini (6).jpg", "canhochungcumini (7).jpg", "canhochungcumini (8).jpg",
                        "canhochungcumini (9).jpg", "canhochungcumini (10).jpg", "canhochungcumini (11).jpg",
                        "canhochungcumini (12).jpg", "canhochungcumini (13).jpg", "canhochungcumini (14).jpg");
                break;
            case "Cho thuê nhà riêng":
                title = String.format("Cho Thuê Nhà Riêng 3 Tầng %s m2 Có Gara Ô Tô", roundedArea);
                description = String.format(
                        "Nhà riêng cho thuê, 3 tầng khang trang, diện tích %s m2, gồm 4 phòng ngủ rộng rãi. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenharieng (1).jpg", "chothuenharieng (2).jpg", "chothuenharieng (3).jpg",
                        "chothuenharieng (4).jpg", "chothuenharieng (5).jpg", "chothuenharieng (6).jpg",
                        "chothuenharieng (7).jpg", "banthuenharieng (1).jpg", "banthuenharieng (2).jpg",
                        "banthuenharieng (3).jpg", "banthuenharieng (4).jpg", "banthuenharieng (5).jpg",
                        "banthuenharieng (6).jpg",
                        "banthuenharieng (7).jpg", "banthuenharieng (8).jpg", "banthuenharieng (9).jpg",
                        "banthuenharieng (10).jpg");
                break;
            case "Cho thuê nhà biệt thự, liền kề":
                title = String.format("Cho Thuê Biệt Thự Liền Kề %s m2 Có Hồ Bơi Riêng", roundedArea);
                description = String.format(
                        "Cho thuê biệt thự liền kề đẳng cấp, diện tích %s m2, thiết kế sang trọng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "bietthulienke (1).jpg", "bietthulienke (2).jpg", "bietthulienke (3).jpg",
                        "bietthulienke (4).jpg", "bietthulienke (5).jpg", "bietthulienke (6).jpg",
                        "bietthulienke (7).jpg", "bietthulienke (8).jpg", "bietthulienke (9).jpg");
                break;
            case "Cho thuê nhà mặt phố":
                title = String.format("Cho Thuê Nhà Mặt Phố %s m2 Vị Trí Kinh Doanh Đắc Địa", roundedArea);
                description = String.format(
                        "Nhà mặt phố cho thuê, diện tích %s m2, 2 tầng rộng rãi. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenhamatpho (1).jpg", "chothuenhamatpho (2).jpg", "chothuenhamatpho (3).jpg",
                        "chothuenhamatpho (4).jpg", "chothuenhamatpho (5).jpg", "chothuenhamatpho (6).jpg",
                        "chothuenhamatpho (7).jpg", "chothuenhamatpho (8).jpg", "chothuenhamatpho (9).jpg");
                break;
            case "Cho thuê shophouse, nhà phố thương mại":
                title = String.format("Cho Thuê Shophouse %s m2 Mặt Tiền Rộng Khu Đô Thị Mới", roundedArea);
                description = String.format(
                        "Cho thuê shophouse hiện đại, diện tích %s m2, thiết kế 3 tầng tối ưu. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothueshophouse (1).jpg", "chothueshophouse (2).jpg", "chothueshophouse (3).jpg",
                        "chothueshophouse (4).jpg", "chothueshophouse (5).jpg", "chothueshophouse (6).jpg",
                        "chothueshophouse (7).jpg", "chothueshophouse (8).jpg");
                break;
            case "Cho thuê nhà trọ, phòng trọ":
                title = String.format("Cho Thuê Phòng Trọ %s m2 Sạch Sẽ Gần Trường Đại Học", roundedArea);
                description = String.format(
                        "Phòng trọ cho thuê sạch sẽ, diện tích %s m2, thiết kế gọn gàng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "nhatrophongtro (1).jpg", "nhatrophongtro (2).jpg", "nhatrophongtro (3).jpg",
                        "nhatrophongtro (4).jpg", "nhatrophongtro (5).jpg", "nhatrophongtro (6).jpg",
                        "nhatrophongtro (7).jpg", "nhatrophongtro (8).jpg");
                break;
            case "Cho thuê văn phòng":
                title = String.format("Cho Thuê Văn Phòng %s m2 Hiện Đại Tại Trung Tâm", roundedArea);
                description = String.format(
                        "Văn phòng cho thuê chuyên nghiệp, diện tích %s m2, không gian mở hiện đại. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuevanphong (1).jpg", "chothuevanphong (2).jpg", "chothuevanphong (3).jpg",
                        "chothuevanphong (4).jpg", "chothuevanphong (5).jpg", "chothuevanphong (6).jpg",
                        "chothuevanphong (7).jpg", "chothuevanphong (8).jpg");
                break;
            case "Cho thuê, sang nhượng cửa hàng, ki ốt":
                title = String.format("Cho Thuê hoặc Sang Nhượng Cửa Hàng %s m2 Đang Kinh Doanh", roundedArea);
                description = String.format(
                        "Cho thuê hoặc sang nhượng cửa hàng, diện tích %s m2, mặt tiền rộng 4m. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuecuahankiot (1).jpg", "chothuecuahankiot (2).jpg", "chothuecuahankiot (3).jpg",
                        "chothuecuahankiot (4).jpg", "chothuecuahankiot (5).jpg", "chothuecuahankiot (6).jpg",
                        "chothuecuahankiot (7).jpg", "chothuecuahankiot (8).jpg", "chothuecuahankiot (9).jpg");
                break;
            case "Cho thuê kho, nhà xưởng, đất":
                title = String.format("Cho Thuê Kho Bãi %s m2 Gần Khu Công Nghiệp", roundedArea);
                description = String.format(
                        "Cho thuê kho bãi rộng rãi, diện tích %s m2, kết cấu khung thép chắc chắn. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenhakhonhaxuong (1).jpg", "chothuenhakhonhaxuong (2).jpg",
                        "chothuenhakhonhaxuong (3).jpg", "chothuenhakhonhaxuong (4).jpg",
                        "chothuenhakhonhaxuong (5).jpg", "chothuenhakhonhaxuong (6).jpg",
                        "chothuenhakhonhaxuong (7).jpg", "chothuenhakhonhaxuong (8).jpg");
                break;
            case "Cho thuê loại bất động sản khác":
                title = String.format("Cho Thuê Mặt Bằng Đa Năng %s m2 Linh Hoạt Sử Dụng", roundedArea);
                description = String.format(
                        "Cho thuê mặt bằng đa năng, diện tích %s m2, vị trí linh hoạt. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "batdongsankhac (1).jpg", "batdongsankhac (2).jpg", "batdongsankhac (3).jpg",
                        "batdongsankhac (4).jpg", "batdongsankhac (5).jpg");
                break;

            case "Bán căn hộ chung cư":
                title = String.format("Bán Căn Hộ Chung Cư 3 Phòng Ngủ %s m2 View Công Viên", roundedArea);
                description = String.format(
                        "Bán căn hộ chung cư cao cấp, diện tích %s m2, gồm 3 phòng ngủ rộng rãi. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chungcucaocap (1).jpg",
                        "chungcucaocap (2).jpg", "chungcucaocap (3).jpg", "chungcucaocap (4).jpg",
                        "chungcucaocap (5).jpg", "chungcucaocap (6).jpg", "canhochungcu (1).jpg",
                        "canhochungcu (2).jpg", "canhochungcu (3).jpg", "canhochungcu (4).jpg",
                        "canhochungcu (5).jpg", "canhochungcu (6).jpg", "canhochungcu (7).jpg",
                        "canhochungcu (8).jpg", "canhochungcu (9).jpg", "canhochungcu (10).jpg",
                        "canhochungcu (11).jpg");
                break;
            case "Bán chung cư mini, căn hộ dịch vụ":
                title = String.format("Bán Chung Cư Mini %s m2 Đang Cho Thuê Ổn Định", roundedArea);
                description = String.format(
                        "Bán chung cư mini sinh lời cao, diện tích %s m2, gồm 1 phòng ngủ khép kín. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chungcu (1).jpg",
                        "chungcu (2).jpg", "chungcu (3).jpg", "chungcu (4).jpg", "chungcu (5).jpg",
                        "chungcu (6).jpg", "canhochungcumini (1).jpg", "canhochungcumini (2).jpg",
                        "canhochungcumini (3).jpg", "canhochungcumini (4).jpg", "canhochungcumini (5).jpg",
                        "canhochungcumini (6).jpg", "canhochungcumini (7).jpg", "canhochungcumini (8).jpg",
                        "canhochungcumini (9).jpg", "canhochungcumini (10).jpg", "canhochungcumini (11).jpg",
                        "canhochungcumini (12).jpg", "canhochungcumini (13).jpg", "canhochungcumini (14).jpg");
                break;
            case "Bán nhà riêng":
                title = String.format("Bán Nhà Riêng 4 Tầng %s m2 Hẻm Xe Hơi Yên Tĩnh", roundedArea);
                description = String.format(
                        "Bán nhà riêng 4 tầng kiên cố, diện tích %s m2, gồm 3 phòng ngủ rộng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenharieng (1).jpg", "chothuenharieng (2).jpg", "chothuenharieng (3).jpg",
                        "chothuenharieng (4).jpg", "chothuenharieng (5).jpg", "chothuenharieng (6).jpg",
                        "chothuenharieng (7).jpg", "banthuenharieng (1).jpg", "banthuenharieng (2).jpg",
                        "banthuenharieng (3).jpg", "banthuenharieng (4).jpg", "banthuenharieng (5).jpg",
                        "banthuenharieng (6).jpg",
                        "banthuenharieng (7).jpg", "banthuenharieng (8).jpg", "banthuenharieng (9).jpg",
                        "banthuenharieng (10).jpg");
                break;
            case "Bán nhà biệt thự, liền kề":
                title = String.format("Bán Biệt Thự Liền Kề %s m2 5 Phòng Ngủ Sang Trọng", roundedArea);
                description = String.format(
                        "Bán biệt thự liền kề đẳng cấp, diện tích %s m2, thiết kế 4 tầng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "bietthulienke (1).jpg", "bietthulienke (2).jpg", "bietthulienke (3).jpg",
                        "bietthulienke (4).jpg", "bietthulienke (5).jpg", "bietthulienke (6).jpg",
                        "bietthulienke (7).jpg", "bietthulienke (8).jpg", "bietthulienke (9).jpg");
                break;
            case "Bán nhà mặt phố":
                title = String.format("Bán Nhà Mặt Phố 3 Tầng %s m2 Vị Trí Kinh Doanh Vàng", roundedArea);
                description = String.format(
                        "Bán nhà mặt phố 3 tầng, diện tích %s m2, mặt tiền 5m lý tưởng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenhamatpho (1).jpg", "chothuenhamatpho (2).jpg", "chothuenhamatpho (3).jpg",
                        "chothuenhamatpho (4).jpg", "chothuenhamatpho (5).jpg", "chothuenhamatpho (6).jpg",
                        "chothuenhamatpho (7).jpg", "chothuenhamatpho (8).jpg", "chothuenhamatpho (9).jpg");
                break;
            case "Bán shophouse, nhà phố thương mại":
                title = String.format("Bán Shophouse 4 Tầng %s m2 Khu Thương Mại Sầm Uất", roundedArea);
                description = String.format(
                        "Bán shophouse hiện đại, diện tích %s m2, 4 tầng tối ưu. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothueshophouse (1).jpg", "chothueshophouse (2).jpg", "chothueshophouse (3).jpg",
                        "chothueshophouse (4).jpg", "chothueshophouse (5).jpg", "chothueshophouse (6).jpg",
                        "chothueshophouse (7).jpg", "chothueshophouse (8).jpg");
                break;
            case "Bán đất nền dự án":
                title = String.format("Bán Đất Nền Dự Án %s m2 Hạ Tầng Hoàn Thiện", roundedArea);
                description = String.format(
                        "Bán đất nền dự án vị trí đẹp, diện tích %s m2, nằm trong khu đô thị mới. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "bandatnenduan (1).jpg", "bandatnenduan (2).jpg", "bandatnenduan (3).jpg",
                        "bandatnenduan (4).jpg", "bandatnenduan (5).jpg", "bandatnenduan (6).jpg",
                        "bandatnenduan (7).jpg", "bandatnenduan (8).jpg", "bandatnenduan (9).jpg",
                        "bandatnenduan (10).jpg");
                break;
            case "Bán đất":
                title = String.format("Bán Lô Đất %s m2 Mặt Tiền Đường Lớn Gần Trung Tâm", roundedArea);
                description = String.format(
                        "Bán lô đất đẹp, diện tích %s m2, mặt tiền đường lớn 10m. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "bandat (1).jpg", "bandat (2).jpg", "bandat (3).jpg", "bandat (4).jpg",
                        "bandat (5).jpg", "bandat (6).jpg", "bandat (7).jpg", "bandat (8).jpg",
                        "bandat (9).jpg", "bandat (10).jpg", "bandat (11).jpg", "bandat (12).jpg",
                        "bandat (13).jpg");
                break;
            case "Bán trang trại, khu nghỉ dưỡng":
                title = String.format("Bán Trang Trại Nghỉ Dưỡng %s m2 Có Ao Cá và Vườn Cây", roundedArea);
                description = String.format(
                        "Bán trang trại nghỉ dưỡng, diện tích %s m2, gồm nhà nghỉ 2 tầng. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "bantrangtrainghiduong (1).jpg", "bantrangtrainghiduong (2).jpg",
                        "bantrangtrainghiduong (3).jpg", "bantrangtrainghiduong (4).jpg",
                        "bantrangtrainghiduong (5).jpg", "bantrangtrainghiduong (6).jpg",
                        "bantrangtrainghiduong (7).jpg", "bantrangtrainghiduong (8).jpg",
                        "bantrangtrainghiduong (9).jpg", "bantrangtrainghiduong (10).jpg",
                        "bantrangtrainghiduong (11).jpg", "bantrangtrainghiduong (12).jpg");
                break;
            case "Bán condotel":
                title = String.format("Bán Condotel %s m2 View Biển Đẳng Cấp 5 Sao", roundedArea);
                description = String.format(
                        "Bán condotel view biển đẳng cấp, diện tích %s m2, gồm 2 phòng ngủ. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "condotel (1).jpg", "condotel (2).jpg", "condotel (3).jpg", "condotel (4).jpg",
                        "condotel (5).jpg", "condotel (6).jpg", "condotel (7).jpg", "condotel (8).jpg");
                break;
            case "Bán kho, nhà xưởng":
                title = String.format("Bán Nhà Xưởng %s m2 Gần Khu Công Nghiệp Có Điện 3 Pha", roundedArea);
                description = String.format(
                        "Bán nhà xưởng kiên cố, diện tích %s m2, khung thép chắc chắn. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "chothuenhakhonhaxuong (1).jpg", "chothuenhakhonhaxuong (2).jpg",
                        "chothuenhakhonhaxuong (3).jpg", "chothuenhakhonhaxuong (4).jpg",
                        "chothuenhakhonhaxuong (5).jpg", "chothuenhakhonhaxuong (6).jpg",
                        "chothuenhakhonhaxuong (7).jpg", "chothuenhakhonhaxuong (8).jpg");
                break;
            case "Bán loại bất động sản khác":
                title = String.format("Bán Tài Sản Đặc Biệt %s m2 Vị Trí Độc Đáo Đa Năng", roundedArea);
                description = String.format(
                        "Bán tài sản đặc biệt, diện tích %s m2, vị trí độc đáo. Địa chỉ: %s.",
                        roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "batdongsankhac (1).jpg", "batdongsankhac (2).jpg", "batdongsankhac (3).jpg",
                        "batdongsankhac (4).jpg", "batdongsankhac (5).jpg");
                break;
            default:
                title = String.format("Tin Đăng Mẫu %d - %s m2", loopIndex, roundedArea);
                description = String.format(
                        "Mô tả mặc định cho tin đăng mẫu %d, diện tích %s m2. Địa chỉ: %s.",
                        loopIndex, roundedArea, fullAddress);
                sampleImageUrls = Arrays.asList(
                        "https://example.com/images/default1.jpg",
                        "https://example.com/images/default2.jpg");
                break;
        }

        description = description + GENERAL_DESCRIPTION;
        post.setTitle(title);
        post.setDescription(description);

        List<Image> images = new ArrayList<>();
        int maxImages = Math.min(sampleImageUrls.size(), 12);
        int numberOfImages = random.nextInt(maxImages - 3) + 4; // Từ 4 đến maxImages
        List<String> availableImageUrls = new ArrayList<>(sampleImageUrls);

        for (int j = 0; j < numberOfImages; j++) {
            Image image = new Image();
            String selectedImageName = "";

            if (!availableImageUrls.isEmpty()) {
                int randomIndex = random.nextInt(availableImageUrls.size());
                selectedImageName = availableImageUrls.remove(randomIndex);
            } else {
                selectedImageName = sampleImageUrls.get(random.nextInt(sampleImageUrls.size()));
            }

            if (selectedImageName.startsWith("http")) {
                image.setUrl(selectedImageName);
            } else {
                image.setUrl(baseImageUrl + selectedImageName);
            }

            image.setOrderIndex(j);
            image.setPost(post);
            images.add(image);
        }
        post.setImages(images);
    }

    // ====================================================================
    // 🌟 1. CÁC HẰNG SỐ DỮ LIỆU (Đưa lên cấp độ Class)
    // ====================================================================
    private static final List<String> STREET_NAMES = Arrays.asList(
            "A1", "A2", "A5", "A8", "A12", "A18", "A25", "A30", "A35", "A40",
            "A45", "A50", "B1", "B3", "B7", "B10", "B15", "B20", "B28", "B32",
            "B38", "B45", "B50", "C2", "C4", "C6", "C9", "C12", "C16", "C22",
            "C27", "C33", "C39", "C45", "C50", "D1", "D5", "D8", "D10", "D15",
            "D20", "D25", "D30", "D36", "D42", "D50", "E3", "E7", "E12", "E18",
            "E24", "E29", "E35", "E40", "E50", "F2", "F8", "F15", "F21", "F30",
            "F38", "F45", "G1", "G5", "G10", "G15", "G20", "G25", "G30", "G35",
            "G40", "G50", "H2", "H7", "H12", "H18", "H24", "H30", "H36", "H45",
            "I1", "I5", "I10", "I15", "I20", "I25", "I30", "I40", "J2", "J8",
            "J15", "J21", "J30", "J40", "K3", "K9", "K18", "K27", "K36", "K45");

    private static final String GENERAL_DESCRIPTION = "\n\n**Thông tin bổ sung**:\n" +
            "- Vị trí đắc địa: Nằm trong khu vực phát triển sôi động, xung quanh có đầy đủ tiện ích như trường học quốc tế, bệnh viện đa khoa, siêu thị lớn, công viên xanh mát và các trung tâm thương mại hiện đại.\n"
            +
            "- Giao thông thuận tiện: Gần các trục đường chính và tuyến giao thông huyết mạch, dễ dàng di chuyển đến trung tâm thành phố hoặc các khu vực lân cận trong thời gian ngắn.\n"
            +
            "- Tiện ích đa dạng: Cư dân được hưởng các tiện ích cao cấp như hồ bơi, phòng gym, khu vui chơi trẻ em, không gian BBQ ngoài trời, và hệ thống an ninh 24/7 đảm bảo sự an toàn tuyệt đối.\n"
            +
            "- Hỗ trợ toàn diện: Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ từ A-Z, bao gồm xem nhà miễn phí, tư vấn pháp lý nhanh chóng, và đàm phán giá tốt nhất để bạn có được giao dịch hoàn hảo.\n"
            +
            "- Cam kết chất lượng: Chúng tôi cung cấp thông tin minh bạch, chính xác, đảm bảo mọi chi tiết về bất động sản đều được kiểm tra kỹ lưỡng trước khi giới thiệu đến bạn.\n"
            +
            "- Cơ hội không thể bỏ lỡ: Hãy liên hệ ngay hôm nay để được tư vấn chi tiết, đặt lịch xem nhà thực tế, và nhận ưu đãi đặc biệt dành riêng cho khách hàng sớm nhất!";

    private void initSamplePosts() {
        if (postRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT posts: ALREADY HAVE DATA ... ");
            return;
        }

        // 1. Load dữ liệu nền
        List<User> users = userRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<Province> provinces = provinceRepository.findAll();
        List<Vip> vips = vipRepository.findAll();

        Vip vip0 = vips.stream().filter(v -> v.getVipLevel() == 0).findFirst().orElse(vips.get(0));
        Vip vip1 = vips.stream().filter(v -> v.getVipLevel() == 1).findFirst().orElse(vips.get(1));

        // 🌟 TÁCH RIÊNG TP.HCM VÀ CÁC TỈNH KHÁC
        Province hcmcProvince = provinces.stream()
                .filter(p -> p.getCode() == 79L)
                .findFirst()
                .orElse(provinces.get(0));

        // 🌟 LẤY TẤT CẢ CÁC TỈNH TRỪ HCM
        final List<Province> finalOtherProvinces = provinces.stream()
                .filter(p -> p.getCode() != 79L)
                .collect(Collectors.toList());

        CompassDirection[] orientations = CompassDirection.values();
        LegalStatus[] legalStatuses = LegalStatus.values();
        Furnishing[] furnishings = Furnishing.values();

        String baseImageUrl = appProperties.getUrl().getBackend() + "/uploads/";
        int totalPost = 1000;
        int numberOfThreads = 10;

        Map<Long, List<District>> districtCache = new ConcurrentHashMap<>();
        Map<Long, List<Ward>> wardCache = new ConcurrentHashMap<>();
        Map<String, double[]> geocodeCache = new ConcurrentHashMap<>();

        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        System.out.println(">>> SEEDING 1000 POSTS: 85% HCMC Clusters | 15% Scattered National | Bulletproof Logic...");

        for (int t = 0; t < numberOfThreads; t++) {
            final int threadIndex = t;
            executorService.submit(() -> {
                var random = java.util.concurrent.ThreadLocalRandom.current();
                List<Post> posts = new ArrayList<>();

                // Trạng thái cụm riêng cho TP.HCM (để giữ tính liên tục của dự án)
                Category hcmClusterCat = categories.get(random.nextInt(categories.size()));
                District hcmClusterDist = null;
                Ward hcmClusterWard = null;
                int hcmClusterSize = (random.nextInt(100) < 70) ? (8 + random.nextInt(8)) : (3 + random.nextInt(5));
                int hcmCurrentCount = 0;

                int postsPerThread = totalPost / numberOfThreads;

                for (int i = 1; i <= postsPerThread; i++) {
                    // 🌟 QUYẾT ĐỊNH: TIN NÀY Ở HCM HAY TỈNH KHÁC?
                    boolean isHcm = random.nextInt(100) < 85;

                    Province selectedProv;
                    District selectedDist;
                    Ward selectedWard;
                    Category selectedCat;

                    if (isHcm) {
                        // --- LOGIC CỤM DỰ ÁN (CHỈ ÁP DỤNG CHO HCM) ---
                        if (hcmCurrentCount >= hcmClusterSize || hcmClusterDist == null) {
                            hcmCurrentCount = 0;
                            hcmClusterSize = (random.nextInt(100) < 70) ? (8 + random.nextInt(8))
                                    : (3 + random.nextInt(5));
                            hcmClusterCat = categories.get(random.nextInt(categories.size()));

                            List<District> dists = districtCache.computeIfAbsent(hcmcProvince.getCode(),
                                    k -> districtRepository.findByProvinceCode(k));
                            hcmClusterDist = dists.isEmpty() ? null : dists.get(random.nextInt(dists.size()));
                            if (hcmClusterDist != null) {
                                List<Ward> wards = wardCache.computeIfAbsent(hcmClusterDist.getCode(),
                                        k -> wardRepository.findByDistrictCode(k));
                                hcmClusterWard = wards.isEmpty() ? null : wards.get(random.nextInt(wards.size()));
                            }
                        }
                        selectedProv = hcmcProvince;
                        selectedDist = hcmClusterDist;
                        selectedWard = hcmClusterWard;
                        selectedCat = hcmClusterCat;
                        hcmCurrentCount++;
                    } else {
                        // --- LOGIC NGẪU NHIÊN (CHO CÁC TỈNH KHÁC) ---
                        selectedProv = finalOtherProvinces.get(random.nextInt(finalOtherProvinces.size()));
                        List<District> dists = districtCache.computeIfAbsent(selectedProv.getCode(),
                                k -> districtRepository.findByProvinceCode(k));
                        selectedDist = dists.isEmpty() ? null : dists.get(random.nextInt(dists.size()));
                        selectedWard = null;
                        if (selectedDist != null) {
                            List<Ward> wards = wardCache.computeIfAbsent(selectedDist.getCode(),
                                    k -> wardRepository.findByDistrictCode(k));
                            selectedWard = wards.isEmpty() ? null : wards.get(random.nextInt(wards.size()));
                        }
                        selectedCat = categories.get(random.nextInt(categories.size()));
                    }

                    // Kiểm tra an toàn trước khi tạo bài
                    if (selectedDist == null) {
                        if (isHcm)
                            hcmCurrentCount = hcmClusterSize; // Ép đổi cụm HCM vòng sau
                        i--;
                        continue;
                    }

                    Post post = new Post();

                    // 3. LOGIC THỜI GIAN (Dàn trải 1 năm)
                    long randomDaysAgo = (random.nextInt(100) < 40) ? random.nextLong(60) : random.nextLong(365);
                    Instant fakeCreatedAt = Instant.now().minus(randomDaysAgo, ChronoUnit.DAYS);
                    int durationDays = (randomDaysAgo < 60) ? 90 : (random.nextBoolean() ? 30 : 60);
                    Instant fakeExpireDate = fakeCreatedAt.plus(durationDays, ChronoUnit.DAYS);
                    boolean isActuallyExpired = fakeExpireDate.isBefore(Instant.now());

                    // 4. GIÁ CẢ & DIỆN TÍCH
                    double roundedArea = Math.round((45 + random.nextDouble() * 180) * 10.0) / 10.0;
                    post.setArea(roundedArea);
                    long basePrice = (selectedCat.getType() == ListingType.RENT)
                            ? (3_000_000L + random.nextLong(20_000_000L))
                            : (long) (roundedArea * (20_000_000L + random.nextLong(60_000_000L)));
                    double priceFactor = Math.pow(1 - 0.08, randomDaysAgo / 365.0) * (0.8 + random.nextDouble() * 0.4);
                    post.setPrice((long) (basePrice * priceFactor));

                    // 5. ĐỊA CHỈ & TỌA ĐỘ
                    post.setProvince(selectedProv);
                    post.setDistrict(selectedDist);
                    post.setWard(selectedWard);
                    post.setStreetAddress("Số " + (random.nextInt(500) + 1) + " Đường "
                            + STREET_NAMES.get(random.nextInt(STREET_NAMES.size())));

                    String geocodeSearchKey = String.format("%s, %s, %s",
                            (selectedWard != null ? selectedWard.getName() : ""), selectedDist.getName(),
                            selectedProv.getName());
                    double[] coords = geocodeCache.get(geocodeSearchKey);

                    if (coords == null) {
                        var latLngOpt = mapboxGeocodeService.getLatLngFromAddress(geocodeSearchKey);
                        if (latLngOpt.isPresent()) {
                            coords = latLngOpt.get();
                            geocodeCache.put(geocodeSearchKey, coords);
                        } else {
                            String fallbackKey = selectedDist.getName() + ", " + selectedProv.getName();
                            coords = geocodeCache.computeIfAbsent(fallbackKey,
                                    k -> mapboxGeocodeService.getLatLngFromAddress(k)
                                            .orElse(new double[] { 106.6297, 10.8231 }));
                        }
                    }
                    if (coords != null) {
                        double radiusInDegrees = (400.0 + random.nextInt(1500)) / 111_000.0;
                        double u = random.nextDouble(), v = random.nextDouble();
                        double w = radiusInDegrees * Math.sqrt(u), theta = 2 * Math.PI * v;
                        post.setLongitude(coords[0] + (w * Math.cos(theta)) / Math.cos(Math.toRadians(coords[1])));
                        post.setLatitude(coords[1] + (w * Math.sin(theta)));
                    }

                    // 6. TRẠNG THÁI & VIP
                    if (isActuallyExpired) {
                        post.setStatus(PostStatus.EXPIRED);
                        long secondsActive = fakeExpireDate.getEpochSecond() - fakeCreatedAt.getEpochSecond();
                        post.setPushedAt(fakeCreatedAt.plusSeconds(random.nextLong(Math.max(1, secondsActive))));
                        post.setVip(vips.get(random.nextInt(vips.size())));
                    } else {
                        int statusRand = random.nextInt(100);
                        if (statusRand < 60) {
                            post.setStatus(PostStatus.APPROVED);
                            post.setPushedAt(Instant.now().minusSeconds(random.nextLong(172800)));
                            post.setVip(vips.get(random.nextInt(vips.size())));
                        } else if (statusRand < 75) {
                            post.setStatus(PostStatus.REVIEW_LATER);
                            post.setPushedAt(Instant.now().minusSeconds(random.nextLong(432000)));
                            post.setVip(vip1);
                        } else {
                            if (statusRand < 90)
                                post.setStatus(PostStatus.PENDING);
                            else if (statusRand < 95)
                                post.setStatus(PostStatus.REJECTED);
                            else
                                post.setStatus(PostStatus.BLOCKED);
                            post.setPushedAt(fakeCreatedAt);
                            post.setVip(vip0);
                        }
                    }

                    if (post.getStatus() == PostStatus.APPROVED && post.getVip().getVipLevel() > 0) {
                        post.setPushedAt(Instant.now().minusSeconds(random.nextLong(7200)));
                    }

                    // 7. Metadata & Detail
                    User user = users.get(random.nextInt(users.size()));
                    post.setUser(user);
                    post.setCreatedBy(user.getEmail());
                    post.setCategory(selectedCat);
                    post.setType(selectedCat.getType());
                    post.setCreatedAt(fakeCreatedAt);
                    post.setExpireDate(fakeExpireDate);
                    post.setUpdatedAt(post.getPushedAt());
                    post.setDeletedByUser(false);
                    // Thay vì random từ 50-150 như cũ, ta giảm xuống random từ 30-45 view
                    post.setView((long) (random.nextInt(16) + 30));

                    ListingDetail detail = new ListingDetail();
                    if (!selectedCat.getName().toLowerCase().contains("đất")) {
                        detail.setBedrooms(random.nextInt(4) + 1);
                        detail.setBathrooms(random.nextInt(2) + 1);
                        detail.setFurnishing(furnishings[random.nextInt(furnishings.length)]);
                    }
                    detail.setHouseDirection(orientations[random.nextInt(orientations.length)]);
                    detail.setLegalStatus(legalStatuses[random.nextInt(legalStatuses.length)]);
                    detail.setPost(post);
                    post.setListingDetail(detail);

                    String fullAddr = post.getStreetAddress() + ", "
                            + (selectedWard != null ? selectedWard.getName() + ", " : "") + selectedProv.getName();
                    populateContentAndImages(post, selectedCat.getName(), roundedArea, fullAddr, random, baseImageUrl,
                            (threadIndex * postsPerThread) + i);

                    posts.add(post);

                    if (posts.size() >= 100) {
                        synchronized (postRepository) {
                            postRepository.saveAll(posts);
                        }
                        posts.clear();
                    }
                }
                if (!posts.isEmpty()) {
                    synchronized (postRepository) {
                        postRepository.saveAll(posts);
                    }
                }
            });
        }

        executorService.shutdown();
        try {
            executorService.awaitTermination(30, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
        System.out.println(">>> SEEDING POSTS COMPLETED!");
    }

    private void initSampleInteractions() {
        if (postViewHistoryRepository.count() > 0 || savedPostRepository.count() > 0) {
            System.out.println(">>> SKIP! INTERACTION DATA ALREADY EXISTS...");
            return;
        }

        List<Post> allPosts = postRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        if (allPosts.isEmpty() || allUsers.isEmpty())
            return;

        List<Post> activePosts = allPosts.stream()
                .filter(p -> p.getStatus() == PostStatus.APPROVED || p.getStatus() == PostStatus.REVIEW_LATER)
                .collect(Collectors.toList());

        Instant now = Instant.now();
        // Dùng số luồng vừa phải để dễ kiểm soát
        ExecutorService executor = Executors.newFixedThreadPool(4);

        System.out.println(">>> START SEEDING INTERACTIONS...");

        // 1. SEED LƯỢT XEM
        executor.submit(() -> {
            try {
                String sql = "INSERT INTO post_view_histories (post_id, user_id, ip_address, viewed_at) VALUES (?, ?, ?, ?)";
                List<Object[]> batchArgs = new ArrayList<>();
                ThreadLocalRandom random = ThreadLocalRandom.current();

                for (Post post : allPosts) {
                    // Lấy trực tiếp số lượng view đã được set trong bảng Post
                    int views = post.getView() != null ? post.getView().intValue() : 0;

                    for (int j = 0; j < views; j++) {
                        User randomUser = allUsers.get(random.nextInt(allUsers.size()));
                        Long viewerId = (random.nextInt(100) < 30) ? randomUser.getId() : null;
                        Instant randomViewedAt = now.minusSeconds(random.nextLong(30L * 24 * 60 * 60));

                        batchArgs.add(new Object[] { post.getId(), viewerId, "192.168.1." + random.nextInt(255),
                                randomViewedAt });

                        // Giữ nguyên logic batch update để tối ưu performance
                        if (batchArgs.size() >= 1000) {
                            jdbcTemplate.batchUpdate(sql, batchArgs);
                            batchArgs.clear();
                        }
                    }
                }
                if (!batchArgs.isEmpty()) {
                    jdbcTemplate.batchUpdate(sql, batchArgs);
                }
                System.out.println(">>> SEEDING VIEWS: SUCCESSFUL!");
            } catch (Exception e) {
                System.err.println(">>> LỖI SEED VIEWS: " + e.getMessage());
                e.printStackTrace();
            }
        });

        // 2. SEED TIN ĐÃ LƯU
        executor.submit(() -> {
            try {
                if (activePosts.isEmpty())
                    return;
                String sql = "INSERT INTO saved_posts (user_id, post_id, saved_at) VALUES (?, ?, ?)";
                List<Object[]> batchArgs = new ArrayList<>();
                ThreadLocalRandom random = ThreadLocalRandom.current();

                for (User user : allUsers) {
                    int toSave = random.nextInt(6) + 3;
                    Set<Long> pickedPostIds = new HashSet<>();
                    for (int k = 0; k < toSave; k++) {
                        Long postId = activePosts.get(random.nextInt(activePosts.size())).getId();
                        if (pickedPostIds.add(postId)) {
                            Instant randomSavedAt = now.minusSeconds(random.nextLong(30L * 24 * 60 * 60));
                            batchArgs.add(new Object[] { user.getId(), postId, randomSavedAt });
                        }
                        if (batchArgs.size() >= 500) {
                            jdbcTemplate.batchUpdate(sql, batchArgs);
                            batchArgs.clear();
                        }
                    }
                }
                if (!batchArgs.isEmpty())
                    jdbcTemplate.batchUpdate(sql, batchArgs);
                System.out.println(">>> SEEDING SAVED POSTS: SUCCESSFUL!");
            } catch (Exception e) {
                System.err.println(">>> LỖI SEED SAVED POSTS: " + e.getMessage());
                e.printStackTrace();
            }
        });

        executor.shutdown();
        try {
            if (!executor.awaitTermination(15, TimeUnit.MINUTES)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    private void initSampleTransactions() {
        if (transactionRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT DATA TABLE 'transactions': ALREADY HAVE DATA ... ");
            return;
        }

        List<User> users = userRepository.findAll();
        List<TransactionStatus> statuses = Arrays.asList(TransactionStatus.PENDING, TransactionStatus.SUCCESS,
                TransactionStatus.FAILED);

        int totalTransactions = 2000;

        // Tự động điều chỉnh số lượng luồng dựa trên sức mạnh CPU
        int numThreads = Runtime.getRuntime().availableProcessors();
        int batchSize = (int) Math.ceil((double) totalTransactions / numThreads);

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        // ⚡ TỐI ƯU: Cache danh sách Post của User để triệt tiêu N+1 Query
        Map<Long, List<Post>> userPostCache = new ConcurrentHashMap<>();

        System.out.println(">>> Bắt đầu tạo " + totalTransactions + " giao dịch bằng " + numThreads + " luồng...");

        for (int t = 0; t < numThreads; t++) {
            // Xác định điểm bắt đầu và kết thúc của biến i cho từng luồng
            final int start = t * batchSize + 1;
            final int end = Math.min((t + 1) * batchSize, totalTransactions);

            executor.submit(() -> {
                Random random = new Random(); // Khởi tạo Random độc lập cho mỗi luồng
                List<Transaction> transactions = new ArrayList<>();

                for (int i = start; i <= end; i++) {
                    Transaction transaction = new Transaction();

                    // Gán user ngẫu nhiên
                    User selectedUser = users.get(random.nextInt(users.size()));
                    transaction.setUser(selectedUser);

                    // ⚡ TỐI ƯU: Gọi Database qua Cache
                    List<Post> userPosts = userPostCache.computeIfAbsent(
                            selectedUser.getId(),
                            userId -> postRepository.findByUser(selectedUser));

                    // Quyết định loại giao dịch: nạp tiền (50%) hoặc thanh toán phí đăng tin (50%)
                    boolean isDeposit = random.nextBoolean();
                    long amount;
                    String description = "";

                    // 👇 FIX 1: Đảm bảo txnId là duy nhất tuyệt đối bằng cách ghép thêm biến i (Giữ
                    // nguyên logic gốc)
                    String txnId = VnPayUtil.getRandomNumber(8) + "_" + i;

                    if (isDeposit || userPosts.isEmpty()) { // Nếu không có Post hoặc là giao dịch nạp tiền
                        // Giao dịch nạp tiền
                        long minAmount = 50_000L;
                        long maxAmount = 10_000_000L;
                        long amountRange = maxAmount - minAmount;
                        amount = minAmount + (long) (random.nextDouble() * amountRange); // Số tiền dương

                        TransactionStatus selectedStatus = statuses.get(random.nextInt(statuses.size()));
                        transaction.setStatus(selectedStatus);

                        // 👇 FIX 2: Set loại giao dịch là Nạp tiền
                        transaction.setType(TransactionType.DEPOSIT);

                        switch (selectedStatus) {
                            case PENDING:
                                description = "Giao dịch nạp tiền đang chờ thanh toán";
                                break;
                            case SUCCESS:
                                description = "Giao dịch nạp tiền thành công";
                                break;
                            case FAILED:
                                description = "Giao dịch nạp tiền thất bại";
                                break;
                        }
                        transaction.setPaymentLink("https://payment.example.com/txn/" + txnId);
                    } else {
                        // Giao dịch thanh toán phí đăng tin
                        Post selectedPost = userPosts.get(random.nextInt(userPosts.size()));
                        long minCost = 10_000L;
                        long maxCost = 1_000_000L;
                        long costRange = maxCost - minCost;
                        amount = -(minCost + (long) (random.nextDouble() * costRange));

                        transaction.setStatus(TransactionStatus.SUCCESS);

                        // 👇 FIX 2: Set loại giao dịch là Thanh toán (Trừ tiền)
                        transaction.setType(TransactionType.PAYMENT);

                        description = "Thanh toán phí đăng tin mã " + selectedPost.getId() + " thành công";
                        transaction.setPaymentLink(null);
                        txnId = null; // Thanh toán nội bộ thì không có mã VNPAY
                    }

                    transaction.setAmount(amount);
                    transaction.setDescription(description);
                    transaction.setTxnId(txnId);

                    // Thời gian tạo (ngẫu nhiên từ 1 năm trước đến hiện tại)
                    long secondsIn1Year = 365L * 24 * 60 * 60;
                    long randomSeconds = (long) (random.nextDouble() * secondsIn1Year);
                    transaction.setCreatedAt(Instant.now().minusSeconds(randomSeconds));

                    // Thời gian cập nhật (nếu SUCCESS hoặc FAILED thì có updatedAt)
                    if (transaction.getStatus() != TransactionStatus.PENDING) {
                        transaction.setUpdatedAt(transaction.getCreatedAt().plusSeconds(random.nextInt(3600 / 4)));
                    }

                    transactions.add(transaction);
                }

                // Ghi xuống DB an toàn giữa nhiều luồng
                if (!transactions.isEmpty()) {
                    synchronized (transactionRepository) {
                        transactionRepository.saveAll(transactions);
                    }
                    System.out.println(">>> Luồng " + Thread.currentThread().getName() + " đã tạo xong từ giao dịch "
                            + start + " đến " + end);
                }
            });
        }

        // Chờ các luồng hoàn thành
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.MINUTES)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }

        System.out.println(">>> INIT DATA TABLE 'transactions' WITH DEPOSIT AND POST FEE: SUCCESS");
    }

    private void initSampleNotifications() {
        if (notificationRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT DATA TABLE 'notifications': ALREADY HAVE DATA ... ");
            return;
        }

        // 1. Đọc dữ liệu gốc một lần duy nhất lên RAM để các luồng dùng chung (Chỉ đọc,
        // không ghi nên an toàn tuyệt đối)
        List<User> users = userRepository.findAll();
        List<Post> posts = postRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        int totalNotifications = 1000;

        // 2. Cấu hình luồng
        int numThreads = Runtime.getRuntime().availableProcessors();
        int batchSize = (int) Math.ceil((double) totalNotifications / numThreads);
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        System.out.println(">>> Bắt đầu tạo " + totalNotifications + " thông báo bằng " + numThreads + " luồng...");

        for (int t = 0; t < numThreads; t++) {
            // Tính toán index bắt đầu và kết thúc cho luồng hiện tại
            final int start = t * batchSize + 1;
            final int end = Math.min((t + 1) * batchSize, totalNotifications);

            executor.submit(() -> {
                Random random = new Random(); // ⚡ Khởi tạo Random bên trong Thread để tránh tranh chấp (Thread-safe)
                List<Notification> localNotifications = new ArrayList<>();

                for (int i = start; i <= end; i++) {
                    Notification notification = new Notification();

                    User selectedUser = users.get(random.nextInt(users.size()));
                    notification.setUser(selectedUser);

                    int notificationTypeIndex = random.nextInt(8); // 👈 Giữ nguyên 8 case
                    String message = "";
                    NotificationType type;

                    switch (notificationTypeIndex) {
                        case 0: // POST: Người dùng xem tin đăng
                            if (posts.isEmpty())
                                continue;
                            Post viewedPost = posts.get(random.nextInt(posts.size()));
                            User viewer = users.get(random.nextInt(users.size()));
                            message = String.format(
                                    "Người dùng '%s - %s' đã xem số điện thoại của tin đăng mã '%d' của bạn.",
                                    viewer.getName(), viewer.getPhone(), viewedPost.getId());
                            type = NotificationType.POST;
                            notification.setUser(viewedPost.getUser());
                            break;

                        case 1: // POST: Tin đăng được chấp nhận
                            if (posts.isEmpty())
                                continue;
                            Post approvedPost = posts.get(random.nextInt(posts.size()));
                            message = String.format("Tin đăng mã '%d' của bạn đã được kiểm duyệt viên chấp nhận.",
                                    approvedPost.getId());
                            type = NotificationType.POST;
                            notification.setUser(approvedPost.getUser());
                            break;

                        case 2: // POST: Tin đăng bị từ chối
                            if (posts.isEmpty())
                                continue;
                            Post rejectedPost = posts.get(random.nextInt(posts.size()));
                            message = String.format("Tin đăng mã '%d' của bạn đã bị từ chối do vi phạm điều khoản.",
                                    rejectedPost.getId());
                            type = NotificationType.POST;
                            notification.setUser(rejectedPost.getUser());
                            break;

                        case 3: // TRANSACTION: Nạp tiền thành công
                            if (transactions.isEmpty())
                                continue;
                            Transaction depositTx = transactions.stream()
                                    .filter(tx -> tx.getStatus() == TransactionStatus.SUCCESS && tx.getAmount() > 0)
                                    .findAny()
                                    .orElse(null);
                            if (depositTx == null)
                                continue;
                            message = String.format("Giao dịch thành công. Tài khoản của bạn được cộng %,d VNĐ.",
                                    depositTx.getAmount());
                            type = NotificationType.TRANSACTION;
                            notification.setUser(depositTx.getUser());
                            break;

                        case 4: // TRANSACTION: Trừ tiền (Đẩy tin/Mua VIP)
                            if (transactions.isEmpty())
                                continue;
                            Transaction paymentTx = transactions.stream()
                                    .filter(tx -> tx.getStatus() == TransactionStatus.SUCCESS && tx.getAmount() < 0)
                                    .findAny()
                                    .orElse(null);
                            if (paymentTx == null)
                                continue;
                            message = String.format(
                                    "Thanh toán thành công. Tài khoản của bạn bị trừ %,d VNĐ cho dịch vụ %s.",
                                    Math.abs(paymentTx.getAmount()), paymentTx.getDescription());
                            type = NotificationType.TRANSACTION;
                            notification.setUser(paymentTx.getUser());
                            break;

                        case 5: // SYSTEM_ALERT: Cảnh báo sắp hết hạn VIP
                            message = "Gói VIP của bạn sẽ hết hạn trong vòng 3 ngày tới. Vui lòng gia hạn để duy trì quyền lợi.";
                            type = NotificationType.SYSTEM_ALERT;
                            break;

                        case 6: // SYSTEM_ALERT: Bảo trì hệ thống / Khuyến mãi
                            message = "Hệ thống BDS360 sẽ bảo trì định kỳ từ 00:00 đến 02:00 sáng mai. Xin lỗi vì sự bất tiện này!";
                            type = NotificationType.SYSTEM_ALERT;
                            break;

                        // ================= CASE MỚI THÊM VÀO =================
                        case 7: // POST: Tin đăng bị khóa do vi phạm
                            if (posts.isEmpty())
                                continue;
                            Post blockedPost = posts.get(random.nextInt(posts.size()));
                            message = String.format(
                                    "Tin đăng mã '%d' của bạn đã bị khóa do vi phạm chính sách của hệ thống.",
                                    blockedPost.getId());
                            type = NotificationType.POST;
                            notification.setUser(blockedPost.getUser());
                            break;

                        default:
                            continue;
                    }

                    notification.setMessage(message);
                    notification.setType(type);
                    notification.setRead(random.nextBoolean());

                    long secondsIn30Days = 30L * 24 * 60 * 60;
                    long randomSeconds = (long) (random.nextDouble() * secondsIn30Days);
                    notification.setCreatedAt(Instant.now().minusSeconds(randomSeconds));

                    localNotifications.add(notification);
                }

                // 3. Ghi xuống Database một cách an toàn
                if (!localNotifications.isEmpty()) {
                    synchronized (notificationRepository) {
                        notificationRepository.saveAll(localNotifications);
                    }
                    System.out.println(">>> Luồng " + Thread.currentThread().getName() + " đã tạo xong từ thông báo "
                            + start + " đến " + end);
                }
            });
        }

        // 4. Chờ các luồng hoàn thành tác vụ
        executor.shutdown();
        try {
            if (!executor.awaitTermination(3, TimeUnit.MINUTES)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }

        System.out.println(">>> INIT DATA TABLE 'notifications': SUCCESS");
    }

    public Province convertToEntity(CreateProvinceRequest provinceDTO) {
        Province province = new Province();
        province.setCode(provinceDTO.getCode());
        province.setName(provinceDTO.getName());
        province.setCodename(provinceDTO.getCodename());
        province.setDivisionType(provinceDTO.getDivisionType());
        province.setPhoneCode(provinceDTO.getPhoneCode());

        if (provinceDTO.getDistricts() != null) {
            List<District> districtEntities = new ArrayList<>();
            for (CreateDistrictRequest districtDTO : provinceDTO.getDistricts()) {
                District district = new District();
                district.setCode(districtDTO.getCode());
                district.setName(districtDTO.getName());
                district.setCodename(districtDTO.getCodename());
                district.setDivisionType(districtDTO.getDivisionType());
                district.setShortCodename(districtDTO.getShortCodename());
                district.setProvince(province);

                if (districtDTO.getWards() != null) {
                    List<Ward> wardEntities = new ArrayList<>();
                    for (CreateWardRequest wardDTO : districtDTO.getWards()) {
                        Ward ward = new Ward();
                        ward.setCode(wardDTO.getCode());
                        ward.setName(wardDTO.getName());
                        ward.setCodename(wardDTO.getCodename());
                        ward.setDivisionType(wardDTO.getDivisionType());
                        ward.setShortCodename(wardDTO.getShortCodename());
                        ward.setDistrict(district);
                        wardEntities.add(ward);
                    }
                    district.setWards(wardEntities);
                }
                districtEntities.add(district);
            }
            province.setDistricts(districtEntities);
        }
        return province;
    }

}
