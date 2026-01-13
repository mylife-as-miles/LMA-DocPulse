import time
from playwright.sync_api import sync_playwright

def test_profile_update():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Waiting for server to be ready...")
        time.sleep(2)

        try:
            # 1. Signup/Login
            print("Navigating to app...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            print("Clicking Sign In...")
            page.get_by_text("Sign In", exact=True).click()
            time.sleep(1)

            print("Switching to signup...")
            page.get_by_text("Sign up", exact=True).click()
            time.sleep(1)

            print("Creating test user for profile...")
            # Use unique email to avoid conflict if DB persists
            timestamp = int(time.time())
            page.get_by_placeholder("John Doe").fill(f"Profile Tester {timestamp}")
            page.get_by_placeholder("name@company.com").fill(f"profile{timestamp}@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            page.get_by_role("button", name="Create Account").click()
            time.sleep(2)

            print("Logging in...")
            page.get_by_placeholder("name@company.com").fill(f"profile{timestamp}@example.com")
            page.get_by_placeholder("••••••••").fill("password123")

            page.get_by_role("button", name="Sign In").click()

            print("Waiting for dashboard...")
            time.sleep(3) # Wait for animation

            # 2. Navigate to Profile
            print("Navigating to Profile...")
            # Ideally via sidebar or header, but let's assume sidebar
            # Sidebar might be collapsed or open.
            # Profile link in sidebar footer
            page.get_by_title("View Profile").click()
            time.sleep(2)

            page.screenshot(path="verification/profile_initial.png")
            print("Initial profile screenshot taken.")

            # Verify initial name
            if page.get_by_text(f"Profile Tester {timestamp}").is_visible():
                print("Initial profile name verified.")
            else:
                print("Initial profile name NOT found.")

            # 3. Edit Profile
            print("Clicking Edit Profile...")
            page.get_by_role("button", name="Edit Profile").click()
            time.sleep(2)

            # Change Title and Bio
            print("Updating profile...")
            page.locator("input[name='title']").fill("Chief Innovation Officer")
            page.locator("textarea[name='bio']").fill("Dexie.js integration expert with a passion for resilient frontend architectures.")

            # Save
            print("Saving changes...")
            page.get_by_role("button", name="Save Changes").click()

            # Wait for save (mock delay 800ms + timeout 1000ms)
            time.sleep(3)

            # 4. Verify Updates
            page.screenshot(path="verification/profile_updated.png")
            print("Updated profile screenshot taken.")

            if page.get_by_text("Chief Innovation Officer").is_visible():
                print("Title update verified.")
            else:
                 print("Title update NOT verified.")

            if page.get_by_text("Dexie.js integration expert").is_visible():
                print("Bio update verified.")
            else:
                 print("Bio update NOT verified.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_profile.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_profile_update()
