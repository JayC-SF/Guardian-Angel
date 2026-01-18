import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

const SettingsPage = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-content">
                <div className="setting-item">
                    <div className="setting-info">
                        <h2>Dark Mode</h2>
                        <p>Switch to a darker theme for nighttime use - easier on the eyes for your little one</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;