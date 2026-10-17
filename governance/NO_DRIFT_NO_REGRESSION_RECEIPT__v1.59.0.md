# NO-DRIFT / NO-REGRESSION RECEIPT — v1.59.0

Predecessor: v1.58.0 main `2e39c83559d21b9b3b65f34b23b7605e23417b9f`

Protected/preserved:
- approved EnglishLegalese logo bytes unchanged; only CSS display sizing changes;
- exact 21 original/synthetic Scenario Studio scenarios preserved;
- custom roleplay preserved with confidentiality boundary;
- learning planner and progress record preserved but progressively disclosed on the homepage;
- free 8-question starting diagnostic preserved, non-accredited and nonpersistent;
- primary desktop navigation and five-item mobile quick navigation preserved;
- public AI/legal/translation boundaries preserved;
- operational dashboards remain fail-closed to unauthenticated public users;
- backend implementation, persistence files, production services and migrations are not intentionally changed;
- security dependency pins and high/critical audit gate remain.

Intentional corrective changes:
- new v1.59 public recovery JS/CSS layer;
- all public asset references receive new `?v=1.59.0` URLs;
- key long sections use direct DOM `hidden` state until requested;
- legacy release/internal public presentation is removed directly if reinjected;
- header logo display is enlarged without changing artwork;
- light hero CTA contrast is corrected;
- browser tests reproduce Roger's rejected live-state symptoms.

Final acceptance remains fail-closed until two exact-head qualification passes and postdeploy production verification complete.
