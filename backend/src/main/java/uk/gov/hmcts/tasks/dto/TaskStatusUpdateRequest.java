package uk.gov.hmcts.tasks.dto;

import jakarta.validation.constraints.NotNull;
import uk.gov.hmcts.tasks.enums.TaskStatus;

public record TaskStatusUpdateRequest(
    @NotNull(message = "Status is required") TaskStatus status
) {
}
