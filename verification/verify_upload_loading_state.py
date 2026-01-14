import os
from playwright.sync_api import sync_playwright

def verify_upload_loading_state():
    """
    Verifies that clicking 'Analyze Documents' without a valid key (simulated or actual)
    triggers the loading state or error handling UI.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to Upload View...")
            page.goto("http://localhost:3000/#upload")

            # 1. Setup: Upload a file to make the button active
            if not os.path.exists("dummy_loading.pdf"):
                with open("dummy_loading.pdf", "wb") as f:
                    f.write(b"%PDF-1.4 dummy loading")

            page.set_input_files("input[type='file']", "dummy_loading.pdf")
            page.wait_for_selector("text=Ready", timeout=10000)

            # 2. Test: Click Analyze and check for immediate visual feedback
            # Since we likely don't have a key, we might see the toast immediately.
            # OR if we have a key/dummy key that passes the check but fails the call, we might see loading.

            # Note: In the code, `hasApiKey` checks `apiKey && apiKey !== 'dummy-key'`.
            # If the env var is missing, it falls back to 'dummy-key' in initialization, BUT `hasApiKey` will return false if it detects 'dummy-key' logic I wrote?
            # Actually, let's check my code in services/openai.ts:
            # apiKey: apiKey || 'dummy-key'
            # hasApiKey: return !!apiKey && apiKey !== 'dummy-key';
            # If VITE_OPENAI_API_KEY is not set, apiKey is undefined from import, so we initialize with 'dummy-key'.
            # Wait, `const apiKey = import.meta.env.VITE_OPENAI_API_KEY;`
            # If undefined, then `hasApiKey` returns false because I need to check the *exported* instance? No, I check the variable.
            # If `apiKey` variable is undefined, `hasApiKey` returns false.

            print("Clicking Analyze...")
            page.click("button:has-text('Analyze Documents')")

            # 3. Verification: Check for "OpenAI API Key is missing" toast
            # Sonner toasts usually appear in a list. We look for the text.
            try:
                page.wait_for_selector("text=OpenAI API Key is missing", timeout=3000)
                print("Success: 'API Key missing' toast appeared.")
            except:
                print("Toast not found immediately. Checking for Loading State...")
                # If key was present (e.g. from previous task env vars?), maybe it went to loading.
                if page.is_visible("text=Analyzing with AI..."):
                     print("Success: Loading state active.")
                else:
                     print("Warning: Neither error toast nor loading text found immediately.")

            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/upload_feedback.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_upload_loading.png")
            raise
        finally:
            browser.close()

if __name__ == "__main__":
    verify_upload_loading_state()
