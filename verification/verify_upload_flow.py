import os
from playwright.sync_api import sync_playwright

def verify_upload_creates_loan():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to Dashboard...")
            page.goto("http://localhost:3000/#dashboard")
            page.wait_for_selector("text=Active Loans", timeout=10000)

            # Check for initial value '6' (assuming mock data is loaded)
            # Depending on how StatCard is rendered, '6' might be its own element or part of text.
            # We look for a specific element that contains '6' inside the stats grid.
            # Using specific locator might be safer if there are other '6's.
            # But for now, assuming standard mock data startup.
            if page.is_visible("text=6"):
                print("Initial Active Loans count confirmed as 6.")
            else:
                print("Warning: Initial count 6 not found, might be different or loading slow.")

            print("Navigating to Upload...")
            page.goto("http://localhost:3000/#upload")
            page.wait_for_selector("text=Upload Loan Agreements", timeout=10000)

            print("Uploading file...")
            # Ensure dummy.pdf exists or use one from repo
            if not os.path.exists("dummy.pdf"):
                with open("dummy.pdf", "wb") as f:
                    f.write(b"%PDF-1.4 empty pdf")

            page.set_input_files("input[type='file']", "dummy.pdf")
            page.wait_for_selector("text=Ready", timeout=15000)

            print("Analyzing...")
            page.click("button:has-text('Analyze Documents')")

            # Wait for redirect to Vault
            page.wait_for_selector("text=Document Vault", timeout=10000)
            print("Redirected to Vault.")

            print("Navigating back to Dashboard...")
            page.goto("http://localhost:3000/#dashboard")
            page.wait_for_selector("text=Active Loans", timeout=10000)

            # Verify count increased to 7
            # We look for '7' now.
            try:
                page.wait_for_selector("text=7", timeout=10000)
                print("Success: Active Loans count increased to 7.")
            except:
                print("Failure: Active Loans count did not increase to 7.")
                raise

            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/dashboard_after_upload.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_upload_flow.png")
            raise
        finally:
            browser.close()

if __name__ == "__main__":
    verify_upload_creates_loan()
