package uk.gov.hmcts.tasks.repositories;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.gov.hmcts.tasks.entities.CaseTask;

public interface CaseTaskRepository extends JpaRepository<CaseTask, UUID> {

  List<CaseTask> findAllByOrderByDueDateTimeAsc();
}
