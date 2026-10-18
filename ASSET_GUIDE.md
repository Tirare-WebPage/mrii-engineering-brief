# Tirare Engineering Briefing — Media Guide

All personal CAD and video assets go in **`assets/user/`** inside this website folder. Use the exact filenames below. The website reads these relative paths; placing a file beside `index.html` or in a different folder will not replace the relevant slot.

## Four CAD stages

| Page location | Exact filename | What to put there |
|---|---|---|
| 01 · Reality / reference tricycle | `reference-trike.glb` | Existing cargo tricycle assembly; it is also used in CAD Stage 01 |
| 01 · Still image fallback | `reference-trike-render.jpg` | Side or three-quarter render of the same tricycle |
| 02 · First attempt | `cad-stage-02-first-attempt.glb` | Your second CAD stage / initial power-delivery concept |
| 02 · Still fallback | `cad-stage-02-first-attempt.jpg` | Render or screenshot of Stage 02 |
| 03 · Constraint collision | `cad-stage-03-constraint-collision.glb` | CAD stage showing the conflict/constraint that forced the architecture to change |
| 03 · Still fallback | `cad-stage-03-constraint-collision.jpg` | Render or screenshot of Stage 03 |
| 04 · Current platform | `cad-stage-04-current-platform.glb` | Latest Tirare/MRII retrofit platform CAD |
| 04 · Still fallback | `cad-stage-04-current-platform.jpg` | Render or screenshot of Stage 04 |

## MRII and mechanism media

| Page location | Exact filename | What to put there |
|---|---|---|
| Reference machine · force path | `existing-drivetrain.mp4` | Animation of crank/pedals → chain → fixed sprocket → solid axle → rear wheels |
| Standard freewheel principle | `freewheel-mechanism.mp4` | Your ratchet-and-pawl/freewheel animation showing engage and overrun; this explains an established mechanism principle |
| MRII main section | `mrii-technical.mp4` | Full MRII technical video; show the compliant coupling, unchanged human torque path, relative-angle sensing and downstream torque-isolation arrangement |
| Optional MRII close-up CAD | `mrii-interface-detail.glb` | MRII input member, compliant flexures, output member and angle sensor. This is a detail view of MRII, not a separate sprocket invention |
| Optional MRII still fallback | `mrii-interface-detail.jpg` | Render/screenshot if no GLB is available |

## Motor media

| Page location | Exact filename | What to put there |
|---|---|---|
| Optional axial-flux candidate model | `axial-flux-motor.glb` | Rotor/stator model for the candidate large-diameter axial-flux architecture |
| Optional motor-mount animation | `motor-mount.mp4` | Shows the proposed motor packaging and the frame's structural reaction-torque path |

The site also links to generic educational references for ratchet-and-pawl and axial-flux motor principles. Those are references, not Tirare inventions or endorsements.

## Formats and upload

- Interactive CAD: **GLB** (`.glb`) is recommended. Fusion/STEP files do not render directly in a browser.
- Still images: `.jpg` or `.png`.
- Video: `.mp4` with H.264 video and AAC audio, preferably 720p or 1080p.
- Keep the reference machine and four CAD stages visually consistent in camera angle where possible.
- The local `?media=edit` mode previews a selected file temporarily. To make it permanent, copy the file into `assets/user/` under the exact name above and commit/push the entire website folder.

## Project facts used on the site

MRII is the invention presented here: a compliant rider-input interface and torque-isolated human-input sensing architecture. Human torque passes mechanically through the input member and compliant coupling; relative angular displacement is measured to estimate rider input after calibration. An overrunning torque-transmission element is part of the architecture, with powered actuation entering downstream. The ordinary ratchet/freewheel principle is explained as context, not presented as a separate Tirare invention.

The physical MRII subsystem has been built and demonstrated. Full vehicle integration and field performance remain to be validated. Indian provisional application `202611118183` is described as filed, not granted. The ₹13,000 per-system cost is a projection from the DIV application, not a verified production cost or final operator price.
