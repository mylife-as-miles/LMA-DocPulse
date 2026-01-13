import os
from playwright.sync_api import sync_playwright

def verify_document_upload_and_view():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Go to the app
            page.goto("http://localhost:3000")
            page.wait_for_timeout(1000)

            # Go to upload
            page.goto("http://localhost:3000/#upload")
            page.wait_for_selector("text=Upload Loan Agreements", timeout=10000)

            # Upload dummy file directly to input
            # The input is covering the button, so we can just set input files
            # The input has opacity 0 but handles the file selection
            page.set_input_files("input[type='file']", "dummy.pdf")

            # Wait for upload simulation to complete (progress bar etc)
            page.wait_for_selector("text=Ready", timeout=15000)

            # Click Analyze
            page.click("button:has-text('Analyze Documents')")

            # Should redirect to Vault (check if "Document Vault" header appears)
            page.wait_for_selector("text=Document Vault", timeout=10000)
            print("Redirected to Vault after upload.")

            # Check if file is in the list
            page.wait_for_selector("text=dummy.pdf", timeout=5000)
            print("File 'dummy.pdf' found in vault.")

            # Click the file to view details
            page.click("text=dummy.pdf")

            # Check for Detail View
            page.wait_for_selector("text=Document Info", timeout=10000)
            print("Detail view loaded.")

            # Verify dummy entities are present
            page.wait_for_selector("text=Alpha Corp", timeout=5000)
            print("Dummy entities found.")

            # Verify Status
            page.wait_for_selector("text=Analyzed", timeout=5000)

            # Screenshot Detail View
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/detail_view.png")
            print("Verification successful.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_upload.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_document_upload_and_view()
