package uk.gov.hmcts.tasks.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import uk.gov.hmcts.tasks.dto.TaskResponse;
import uk.gov.hmcts.tasks.dto.TaskRequest;
import uk.gov.hmcts.tasks.dto.TaskStatusUpdateRequest;
import uk.gov.hmcts.tasks.enums.TaskStatus;
import uk.gov.hmcts.tasks.services.CaseTaskService;
import uk.gov.hmcts.tasks.utils.CommonUtilities;

@ExtendWith(MockitoExtension.class)
class CaseTaskControllerTest {

  @Mock
  private CaseTaskService caseTaskService;

  private CaseTaskController controller;
  private TaskResponse taskResponse;

  @BeforeEach
  void setUp() {
    controller = new CaseTaskController(caseTaskService, new CommonUtilities());
    taskResponse = new TaskResponse(
        UUID.randomUUID(),
        "Prepare hearing bundle",
        null,
        TaskStatus.TODO,
        LocalDateTime.now().plusDays(1),
        LocalDateTime.now(),
        LocalDateTime.now());
  }

  @Test
  void returnsAllTasksInStandardApiResponse() {
    when(caseTaskService.getAllTasks()).thenReturn(List.of(taskResponse));

    var response = controller.getAllTasks();

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getData()).containsKey("tasks");
  }

  @Test
  void createsTaskWithLocationHeader() {
    TaskRequest request = new TaskRequest(
        taskResponse.title(),
        taskResponse.description(),
        taskResponse.status(),
        taskResponse.dueDateTime());
    when(caseTaskService.createTask(request)).thenReturn(taskResponse);

    var response = controller.createTask(request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getHeaders().getLocation())
        .hasToString("/api/tasks/" + taskResponse.taskId());
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getData()).containsKey("task");
  }

  @Test
  void returnsTaskById() {
    when(caseTaskService.getTask(taskResponse.taskId())).thenReturn(taskResponse);

    var response = controller.getTask(taskResponse.taskId());

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    verify(caseTaskService).getTask(taskResponse.taskId());
  }

  @Test
  void updatesTaskStatus() {
    when(caseTaskService.updateStatus(taskResponse.taskId(), TaskStatus.IN_PROGRESS))
        .thenReturn(new TaskResponse(
            taskResponse.taskId(),
            taskResponse.title(),
            taskResponse.description(),
            TaskStatus.IN_PROGRESS,
            taskResponse.dueDateTime(),
            taskResponse.createdAt(),
            taskResponse.updatedAt()));

    var response = controller.updateStatus(
        taskResponse.taskId(),
        new TaskStatusUpdateRequest(TaskStatus.IN_PROGRESS));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    verify(caseTaskService).updateStatus(taskResponse.taskId(), TaskStatus.IN_PROGRESS);
  }

  @Test
  void updatesTaskDetails() {
    TaskRequest request = new TaskRequest(
        "Updated hearing bundle",
        "Include the latest evidence",
        TaskStatus.IN_PROGRESS,
        taskResponse.dueDateTime().plusDays(1));
    TaskResponse updated = new TaskResponse(
        taskResponse.taskId(),
        request.title(),
        request.description(),
        request.status(),
        request.dueDateTime(),
        taskResponse.createdAt(),
        taskResponse.updatedAt());
    when(caseTaskService.updateTask(taskResponse.taskId(), request)).thenReturn(updated);

    var response = controller.updateTask(taskResponse.taskId(), request);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getData().get("task")).isEqualTo(updated);
    verify(caseTaskService).updateTask(taskResponse.taskId(), request);
  }

  @Test
  void deletesTask() {
    var response = controller.deleteTask(taskResponse.taskId());

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    verify(caseTaskService).deleteTask(taskResponse.taskId());
  }
}
