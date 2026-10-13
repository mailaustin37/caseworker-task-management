package uk.gov.hmcts.tasks.services;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.hmcts.tasks.dto.TaskRequest;
import uk.gov.hmcts.tasks.dto.TaskResponse;
import uk.gov.hmcts.tasks.entities.CaseTask;
import uk.gov.hmcts.tasks.enums.TaskStatus;
import uk.gov.hmcts.tasks.exceptions.ResourceNotFoundException;
import uk.gov.hmcts.tasks.repositories.CaseTaskRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class CaseTaskService {

  private final CaseTaskRepository caseTaskRepository;

  @Transactional
  public TaskResponse createTask(TaskRequest request) {
    log.debug("CaseTaskService::createTask is firing up");
    CaseTask task = CaseTask.builder()
        .title(request.title().trim())
        .description(normaliseDescription(request.description()))
        .status(request.status())
        .dueDateTime(request.dueDateTime())
        .build();
    CaseTask savedTask = caseTaskRepository.saveAndFlush(task);
    return toResponse(savedTask);
  }

  @Transactional(readOnly = true)
  public List<TaskResponse> getAllTasks() {
    log.debug("CaseTaskService::getAllTasks is firing up");
    return caseTaskRepository.findAllByOrderByDueDateTimeAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public TaskResponse getTask(UUID taskId) {
    log.debug("CaseTaskService::getTask is firing up for {}", taskId);
    return toResponse(findTask(taskId));
  }

  @Transactional
  public TaskResponse updateTask(UUID taskId, TaskRequest request) {
    log.debug("CaseTaskService::updateTask is firing up for {}", taskId);
    CaseTask task = findTask(taskId);
    task.setTitle(request.title().trim());
    task.setDescription(normaliseDescription(request.description()));
    task.setStatus(request.status());
    task.setDueDateTime(request.dueDateTime());
    return toResponse(caseTaskRepository.saveAndFlush(task));
  }

  @Transactional
  public TaskResponse updateStatus(UUID taskId, TaskStatus status) {
    log.debug("CaseTaskService::updateStatus is firing up for {}", taskId);
    CaseTask task = findTask(taskId);
    task.setStatus(status);
    return toResponse(caseTaskRepository.saveAndFlush(task));
  }

  @Transactional
  public void deleteTask(UUID taskId) {
    log.debug("CaseTaskService::deleteTask is firing up for {}", taskId);
    CaseTask task = findTask(taskId);
    caseTaskRepository.delete(task);
  }

  private CaseTask findTask(UUID taskId) {
    return caseTaskRepository.findById(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
  }

  private String normaliseDescription(String description) {
    return description == null || description.isBlank() ? null : description.trim();
  }

  private TaskResponse toResponse(CaseTask task) {
    return new TaskResponse(
        task.getTaskId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        task.getDueDateTime(),
        task.getCreatedAt(),
        task.getUpdatedAt());
  }
}
