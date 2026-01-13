import os
from playwright.sync_api import sync_playwright

def verify_upload_status():
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

            # Upload "draft" file to trigger "Review" status
            page.set_input_files("input[type='file']", "draft_agreement.pdf")

            # Wait for upload simulation
            page.wait_for_selector("text=Ready", timeout=15000)

            # Click Analyze
            page.click("button:has-text('Analyze Documents')")

            # Should redirect to Vault
            page.wait_for_selector("text=Document Vault", timeout=10000)

            # Check if file is in the list
            page.wait_for_selector("text=draft_agreement.pdf", timeout=5000)

            # Check if status is "REVIEW" (or Review)
            page.wait_for_selector("text=Review", timeout=5000)
            print("Status 'Review' verified in Vault.")

            # Click the file to view details
            page.click("text=draft_agreement.pdf")

            # Check for Detail View
            page.wait_for_selector("text=Document Info", timeout=10000)

            # Verify Status Badge is Orange (Review) - implicitly checked by text presence
            page.wait_for_selector("text=Review", timeout=5000)

            # Check for "Mark as Analyzed" button
            page.wait_for_selector("text=Mark as Analyzed", timeout=5000)
            print("'Mark as Analyzed' button found.")

            # Screenshot Detail View with Review status
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/detail_review_status.png")

            # Click Approve
            page.click("text=Mark as Analyzed")

            # Verify Status changes to "Analyzed"
            page.wait_for_selector("text=Analyzed", timeout=5000)
            print("Status updated to 'Analyzed'.")

            # Verify button is gone
            if page.locator("text=Mark as Analyzed").count() == 0:
                print("Button removed after approval.")

            # Screenshot Detail View with Analyzed status
            page.screenshot(path="verification/detail_analyzed_status.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_status.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_upload_status()
