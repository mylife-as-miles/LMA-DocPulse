import os
from playwright.sync_api import sync_playwright

def verify_document_vault():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Go to the app
            page.goto("http://localhost:3000")

            # Navigate to vault via hash (wait a bit for app to hydrate)
            page.wait_for_timeout(2000)
            page.goto("http://localhost:3000/#vault")

            # Wait for content
            try:
                page.wait_for_selector("text=Document Vault", timeout=10000)
            except:
                print("Failed to find 'Document Vault' header. Taking screenshot of current state.")
                os.makedirs("verification", exist_ok=True)
                page.screenshot(path="verification/failed_load.png")
                raise

            # Check for empty state
            try:
                page.wait_for_selector("text=No documents found", timeout=5000)
                print("Empty state verified.")
            except:
                print("Empty state not found (maybe docs exist).")

            # Take screenshot of Vault
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/vault_empty.png")

            # Go to upload
            page.goto("http://localhost:3000/#upload")
            page.wait_for_selector("text=Upload Loan Agreements", timeout=10000)
            page.screenshot(path="verification/upload_page.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_document_vault()
