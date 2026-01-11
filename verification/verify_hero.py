from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for hero content to be visible
        expect(page.locator("text=Document Intelligence")).to_be_visible()
        expect(page.locator("text=Reimagined")).to_be_visible()

        # Take a screenshot of the hero section
        page.screenshot(path="verification/hero.png", clip={"x": 0, "y": 0, "width": 1280, "height": 800})

        # Scroll to Advanced Feature section
        # We scroll down to find the text we inserted
        target = page.locator("text=Turn unstructured PDFs into")
        target.scroll_into_view_if_needed()
        expect(target).to_be_visible()

        # Take a screenshot of the scanning feature
        # We can take a screenshot of the specific element or the viewport
        page.screenshot(path="verification/advanced_feature.png")

        browser.close()

run()
