package uk.gov.hmcts.tasks.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI taskManagementOpenApi() {
    return new OpenAPI().info(new Info()
        .title("HMCTS Caseworker Task API")
        .description("API for creating and managing caseworker tasks")
        .version("1.0.0")
        .contact(new Contact().name("HMCTS Developer Challenge")));
  }
}
