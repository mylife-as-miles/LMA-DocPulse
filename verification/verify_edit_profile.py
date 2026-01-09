from playwright.sync_api import sync_playwright, expect

def verify_edit_profile():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at Profile Page
        page.goto("http://localhost:3000/#profile")

        # 2. Click Edit Profile
        # We need to wait for the page to render the button
        page.wait_for_selector('button:has-text("Edit Profile")')
        page.get_by_role("button", name="Edit Profile").click()

        # 3. Verify Edit Profile Page Load
        # We can look for the heading instead which might be more reliable if text varies
        expect(page.get_by_role("heading", name="Edit Profile")).to_be_visible()
        expect(page.get_by_text("Expertise & Skills")).to_be_visible()

        # 4. Verify Skills interaction
        # Add a skill
        page.get_by_placeholder("Add a skill").fill("Python")
        page.get_by_role("button", name="", exact=False).filter(has=page.locator("svg.lucide-plus")).click()

        expect(page.get_by_text("Python")).to_be_visible()

        page.screenshot(path="verification/edit_profile.png")
        print("Edit Profile verified.")

        browser.close()

if __name__ == "__main__":
    verify_edit_profile()
