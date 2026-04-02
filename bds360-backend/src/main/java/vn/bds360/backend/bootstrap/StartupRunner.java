package vn.bds360.backend.bootstrap;

import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
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
import vn.bds360.backend.modules.post.constant.PostStatus;
import vn.bds360.backend.modules.post.entity.Image;
import vn.bds360.backend.modules.post.entity.Post;
import vn.bds360.backend.modules.post.repository.PostRepository;
import vn.bds360.backend.modules.transaction.constant.TransactionStatus;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.transaction.util.VnPayUtil;
import vn.bds360.backend.modules.user.constant.Gender;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.modules.user.service.UserService;
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
    private final UserService userService;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final MapboxGeocodeService mapboxGeocodeService;
    // private final VnPayProperties vnPayProperties;

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

        initSampleTransactions();

        initSampleNotifications();

        System.out.println(">>> END INIT DATABASE");

    }

    private void initSampleUsers() {
        List<User> userList = new ArrayList<>();

        // Thêm user admin mẫu
        User adminUser = new User();
        adminUser.setEmail("admin@gmail.com");
        adminUser.setName("Quản trị viên");
        adminUser.setPassword(this.passwordEncoder.encode("123456"));
        adminUser.setRole(Role.ADMIN);
        adminUser.setGender(Gender.MALE);
        adminUser.setBalance(999999999L);
        adminUser.setPhone("0123456789");
        adminUser.setAddress("Thành Phố Hồ Chí Minh");
        userList.add(adminUser);

        // Tạo 100 user mẫu với thông tin ngẫu nhiên
        for (int i = 1; i <= 50; i++) {
            User user = new User();
            user.setEmail("user" + i + "@gmail.com");
            user.setName("TestUser" + i);
            user.setPassword(this.passwordEncoder.encode("123456"));
            user.setRole(Role.USER);
            user.setGender(i % 2 == 0 ? Gender.MALE : Gender.FEMALE);
            user.setBalance(1000000L * i); // Số dư tăng dần
            user.setPhone("01234567" + String.format("%02d", i));
            user.setAddress(i % 2 == 0 ? "Thành Phố Hồ Chí Minh" : "Thành Phố Hà Nội");
            userList.add(user);
        }

        for (User user : userList) {
            boolean isEmailExist = this.userService.isEmailExist(user.getEmail());
            if (!isEmailExist) {
                this.userService.saveInternalUser(user);
            }
        }
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

    private void initSamplePosts() {
        // Danh sách tên đường
        List<String> streetNames = Arrays.asList(
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

        if (postRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT ADDRESS DATA TABLE posts: ALREADY HAVE DATA ... ");
            return;
        }
        Random random = new Random();

        // Lấy danh sách dữ liệu từ các bảng khác
        List<User> users = userRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<Province> provinces = provinceRepository.findAll();
        List<Vip> vips = vipRepository.findAll();

        // Danh sách các trạng thái cho các level VIP > 0 (loại bỏ PENDING)
        List<PostStatus> nonPendingStatuses = new ArrayList<>(Arrays.asList(
                PostStatus.REVIEW_LATER,
                PostStatus.APPROVED,
                PostStatus.REJECTED,
                PostStatus.EXPIRED));

        List<Post> posts = new ArrayList<>();

        for (int i = 1; i <= 1000; i++) {
            Post post = new Post();
            Category selectedCategory = categories.get(random.nextInt(categories.size()));
            Vip selectedVip = vips.get(random.nextInt(vips.size()));

            double rawArea = 50 + random.nextDouble() * 2000;
            double roundedArea = Math.round(rawArea * 10.0) / 10.0;
            post.setArea(roundedArea);

            // Gán địa chỉ trước switch-case
            Province selectedProvince = provinces.get(random.nextInt(provinces.size()));
            post.setProvince(selectedProvince);
            List<District> districtsInProvince = districtRepository.findByProvinceCode(selectedProvince.getCode());
            District selectedDistrict = null;
            Ward selectedWard = null;
            if (!districtsInProvince.isEmpty()) {
                selectedDistrict = districtsInProvince.get(random.nextInt(districtsInProvince.size()));
                post.setDistrict(selectedDistrict);
                List<Ward> wardsInDistrict = wardRepository.findByDistrictCode(selectedDistrict.getCode());
                if (!wardsInDistrict.isEmpty()) {
                    selectedWard = wardsInDistrict.get(random.nextInt(wardsInDistrict.size()));
                    post.setWard(selectedWard);
                }
            }
            String detailAddress = "";

            // Tạo chuỗi địa chỉ đầy đủ
            String fullAddress = detailAddress + (selectedWard != null ? selectedWard.getName() : "") +
                    (selectedDistrict != null ? ", " + selectedDistrict.getName() : "") +
                    ", " + selectedProvince.getName();

            Optional<double[]> latLng = mapboxGeocodeService.getLatLngFromAddress(fullAddress);
            if (latLng.isPresent()) {
                double[] coords = latLng.get();
                double baseLongitude = coords[0];
                double baseLatitude = coords[1];

                // Tạo tọa độ ngẫu nhiên trong bán kính 1000 mét
                Random randomPoint = new Random();
                double radiusInMeters = 1000.0;
                double radiusInDegrees = radiusInMeters / 111_000.0; // Chuyển đổi mét sang độ (~111km/độ)

                // Tạo offset ngẫu nhiên trong bán kính
                double u = randomPoint.nextDouble();
                double v = randomPoint.nextDouble();
                double w = radiusInDegrees * Math.sqrt(u);
                double t = 2 * Math.PI * v;
                double x = w * Math.cos(t); // Offset kinh độ
                double y = w * Math.sin(t); // Offset vĩ độ

                // Điều chỉnh kinh độ dựa trên vĩ độ (cos(latitude) để chính xác hơn)
                double newLongitude = baseLongitude + x / Math.cos(Math.toRadians(baseLatitude));
                double newLatitude = baseLatitude + y;

                // Gán tọa độ ngẫu nhiên cho tin đăng
                post.setLongitude(newLongitude);
                post.setLatitude(newLatitude);
            }

            String houseNumber = "Số " + (random.nextInt(999) + 1); // Số 1-999
            String street = streetNames.get(random.nextInt(streetNames.size()));
            detailAddress = houseNumber + " Đường " + street;

            // Tạo chuỗi địa chỉ đầy đủ
            fullAddress = detailAddress + ", " + (selectedWard != null ? selectedWard.getName() : "") +
                    (selectedDistrict != null ? ", " + selectedDistrict.getName() : "") +
                    ", " + selectedProvince.getName();

            String title = "";
            String description = "";
            List<String> sampleImageUrls = new ArrayList<>();

            switch (selectedCategory.getName()) {
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
                            "bandatnenduan (1).jpg",
                            "bandatnenduan (2).jpg",
                            "bandatnenduan (3).jpg",
                            "bandatnenduan (4).jpg",
                            "bandatnenduan (5).jpg",
                            "bandatnenduan (6).jpg",
                            "bandatnenduan (7).jpg",
                            "bandatnenduan (8).jpg",
                            "bandatnenduan (9).jpg",
                            "bandatnenduan (10).jpg");
                    break;
                case "Bán đất":
                    title = String.format("Bán Lô Đất %s m2 Mặt Tiền Đường Lớn Gần Trung Tâm", roundedArea);
                    description = String.format(
                            "Bán lô đất đẹp, diện tích %s m2, mặt tiền đường lớn 10m. Địa chỉ: %s.",
                            roundedArea, fullAddress);
                    sampleImageUrls = Arrays.asList(
                            "bandat (1).jpg",
                            "bandat (2).jpg",
                            "bandat (3).jpg",
                            "bandat (4).jpg",
                            "bandat (5).jpg",
                            "bandat (6).jpg",
                            "bandat (7).jpg",
                            "bandat (8).jpg",
                            "bandat (9).jpg",
                            "bandat (10).jpg",
                            "bandat (11).jpg",
                            "bandat (12).jpg",
                            "bandat (13).jpg");
                    break;
                case "Bán trang trại, khu nghỉ dưỡng":
                    title = String.format("Bán Trang Trại Nghỉ Dưỡng %s m2 Có Ao Cá và Vườn Cây", roundedArea);
                    description = String.format(
                            "Bán trang trại nghỉ dưỡng, diện tích %s m2, gồm nhà nghỉ 2 tầng. Địa chỉ: %s.",
                            roundedArea, fullAddress);
                    sampleImageUrls = Arrays.asList(
                            "bantrangtrainghiduong (1).jpg",
                            "bantrangtrainghiduong (2).jpg",
                            "bantrangtrainghiduong (3).jpg",
                            "bantrangtrainghiduong (4).jpg",
                            "bantrangtrainghiduong (5).jpg",
                            "bantrangtrainghiduong (6).jpg",
                            "bantrangtrainghiduong (7).jpg",
                            "bantrangtrainghiduong (8).jpg",
                            "bantrangtrainghiduong (9).jpg",
                            "bantrangtrainghiduong (10).jpg",
                            "bantrangtrainghiduong (11).jpg",
                            "bantrangtrainghiduong (12).jpg");
                    break;
                case "Bán condotel":
                    title = String.format("Bán Condotel %s m2 View Biển Đẳng Cấp 5 Sao", roundedArea);
                    description = String.format(
                            "Bán condotel view biển đẳng cấp, diện tích %s m2, gồm 2 phòng ngủ. Địa chỉ: %s.",
                            roundedArea, fullAddress);
                    sampleImageUrls = Arrays.asList(
                            "condotel (1).jpg",
                            "condotel (2).jpg",
                            "condotel (3).jpg",
                            "condotel (4).jpg",
                            "condotel (5).jpg",
                            "condotel (6).jpg",
                            "condotel (7).jpg",
                            "condotel (8).jpg");
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
                    title = String.format("Tin Đăng Mẫu %d - %s m2", i, roundedArea);
                    description = String.format(
                            "Mô tả mặc định cho tin đăng mẫu %d, diện tích %s m2. Địa chỉ: %s.",
                            i, roundedArea, fullAddress);
                    sampleImageUrls = Arrays.asList(
                            "https://example.com/images/default1.jpg",
                            "https://example.com/images/default2.jpg");
                    break;
            }
            String generalDescription = "\n\n**Thông tin bổ sung**:\n" +
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
            description = description + generalDescription;
            post.setTitle(title);
            post.setDescription(description);

            post.setType(selectedCategory.getType());

            // Gán giá dựa trên loại tin đăng (RENT hoặc SALE)
            if (selectedCategory.getType() == ListingType.RENT) {
                long minRentPrice = 1_700_000L;
                long maxRentPrice = 40_000_000L;
                long rentPriceRange = maxRentPrice - minRentPrice;
                post.setPrice(minRentPrice + (long) (random.nextDouble() * rentPriceRange));
            } else if (selectedCategory.getType() == ListingType.SALE) {
                long minPricePerM2 = 100_000L;
                long maxPricePerM2 = 10_000_000L;
                long pricePerM2Range = maxPricePerM2 - minPricePerM2;
                long pricePerM2 = minPricePerM2 + (long) (random.nextDouble() * pricePerM2Range);
                post.setPrice((long) (roundedArea * pricePerM2));
            }

            post.setView(random.nextInt(10000) * 1L);

            // Kiểm tra vipLevel để gán trạng thái và thời gian hiệu lực
            if (selectedVip.getVipLevel() == 0) {
                post.setStatus(PostStatus.PENDING);
                long secondsIn1Month = 30L * 24 * 60 * 60;
                long secondsIn3Months = 90L * 24 * 60 * 60;
                long range = secondsIn3Months - secondsIn1Month;
                post.setExpireDate(Instant.now().plusSeconds(secondsIn1Month + (long) (random.nextDouble() * range)));
                post.setNotifyOnView(false);
            } else {
                PostStatus selectedStatus = nonPendingStatuses.get(random.nextInt(nonPendingStatuses.size()));
                post.setStatus(selectedStatus);

                if (selectedStatus == PostStatus.EXPIRED) {
                    long secondsInPast = random.nextInt(30) * 24 * 60 * 60 + 1;
                    post.setExpireDate(Instant.now().minusSeconds(secondsInPast));
                } else {
                    long secondsIn1Month = 30L * 24 * 60 * 60;
                    long secondsIn3Months = 90L * 24 * 60 * 60;
                    long range = secondsIn3Months - secondsIn1Month;
                    post.setExpireDate(
                            Instant.now().plusSeconds(secondsIn1Month + (long) (random.nextDouble() * range)));
                    post.setNotifyOnView(true);
                }
            }

            post.setDeletedByUser(false);

            // Liên kết với các entity khác
            User user = users.get(random.nextInt(users.size()));
            post.setUser(user);
            post.setCreatedBy(user.getEmail());
            post.setCategory(selectedCategory);
            post.setVip(selectedVip);
            post.setDetailAddress(detailAddress);

            // Tạo danh sách ảnh mẫu (ít nhất 4 ảnh)
            List<Image> images = new ArrayList<>();
            // Chọn số lượng ảnh ngẫu nhiên từ 4 đến tối đa 8 (hoặc sampleImageUrls.size()
            // nếu nhỏ hơn)
            int maxImages = Math.min(sampleImageUrls.size(), 12);
            int numberOfImages = random.nextInt(maxImages - 3) + 4; // Từ 4 đến maxImages
            // Tạo danh sách URL đã chọn để tránh trùng lặp
            List<String> availableImageUrls = new ArrayList<>(sampleImageUrls);
            for (int j = 0; j < numberOfImages; j++) {
                Image image = new Image();
                // Chọn URL ngẫu nhiên và xóa khỏi danh sách để tránh trùng
                if (!availableImageUrls.isEmpty()) {
                    int randomIndex = random.nextInt(availableImageUrls.size());
                    image.setUrl(availableImageUrls.remove(randomIndex));
                } else {
                    // Nếu hết URL, quay lại dùng danh sách gốc (cho phép trùng nếu danh sách nhỏ)
                    image.setUrl(sampleImageUrls.get(random.nextInt(sampleImageUrls.size())));
                }
                image.setOrderIndex(j);
                image.setPost(post);
                images.add(image);
            }
            post.setImages(images);

            post.setView((long) (random.nextInt(1000) + 100));

            posts.add(post);
        }

        postRepository.saveAll(posts);

        System.out.println(">>> INIT ADDRESS DATA TABLE 'posts' WITH IMAGES : SUCCESS");
    }

    private void initSampleTransactions() {
        if (transactionRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT DATA TABLE 'transactions': ALREADY HAVE DATA ... ");
            return;
        }

        Random random = new Random();
        List<User> users = userRepository.findAll();
        List<Transaction> transactions = new ArrayList<>();
        List<TransactionStatus> statuses = Arrays.asList(TransactionStatus.PENDING, TransactionStatus.SUCCESS,
                TransactionStatus.FAILED);

        // Tạo 200 giao dịch mẫu
        for (int i = 1; i <= 1000; i++) {
            Transaction transaction = new Transaction();

            // Gán user ngẫu nhiên
            User selectedUser = users.get(random.nextInt(users.size()));
            transaction.setUser(selectedUser);

            // Lấy danh sách Post của user này
            List<Post> userPosts = postRepository.findByUser(selectedUser); // Giả định có phương thức này trong
                                                                            // PostRepository

            // Quyết định loại giao dịch: nạp tiền (50%) hoặc thanh toán phí đăng tin (50%)
            boolean isDeposit = random.nextBoolean();
            long amount;
            String description = "";
            String txnId = VnPayUtil.getRandomNumber(10);

            if (isDeposit || userPosts.isEmpty()) { // Nếu không có Post hoặc là giao dịch nạp tiền
                // Giao dịch nạp tiền
                long minAmount = 50_000L;
                long maxAmount = 10_000_000L;
                long amountRange = maxAmount - minAmount;
                amount = minAmount + (long) (random.nextDouble() * amountRange); // Số tiền dương
                TransactionStatus selectedStatus = statuses.get(random.nextInt(statuses.size()));
                transaction.setStatus(selectedStatus);

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

                Post selectedPost = userPosts.get(random.nextInt(userPosts.size()));
                long minCost = 10_000L;
                long maxCost = 1_000_000L;
                long costRange = maxCost - minCost;
                amount = -(minCost + (long) (random.nextDouble() * costRange));
                transaction.setStatus(TransactionStatus.SUCCESS);
                description = "Thanh toán phí đăng tin mã " + selectedPost.getId() + " thành công";
                transaction.setPaymentLink(null);
                txnId = null;
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

        transactionRepository.saveAll(transactions);
        System.out.println(">>> INIT DATA TABLE 'transactions' WITH DEPOSIT AND POST FEE: SUCCESS");
    }

    private void initSampleNotifications() {
        if (notificationRepository.count() > 0) {
            System.out.println(">>> SKIP! INIT DATA TABLE 'notifications': ALREADY HAVE DATA ... ");
            return;
        }

        Random random = new Random();
        List<User> users = userRepository.findAll();
        List<Post> posts = postRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();
        List<Notification> notifications = new ArrayList<>();

        for (int i = 1; i <= 1000; i++) {
            Notification notification = new Notification();

            User selectedUser = users.get(random.nextInt(users.size()));
            notification.setUser(selectedUser);

            // Chọn loại thông báo ngẫu nhiên (4 loại)
            int notificationTypeIndex = random.nextInt(4);
            String message = "";
            NotificationType type;

            switch (notificationTypeIndex) {
                case 0: // Người dùng xem tin đăng
                    if (posts.isEmpty())
                        continue;
                    Post viewedPost = posts.get(random.nextInt(posts.size()));
                    User viewer = users.get(random.nextInt(users.size()));
                    message = "Người dùng '" + viewer.getName() + " - " + viewer.getPhone() +
                            " đã xem tin đăng mã " + viewedPost.getId() + " của  bạn.";
                    type = NotificationType.POST;
                    notification.setUser(viewedPost.getUser());
                    break;

                case 1: // tin đăng được chấp nhận
                    if (posts.isEmpty())
                        continue;
                    Post approvedPost = posts.get(random.nextInt(posts.size()));
                    message = "Tin đăng mã '" + approvedPost.getId() + "' của bạn đã được kiểm  duyệt viên chấp nhận.";
                    type = NotificationType.SYSTEM_ALERT;
                    notification.setUser(approvedPost.getUser());
                    break;

                case 2: // tin đăng bị từ chối
                    if (posts.isEmpty())
                        continue;
                    Post rejectedPost = posts.get(random.nextInt(posts.size()));
                    message = "Tin đăng mã '" + rejectedPost.getId() + "' của bạn đã bị kiểm  duyệt viên từ chối.";
                    type = NotificationType.SYSTEM_ALERT;
                    notification.setUser(rejectedPost.getUser());
                    break;

                case 3:
                    if (transactions.isEmpty())
                        continue;
                    Transaction successfulTransaction = transactions.stream()
                            .filter(t -> t.getStatus() == TransactionStatus.SUCCESS && t.getAmount() > 0)
                            .findAny()
                            .orElse(null);
                    if (successfulTransaction == null)
                        continue;
                    message = "Giao dịch nạp tiền thành công, tài khoản  của bạn cộng "
                            + successfulTransaction.getAmount() + " VNĐ";
                    type = NotificationType.TRANSACTION;
                    notification.setUser(successfulTransaction.getUser());
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

            notifications.add(notification);
        }

        notificationRepository.saveAll(notifications);
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
