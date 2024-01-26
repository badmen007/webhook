#!/bin/bash
WORK_PATH='/usr/projects/blog'
cd $WORK_PATH
echo '清理代码'
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "安装依赖"
pnpm install
echo "打包最新代码"
pnpm run build
echo "开始构建镜像"
docker build -t blog:1.0 .
echo '删除旧容器'
docker stop blog-container
docker rm blog-container
echo '启动新容器'
docker container run -p 80:80 -d --name blog-container blog:1.0