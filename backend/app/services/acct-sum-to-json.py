import pdfplumber
import json
import re
from datetime import datetime

def parse_periods_from_header(line):
    """
    Extract date ranges and return structured period information.
    Example: '7/01/2024 - 6/30/2025  7/01/2025 - Current' 
    Returns: [
        {"label": "2024_2025", "start": "2024-07-01", "end": "2025-06-30"},
        {"label": "2025_Current", "start": "2025-07-01", "end": null}
    ]
    """
    periods = []
    matches = re.findall(
        r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\s*[-–]\s*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|Current))",
        line
    )
    
    for m in matches:
        # Extract start date
        start_match = re.search(r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})', m)
        
        period_info = {}
        
        if start_match:
            month, day, year = start_match.groups()
            period_info["start"] = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        
        # Check if it ends with 'Current'
        if 'Current' in m:
            period_info["end"] = None
            period_info["label"] = f"{year}_Current" if start_match else "period_Current"
        else:
            # Extract end date
            end_match = re.search(r'[-–]\s*(\d{1,2})[/-](\d{1,2})[/-](\d{4})', m)
            if end_match:
                end_month, end_day, end_year = end_match.groups()
                period_info["end"] = f"{end_year}-{end_month.zfill(2)}-{end_day.zfill(2)}"
                period_info["label"] = f"{year}_{end_year}" if start_match else "period"
        
        periods.append(period_info)
    
    return periods if len(periods) == 2 else [
        {"label": "period_1", "start": None, "end": None},
        {"label": "period_2", "start": None, "end": None}
    ]

def parse_financial_line(line):
    """
    Parses lines like: '5000 Supplies $ - $ -'
    Returns code, description, and two values.
    """
    line = re.sub(r'\s{2,}', ' ', line.strip())
    num_pat_str = r"(\$?\(?-?\d[\d,]*\.?\d*\)?|-)"
    
    m = re.match(fr'^(\d{{4}})\s+(.*?)\s+{num_pat_str}\s+{num_pat_str}\s*$', line)
    
    if not m:
        parts = line.split()
        if len(parts) >= 4 and parts[0].isdigit() and len(parts[0]) == 4:
            code = parts[0]
            val2 = parts.pop()
            val1 = parts.pop()
            desc = " ".join(parts[1:])
        else:
            return None
    else:
        code, desc, val1, val2 = m.groups()

    # Clean values
    val1 = val1.replace("(", "").replace(")", "").replace("$", "").strip()
    val2 = val2.replace("(", "").replace(")", "").replace("$", "").strip()
    
    # Convert "-" to "0" for numeric fields
    val1 = "0" if val1 == "-" else val1
    val2 = "0" if val2 == "-" else val2
    
    return {
        "code": code.strip(),
        "description": desc.replace("(", "").replace(")", "").replace("$", "").strip(),
        "value_period_1": val1,
        "value_period_2": val2
    }


def extract_financial_summary(pdf_path, json_path="financial_summary_split.json"):
    """
    Extract financial data and prepare it for two separate tables.
    """
    periods = [{"label": "period_1", "start": None, "end": None},
               {"label": "period_2", "start": None, "end": None}]
    
    period_1_data = {"Revenue": [], "Expenditures": []}
    period_2_data = {"Revenue": [], "Expenditures": []}
    
    revenue_first_parsed = False
    section = None
    dates_parsed = False

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            lines = text.split("\n")

            # Parse date periods once
            if not dates_parsed:
                date_header_line = next((
                    l for l in lines if re.search(r"\d{1,2}/\d{1,2}/\d{4}\s*-\s*\d{1,2}/\d{1,2}/\d{4}", l)
                ), None)
                
                if date_header_line:
                    periods = parse_periods_from_header(date_header_line)
                    print(f"Found periods: {[p['label'] for p in periods]}")
                    dates_parsed = True

            for line in lines:
                line = line.strip()

                if "Transfer to Next Year" in line:
                    break

                # Detect sections
                if re.match(r"^Revenue$", line, re.IGNORECASE):
                    section = "Revenue"
                    continue
                elif re.match(r"^Expenditures$", line, re.IGNORECASE):
                    section = "Expenditures"
                    continue
                
                # Handle first revenue line specially
                line_norm = re.sub(r'\s{2,}', ' ', line.strip())
                if section == "Revenue" and not revenue_first_parsed:
                    mcode = re.match(r'^(\d{4})\s+(.*)$', line_norm)
                    if mcode:
                        code, rest = mcode.groups()
                        num_pat = re.compile(r'(\$?\(?-?\d[\d,]*\.?\d*\)?|-)')
                        nums = num_pat.findall(rest)

                        if len(nums) >= 2:
                            v1, v2 = nums[-2], nums[-1]
                            cut = rest.rfind(v1)
                            desc = rest[:cut].strip()
                            
                            v1 = "0" if v1.strip() == "-" else v1.strip()
                            v2 = "0" if v2.strip() == "-" else v2.strip()

                            parsed = {
                                "code": code.strip(),
                                "description": desc,
                                "value_period_1": v1,
                                "value_period_2": v2
                            }
                            
                            # Split into two tables
                            period_1_data[section].append({
                                "code": parsed["code"],
                                "description": parsed["description"],
                                "value": parsed["value_period_1"]
                            })
                            period_2_data[section].append({
                                "code": parsed["code"],
                                "description": parsed["description"],
                                "value": parsed["value_period_2"]
                            })
                            
                            revenue_first_parsed = True
                            continue

                if not section or not re.search(r"\d{4}", line):
                    continue

                parsed = parse_financial_line(line)
                if parsed:
                    # Add to period 1 table
                    period_1_data[section].append({
                        "code": parsed["code"],
                        "description": parsed["description"],
                        "value": parsed["value_period_1"]
                    })
                    # Add to period 2 table
                    period_2_data[section].append({
                        "code": parsed["code"],
                        "description": parsed["description"],
                        "value": parsed["value_period_2"]
                    })

    # Save as two separate table structures
    output = {
        "period_1": {
            "period_info": periods[0],
            "data": period_1_data
        },
        "period_2": {
            "period_info": periods[1],
            "data": period_2_data
        }
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)

    print(f"Extracted data for two separate tables saved to {json_path}")
    print(f"   Period 1: {periods[0]['label']} ({periods[0]['start']} to {periods[0]['end']})")
    print(f"   Period 2: {periods[1]['label']} ({periods[1]['start']} to {periods[1]['end'] or 'Current'})")

if __name__ == "__main__":
    extract_financial_summary("financial_report.pdf")