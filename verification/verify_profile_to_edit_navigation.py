from playwright.sync_api import sync_playwright, expect

def verify_profile_to_edit_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at Profile Page
        page.goto("http://localhost:3000/#profile")

        # 2. Click Edit Profile
        # We wait for the button to ensure page is loaded
        page.wait_for_selector('button:has-text("Edit Profile")')
        page.get_by_role("button", name="Edit Profile").click()

        # 3. Verify Edit Profile Page Load
        # We expect to see "Update your personal details" or the "Edit Profile" heading
        expect(page.get_by_role("heading", name="Edit Profile")).to_be_visible()
        expect(page.get_by_text("Update your personal details")).to_be_visible()

        page.screenshot(path="verification/profile_to_edit_flow.png")
        print("Navigation from Profile to Edit Profile verified.")

        browser.close()

if __name__ == "__main__":
    verify_profile_to_edit_navigation()
