import time
from playwright.sync_api import sync_playwright

def test_bg_color():
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
                page.get_by_placeholder("John Doe").fill(f"Tester {timestamp}")
                page.get_by_placeholder("name@company.com").fill(f"test{timestamp}@example.com")
                page.get_by_placeholder("••••••••").fill("password123")
                page.get_by_role("button", name="Create Account").click()
                time.sleep(2)

                # Login
                page.get_by_placeholder("name@company.com").fill(f"test{timestamp}@example.com")
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

            # 3. Check Background Color of Input
            # Select the Full Name input
            input_locator = page.locator("input[name='name']")

            # Get computed style
            bg_color = input_locator.evaluate("element => getComputedStyle(element).backgroundColor")
            print(f"Input background color: {bg_color}")

            # Convert rgb to hex for easier comparison if needed, but rgb is standard output from getComputedStyle
            # Expected for surface-dark #0A0F14 is roughly rgb(10, 15, 20)
            # If it is white, it will be rgb(255, 255, 255)

            if "255, 255, 255" in bg_color:
                print("FAIL: Background is white.")
            else:
                print("SUCCESS: Background is not white.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_bg_color.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_bg_color()
