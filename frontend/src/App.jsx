import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import TaskManager from './pages/TaskManager';

const App = () => (
    <Routes>
        <Route element={<AppLayout />}>
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Route>
    </Routes>
);

export default App;
