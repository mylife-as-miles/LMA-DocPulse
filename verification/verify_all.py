import os
from playwright.sync_api import sync_playwright

def verify_all_views_realtime():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Dashboard
            page.goto("http://localhost:3000/#dashboard")
            page.wait_for_selector("text=Compliance Score", timeout=10000)
            print("Dashboard loaded.")

            # Check for real data (no hardcoded old values)
            # The mocked real data has score 94%
            page.wait_for_selector("text=94%", timeout=5000)

            # Screenshot Dashboard
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/dashboard_final.png")

            # 2. Portfolio Analytics
            page.goto("http://localhost:3000/#analytics")
            page.wait_for_selector("text=Portfolio Analytics", timeout=10000)

            # Check for aggregated values (Total Exposure)
            # Sum of all loans in mockData ~ 12.5+4.2+25+3.2+12.25+1.1 = ~58.25M
            # The parser logic handles M/K/B.
            # 12.5M + 4.2M + 25.0M + 3.2M + 12.25M + 1.1M = 58.25M
            page.wait_for_selector("text=$58.3M", timeout=5000)
            print("Analytics loaded and calculated correctly.")
            page.screenshot(path="verification/analytics_final.png")

            # 3. Compliance
            page.goto("http://localhost:3000/#compliance")
            page.wait_for_selector("text=Compliance & Risk", timeout=10000)

            # Check Score again
            page.wait_for_selector("text=94%", timeout=5000)
            # Check Critical Issues (from Loans and Alerts)
            # Loans: 1 Critical (#LN-884-X)
            # Alerts: 1 Critical (LIBOR)
            # Total = 2
            page.wait_for_selector("text=2", timeout=5000)
            print("Compliance loaded and calculated correctly.")
            page.screenshot(path="verification/compliance_final.png")

            # 4. Loan Reviews List
            page.goto("http://localhost:3000/#loan_reviews")
            page.wait_for_selector("text=Loan Reviews", timeout=10000)

            # Check for specific loan
            page.wait_for_selector("text=Omega Holdings", timeout=5000)
            print("Loan List loaded.")
            page.screenshot(path="verification/loan_list_final.png")

            # 5. Loan Review Detail
            page.click("text=Omega Holdings")
            page.wait_for_selector("text=Facility Details", timeout=10000)
            page.wait_for_selector("text=Term Loan A", timeout=5000)
            print("Loan Detail loaded.")
            page.screenshot(path="verification/loan_detail_final.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_final.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_all_views_realtime()
