
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Wait for server to start
    page.goto("http://localhost:3000")

    # Check Dashboard
    page.wait_for_selector('text=Dashboard')
    page.screenshot(path="verification/dashboard.png")

    # Navigate to Filters (assuming wire up works)
    page.goto("http://localhost:3000/#filter")
    page.wait_for_selector('text=Advanced Filters')
    page.screenshot(path="verification/filter.png")

    # Navigate to Document Detail
    page.goto("http://localhost:3000/#document_detail")
    page.wait_for_selector('text=Document Info')
    page.screenshot(path="verification/document_detail.png")

    # Navigate to Edit Profile
    page.goto("http://localhost:3000/#edit_profile")
    page.wait_for_selector('text=Edit Profile')
    page.screenshot(path="verification/edit_profile.png")

    # Navigate to Alerts Log
    page.goto("http://localhost:3000/#alerts_log")
    page.wait_for_selector('text=System Alerts Log')
    page.screenshot(path="verification/alerts_log.png")

    # Navigate to Activity Log
    page.goto("http://localhost:3000/#activity_log")
    page.wait_for_selector('text=Activity Log')
    page.screenshot(path="verification/activity_log.png")

    # Navigate to Violations Log
    page.goto("http://localhost:3000/#violations_log")
    page.wait_for_selector('text=Compliance Violations')
    page.screenshot(path="verification/violations_log.png")

    # Navigate to Public Profile
    page.goto("http://localhost:3000/#public_profile")
    page.wait_for_selector('text=Connect')
    page.screenshot(path="verification/public_profile.png")

    # Navigate to Analytics Result
    page.goto("http://localhost:3000/#analytics_result")
    page.wait_for_selector('text=Query Analysis')
    page.screenshot(path="verification/analytics_result.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
