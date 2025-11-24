# 📤 Professional Export System

DocBuilder doesn't just generate text; it produces enterprise-ready documents and presentations.

## 📄 DOCX Export

Generates Microsoft Word documents using `python-docx`.

### Features
- **Title Page**: Includes project title and date.
- **Formatting**: Preserves bold, italics, and lists from the web view.
- **Hierarchy**: Uses proper Heading 1, Heading 2 styles for structure.
- **Typography**: Professional Calibri font with optimized line spacing.

## 📊 PPTX Export

Generates PowerPoint presentations using `python-pptx`.

### 4 Professional Themes

1.  **Professional**: Blue/Gray corporate aesthetic. Clean and authoritative.
2.  **Modern**: Vibrant Purple/Green. High contrast and energetic.
3.  **Academic**: Minimalist Black/White. Focus on content and clarity.
4.  **Creative**: Bold Red/Orange. Dynamic and engaging.

### Smart Slide Layout
- **Dynamic Font Sizing**: The system calculates the amount of text on a slide and automatically adjusts the font size (from 14pt to 20pt) to ensure everything fits perfectly.
- **Visual Elements**: Each theme includes custom background colors, accent stripes, and decorative dividers.
- **Slide Numbers**: Automatically added to footers.

## Technical Implementation

See `backend/app/services/export_service.py`.
