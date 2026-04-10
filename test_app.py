import os
import http.server
import threading
import pytest
import socket
from filelock import FileLock
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# --- Configuration ---
PORT = 8000
BASE_URL = f"http://localhost:{PORT}"

# --- Setup Local Server ---
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return 

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def start_server():
    # Final check to prevent race conditions within the thread
    if not is_port_in_use(PORT):
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        server = http.server.HTTPServer(('localhost', PORT), QuietHandler)
        server.serve_forever()

@pytest.fixture(scope="session", autouse=True)
def manage_server(tmp_path_factory):
    """Ensures only one server starts across multiple xdist workers."""
    # Use a file lock in a temporary directory shared by all workers
    root_tmp_dir = tmp_path_factory.getbasetemp().parent
    lock_path = root_tmp_dir / "server.lock"
    
    with FileLock(str(lock_path)):
        if not is_port_in_use(PORT):
            thread = threading.Thread(target=start_server, daemon=True)
            thread.start()
            # Wait for port to open
            import time
            for _ in range(10):
                if is_port_in_use(PORT): break
                time.sleep(0.5)
# --- Selenium Fixture ---
@pytest.fixture
def driver():
    """Sets up a fresh headless Chrome browser for each test."""
    options = Options()
    options.add_argument("--headless=new") 
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    yield driver
    driver.quit()

# --- Helper Functions ---
def wait_for_page_fade_in(driver):
    """Wait for script.js to set body opacity to 1 so .text isn't empty."""
    wait = WebDriverWait(driver, 10)
    wait.until(lambda d: d.find_element(By.TAG_NAME, "body").value_of_css_property("opacity") == "1")
# --- Test Cases ---

def test_homepage_loads(driver):
    driver.get(f"{BASE_URL}/index.html")
    wait_for_page_fade_in(driver)
    assert "Play Sphere" in driver.title

def test_navigation_menu_items(driver):
    driver.get(f"{BASE_URL}/index.html")
    wait = WebDriverWait(driver, 10)
    wait_for_page_fade_in(driver)
    
    # Use visibility_of_all_elements_located to ensure text is accessible
    nav_links = wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "nav ul li a")))
    link_texts = [link.text for link in nav_links]
    
    expected = ["Home", "Packages", "How it Works", "Hygiene", "Contact"]
    for item in expected:
        assert item in link_texts

def test_package_pricing_display(driver):
    """Confirm the pricing from the HTML matches the brand intent."""
    driver.get(f"{BASE_URL}/index.html")
    wait = WebDriverWait(driver, 10)
    wait_for_page_fade_in(driver)
    
    # 1. Use PRESENCE instead of VISIBILITY. 
    # The element is in the HTML, it's just opacity: 0 because it's off-screen.
    card_xpath = "//div[contains(@class, 'category-card')][h3[contains(text(), 'Royal Carnival Pack')]]"
    royal_card = wait.until(EC.presence_of_element_located((By.XPATH, card_xpath)))
    
    # 2. Scroll the page to the card. 
    # This proves the page can scroll and triggers your script.js IntersectionObserver!
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'instant', block: 'center'});", royal_card)
    
    # 3. Locate the price element
    price_element = royal_card.find_element(By.CLASS_NAME, "price")
    
    # 4. Use get_attribute("textContent") instead of .text
    # Selenium's .text returns an empty string if CSS opacity is 0 or if the transition is still animating.
    # textContent reads the raw text directly from the HTML instantly.
    price_text = price_element.get_attribute("textContent")
    
    assert "17,999" in price_text

def test_hygiene_section_content(driver):
    """Verify the 'Triple-Layer' promise details are visible."""
    driver.get(f"{BASE_URL}/index.html")
    wait = WebDriverWait(driver, 10)
    
    hygiene_title = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "#hygiene .section-title")))
    assert "Triple-Layer Hygiene Promise" in hygiene_title.text

def test_whatsapp_integration(driver):
    driver.get(f"{BASE_URL}/index.html")
    wait = WebDriverWait(driver, 10)
    wa_button = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "whatsapp-float")))
    assert "916362905095" in wa_button.get_attribute("href")

def test_javascript_loading(driver):
    """Verify script.js logic (opacity change) is applied correctly."""
    driver.get(f"{BASE_URL}/index.html")
    wait = WebDriverWait(driver, 10)
    
    # Instead of time.sleep(1), wait until the opacity actually becomes 1
    # This handles the 100ms timeout in your script.js dynamically
    wait.until(lambda d: d.find_element(By.TAG_NAME, "body").value_of_css_property("opacity") == "1")
    
    body = driver.find_element(By.TAG_NAME, "body")
    assert body.value_of_css_property("opacity") == "1"

def test_package_details_button_centering(driver):
    """Verify the Book via WhatsApp button on package-details.html is centered."""
    driver.get(f"{BASE_URL}/package-details.html?id=1")
    wait = WebDriverWait(driver, 10)
    wait_for_page_fade_in(driver)
    
    booking_box = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "booking-box")))
    assert booking_box.value_of_css_property("text-align") == "center"