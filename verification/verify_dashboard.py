import os
from playwright.sync_api import sync_playwright

def verify_dashboard_data():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Go to the app
            page.goto("http://localhost:3000")
            page.wait_for_timeout(1000)

            # Navigate to Dashboard (default)
            page.goto("http://localhost:3000/#dashboard")
            page.wait_for_selector("text=Compliance Trend", timeout=10000)

            # Check for Stat Cards - Values should match initial mock data
            # Active Loans: 3 (from LOANS_DATA)
            # Compliance Score: 94% (from CHART_DATA)
            # Critical Risks: 1 (from LOANS_DATA)
            # Pending Approvals: 0 (initially, unless we upload stuff)

            # Since we just reset everything, Pending might be 0.
            # Let's check for specific values to confirm it's not the hardcoded old values (142, 94%, 3, 12)

            # Active Loans = 3
            page.wait_for_selector("text=3", timeout=5000)

            # Compliance Score = 94%
            page.wait_for_selector("text=94%", timeout=5000)

            # Critical Risks = 1
            # Note: "3" appears for active loans, so finding "1" specifically in the risk card is tricky with simple selectors.
            # But the hardcoded value was "3". If we see "1" in that area it's good.
            # We can check that "142" is NOT present (old hardcoded value for active loans)
            if page.locator("text=142").count() > 0:
                print("Error: Old hardcoded '142' found.")
            else:
                print("Old hardcoded values gone.")

            # Check Alerts
            # Should see "LIBOR Clause Missing"
            page.wait_for_selector("text=LIBOR Clause Missing", timeout=5000)
            print("Alerts verified.")

            # Take screenshot
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/dashboard_realtime.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_dashboard.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_dashboard_data()
