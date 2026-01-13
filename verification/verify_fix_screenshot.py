import time
from playwright.sync_api import sync_playwright

def test_fix_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Signup/Login
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Check if we are already logged in or need to sign in
            if page.get_by_text("Sign In", exact=True).is_visible():
                page.get_by_text("Sign In", exact=True).click()
                time.sleep(1)
                page.get_by_text("Sign up", exact=True).click()
                time.sleep(1)

                timestamp = int(time.time())
                page.get_by_placeholder("John Doe").fill(f"Screenshot Tester {timestamp}")
                page.get_by_placeholder("name@company.com").fill(f"screen{timestamp}@example.com")
                page.get_by_placeholder("••••••••").fill("password123")
                page.get_by_role("button", name="Create Account").click()
                time.sleep(2)

                # Login
                page.get_by_placeholder("name@company.com").fill(f"screen{timestamp}@example.com")
                page.get_by_placeholder("••••••••").fill("password123")
                page.get_by_role("button", name="Sign In").click()
                time.sleep(3)

            # 2. Navigate to Edit Profile
            # Go to Profile first
            page.get_by_title("View Profile").click()
            time.sleep(2)

            # Click Edit Profile
            page.get_by_role("button", name="Edit Profile").click()
            time.sleep(2)

            # 3. Take Screenshot
            screenshot_path = "verification/edit_profile_fixed.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot taken: {screenshot_path}")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_fix_screenshot()
