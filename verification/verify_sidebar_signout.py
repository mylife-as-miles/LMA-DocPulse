from playwright.sync_api import sync_playwright, expect

def verify_sidebar_signout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at Dashboard (Sidebar visible)
        page.goto("http://localhost:3000/#dashboard")

        # 2. Check for Sidebar user profile and Sign Out button
        # The sign out button has title="Sign Out"
        sign_out_btn = page.locator('button[title="Sign Out"]')
        expect(sign_out_btn).to_be_visible()

        # 3. Click Sign Out
        sign_out_btn.click()

        # 4. Verify navigation to Auth page
        expect(page.get_by_text("Welcome back")).to_be_visible()
        expect(page.get_by_text("Secure access to your portfolio intelligence")).to_be_visible()

        page.screenshot(path="verification/sidebar_signout.png")
        print("Sidebar sign-out verified.")

        browser.close()

if __name__ == "__main__":
    verify_sidebar_signout()
