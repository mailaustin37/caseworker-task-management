import * as yup from 'yup';

const notInPast = value => {
    if (!value) return true;
    return new Date(value).getTime() >= Date.now() - 60000;
};

export const TaskValidation = yup.object().shape({
    title: yup.string()
        .trim()
        .max(120, 'Title must be 120 characters or fewer')
        .required('Enter a task title'),
    description: yup.string()
        .trim()
        .max(1000, 'Description must be 1,000 characters or fewer'),
    status: yup.string()
        .oneOf(['TODO', 'IN_PROGRESS', 'COMPLETED'])
        .required('Select a status'),
    dueDateTime: yup.string()
        .required('Enter a due date and time')
        .test('not-in-past', 'Due date and time must not be in the past', notInPast)
});
