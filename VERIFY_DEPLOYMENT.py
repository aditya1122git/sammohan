import urllib.request
import urllib.error
import json
import os

BASE_URL = 'http://localhost:5000'
results = []

def test(name, func):
    try:
        func()
        results.append((name, True, "PASSED"))
        print(f"PASS: {name}")
    except Exception as e:
        results.append((name, False, str(e)))
        print(f"FAIL: {name} -> {e}")

# 1. Health check
def test_health():
    req = urllib.request.urlopen(f'{BASE_URL}/api/health', timeout=5)
    data = json.loads(req.read().decode('utf-8'))
    assert req.status == 200
    assert data.get('status') == 'ONLINE'
    assert 'Bihar' in data.get('system', '')
test("Health Endpoint Online", test_health)

# 1B. Project Tracking Stats & API
def test_projects_api():
    req = urllib.request.urlopen(f'{BASE_URL}/api/projects/stats', timeout=5)
    data = json.loads(req.read().decode('utf-8'))
    assert req.status == 200
    assert data.get('success') is True
    assert data.get('stats', {}).get('totalAnnouncements') >= 0
test("Announcement & Project Tracking Stats API", test_projects_api)

# 2. Security Headers
def test_security_headers():
    req = urllib.request.urlopen(f'{BASE_URL}/api/health', timeout=5)
    headers = {k.lower(): v for k, v in req.headers.items()}
    assert headers.get('x-content-type-options') == 'nosniff', "Missing X-Content-Type-Options"
    assert headers.get('x-frame-options') == 'DENY', "Missing X-Frame-Options"
    assert 'referrer-policy' in headers, "Missing Referrer-Policy"
test("HTTP Security Hardening Headers", test_security_headers)

# 3. Auth Failure on Bad Credentials
def test_auth_invalid():
    url = f'{BASE_URL}/api/auth/login'
    payload = json.dumps({'identifier': 'admin@assembly.bihar.gov.or', 'password': 'wrongpassword123'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        urllib.request.urlopen(req, timeout=5)
        assert False, "Should have failed with 401"
    except urllib.error.HTTPError as e:
        assert e.code in (400, 401), f"Expected 401/400 but got {e.code}"
test("Authentication Protection Against Invalid Credentials", test_auth_invalid)

# 4. CAPTCHA endpoint
def test_captcha():
    req = urllib.request.urlopen(f'{BASE_URL}/api/auth/captcha', timeout=5)
    data = json.loads(req.read().decode('utf-8'))
    assert req.status == 200
    assert 'captchaId' in data
    assert 'svgDataUrl' in data
test("Anti-Bot CAPTCHA Verification Endpoint", test_captcha)

# 5. Protected Endpoint Blocks Unauthenticated Requests
def test_unauth_protection():
    try:
        urllib.request.urlopen(f'{BASE_URL}/api/applications', timeout=5)
        assert False, "Should have blocked unauthenticated request"
    except urllib.error.HTTPError as e:
        assert e.code in (401, 403), f"Expected 401/403 but got {e.code}"
test("RBAC - Unauthenticated Request Blocking", test_unauth_protection)

# 6. Static Slide Assets Delivery
def test_slides():
    for slide in ['Slide1.webp', 'Slide2.webp', 'Slide3.webp', 'Slide4.webp']:
        req = urllib.request.urlopen(f'{BASE_URL}/assets/Web_Images/{slide}', timeout=5)
        assert req.status == 200
        assert req.length > 50000, f"{slide} size is unusually small"
test("HeroSlider & LoginSlider Unique WebP Assets Delivery", test_slides)

# 7. Official Logos Delivery
def test_logos():
    for logo in ['Govt_of_Bihar_Logo.png', 'NIC-Logo.png', 'favicon.ico']:
        req = urllib.request.urlopen(f'{BASE_URL}/assets/Web_Images/{logo}', timeout=5)
        assert req.status == 200
        assert req.length > 1000
test("Government Logos & Favicon Delivery", test_logos)

# 8. Single Page App Root Serves Index.html
def test_spa_root():
    req = urllib.request.urlopen(f'{BASE_URL}/', timeout=5)
    html = req.read().decode('utf-8')
    assert req.status == 200
    assert '<div id="root">' in html or 'Sammohan' in html or '<title>' in html
test("Single Page Application (SPA) Root Routing", test_spa_root)

# 9. Path Traversal Protection
def test_path_traversal():
    try:
        urllib.request.urlopen(f'{BASE_URL}/api/documents/..%2f..%2fpasswd', timeout=5)
        assert False, "Should have returned 404"
    except urllib.error.HTTPError as e:
        assert e.code in (400, 401, 403, 404), f"Got code {e.code}"
test("Path Traversal Security Defense", test_path_traversal)

print("\n" + "="*50)
print(f"Total Tests Run: {len(results)}")
passed = sum(1 for _, s, _ in results if s)
print(f"Passed: {passed}/{len(results)}")
print("="*50)
if passed == len(results):
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
else:
    exit(1)
