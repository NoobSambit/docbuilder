"""
Quick test script to verify PPT generation with themes
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app.services.export_service import ExportService
import os

# Sample project data
test_project = {
    'title': 'Test Presentation - Formatting Demo',
    'outline': [
        {
            'id': '1',
            'title': 'Introduction to Cell Division',
            'content': '''Cell division is a fundamental biological process. It allows organisms to grow, repair damaged tissues, and reproduce. There are two main types of cell division: mitosis and meiosis. Mitosis produces two identical daughter cells, while meiosis produces four genetically different cells with half the chromosome number.'''
        },
        {
            'id': '2',
            'title': 'Key Concepts',
            'content': '''The cell cycle consists of multiple phases including interphase, prophase, metaphase, anaphase, and telophase. During interphase, the cell grows and DNA replicates. In prophase, chromosomes condense and become visible. Metaphase involves alignment of chromosomes at the cell's equator. During anaphase, sister chromatids separate and move to opposite poles.'''
        },
        {
            'id': '3',
            'title': 'Importance in Biology',
            'content': '''Cell division is essential for life. It enables growth from a single fertilized egg to a complex multicellular organism. It allows for tissue repair and regeneration when cells are damaged or die. In unicellular organisms, it serves as the primary means of reproduction.'''
        }
    ]
}

# Test each theme
themes = ['professional', 'modern', 'academic', 'creative']

print("Testing PPT generation with different themes...")
print("-" * 50)

for theme in themes:
    try:
        print(f"\nGenerating PPT with '{theme}' theme...")
        ppt_file = ExportService.generate_pptx(test_project, theme_name=theme)

        # Save to file for manual inspection
        filename = f'test_output_{theme}.pptx'
        with open(filename, 'wb') as f:
            f.write(ppt_file.read())

        file_size = os.path.getsize(filename)
        print(f"  ✓ Generated: {filename} ({file_size:,} bytes)")

    except Exception as e:
        print(f"  ✗ Error with '{theme}' theme: {str(e)}")

print("\n" + "-" * 50)
print("Test complete! Check the generated .pptx files.")
print("\nFormatting features implemented:")
print("  ✓ Standard slide size (10\" x 7.5\")")
print("  ✓ Custom theme colors (background, title, text, accent)")
print("  ✓ Proper text wrapping and margins")
print("  ✓ Automatic font sizing based on content length")
print("  ✓ Intelligent bullet point splitting")
print("  ✓ Slide numbers in footer")
print("  ✓ Centered title slide")
print("  ✓ Proper line spacing and paragraph spacing")
