package uk.gov.hmcts.tasks.exceptions;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;

class GlobalExceptionHandlerTest {

  private GlobalExceptionHandler exceptionHandler;

  @BeforeEach
  void setUp() {
    exceptionHandler = new GlobalExceptionHandler();
  }

  @Test
  void returnsNotFoundWithoutExposingInternalDetails() {
    var response = exceptionHandler.handleNotFound(
        new ResourceNotFoundException("Task not found"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getMessage()).isEqualTo("Task not found");
  }

  @Test
  void returnsSafeMessageForUnreadableRequest() {
    var exception = new HttpMessageNotReadableException(
        "Technical parsing details",
        (HttpInputMessage) null);

    var response = exceptionHandler.handleUnreadableMessage(exception);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getMessage())
        .isEqualTo("The request contains an invalid value or format");
  }

  @Test
  void returnsSafeMessageForUnexpectedFailure() {
    var response = exceptionHandler.handleUnexpected(
        new IllegalStateException("Database password should not be exposed"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getMessage())
        .isEqualTo("The service could not process the request");
  }
}
