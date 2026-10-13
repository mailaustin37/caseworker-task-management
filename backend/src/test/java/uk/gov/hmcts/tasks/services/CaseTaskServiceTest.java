package uk.gov.hmcts.tasks.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.hmcts.tasks.dto.TaskRequest;
import uk.gov.hmcts.tasks.entities.CaseTask;
import uk.gov.hmcts.tasks.enums.TaskStatus;
import uk.gov.hmcts.tasks.exceptions.ResourceNotFoundException;
import uk.gov.hmcts.tasks.repositories.CaseTaskRepository;

@ExtendWith(MockitoExtension.class)
class CaseTaskServiceTest {

  @Mock
  private CaseTaskRepository caseTaskRepository;

  private CaseTaskService caseTaskService;
  private CaseTask task;

  @BeforeEach
  void setUp() {
    caseTaskService = new CaseTaskService(caseTaskRepository);
    task = CaseTask.builder()
        .taskId(UUID.randomUUID())
        .title("Review witness statement")
        .description("Check the supporting evidence")
        .status(TaskStatus.TODO)
        .dueDateTime(LocalDateTime.now().plusDays(2))
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
  }

  @Test
  void createsTaskWithTrimmedText() {
    when(caseTaskRepository.saveAndFlush(any(CaseTask.class))).thenAnswer(invocation -> {
      CaseTask value = invocation.getArgument(0);
      value.setTaskId(task.getTaskId());
      value.setCreatedAt(task.getCreatedAt());
      value.setUpdatedAt(task.getUpdatedAt());
      return value;
    });

    var response = caseTaskService.createTask(new TaskRequest(
        " Review witness statement ",
        " Check the supporting evidence ",
        TaskStatus.TODO,
        task.getDueDateTime()));

    assertThat(response.title()).isEqualTo("Review witness statement");
    assertThat(response.description()).isEqualTo("Check the supporting evidence");
  }

  @Test
  void convertsBlankDescriptionToNullWhenCreatingTask() {
    when(caseTaskRepository.saveAndFlush(any(CaseTask.class))).thenAnswer(invocation -> {
      CaseTask value = invocation.getArgument(0);
      value.setTaskId(task.getTaskId());
      value.setCreatedAt(task.getCreatedAt());
      value.setUpdatedAt(task.getUpdatedAt());
      return value;
    });

    var response = caseTaskService.createTask(new TaskRequest(
        "Review witness statement",
        "   ",
        TaskStatus.TODO,
        task.getDueDateTime()));

    assertThat(response.description()).isNull();
  }

  @Test
  void returnsTasksInRepositoryOrder() {
    when(caseTaskRepository.findAllByOrderByDueDateTimeAsc()).thenReturn(List.of(task));

    var responses = caseTaskService.getAllTasks();

    assertThat(responses).hasSize(1);
    assertThat(responses.getFirst().taskId()).isEqualTo(task.getTaskId());
  }

  @Test
  void returnsTaskById() {
    when(caseTaskRepository.findById(task.getTaskId())).thenReturn(Optional.of(task));

    var response = caseTaskService.getTask(task.getTaskId());

    assertThat(response.taskId()).isEqualTo(task.getTaskId());
    assertThat(response.title()).isEqualTo(task.getTitle());
  }

  @Test
  void updatesTaskDetails() {
    when(caseTaskRepository.findById(task.getTaskId())).thenReturn(Optional.of(task));
    when(caseTaskRepository.saveAndFlush(task)).thenReturn(task);
    LocalDateTime newDueDate = task.getDueDateTime().plusDays(1);

    var response = caseTaskService.updateTask(task.getTaskId(), new TaskRequest(
        " Updated title ",
        " Updated description ",
        TaskStatus.IN_PROGRESS,
        newDueDate));

    assertThat(response.title()).isEqualTo("Updated title");
    assertThat(response.description()).isEqualTo("Updated description");
    assertThat(response.status()).isEqualTo(TaskStatus.IN_PROGRESS);
    assertThat(response.dueDateTime()).isEqualTo(newDueDate);
  }

  @Test
  void updatesTaskStatus() {
    when(caseTaskRepository.findById(task.getTaskId())).thenReturn(Optional.of(task));
    when(caseTaskRepository.saveAndFlush(task)).thenReturn(task);

    var response = caseTaskService.updateStatus(task.getTaskId(), TaskStatus.COMPLETED);

    assertThat(response.status()).isEqualTo(TaskStatus.COMPLETED);
  }

  @Test
  void deletesExistingTask() {
    when(caseTaskRepository.findById(task.getTaskId())).thenReturn(Optional.of(task));

    caseTaskService.deleteTask(task.getTaskId());

    verify(caseTaskRepository).delete(task);
  }

  @Test
  void throwsWhenTaskDoesNotExist() {
    UUID taskId = UUID.randomUUID();
    when(caseTaskRepository.findById(taskId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> caseTaskService.getTask(taskId))
        .isInstanceOf(ResourceNotFoundException.class)
        .hasMessage("Task not found");
  }

  @Test
  void throwsWhenUpdatingMissingTask() {
    UUID taskId = UUID.randomUUID();
    when(caseTaskRepository.findById(taskId)).thenReturn(Optional.empty());

    TaskRequest request = new TaskRequest(
        "Updated title",
        null,
        TaskStatus.IN_PROGRESS,
        LocalDateTime.now().plusDays(3));

    assertThatThrownBy(() -> caseTaskService.updateTask(taskId, request))
        .isInstanceOf(ResourceNotFoundException.class)
        .hasMessage("Task not found");
  }

  @Test
  void throwsWhenDeletingMissingTask() {
    UUID taskId = UUID.randomUUID();
    when(caseTaskRepository.findById(taskId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> caseTaskService.deleteTask(taskId))
        .isInstanceOf(ResourceNotFoundException.class)
        .hasMessage("Task not found");
  }
}
