---
name: PDF processing in this workspace
description: PyMuPDF may require an isolated uv-managed environment for visual PDF processing.
---

The system Python is externally managed and may not include pip, so installing PyMuPDF globally can fail.

**Why:** The workspace's Nix-managed interpreter prevents direct package writes.

**How to apply:** Use `uv venv` plus `uv pip install --python <venv>/bin/python pymupdf`, then run the rendering script with that interpreter.