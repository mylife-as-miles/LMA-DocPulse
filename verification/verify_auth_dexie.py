import time
from playwright.sync_api import sync_playwright

def test_auth_and_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Wait for the server to be ready
        print("Waiting for server to be ready...")
        time.sleep(2)

        try:
            # 1. Navigate to the app (defaults to landing page)
            print("Navigating to app...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Take screenshot of Landing page
            page.screenshot(path="verification/landing_page.png")
            print("Landing page screenshot taken.")

            # Click "Sign In" to go to Auth view
            print("Clicking Sign In...")
            page.get_by_text("Sign In", exact=True).click()
            time.sleep(1)

            # Take screenshot of Auth page
            page.screenshot(path="verification/auth_page.png")
            print("Auth page screenshot taken.")

            # 2. Signup
            print("Switching to signup...")
            # Click "Sign up" button.
            page.get_by_text("Sign up", exact=True).click()
            time.sleep(1)

            print("Filling signup form...")
            # Fill name, email, password
            page.get_by_placeholder("John Doe").fill("Test User")
            page.get_by_placeholder("name@company.com").fill("test@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            # Click "Create Account"
            page.get_by_role("button", name="Create Account").click()

            # Wait for success toast or mode switch
            time.sleep(2)

            # Take screenshot after signup (should be back to login or showing success)
            page.screenshot(path="verification/after_signup.png")
            print("After signup screenshot taken.")

            # 3. Login
            print("Logging in...")
            # Should be in login mode now
            page.get_by_placeholder("name@company.com").fill("test@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            page.get_by_role("button", name="Sign In").click()

            # Wait for navigation to dashboard
            # App.tsx: onComplete: () => setView('dashboard')
            # Dashboard has "Compliance Trend" text
            print("Waiting for dashboard...")
            page.wait_for_selector("text=Compliance Trend", timeout=10000)

            # Take screenshot of Dashboard
            page.screenshot(path="verification/dashboard.png")
            print("Dashboard screenshot taken.")

            # Verify data presence (Dexie loaded)
            # Check if "Active Loans" or "Compliance Score" is visible
            if page.get_by_text("Active Loans").is_visible():
                print("Dashboard loaded successfully with data.")
            else:
                print("Dashboard data might be missing.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_auth_and_dashboard()
