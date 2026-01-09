from playwright.sync_api import sync_playwright, expect

def verify_settings():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Settings
        page.goto("http://localhost:3000/#settings")

        # 1. General Section (Default)
        expect(page.get_by_text("System Preferences")).to_be_visible()
        expect(page.get_by_text("Interface & Experience")).to_be_visible()
        expect(page.get_by_text("Regional Settings")).to_be_visible()
        page.screenshot(path="verification/settings_general.png")
        print("General section verified.")

        # 2. Account Section
        page.get_by_role("button", name="Account").click()
        expect(page.get_by_text("Profile Customization")).to_be_visible()
        expect(page.get_by_text("Avatar")).to_be_visible()
        page.screenshot(path="verification/settings_account.png")
        print("Account section verified.")

        # 3. Security Section
        page.get_by_role("button", name="Security").click()
        expect(page.get_by_text("Password Management")).to_be_visible()
        expect(page.get_by_text("Two-Factor Authentication")).to_be_visible()
        expect(page.get_by_text("Active Sessions")).to_be_visible()
        page.screenshot(path="verification/settings_security.png")
        print("Security section verified.")

        browser.close()

if __name__ == "__main__":
    verify_settings()
