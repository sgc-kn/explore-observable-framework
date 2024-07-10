#!/bin/sh -e

cat << EOF | mc alias import alias
{
  "url": "${MINIO_ALIAS_URL}",
  "accessKey": "${MINIO_ALIAS_ACCESS_KEY}",
  "secretKey": "${MINIO_ALIAS_SECRET_KEY}",
  "api": "${MINIO_ALIAS_API}"
}
EOF

exec "/opt/bitnami/scripts/minio-client/entrypoint.sh" "$@"
