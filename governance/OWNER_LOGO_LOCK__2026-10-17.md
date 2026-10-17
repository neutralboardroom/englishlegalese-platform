# EnglishLegalese.com — Owner Logo Lock

**Rule ID:** EL-RGR-019  
**Owner:** Roger Gillman  
**Date:** 2026-10-17  
**Status:** ACTIVE · PERMANENT UNTIL OWNER EXPLICITLY UNLOCKS  
**Authority:** Direct owner instruction; higher than ordinary builder choices.

## Exact owner instruction
Roger approved the current EnglishLegalese logo and instructed that it be locked against future drift while still being displayed at an appropriate size.

## Protected asset
- Repository path: `assets/englishlegalese-logo.png`
- Protected predecessor blob SHA: `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`

## Rule
The protected EnglishLegalese logo artwork may not be replaced, regenerated, redrawn, recolored, restyled, cropped, stretched, distorted, reinterpreted, swapped for another asset, renamed in a way that breaks protected references, or otherwise visually changed in future releases unless Roger explicitly unlocks that exact asset.

Display-only presentation changes are allowed when they preserve the exact protected asset and its aspect ratio and are reasonably necessary to make the logo legible and proportionate on desktop, tablet, mobile, header, footer, or other approved placements. Permitted presentation changes include CSS width/max-width/height-auto constraints and surrounding layout/spacing adjustments. These may not modify the underlying file bytes or distort the logo.

## Release gate
Every material release must verify:
1. `assets/englishlegalese-logo.png` still has blob SHA `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`, unless an explicit later owner unlock/successor exists.
2. Protected references still resolve to this asset unless a later owner instruction says otherwise.
3. CSS preserves aspect ratio (`height:auto` or equivalent) and does not crop/distort the protected artwork.
4. Any sizing change is documented as display-only and responsive, not an asset redesign.

Unexpected logo-byte drift is a **RELEASE BLOCKER** under EL-RGR-002, EL-RGR-003, and EL-RGR-019.
