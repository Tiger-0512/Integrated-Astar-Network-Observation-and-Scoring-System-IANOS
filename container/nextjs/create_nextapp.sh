docker build -t nextapp_image .

docker run --rm\
    -p 3000:3000 \
    --name=nextapp_container \
    nextapp_image
