import time
from playwright.sync_api import sync_playwright

def test_signout_modal():
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

            # Click "Sign In" to go to Auth view
            print("Clicking Sign In...")
            page.get_by_text("Sign In", exact=True).click()
            time.sleep(1)

            # 2. Signup (Required because it's a fresh browser context)
            print("Switching to signup...")
            page.get_by_text("Sign up", exact=True).click()
            time.sleep(1)

            print("Filling signup form...")
            page.get_by_placeholder("John Doe").fill("Modal Tester")
            page.get_by_placeholder("name@company.com").fill("modal@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            page.get_by_role("button", name="Create Account").click()
            time.sleep(2)

            # 3. Login
            print("Logging in...")
            page.get_by_placeholder("name@company.com").fill("modal@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            page.get_by_role("button", name="Sign In").click()

            # Wait for navigation to dashboard
            print("Waiting for dashboard...")
            # Use a more generic selector or just wait
            time.sleep(3)
            page.screenshot(path="verification/dashboard_debug.png")

            # 4. Trigger Sign Out Modal
            print("Clicking Sign Out button...")
            page.set_viewport_size({"width": 1280, "height": 720})

            page.get_by_title("Sign Out").click()
            time.sleep(1)

            # Take screenshot of Modal
            page.screenshot(path="verification/signout_modal.png")
            print("Signout modal screenshot taken.")

            # Verify Modal Content
            if page.get_by_text("Are you sure you want to sign out?").is_visible():
                print("Modal is visible.")
            else:
                print("Modal is NOT visible.")

            # 5. Confirm Sign Out
            print("Confirming Sign Out...")
            # Be specific about the confirmation button in the modal
            # It's the one with text "Sign Out" and is not the title attribute button
            # We can select by text inside the modal or using the class we saw in error
            page.locator("button.bg-red-500").click()
            time.sleep(1)

            # Verify we are back at Auth/Landing
            page.screenshot(path="verification/after_signout.png")
            print("After signout screenshot taken.")

            if page.get_by_text("Welcome back").is_visible() or page.get_by_text("Sign In").is_visible():
                print("Successfully signed out.")
            else:
                 print("Sign out might have failed.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_modal.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_signout_modal()
