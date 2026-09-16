# deploy.config.sh — deploy targets for wpc-ero-verif, read by the shared
# wpc-deploy script (https://github.com/atkingtornado/wpc-deploy). See its
# example.config.sh for every option.

APP_NAME="wpc-ero-verif"

# Both prefixes hold this app's build (verified 2026-09-16).
#   "name|s3 prefix (bucket-relative)|public URL|flags"
TARGETS=(
  "dev|public/test_scripts/ero-verification/|https://www.wpc.ncep.noaa.gov/test_scripts/ero-verification/|"
  "production|public/ero-verification/|https://www.wpc.ncep.noaa.gov/ero-verification/|confirm"
)

# Nothing in public/ shadows real data in the bucket (test-data/ lives outside
# public/), so no excludes needed.
ROOT_EXCLUDES=()
ROOT_FORCE_DIRS=()
