// TaxEasy ZA 2025 - POPIA Compliant Cookie Consent System
// Enhanced to reflect client-side data processing only

class PopiaCookieConsent {
    constructor() {
        this.consentKey = 'taxeasy_popia_consent';
        this.consentDateKey = 'taxeasy_popia_consent_date';
        this.preferencesKey = 'taxeasy_popia_preferences';
        this.cookiePolicyUrl = 'privacy-policy.html'; // Link to your privacy policy
        this.privacyPolicyUrl = 'privacy-policy.html'; // Link to your privacy policy

        // Define cookie/local storage categories and their default states
        this.categories = {
            'strictly_necessary': {
                title: 'Strictly Necessary',
                description: 'These are essential for the website to function and cannot be switched off. They enable core functionality like navigation and access to secure areas. The website cannot function properly without these. **All data for this category is processed and stored locally in your browser only, and is never sent to our servers.**',
                enabled: true, // Always enabled
                always_active: true,
                uses: ['Application State (Local Storage)', 'Form Data (Local Storage)']
            },
            'functional': {
                title: 'Functional',
                description: 'These allow the website to remember choices you make (such as your language or region) and provide enhanced, more personal features. They are used to improve your experience on the site. **All data for this category is processed and stored locally in your browser only, and is never sent to our servers.**',
                enabled: false,
                uses: ['User Preferences (Local Storage)', 'Visited Status (Local Storage)']
            },
            'analytics': {
                title: 'Analytics',
                description: 'These help us understand how visitors interact with the website by collecting and reporting information anonymously. This helps us improve the website functionality and user experience. (Note: Currently not used, but included for future extensibility). **If enabled, data for this category would be processed locally in your browser only, and would never be sent to our servers.**',
                enabled: false,
                uses: ['Anonymous Usage Statistics (Future)']
            }
        };

        this.init();
    }

    init() {
        this.loadPreferences();
        if (!this.hasConsent()) {
            this.showConsentBanner();
        } else {
            this.applyPreferences();
        }
        this.attachCookieSettingsLink();
    }

    hasConsent() {
        return localStorage.getItem(this.consentKey) === 'accepted';
    }

    loadPreferences() {
        try {
            const storedPreferences = JSON.parse(localStorage.getItem(this.preferencesKey));
            if (storedPreferences) {
                for (const category in storedPreferences) {
                    if (this.categories[category] && !this.categories[category].always_active) {
                        this.categories[category].enabled = storedPreferences[category];
                    }
                }
            }
        } catch (e) {
            console.warn('Error loading cookie preferences:', e);
        }
    }

    savePreferences() {
        const preferences = {};
        for (const category in this.categories) {
            preferences[category] = this.categories[category].enabled;
        }
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
    }

    applyPreferences() {
        // This function would enable/disable scripts based on consent
        // For this application, it primarily affects local storage usage for non-essential categories
        for (const category in this.categories) {
            if (this.categories[category].enabled) {
                // Logic to enable functionality for this category
                // e.g., if (category === 'analytics') enableAnalyticsScript();
            } else {
                // Logic to disable/clear functionality for this category
                // e.g., if (category === 'functional') clearUserPreferences();
                this.clearCategoryData(category);
            }
        }
    }

