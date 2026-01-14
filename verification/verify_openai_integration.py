import os
from playwright.sync_api import sync_playwright

def verify_openai_integration_ui():
    """
    Since we don't have a real API key in this environment, this test verifies
    that the UI elements for the OpenAI integration are present and interactable,
    and that the application handles the 'missing key' or 'error' state gracefully
    without crashing.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to Smart Query View...")
            page.goto("http://localhost:3000/#smart_query")
            page.wait_for_selector("text=What would you like to know?", timeout=10000)

            # Check for the new GPT-5 badge or similar text
            # (In the code, I changed the button text to GPT-5)
            if page.is_visible("text=GPT-5"):
                print("GPT-5 model indicator found.")
            else:
                print("Warning: GPT-5 indicator not found.")

            print("Testing Chat Interaction...")
            # Type a query
            page.fill("textarea", "Show me all high risk loans")

            # Click Analyze
            page.click("button:has-text('Analyze')")

            # Since we likely don't have a valid key, we expect a result (error message or actual result)
            # The code sets result to an error message on failure.
            try:
                # Wait for result container or error message
                # The result is rendered in a div with "Result" header
                page.wait_for_selector("text=Result", timeout=15000)
                print("Result container appeared.")

                # Check for content
                content_found = page.locator("div.prose").inner_text()
                print(f"Result content: {content_found[:100]}...")

                os.makedirs("verification", exist_ok=True)
                page.screenshot(path="verification/smart_query_result.png")

            except Exception as e:
                print("Timed out waiting for result - potentially slow API or unhandled error.")
                page.screenshot(path="verification/smart_query_timeout.png")
                raise e

            print("Navigating to Upload View for Analysis Verification...")
            page.goto("http://localhost:3000/#upload")

            # Upload a file again to check if the new async logic holds up
            if not os.path.exists("dummy_analysis.pdf"):
                with open("dummy_analysis.pdf", "wb") as f:
                    f.write(b"%PDF-1.4 dummy analysis")

            page.set_input_files("input[type='file']", "dummy_analysis.pdf")
            page.wait_for_selector("text=Ready", timeout=10000)

            # Click Analyze
            page.click("button:has-text('Analyze Documents')")

            # Should redirect to Vault eventually
            # It might take longer now due to the API call timeout if key is invalid
            page.wait_for_selector("text=Document Vault", timeout=30000)
            print("Redirected to Vault after OpenAI-backed analysis attempt.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_openai_integration.png")
            raise
        finally:
            browser.close()

if __name__ == "__main__":
    verify_openai_integration_ui()
