# Storage boundary

Do not store production uploads, reports, recordings, or homework files inside the deployable app folder.

Use S3, Cloudflare R2, Google Cloud Storage, or another persistent object store. PostgreSQL should store object keys, not large file bodies.

Recording remains off by default and requires explicit consent from all participants.