    clearCategoryData(category) {
        if (this.categories[category]) {
            this.categories[category].uses.forEach(use => {
                // This is a simplified example. In a real app, you'd map 'uses' to specific localStorage keys.
                // For now, we'll clear general keys associated with categories if they are not strictly necessary.
                if (category === 'functional') {
                    localStorage.removeItem('taxeasy_preferences');
                    localStorage.removeItem('taxeasy_app_state');
                    localStorage.removeItem('taxeasy_visited');
                } else if (category === 'analytics') {
                    // Clear any analytics-related local storage if implemented
                }
            });
        }
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'popia-consent-banner';
        banner.innerHTML = `
            <div class="popia-consent-content">
                <p>
                    We use essential local storage to make our site work. With your consent, we may also use functional local storage to improve your experience. 
                    **No personal data is stored on our servers.** All calculations and data processing occur directly in your browser.
                    You can manage your preferences below or read our <a href="${this.privacyPolicyUrl}" target="_blank">Privacy Policy</a>.
                </p>
                <div class="popia-consent-actions">
                    <button id="popia-accept-all" class="btn btn-primary">Accept All</button>
                    <button id="popia-manage-preferences" class="btn btn-secondary">Manage Preferences</button>
                    <button id="popia-decline-all" class="btn btn-tertiary">Decline All</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('popia-accept-all').addEventListener('click', () => this.acceptAll());
        document.getElementById('popia-decline-all').addEventListener('click', () => this.declineAll());
        document.getElementById('popia-manage-preferences').addEventListener('click', () => this.showPreferencesModal());
    }

    hideConsentBanner() {
        const banner = document.getElementById('popia-consent-banner');
        if (banner) {
            banner.remove();
        }
    }

    acceptAll() {
        for (const category in this.categories) {
            this.categories[category].enabled = true;
        }
        this.setConsent('accepted');
        this.savePreferences();
        this.applyPreferences();
        this.hideConsentBanner();
    }

    declineAll() {
        for (const category in this.categories) {
            if (!this.categories[category].always_active) {
                this.categories[category].enabled = false;
            }
        }
        this.setConsent('accepted'); // Still set as accepted, but with minimal preferences
        this.savePreferences();
        this.applyPreferences();
        this.hideConsentBanner();
    }

    setConsent(status) {
        localStorage.setItem(this.consentKey, status);
        localStorage.setItem(this.consentDateKey, new Date().toISOString());
    }

    showPreferencesModal() {
        this.hideConsentBanner(); // Hide banner if modal is shown

        const modal = document.createElement('div');
        modal.id = 'popia-preferences-modal';
        modal.innerHTML = `
            <div class="popia-modal-overlay"></div>
            <div class="popia-modal-content">
                <div class="popia-modal-header">
                    <h3>Manage Your Privacy Preferences</h3>
                    <button class="popia-modal-close">&times;</button>
                </div>
                <div class="popia-modal-body">
                    <p>We value your privacy. You can choose which types of local storage you allow. 
                    **No personal data is stored on our servers.** All calculations and data processing occur directly in your browser.</p>
                    <p>For more details, please refer to our <a href="${this.privacyPolicyUrl}" target="_blank">Privacy Policy</a>.</p>
                    <div class="popia-categories">
                        ${Object.keys(this.categories).map(categoryKey => {
                            const category = this.categories[categoryKey];
                            const checked = category.enabled ? 'checked' : '';
                            const disabled = category.always_active ? 'disabled' : '';
                            const usesList = category.uses.map(use => `<li>${use}</li>`).join('');
                            return `
                                <div class="popia-category-item">
                                    <div class="popia-category-header">
                                        <label for="popia-${categoryKey}">${category.title}</label>
                                        <label class="popia-switch">
                                            <input type="checkbox" id="popia-${categoryKey}" data-category="${categoryKey}" ${checked} ${disabled}>
                                            <span class="popia-slider round"></span>
                                        </label>
                                    </div>
                                    <p>${category.description}</p>
                                    ${category.uses.length > 0 ? `
                                        <div class="popia-category-uses">
                                            <h5>Used for:</h5>
                                            <ul>${usesList}</ul>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="popia-modal-footer">
                    <button id="popia-save-preferences" class="btn btn-primary">Save Preferences</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.popia-modal-close').addEventListener('click', () => this.hidePreferencesModal());
        modal.querySelector('.popia-modal-overlay').addEventListener('click', () => this.hidePreferencesModal());
        document.getElementById('popia-save-preferences').addEventListener('click', () => this.saveAndApplyPreferences());

        // Attach event listeners for checkboxes
        modal.querySelectorAll('.popia-categories input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const categoryKey = e.target.dataset.category;
                if (this.categories[categoryKey] && !this.categories[categoryKey].always_active) {
                    this.categories[categoryKey].enabled = e.target.checked;
                }
            });
        });
    }

    hidePreferencesModal() {
        const modal = document.getElementById('popia-preferences-modal');
        if (modal) {
            modal.remove();
        }
    }

    saveAndApplyPreferences() {
        this.savePreferences();
        this.applyPreferences();
        this.hidePreferencesModal();
        this.setConsent('accepted'); // User has made a choice, so consent is recorded
    }

    attachCookieSettingsLink() {
        const cookieSettingsLink = document.getElementById('cookieSettingsLink'); // Assuming this ID exists in your footer
        if (cookieSettingsLink) {
            cookieSettingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPreferencesModal();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.popiaConsentManager = new PopiaCookieConsent();
});

console.log('POPIA Cookie Consent System Loaded');

