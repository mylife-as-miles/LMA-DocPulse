from playwright.sync_api import sync_playwright, expect

def verify_auth_view():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Start at Landing Page
        page.goto("http://localhost:3000/#landing")

        # 2. Navigate to Auth (Sign In)
        page.get_by_text("Sign In").click()

        # Verify Auth Page Load
        expect(page.get_by_text("Welcome back")).to_be_visible()
        expect(page.get_by_text("Secure access to your portfolio intelligence")).to_be_visible()
        page.screenshot(path="verification/auth_login.png")
        print("Auth - Login verified.")

        # 3. Toggle to Signup
        page.get_by_text("Sign up").click()
        expect(page.get_by_role("heading", name="Create account")).to_be_visible()
        expect(page.get_by_text("Join the future of syndicated loan management")).to_be_visible()
        page.screenshot(path="verification/auth_signup.png")
        print("Auth - Signup verified.")

        browser.close()

if __name__ == "__main__":
    verify_auth_view()
