import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def get_ward_from_room(room):
    try:
        num = int(re.match(r'(\d+)', room).group(1))
        return 'North' if num <= 115 else 'South'
    except:
        return 'North'

def get_skin_day(room):
    days = ['Mon','Tue','Wed','Thu','Fri']
    try:
        num = int(re.match(r'(\d+)', room).group(1))
        return days[(num - 101) % 5]
    except:
        return 'Mon'

def find_patients(text):
    results = []
    i = 0
    while i < len(text):
        idx = text.find('{id:"', i)
        if idx == -1:
            idx = text.find("{id:'", i)
        if idx == -1:
            break
        depth = 0
        j = idx
        while j < len(text):
            if text[j] == '{':
                depth += 1
            elif text[j] == '}':
                depth -= 1
                if depth == 0:
                    results.append((idx, j+1, text[idx:j+1]))
                    break
            j += 1
        i = j + 1 if j > idx else idx + 1
    return results

def transform_patient_obj(p_str):
    rm = re.search(r'room:"([^"]+)"', p_str)
    room = rm.group(1) if rm else '101A'
    ward = get_ward_from_room(room)
    skin_day = get_skin_day(room)
    
    # Remove old fields
    p_str = re.sub(r',?\bfsbsCount\b\s*:\s*\d+', '', p_str)
    
    new_fields = []
    if not re.search(r'\bward\s*:', p_str):
        new_fields.append(f'ward:"{ward}"')
    if not re.search(r'\bskinDueDay\s*:', p_str):
        new_fields.append(f'skinDueDay:"{skin_day}"')
    if not re.search(r'\bvitalsFreqMode\s*:', p_str):
        vf = re.search(r'vitalsFreq:"([^"]*)"', p_str)
        old_freq = vf.group(1) if vf else ''
        low = old_freq.lower()
        if old_freq:
            if low in ['daily','d']:
                vfm = 'daily'; vfc = ''; vfd = 'Daily'
            elif low in ['weekly','w']:
                vfm = 'weekly'; vfc = ''; vfd = 'Weekly'
            elif low in ['monthly','m']:
                vfm = 'monthly'; vfc = ''; vfd = 'Monthly'
            elif low in ['prn']:
                vfm = 'prn'; vfc = ''; vfd = 'PRN'
            elif low in ['q4h','q6h','q8h','q12h','qshift','q2h']:
                vfm = 'daily'; vfc = ''; vfd = old_freq
            else:
                vfm = 'other'; vfc = old_freq; vfd = old_freq
        else:
            vfm = 'none'; vfc = ''; vfd = ''
        new_fields.append(f'vitalsFreqMode:"{vfm}",vitalsFreqCustom:"{vfc}",vitalsFreqDisplay:"{vfd}"')
    if not re.search(r'\bfsbsOrdered\b\s*:', p_str):
        has_fsbs = re.search(r'fsbsCount:(\d+)', p_str)
        ordered = 'true' if (has_fsbs and int(has_fsbs.group(1)) > 0) else 'false'
        new_fields.append(f'fsbsOrdered:{ordered}')
    if not re.search(r'\bcnaTasks\b\s*:', p_str):
        new_fields.append('cnaTasks:[]')
    
    if new_fields:
        p_str = p_str.rstrip()
        if p_str.endswith('}'):
            p_str = p_str[:-1].rstrip(',') + ',' + ','.join(new_fields) + '}'
    
    return p_str

patients = find_patients(content)
print(f'Found {len(patients)} patient objects')

modified_count = 0
for start, end, p_text in reversed(patients):
    new_p = transform_patient_obj(p_text)
    if new_p != p_text:
        content = content[:start] + new_p + content[end:]
        modified_count += 1

print(f'Modified {modified_count} patient objects')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Saved!')

# Verify: count new fields
print(f'ward: {content.count("ward:")}')
print(f'skinDueDay: {content.count("skinDueDay:")}')
print(f'vitalsFreqMode: {content.count("vitalsFreqMode:")}')
print(f'fsbsOrdered: {content.count("fsbsOrdered:")}')
print(f'cnaTasks: {content.count("cnaTasks:")}')
