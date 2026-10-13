package uk.gov.hmcts.tasks.utils;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.tasks.dto.ApiResponse;

@Component
public class CommonUtilities {

  public ResponseEntity<ApiResponse> generateApiResponse(
      HttpStatus status, String message, Map<String, ?> data) {
    return ResponseEntity.status(status).body(ApiResponse.builder()
        .message(message)
        .data(data)
        .build());
  }

  public ResponseEntity<ApiResponse> generateApiResponse(HttpStatus status, String message) {
    return generateApiResponse(status, message, null);
  }
}
