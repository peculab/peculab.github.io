"""Add FormSubmit bridge responses to public category totals without publishing PII."""
import datetime
import hashlib
import hmac
import json
import os
from pathlib import Path
from urllib.request import urlopen

root = Path(__file__).resolve().parents[1]
api_key = os.environ["FORMSUBMIT_API_KEY"]
hash_key = os.environ["BRIDGE_HASH_KEY"].encode()
with urlopen(f"https://formsubmit.co/api/get-submissions/{api_key}", timeout=30) as response:
    payload = json.load(response)
if not payload.get("success") or not isinstance(payload.get("submissions"), list):
    raise RuntimeError("FormSubmit API did not return submissions")

counts_path = root / "interest-counts.json"
ledger_path = root / "interest-ledger.json"
counts = json.loads(counts_path.read_text(encoding="utf-8"))
ledger = json.loads(ledger_path.read_text(encoding="utf-8"))
seen = set(ledger["seen"])
roles = {"faculty": "faculty", "institution": "institutions", "student": "students", "supporter": "supporters"}
added = 0
for submission in payload["submissions"]:
    data = submission.get("form_data") or {}
    if data.get("initiative") != "Taiwan-Seattle Student Bridge":
        continue
    category = roles.get(data.get("role"))
    if not category or data.get("contact_consent") != "yes":
        continue
    stamp = (submission.get("submitted_at") or {}).get("date", "")
    email = str(data.get("email", "")).strip().casefold()
    if not stamp or not email:
        continue
    fingerprint = hmac.new(hash_key, f"{stamp}|{email}|{category}".encode(), hashlib.sha256).hexdigest()
    if fingerprint in seen:
        continue
    seen.add(fingerprint)
    counts[category] += 1
    added += 1

if added:
    counts["updated"] = datetime.date.today().isoformat()
    counts_path.write_text(json.dumps(counts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ledger_path.write_text(json.dumps({"seen": sorted(seen)}, indent=2) + "\n", encoding="utf-8")
print(f"Added {added} bridge submissions")
