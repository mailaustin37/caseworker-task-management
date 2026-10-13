import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import App from './App';
import store from './redux/Store';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar
                    closeOnClick
                    theme="light"
                />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
