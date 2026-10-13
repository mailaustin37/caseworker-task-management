import {Outlet} from 'react-router-dom';

const AppLayout = () => (
    <div className="app-shell">
        <header className="service-header">
            <div className="service-header__inner">
                <div className="service-identity" aria-label="HMCTS task management">
                    <span className="service-identity__crest" aria-hidden="true">HMCTS</span>
                    <span className="service-identity__divider" aria-hidden="true" />
                    <span className="service-identity__name">Casework tasks</span>
                </div>
                <span className="service-header__phase">Prototype</span>
            </div>
        </header>
        <div className="service-strip" />
        <main id="main-content" className="main-content">
            <Outlet />
        </main>
        <footer className="service-footer">
            <div className="service-footer__inner">
                <span>HM Courts &amp; Tribunals Service</span>
                <span>Technical assessment service</span>
            </div>
        </footer>
    </div>
);

export default AppLayout;
