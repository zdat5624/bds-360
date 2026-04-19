package vn.bds360.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Bds360BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(Bds360BackendApplication.class, args);
	}

}
