import {TASK_STATUS_LABEL} from '../../utils/Constants';

const StatusBadge = ({status}) => (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
        {TASK_STATUS_LABEL[status] || status}
    </span>
);

export default StatusBadge;
