from playwright.sync_api import sync_playwright, expect

def verify_landing_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Landing Page (default route)
        page.goto("http://localhost:3000/#landing")

        # 1. Hero Section
        expect(page.get_by_text("Document Intelligence")).to_be_visible()
        expect(page.get_by_text("New: AI-Powered Smart Extraction 2.0")).to_be_visible()
        page.screenshot(path="verification/landing_hero.png")
        print("Hero section verified.")

        # 2. Marquee
        expect(page.get_by_text("Goldman Sachs").first).to_be_visible()
        page.screenshot(path="verification/landing_marquee.png")
        print("Marquee section verified.")

        # 3. Features Section (Scroll to it)
        page.evaluate("window.scrollTo(0, 1000)")
        expect(page.get_by_text("Built for the Modern Deal Team")).to_be_visible()
        expect(page.get_by_text("Instant Extraction")).to_be_visible()
        page.screenshot(path="verification/landing_features.png")
        print("Features section verified.")

        # 4. CTA Section
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        expect(page.get_by_text("Ready to automate your")).to_be_visible()
        page.screenshot(path="verification/landing_cta.png")
        print("CTA section verified.")

        browser.close()

if __name__ == "__main__":
    verify_landing_page()
