until mongo $MONGODB_URI_LOCAL --eval 'db'; do
    >&2 echo "Mongo is unavailable - sleeping"
    sleep 1
done;

npm run build-ts

npm run watch-node