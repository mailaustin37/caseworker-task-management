package uk.gov.hmcts.tasks.controllers;

import static uk.gov.hmcts.tasks.utils.Constants.TASKS_RETRIEVED_MESSAGE;
import static uk.gov.hmcts.tasks.utils.Constants.TASK_CREATED_MESSAGE;
import static uk.gov.hmcts.tasks.utils.Constants.TASK_DELETED_MESSAGE;
import static uk.gov.hmcts.tasks.utils.Constants.TASK_STATUS_UPDATED_MESSAGE;
import static uk.gov.hmcts.tasks.utils.Constants.TASK_UPDATED_MESSAGE;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.hmcts.tasks.dto.ApiResponse;
import uk.gov.hmcts.tasks.dto.TaskRequest;
import uk.gov.hmcts.tasks.dto.TaskResponse;
import uk.gov.hmcts.tasks.dto.TaskStatusUpdateRequest;
import uk.gov.hmcts.tasks.services.CaseTaskService;
import uk.gov.hmcts.tasks.utils.CommonUtilities;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
@Tag(name = "Caseworker tasks", description = "Create and manage caseworker tasks")
public class CaseTaskController {

  private final CaseTaskService caseTaskService;
  private final CommonUtilities commonUtilities;

  @Operation(summary = "Create a task")
  @PostMapping
  public ResponseEntity<ApiResponse> createTask(@Valid @RequestBody TaskRequest request) {
    log.debug("CaseTaskController::createTask is firing up");
    TaskResponse task = caseTaskService.createTask(request);
    return ResponseEntity.created(URI.create("/api/tasks/" + task.taskId()))
        .body(ApiResponse.builder()
            .message(TASK_CREATED_MESSAGE)
            .data(Map.of("task", task))
            .build());
  }

  @Operation(summary = "Retrieve all tasks")
  @GetMapping
  public ResponseEntity<ApiResponse> getAllTasks() {
    log.debug("CaseTaskController::getAllTasks is firing up");
    return commonUtilities.generateApiResponse(
        HttpStatus.OK,
        TASKS_RETRIEVED_MESSAGE,
        Map.of("tasks", caseTaskService.getAllTasks()));
  }

  @Operation(summary = "Retrieve a task by ID")
  @GetMapping("/{taskId}")
  public ResponseEntity<ApiResponse> getTask(@PathVariable UUID taskId) {
    log.debug("CaseTaskController::getTask is firing up for {}", taskId);
    return commonUtilities.generateApiResponse(
        HttpStatus.OK,
        TASKS_RETRIEVED_MESSAGE,
        Map.of("task", caseTaskService.getTask(taskId)));
  }

  @Operation(summary = "Update a task")
  @PutMapping("/{taskId}")
  public ResponseEntity<ApiResponse> updateTask(
      @PathVariable UUID taskId,
      @Valid @RequestBody TaskRequest request) {
    log.debug("CaseTaskController::updateTask is firing up for {}", taskId);
    return commonUtilities.generateApiResponse(
        HttpStatus.OK,
        TASK_UPDATED_MESSAGE,
        Map.of("task", caseTaskService.updateTask(taskId, request)));
  }

  @Operation(summary = "Update the status of a task")
  @PatchMapping("/{taskId}/status")
  public ResponseEntity<ApiResponse> updateStatus(
      @PathVariable UUID taskId,
      @Valid @RequestBody TaskStatusUpdateRequest request) {
    log.debug("CaseTaskController::updateStatus is firing up for {}", taskId);
    return commonUtilities.generateApiResponse(
        HttpStatus.OK,
        TASK_STATUS_UPDATED_MESSAGE,
        Map.of("task", caseTaskService.updateStatus(taskId, request.status())));
  }

  @Operation(summary = "Delete a task")
  @DeleteMapping("/{taskId}")
  public ResponseEntity<ApiResponse> deleteTask(@PathVariable UUID taskId) {
    log.debug("CaseTaskController::deleteTask is firing up for {}", taskId);
    caseTaskService.deleteTask(taskId);
    return commonUtilities.generateApiResponse(HttpStatus.OK, TASK_DELETED_MESSAGE);
  }
}
