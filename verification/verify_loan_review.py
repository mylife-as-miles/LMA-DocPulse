from playwright.sync_api import sync_playwright, expect

def verify_loan_review():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Loan Review
        page.goto("http://localhost:3000/#loan_review")

        # 1. Summary Section (Default)
        expect(page.get_by_text("Loan Agreement #10294")).to_be_visible()
        # Verify specific summary element
        expect(page.get_by_text("AI Confidence")).to_be_visible()
        page.screenshot(path="verification/loan_review_summary.png")
        print("Summary section verified.")

        # 2. Borrower Details
        page.get_by_text("Borrower Details", exact=True).click()
        # Wait for content
        expect(page.get_by_text("Entity Name")).to_be_visible()
        page.screenshot(path="verification/loan_review_borrower.png")
        print("Borrower Details section verified.")

        # 3. Financial Covenants
        page.get_by_text("Financial Covenants", exact=True).click()
        # Wait for content
        expect(page.get_by_text("Interest Cover Ratio")).to_be_visible()
        page.screenshot(path="verification/loan_review_covenants.png")
        print("Financial Covenants section verified.")

        # 4. Events of Default
        page.get_by_text("Events of Default", exact=True).click()
        # Wait for content
        expect(page.get_by_text("Non-Payment")).to_be_visible()
        # Verify a new specific element from the new code
        expect(page.get_by_text("Grace Period")).to_be_visible()
        page.screenshot(path="verification/loan_review_defaults.png")
        print("Events of Default section verified.")

        # 5. Signatures
        page.get_by_text("Signatures", exact=True).click()
        # Wait for content
        expect(page.get_by_text("The Borrower")).to_be_visible()
        # Verify signature status
        expect(page.get_by_text("Signed").first).to_be_visible()
        page.screenshot(path="verification/loan_review_signatures.png")
        print("Signatures section verified.")

        browser.close()

if __name__ == "__main__":
    verify_loan_review()
