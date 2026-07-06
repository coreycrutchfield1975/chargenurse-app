import re, subprocess, sys

with open('C:/Users/corey/chargenurse-app/styles.css','r') as f: css=f.read()
result = subprocess.run(['git','show','HEAD:index.html'],capture_output=True,text=True,cwd='C:/Users/corey/chargenurse-app')
html = result.stdout

body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body_content = body_match.group(1) if body_match else ''
body_content = re.sub(r'<script>.*?</script>', '', body_content, flags=re.DOTALL)
body_content = re.sub(r'<link rel="stylesheet"[^>]*>', '', body_content)

script_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js = script_match.group(1) if script_match else ''

output = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Charge RN Workstation</title>\n<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏥</text></svg>">\n<style>\n' + css + '\n</style>\n</head>\n<body class="theme-clinical">\n' + body_content + '\n<script>\n' + js + '\n</script>\n</body>\n</html>'

with open('C:/Users/corey/chargenurse-app/charge-rn.html','w', encoding='utf-8') as f:
    f.write(output)

print(f"Written {len(output)} bytes to charge-rn.html")
sys.stdout.flush()
