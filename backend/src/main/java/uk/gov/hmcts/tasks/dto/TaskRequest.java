package uk.gov.hmcts.tasks.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import uk.gov.hmcts.tasks.enums.TaskStatus;

public record TaskRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title must be 120 characters or fewer")
    String title,

    @Size(max = 1000, message = "Description must be 1,000 characters or fewer")
    String description,

    @NotNull(message = "Status is required")
    TaskStatus status,

    @NotNull(message = "Due date and time are required")
    @FutureOrPresent(message = "Due date and time must not be in the past")
    LocalDateTime dueDateTime
) {
}
