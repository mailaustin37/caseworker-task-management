package uk.gov.hmcts.tasks.dto;

import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse {

  private String message;
  private Map<String, ?> data;
  private Map<String, ?> errors;

  @Builder.Default
  private Instant timestamp = Instant.now();
}
