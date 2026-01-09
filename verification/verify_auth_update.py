from playwright.sync_api import sync_playwright, expect

def verify_auth_update():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at Landing Page
        page.goto("http://localhost:3000/#auth")

        # 2. Check for Google button
        expect(page.get_by_text("Google")).to_be_visible()

        # 3. Check for absence of GitHub button
        # We use a try/except or just expect(locator).not_to_be_visible()
        expect(page.get_by_text("GitHub")).not_to_be_visible()

        # 4. Check for absence of Microsoft button (since we replaced it)
        expect(page.get_by_text("Microsoft")).not_to_be_visible()

        page.screenshot(path="verification/auth_google_update.png")
        print("Auth - Google update verified.")

        browser.close()

if __name__ == "__main__":
    verify_auth_update()
