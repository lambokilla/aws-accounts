set -o allexport
if [ -f "../.env.cdk" ]; then
    source ../.env.cdk
fi
source ../.env
set +o allexport
