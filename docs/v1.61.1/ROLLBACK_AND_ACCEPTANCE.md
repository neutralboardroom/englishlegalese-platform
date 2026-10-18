# v1.61.1 rollback and browser qualification
Current predecessor: v1.61.0 main SHA `be56b49b17af2ad6379de04368b42f076b27b53a`, Render deployment `dep-dba84hbm8hqs73b4ejrg`; prior owner-visual baseline recovered but Safari scenario expansion not fully accepted. Last previous 12/12 qualified v1.60.0 deployment `dep-dba6nnhsrm7s73a51p90` remains known-good fallback.

Premerge fail-closed: 19 Roger + 10 durable rules, logo blob `b5f20ef046d75d6f108bc93243c7c14acf3c4eb1`, exact Git predecessor, npm zero high vulnerabilities, browser 4 projects including WebKit, twice same exact candidate. Postmerge check Render SHA, both domains, all 21 scenarios expand and aria-expanded true on iPad WebKit, 8 diagnostic items, role denial, logo size.

If regression affects visitors, Render service dashboard → Deploys → Rollback to known-good v1.60.0 `dep-dba6nnhsrm7s73a51p90`, verify apex/www and health, reconcile main and automatic deploy (Render disables it on rollback). Never overwrite learner data. This candidate is not yet qualified or live.
