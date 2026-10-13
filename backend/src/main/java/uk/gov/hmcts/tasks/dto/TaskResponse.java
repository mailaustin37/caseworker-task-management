package uk.gov.hmcts.tasks.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import uk.gov.hmcts.tasks.enums.TaskStatus;

public record TaskResponse(
    UUID taskId,
    String title,
    String description,
    TaskStatus status,
    LocalDateTime dueDateTime,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
