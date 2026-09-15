"""Count new FormSubmit interest in one public aggregate JSON file; never save PII."""
import datetime as dt
import json
import os
from pathlib import Path
from urllib.request import urlopen

count_file = Path(__file__).resolve().parents[1] / "interest-counts.json"
counts = json.loads(count_file.read_text(encoding="utf-8"))
cutoff = counts.get("last_processed_at") or ""
roles = {"faculty": "faculty", "institution": "institutions", "student": "students", "supporter": "supporters"}

with urlopen(f"https://formsubmit.co/api/get-submissions/{os.environ['FORMSUBMIT_API_KEY']}", timeout=30) as response:
    archive = json.load(response)
if not archive.get("success") or not isinstance(archive.get("submissions"), list):
    raise RuntimeError("FormSubmit API returned no submission archive")

# The archive is private and stays in this job's memory. The repository receives totals only.
bridge = []
for item in archive["submissions"]:
    fields = item.get("form_data") or {}
    if fields.get("initiative") != "Taiwan-Seattle Student Bridge":
        continue
    stamp = (item.get("submitted_at") or {}).get("date") or ""
    if not stamp:
        continue
    bridge.append((stamp, fields))
bridge.sort(key=lambda entry: entry[0])

seen_in_archive = set()
new_cutoff = cutoff
added = 0
for stamp, fields in bridge:
    new_cutoff = max(new_cutoff, stamp)
    role = fields.get("role")
    email = str(fields.get("email") or "").strip().casefold()
    interest = str(fields.get("interest") or "").strip().casefold()
    valid = role in roles and email and fields.get("contact_consent") == "yes" and interest not in {"test", "測試"}
    if not valid:
        continue
    if stamp > cutoff and email not in seen_in_archive:
        counts[roles[role]] += 1
        added += 1
    seen_in_archive.add(email)

if new_cutoff != cutoff:
    counts["last_processed_at"] = new_cutoff
    if added:
        counts["updated"] = dt.date.today().isoformat()
    count_file.write_text(json.dumps(counts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Added {added} new interest entries to the COUNT file")
