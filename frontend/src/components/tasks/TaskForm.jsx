import {useEffect, useMemo, useState} from 'react';
import {TASK_STATUS, TASK_STATUS_LABEL} from '../../utils/Constants';
import {TaskValidation} from '../../utils/validations/TaskValidation';

const toDateTimeInput = value => {
    if (!value) return '';
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

const initialValues = {
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    dueDateTime: ''
};

const TaskForm = ({task, isSaving, onSave, onCancel}) => {
    const startingValues = useMemo(() => task ? {
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDateTime: toDateTimeInput(task.dueDateTime)
    } : initialValues, [task]);

    const [values, setValues] = useState(startingValues);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setValues(startingValues);
        setErrors({});
    }, [startingValues]);

    const handleChange = event => {
        const {name, value} = event.target;
        setValues(current => ({...current, [name]: value}));
        setErrors(current => ({...current, [name]: undefined}));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const validated = await TaskValidation.validate(values, {abortEarly: false});
            setErrors({});
            const dueDateTime = validated.dueDateTime.length === 16
                ? `${validated.dueDateTime}:00`
                : validated.dueDateTime;
            await onSave({...validated, dueDateTime});
        } catch (error) {
            if (!error.inner) return;
            const nextErrors = {};
            error.inner.forEach(item => {
                if (!nextErrors[item.path]) nextErrors[item.path] = item.message;
            });
            setErrors(nextErrors);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className={errors.title ? 'form-group form-group--error' : 'form-group'}>
                <label htmlFor="title">Task title</label>
                <span className="form-hint">Use a short description that is easy to recognise.</span>
                {errors.title && <span className="form-error">{errors.title}</span>}
                <input
                    id="title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    maxLength="120"
                    autoFocus
                />
            </div>

            <div className={errors.description ? 'form-group form-group--error' : 'form-group'}>
                <label htmlFor="description">Description <span className="optional">(optional)</span></label>
                {errors.description && <span className="form-error">{errors.description}</span>}
                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={values.description}
                    onChange={handleChange}
                    maxLength="1000"
                />
                <span className="character-count">{values.description.length} of 1,000 characters</span>
            </div>

            <div className="form-grid">
                <div className={errors.status ? 'form-group form-group--error' : 'form-group'}>
                    <label htmlFor="status">Status</label>
                    {errors.status && <span className="form-error">{errors.status}</span>}
                    <select id="status" name="status" value={values.status} onChange={handleChange}>
                        {Object.values(TASK_STATUS).map(status => (
                            <option key={status} value={status}>{TASK_STATUS_LABEL[status]}</option>
                        ))}
                    </select>
                </div>

                <div className={errors.dueDateTime ? 'form-group form-group--error' : 'form-group'}>
                    <label htmlFor="dueDateTime">Due date and time</label>
                    {errors.dueDateTime && <span className="form-error">{errors.dueDateTime}</span>}
                    <input
                        id="dueDateTime"
                        name="dueDateTime"
                        type="datetime-local"
                        value={values.dueDateTime}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="button-row">
                <button className="button" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
                </button>
                <button className="button button--secondary" type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
